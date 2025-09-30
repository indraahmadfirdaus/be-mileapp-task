/**
 * MongoDB Index Creation Script
 * 
 * This file contains all the indexes that should be created on MongoDB collections
 * to optimize query performance for the Task Management application.
 */

// ==========================================
// USERS COLLECTION INDEXES
// ==========================================

db.users.createIndex(
  { email: 1 },
  { 
    unique: true,
    name: 'idx_users_email'
  }
);
// Reason: Email is used for authentication and must be unique.
// This ensures fast lookups during login and prevents duplicate emails.

db.users.createIndex(
  { createdAt: -1 },
  { name: 'idx_users_created_at' }
);
// Reason: For sorting users by registration date in admin panels.

// ==========================================
// TASKS COLLECTION INDEXES
// ==========================================

db.tasks.createIndex(
  { userId: 1, createdAt: -1 },
  { name: 'idx_tasks_user_created' }
);
// Reason: Most common query - get all tasks for a specific user sorted by creation date.
// Compound index supports filtering by userId and sorting by createdAt efficiently.

db.tasks.createIndex(
  { userId: 1, status: 1 },
  { name: 'idx_tasks_user_status' }
);
// Reason: Frequently used to filter tasks by status (pending, in-progress, completed).
// Supports queries like "show me all pending tasks for user X".

db.tasks.createIndex(
  { userId: 1, priority: 1 },
  { name: 'idx_tasks_user_priority' }
);
// Reason: Filter tasks by priority level (low, medium, high).
// Useful for displaying high-priority tasks or sorting by priority.

db.tasks.createIndex(
  { userId: 1, dueDate: 1 },
  { name: 'idx_tasks_user_duedate' }
);
// Reason: Essential for querying tasks by due date.
// Supports features like "tasks due this week" or overdue task notifications.

db.tasks.createIndex(
  { userId: 1, status: 1, priority: 1 },
  { name: 'idx_tasks_user_status_priority' }
);
// Reason: Combined filter - e.g., "high priority pending tasks".
// Optimizes queries that filter by both status and priority simultaneously.

db.tasks.createIndex(
  { title: 'text', description: 'text' },
  { 
    name: 'idx_tasks_text_search',
    weights: {
      title: 2,
      description: 1
    }
  }
);
// Reason: Enables full-text search across task titles and descriptions.
// Title has higher weight (2x) as it's more relevant than description.
// Supports search functionality in the UI.

db.tasks.createIndex(
  { updatedAt: -1 },
  { name: 'idx_tasks_updated_at' }
);
// Reason: For sorting tasks by last update time.
// Useful for "recently updated" views or activity tracking.

db.tasks.createIndex(
  { userId: 1, updatedAt: -1 },
  { name: 'idx_tasks_user_updated' }
);
// Reason: Get user's tasks sorted by most recently updated.
// Provides better user experience by showing recent activity first.

// ==========================================
// COMPOUND INDEX EXPLANATION
// ==========================================

/*
 * Why compound indexes with userId first?
 * 
 * 1. Multi-tenancy: Each user only sees their own tasks
 * 2. Data isolation: userId filter is ALWAYS present in queries
 * 3. Index efficiency: MongoDB can use the index for:
 *    - Queries filtering only by userId
 *    - Queries filtering by userId + other fields
 * 
 * Example queries these indexes optimize:
 * 
 * - db.tasks.find({ userId: 1, status: "pending" }).sort({ createdAt: -1 })
 *   ✅ Uses: idx_tasks_user_status + idx_tasks_user_created
 * 
 * - db.tasks.find({ userId: 1, priority: "high", status: "in-progress" })
 *   ✅ Uses: idx_tasks_user_status_priority
 * 
 * - db.tasks.find({ userId: 1 }).sort({ dueDate: 1 })
 *   ✅ Uses: idx_tasks_user_duedate
 * 
 * - db.tasks.find({ userId: 1, $text: { $search: "project" } })
 *   ✅ Uses: idx_tasks_text_search
 */

// ==========================================
// INDEX MAINTENANCE COMMANDS
// ==========================================

// List all indexes
// db.tasks.getIndexes()

// Drop an index
// db.tasks.dropIndex("idx_tasks_user_status")

// Get index usage statistics
// db.tasks.aggregate([{ $indexStats: {} }])

// Analyze query performance
// db.tasks.find({ userId: 1, status: "pending" }).explain("executionStats")