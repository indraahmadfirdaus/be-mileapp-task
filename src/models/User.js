const bcrypt = require('bcryptjs');

class User {
  constructor(id, email, password, name, createdAt) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.createdAt = createdAt || new Date().toISOString();
  }

  static users = [
    new User(1, 'admin@mileapp.com', bcrypt.hashSync('admin123', 10), 'Admin User', '2025-09-01T10:00:00.000Z'),
    new User(2, 'user@mileapp.com', bcrypt.hashSync('user123', 10), 'Regular User', '2025-09-02T10:00:00.000Z'),
  ];

  static currentId = 3;

  static findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  static findById(id) {
    return this.users.find(user => user.id === parseInt(id));
  }

  static create(userData) {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const newUser = new User(
      this.currentId++,
      userData.email,
      hashedPassword,
      userData.name
    );
    this.users.push(newUser);
    return newUser;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static getUserWithoutPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = User;