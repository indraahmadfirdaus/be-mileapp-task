class Task {
  constructor(id, title, description, status, priority, dueDate, userId, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status || 'pending'; // pending, in-progress, completed
    this.priority = priority || 'medium'; // low, medium, high
    this.dueDate = dueDate || null;
    this.userId = userId;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  static tasks = [
    new Task(1, 'Setup Project', 'Initialize project with all dependencies', 'completed', 'high', '2025-09-25', 1, '2025-09-20T10:00:00.000Z', '2025-09-25T15:30:00.000Z'),
    new Task(2, 'Design Database Schema', 'Create MongoDB schema design', 'in-progress', 'high', '2025-09-28', 1, '2025-09-22T09:00:00.000Z', '2025-09-28T11:20:00.000Z'),
    new Task(3, 'Implement Authentication', 'Add JWT-based authentication', 'pending', 'medium', '2025-10-01', 1, '2025-09-23T14:00:00.000Z', '2025-09-23T14:00:00.000Z'),
    new Task(4, 'Create Task CRUD', 'Build complete CRUD operations', 'pending', 'high', '2025-10-02', 1, '2025-09-24T08:30:00.000Z', '2025-09-24T08:30:00.000Z'),
    new Task(5, 'Frontend Development', 'Build Vue.js frontend', 'pending', 'medium', '2025-10-05', 1, '2025-09-25T10:00:00.000Z', '2025-09-25T10:00:00.000Z'),
  ];

  static currentId = 6;

  static getAll(filters = {}, sort = {}, pagination = {}) {
    let filteredTasks = [...this.tasks];

    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }
    if (filters.userId) {
      filteredTasks = filteredTasks.filter(task => task.userId === parseInt(filters.userId));
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        task.description.toLowerCase().includes(searchLower)
      );
    }

    if (sort.field) {
      const order = sort.order === 'desc' ? -1 : 1;
      filteredTasks.sort((a, b) => {
        if (a[sort.field] < b[sort.field]) return -1 * order;
        if (a[sort.field] > b[sort.field]) return 1 * order;
        return 0;
      });
    }

    const page = parseInt(pagination.page) || 1;
    const limit = parseInt(pagination.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = filteredTasks.length;

    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return {
      data: paginatedTasks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: endIndex < total,
        hasPrevPage: page > 1
      }
    };
  }

  static getById(id) {
    return this.tasks.find(task => task.id === parseInt(id));
  }

  static create(taskData) {
    const newTask = new Task(
      this.currentId++,
      taskData.title,
      taskData.description,
      taskData.status,
      taskData.priority,
      taskData.dueDate,
      taskData.userId
    );
    this.tasks.push(newTask);
    return newTask;
  }

  static update(id, taskData) {
    const index = this.tasks.findIndex(task => task.id === parseInt(id));
    if (index === -1) return null;

    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      id: this.tasks[index].id,
      updatedAt: new Date().toISOString()
    };

    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  static delete(id) {
    const index = this.tasks.findIndex(task => task.id === parseInt(id));
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  static getStats(userId) {
    const userTasks = userId 
      ? this.tasks.filter(task => task.userId === parseInt(userId))
      : this.tasks;

    return {
      total: userTasks.length,
      pending: userTasks.filter(t => t.status === 'pending').length,
      inProgress: userTasks.filter(t => t.status === 'in-progress').length,
      completed: userTasks.filter(t => t.status === 'completed').length,
      highPriority: userTasks.filter(t => t.priority === 'high').length,
    };
  }
}

module.exports = Task;