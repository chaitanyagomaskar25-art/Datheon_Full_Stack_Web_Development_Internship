import { useCallback, useEffect, useRef, useState } from 'react';
import { notificationApi } from '@/services/api';

export function useNotifications(user) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const userId = user ? user._id || user.id || user.email : null;

  const fetchNotifications = useCallback(
    async (sync = false) => {
      if (!userId) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        const response = await notificationApi.getAll(sync);
        if (response && response.success && Array.isArray(response.data)) {
          setNotifications(response.data);
          setUnreadCount(response.unreadCount ?? 0);
        }
      } catch (err) {
        console.warn('[Notifications Fetch Warning]:', err.message);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [userId]
  );

  // Initial fetch and user change
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      fetchNotifications(true); // sync reminders on login/load

      // Background poll every 60s
      const interval = setInterval(() => {
        fetchNotifications(false);
      }, 60000);

      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [userId, fetchNotifications]);

  const markAsRead = useCallback(
    async (id) => {
      if (!userId) return;
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await notificationApi.markAsRead(id);
      } catch (err) {
        console.error('[Mark As Read Error]:', err.message);
        fetchNotifications(false);
      }
    },
    [userId, fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await notificationApi.markAllAsRead();
    } catch (err) {
      console.error('[Mark All Read Error]:', err.message);
      fetchNotifications(false);
    }
  }, [userId, fetchNotifications]);

  const deleteNotification = useCallback(
    async (id) => {
      if (!userId) return;
      const target = notifications.find((n) => n.id === id || n._id === id);
      const wasUnread = target && !target.read;

      // Optimistic delete
      setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      try {
        await notificationApi.delete(id);
      } catch (err) {
        console.error('[Delete Notification Error]:', err.message);
        fetchNotifications(false);
      }
    },
    [userId, notifications, fetchNotifications]
  );

  const clearAllNotifications = useCallback(async () => {
    if (!userId) return;
    setNotifications([]);
    setUnreadCount(0);

    try {
      await notificationApi.clearAll();
    } catch (err) {
      console.error('[Clear Notifications Error]:', err.message);
      fetchNotifications(false);
    }
  }, [userId, fetchNotifications]);

  const checkReminders = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await notificationApi.checkReminders();
      if (response && response.success && Array.isArray(response.data)) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount ?? 0);
      }
    } catch (err) {
      console.error('[Check Reminders Error]:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    checkReminders,
    refreshNotifications: fetchNotifications,
  };
}
