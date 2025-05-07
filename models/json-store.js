'use strict';

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import cloudinary from 'cloudinary';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require('fs').promises; 

try {
  const env = require("../.data/.env.json");
  cloudinary.config(env.cloudinary);
}
catch(e) {
  console.log('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}

class JsonStore {
  constructor(file, defaults) {
    this.db = new Low(new JSONFile(file), defaults);
    this.db.read();
  }

  findAll(collection) {
    return this.db.data[collection];
  }

  findBy(collection, filter) {
    const results = this.db.data[collection].filter(filter);
    return results;
  }

  findOneBy(collection, filter) {
    const results = this.db.data[collection].filter(filter);
    return results[0];
  }

  async addCollection(collection, obj) {
    this.db.data[collection].push(obj);
    await this.db.write();
  }

  async addItem(collection, collectionId, arr, obj) {
    const data = this.db.data[collection].filter((c) => c.collectionId === collectionId);
    data[0][arr].push(obj);
    
    for (const key in obj){
      console.log(`${key}: ${obj[key]}`)
    }
    
    await this.db.write();
  }

  async removeCollection(collection, obj) {
    const index = this.db.data[collection].indexOf(obj);
    if (index > -1) {
      this.db.data[collection].splice(index, 1);
    }
    await this.db.write();
  }

  async removeItem(collection, collectionId, arr, movieId) {
    const data = this.db.data[collection].filter((c) => c.collectionId === collectionId);
    const item = data[0][arr].filter((i) => i.movieId === movieId);
    const index = data[0][arr].indexOf(item[0]);
    if (index > -1) {
      data[0][arr].splice(index, 1);
    }
    await this.db.write();
  }

  async editCollection(collection, id, obj) {
    let index = this.db.data[collection].findIndex((c) => c.id === id);
    if (index > -1) {
      this.db.data[collection].splice(index, 1, obj);
    }
    await this.db.write();
  }

  async editItem(collection, collectionId, movieId, arr, movie) {
    const data = this.db.data[collection].filter((c) => c.collectionId === collectionId);
    let index = data[0][arr].findIndex((i) => i.movieId === movieId);
    data[0][arr].splice(index, 1, movie);
    await this.db.write();
  }
  
  async uploader(object) {
    async function addToCloudinary(obj) {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(obj.image.tempFilePath, (result, err) => {
          if (err) {
            console.error("Upload error:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }
  
    let result = await addToCloudinary(object);
    await fs.unlink(`./tmp/${result.original_filename}`);

    return result.url;
  }
}

export default JsonStore;