import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must belong to a user'],
      index: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    type: {
      type: String,
      enum: ['deadline_upcoming', 'task_overdue', 'task_completed', 'system'],
      default: 'system',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [140, 'Title cannot exceed 140 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [600, 'Message cannot exceed 600 characters'],
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      taskTitle: { type: String, default: '' },
      dueDate: { type: String, default: null },
      priority: { type: String, default: 'Medium' },
      category: { type: String, default: 'Work' },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for efficient user-specific sorted & unread queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
