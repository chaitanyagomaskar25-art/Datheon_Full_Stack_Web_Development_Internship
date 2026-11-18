import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

/**
 * Scan and generate deadline and overdue reminders for a specific user.
 * Prevents spamming duplicate notifications within the same calendar day.
 */
export async function checkRemindersForUser(userId) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().slice(0, 10);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Fetch incomplete tasks with a due date belonging to this user
    const tasks = await Task.find({
      user: userId,
      completed: false,
      dueDate: { $ne: null },
    });

    for (const task of tasks) {
      if (!task.dueDate) continue;

      // 1. Overdue Task Detection
      if (task.dueDate < today) {
        const existingNotification = await Notification.findOne({
          user: userId,
          task: task._id,
          type: 'task_overdue',
          createdAt: { $gte: startOfToday },
        });

        if (!existingNotification) {
          await Notification.create({
            user: userId,
            task: task._id,
            type: 'task_overdue',
            title: `Overdue Task Alert: "${task.title}"`,
            message: `This task was due on ${task.dueDate} and is now overdue. Please review, reschedule, or complete it.`,
            metadata: {
              taskTitle: task.title,
              dueDate: task.dueDate,
              priority: task.priority,
              category: task.category,
            },
          });
        }
      }
      // 2. Upcoming Deadline Detection (Due Today or Tomorrow)
      else if (task.dueDate === today || task.dueDate === tomorrow) {
        const isToday = task.dueDate === today;
        const existingNotification = await Notification.findOne({
          user: userId,
          task: task._id,
          type: 'deadline_upcoming',
          createdAt: { $gte: startOfToday },
        });

        if (!existingNotification) {
          await Notification.create({
            user: userId,
            task: task._id,
            type: 'deadline_upcoming',
            title: isToday ? `Due Today: "${task.title}"` : `Upcoming Deadline: "${task.title}"`,
            message: isToday
              ? `Task is scheduled for today (${task.dueDate}) with ${task.priority} priority. Keep up your focus!`
              : `Upcoming deadline tomorrow (${task.dueDate}). Be prepared to finalize this task on time.`,
            metadata: {
              taskTitle: task.title,
              dueDate: task.dueDate,
              priority: task.priority,
              category: task.category,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error(`[ReminderScheduler Error for user ${userId}]:`, error.message);
  }
}

/**
 * Scan all active users and generate due/overdue reminders.
 */
export async function checkRemindersForAllUsers() {
  try {
    const users = await User.find({}, '_id');
    for (const user of users) {
      await checkRemindersForUser(user._id);
    }
  } catch (error) {
    console.error('[ReminderScheduler Global Error]:', error.message);
  }
}

let schedulerTimer = null;

/**
 * Starts the background reminder scheduler timer.
 * Default interval: 15 minutes.
 */
export function startReminderScheduler(intervalMs = 15 * 60 * 1000) {
  if (schedulerTimer) clearInterval(schedulerTimer);

  // Initial trigger after 2 seconds
  setTimeout(() => {
    checkRemindersForAllUsers().catch((err) =>
      console.warn('[Scheduler Initial Run Warning]:', err.message)
    );
  }, 2000);

  schedulerTimer = setInterval(() => {
    checkRemindersForAllUsers().catch((err) =>
      console.warn('[Scheduler Run Warning]:', err.message)
    );
  }, intervalMs);

  console.log(`[Scheduler] Reminder scheduler active (interval: ${intervalMs / 1000}s)`);
}
