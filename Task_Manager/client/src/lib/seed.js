import { uid } from '@/lib/datetime';

function isoFuture(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

export function createSeedTasks() {
  const now = Date.now();
  return [
    {
      id: uid(),
      title: 'Finalize Q4 product roadmap',
      description: 'Draft milestones for the next quarter and circulate to the team for review.',
      category: 'Work',
      priority: 'High',
      dueDate: isoFuture(0),
      completed: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: uid(),
      title: 'Review pull requests',
      description: 'Three PRs waiting in the queue — focus on auth and migrations.',
      category: 'Work',
      priority: 'Medium',
      dueDate: isoFuture(1),
      completed: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: uid(),
      title: 'Read chapter 7 — Designing Data-Intensive Apps',
      description: 'Replication and partitioning. Take notes for the study group.',
      category: 'Study',
      priority: 'Medium',
      dueDate: isoFuture(3),
      completed: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: uid(),
      title: 'Morning run — 5km',
      description: 'Easy pace recovery run around the park.',
      category: 'Personal',
      priority: 'Low',
      dueDate: isoFuture(0),
      completed: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 10).toISOString(),
    },
    {
      id: uid(),
      title: 'Pay electricity bill',
      description: 'Auto-pay lapsed — submit manually before the weekend.',
      category: 'Personal',
      priority: 'High',
      dueDate: isoFuture(-2),
      completed: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
    },
    {
      id: uid(),
      title: 'Prepare slides for Monday standup',
      description: 'Keep it short: progress, blockers, next steps.',
      category: 'Work',
      priority: 'Medium',
      dueDate: null,
      completed: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
    },
  ];
}
