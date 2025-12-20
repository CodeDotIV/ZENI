export function calculatePriority(deadline) {
  if (!deadline) return 5;

  const now = new Date();
  const daysUntilDue = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) return 10; // Overdue
  if (daysUntilDue < 3) return 10; // Urgent
  if (daysUntilDue < 7) return 8;  // High
  if (daysUntilDue < 14) return 6;  // Medium
  if (daysUntilDue < 30) return 4;  // Low
  return 2; // Very low
}

export function estimateTime(taskType, complexity = 'medium') {
  const timeEstimates = {
    'essay': { low: 2, medium: 4, high: 8 },
    'homework': { low: 1, medium: 2, high: 4 },
    'project': { low: 4, medium: 8, high: 16 },
    'reading': { low: 1, medium: 2, high: 4 },
    'study': { low: 2, medium: 4, high: 8 },
    'default': { low: 1, medium: 2, high: 4 }
  };

  const estimates = timeEstimates[taskType] || timeEstimates['default'];
  return estimates[complexity] * 60; // Convert to minutes
}

