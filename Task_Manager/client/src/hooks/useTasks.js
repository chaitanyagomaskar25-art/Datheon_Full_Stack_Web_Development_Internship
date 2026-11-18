import { useCallback, useEffect, useRef, useState } from 'react';
import { taskApi } from '@/services/api';

export function useTasks(user) {
  const [tasks, setTasks] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [isOperating, setIsOperating] = useState(false);
  const [apiOk, setApiOk] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const isFetchingRef = useRef(false);

  const userId = user ? user._id || user.id || user.email : null;

  // Fetch all tasks from MongoDB via Express API
  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      setInitialized(true);
      return;
    }
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const response = await taskApi.getAll();
      if (response && response.success && Array.isArray(response.data)) {
        setTasks(response.data);
        setApiOk(true);
        setErrorMessage(null);
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (err) {
      console.warn('[API Warning] Could not connect to Express backend:', err.message);
      setApiOk(false);
      setErrorMessage(err.message);
      setTasks([]);
    } finally {
      setInitialized(true);
      isFetchingRef.current = false;
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (input) => {
    if (!userId) {
      return { success: false, error: 'Authentication required. Please sign in to create tasks.' };
    }
    setIsOperating(true);
    try {
      const title = (input.title || '').trim();
      if (!title) {
        throw new Error('Task title cannot be empty.');
      }

      const payload = {
        title,
        description: (input.description || '').trim(),
        category: input.category || 'Work',
        priority: input.priority || 'Medium',
        dueDate: input.dueDate || null,
      };

      const response = await taskApi.create(payload);
      const createdTask = response.data;

      setTasks((prev) => [createdTask, ...prev]);
      setApiOk(true);
      return { success: true, task: createdTask };
    } catch (err) {
      console.error('[Task Create Error]:', err.message);
      return { success: false, error: err.message };
    } finally {
      setIsOperating(false);
    }
  }, [userId]);

  const updateTask = useCallback(async (id, patch) => {
    if (!userId) {
      return { success: false, error: 'Authentication required. Please sign in.' };
    }
    setIsOperating(true);
    try {
      const payload = { ...patch };
      if (payload.title !== undefined) payload.title = payload.title.trim();
      if (payload.description !== undefined) payload.description = payload.description.trim();

      const response = await taskApi.update(id, payload);
      const updatedTask = response.data;

      setTasks((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? { ...t, ...updatedTask } : t))
      );
      setApiOk(true);
      return { success: true, task: updatedTask };
    } catch (err) {
      console.error('[Task Update Error]:', err.message);
      return { success: false, error: err.message };
    } finally {
      setIsOperating(false);
    }
  }, [userId]);

  const toggleTask = useCallback(async (id) => {
    if (!userId) {
      return { success: false, error: 'Authentication required. Please sign in.' };
    }
    try {
      // Optimistic update
      let toggledState = false;
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id || t._id === id) {
            toggledState = !t.completed;
            return { ...t, completed: toggledState };
          }
          return t;
        })
      );

      const response = await taskApi.toggle(id);
      const serverTask = response.data;

      setTasks((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? { ...t, ...serverTask } : t))
      );
      setApiOk(true);
      return { success: true, completed: serverTask.completed, task: serverTask };
    } catch (err) {
      console.error('[Task Toggle Error]:', err.message);
      // Rollback on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? { ...t, completed: !t.completed } : t))
      );
      return { success: false, error: err.message };
    }
  }, [userId]);

  const setTaskCompleted = useCallback(async (id, completed) => {
    if (!userId) {
      return { success: false, error: 'Authentication required. Please sign in.' };
    }
    try {
      setTasks((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? { ...t, completed } : t))
      );

      const response = await taskApi.update(id, { completed });
      const serverTask = response.data;

      setTasks((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? { ...t, ...serverTask } : t))
      );
      setApiOk(true);
      return { success: true, task: serverTask };
    } catch (err) {
      console.error('[Task Set Completed Error]:', err.message);
      return { success: false, error: err.message };
    }
  }, [userId]);

  const setTaskPriority = useCallback(async (id, priority) => {
    if (!userId) {
      return { success: false, error: 'Authentication required. Please sign in.' };
    }
    try {
      setTasks((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? { ...t, priority } : t))
      );

      const response = await taskApi.update(id, { priority });
      const serverTask = response.data;

      setTasks((prev) =>
        prev.map((t) => (t.id === id || t._id === id ? { ...t, ...serverTask } : t))
      );
      setApiOk(true);
      return { success: true, task: serverTask };
    } catch (err) {
      console.error('[Task Set Priority Error]:', err.message);
      return { success: false, error: err.message };
    }
  }, [userId]);

  const deleteTask = useCallback(async (id) => {
    if (!userId) {
      return { success: false, error: 'Authentication required. Please sign in.' };
    }
    setIsOperating(true);
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));
      setApiOk(true);
      return { success: true };
    } catch (err) {
      console.error('[Task Delete Error]:', err.message);
      return { success: false, error: err.message };
    } finally {
      setIsOperating(false);
    }
  }, [userId]);

  const reorder = useCallback(async (fromId, toId) => {
    if (!userId) return;
    let reorderedList = [];
    setTasks((prev) => {
      const from = prev.findIndex((t) => t.id === fromId || t._id === fromId);
      const to = prev.findIndex((t) => t.id === toId || t._id === toId);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      reorderedList = next;
      return next;
    });

    if (reorderedList.length > 0) {
      try {
        const taskIds = reorderedList.map((t) => t.id || t._id);
        await taskApi.reorder(taskIds);
      } catch (err) {
        console.warn('[Task Reorder Persistence Warning]:', err.message);
      }
    }
  }, [userId]);

  const clearAll = useCallback(async () => {
    if (!userId) {
      return { success: false, error: 'Authentication required. Please sign in.' };
    }
    setIsOperating(true);
    try {
      await taskApi.clearAll();
      setTasks([]);
      setApiOk(true);
      return { success: true };
    } catch (err) {
      console.error('[Task Clear All Error]:', err.message);
      return { success: false, error: err.message };
    } finally {
      setIsOperating(false);
    }
  }, [userId]);

  return {
    tasks,
    initialized,
    storageOk: apiOk,
    apiOk,
    errorMessage,
    isOperating,
    addTask,
    updateTask,
    toggleTask,
    setTaskCompleted,
    setTaskPriority,
    deleteTask,
    reorder,
    clearAll,
    refreshTasks: fetchTasks,
  };
}
