'use strict';

import JsonStore from './json-store.js';

const userStore = {

  store: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },
  
  getUserById(id) {
    return this.store.findOneBy(this.collection, (user => user.id === id));
  },
  
  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, (user => user.email === email));
  },
  
  async addUser(user, response) {
    try {
      user.image = await this.store.uploader(user);
      await this.store.addCollection(this.collection, user);
      response(); 
    } catch (error) {
      throw error;
    }
  },
  
  getUserCount() {
    return this.getAllUsers().length;
  },
  
  emailExists(email) {
    const users = this.getAllUsers();
    return users.some(user => user.email === email);
  }
};

export default userStore;