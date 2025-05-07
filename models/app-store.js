'use strict';

import JsonStore from './json-store.js';

const appStore = {

  store: new JsonStore('./models/app-store.json', { info: [] }),
  collection: 'info',

  getInfo() {
    return this.store.findAll(this.collection);
  },

  getCompanyInfo() {
    return this.getInfo()[0];
  },
    
  getDevelopmentInfo() {
    return this.getInfo()[1];
  }

};

export default appStore;