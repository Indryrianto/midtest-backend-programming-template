class UserRepository {
  constructor() {
    this.users = [];
  }

  async getUsers() {
    return this.users;
  }

  async getUser(id) {
    return this.users.find((user) => user._id === id);
  }

  async createUser(name, email, password) {
    const user = {
      _id: this.users.length + 1,
      name,
      email,
      password,
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id, name, email) {
    const user = this.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.name = name;
    user.email = email;
    return user;
  }

  async deleteUser(id) {
    const user = this.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    this.users = this.users.filter((u) => u._id !== id);
    return user;
  }

  async getUserByEmail(email) {
    return this.users.find((user) => user.email === email);
  }

  async changePassword(id, password) {
    const user = this.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.password = password;
    return user;
  }
}

module.exports = UserRepository;
