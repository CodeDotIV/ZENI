import { calculatePriority } from './taskUtils.js';

export async function generateSchedule(user, tasks, date) {
  // Simple schedule generation algorithm
  // In production, this would be more sophisticated with AI optimization

  const timeBlocks = [];
  let currentTime = new Date(date);
  currentTime.setHours(8, 0, 0, 0); // Start at 8 AM

  // Sort tasks by priority
  const sortedTasks = tasks.sort((a, b) => {
    const priorityA = a.priority || calculatePriority(a.deadline ? new Date(a.deadline) : null);
    const priorityB = b.priority || calculatePriority(b.deadline ? new Date(b.deadline) : null);
    return priorityB - priorityA;
  });

  for (const task of sortedTasks) {
    const estimatedTime = task.estimated_time || 60; // Default 1 hour
    const endTime = new Date(currentTime.getTime() + estimatedTime * 60000);

    // Don't schedule past 10 PM
    if (endTime.getHours() >= 22) {
      break;
    }

    timeBlocks.push({
      task_id: task.id,
      title: task.title,
      start_time: currentTime.toISOString(),
      end_time: endTime.toISOString(),
      type: 'task',
      priority: task.priority
    });

    // Add break after task
    currentTime = new Date(endTime.getTime() + 15 * 60000); // 15 min break

    timeBlocks.push({
      start_time: endTime.toISOString(),
      end_time: currentTime.toISOString(),
      type: 'break',
      title: 'Break'
    });
  }

  return { time_blocks: timeBlocks };
}

