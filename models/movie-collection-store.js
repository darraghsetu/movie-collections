'use strict';

import JsonStore from './json-store.js';

const movieCollectionStore = {

  store: new JsonStore('./models/movie-collection-store.json', { movieCollections: [] }),
  collection: 'movieCollections',
  array: 'movies',

  getAllCollections() {
    return this.store.findAll(this.collection);
  },
  
  getCollectionById(collectionId) {
    return this.store.findOneBy(this.collection, (collection => collection.collectionId === collectionId));
  },
  
  getCollectionsByUserId(userId) {
    return this.store.findBy(this.collection, (collection => collection.userId === userId));
  },
  
  getMovieFromCollection(collectionId, movieId) {
    const collection = this.getCollectionById(collectionId);
    const result = collection.movies.find(movie => movie.movieId === movieId); 
    return result !== undefined ? result : null;
  },
  
  async addCollection(collection, response) {
    try {
      collection.image = await this.store.uploader(collection);
      await this.store.addCollection(this.collection, collection);
    } 
    catch (error) {
      console.log(`Error adding new collection: ${error}`);
    } 
    finally {
      response();   
    }
  },

  async deleteCollection(collectionId, response) {
    const collection = this.getCollectionById(collectionId);
    await this.store.removeCollection(this.collection, collection)
      .catch(error => { console.log(`Error deleting collection: ${error}`) })
      .finally(() => response());
  },
  
  async addMovie(collectionId, movie, response) {
    try{
      movie.image = await this.store.uploader(movie);
      await this.store.addItem(this.collection, collectionId, this.array, movie);
    } 
    catch (error) {
      console.log(`Error adding movie: ${error}`);
    } 
    finally {
      response();
    }
  },
  
  async deleteMovie(collectionId, movieId, response) {
    await this.store.removeItem(this.collection, collectionId, this.array, movieId)
      .catch(error => { console.log(`Error deleting movie: ${error}`) })
      .finally(() => response());
  },
  
  async updateMovie(collectionId, movieId, updatedMovie, response) {
    try{
      await this.store.editItem(this.collection, collectionId, movieId, this.array, updatedMovie);
    }
    catch (error) {
      console.log(`Error updating movie: ${error}`);
    } 
    finally {
      response();
    }
  },
  
  getGenresByUserId(userId) {
    const collections = this.getCollectionsByUserId(userId);
    const genres = []
    
    let totalMovies = 0;
    collections.forEach(collection => {
      totalMovies += collection.movies.length;
    })
    console.log(totalMovies)
    if (totalMovies !== 0) {
      genres.push('Horror');
      
      collections.forEach(collection => {
        collection.movies.forEach(movie => {
          movie.genres.forEach(genre => {
            if (!genres.includes(genre)) {
              genres.push(genre)
            }
          })
        })
      });
    }
    
    return genres;
  },
  
  getUserMoviesByGenre(userId, genre) {
    const collections = this.getCollectionsByUserId(userId);
    const movies = [];
    
    collections.forEach(collection => {
      collection.movies.forEach(movie => {
        if(movie.genres.includes(genre)){
          movies.push(movie)
        }
      })
    });
    
    return movies;
  }
};

export default movieCollectionStore;