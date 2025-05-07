'use strict';

import movieCollectionStore from '../models/movie-collection-store.js';
import userStore from '../models/user-store.js'

const collectionStatistics = {
  statistics: {},
  
  getAllCollectionsStatistics() {
    const collections = movieCollectionStore.getAllCollections();
    this.generateCollectionsStatistics(collections);
    this.statistics.userCount = userStore.getUserCount();
    return this.statistics;
  },
  
  getUserCollectionsStatistics(user) {
    const userCollections = movieCollectionStore.getCollectionsByUserId(user.userId);
    this.generateCollectionsStatistics(userCollections);
    return this.statistics;
  },
  
  generateCollectionsStatistics(collections) {
    this.statistics = {};
    const collectionsSizes = collections.map(collection => collection.movies.length);
    this.statistics.collectionCount = this.getCollectionCount(collections);
    this.statistics.minSize = collectionsSizes.length === 0 ? 0 : Math.min(...collectionsSizes);
    this.statistics.maxSize = collectionsSizes.length === 0 ? 0 : Math.max(...collectionsSizes);
    this.statistics.movieCount = this.getMovieCount(collectionsSizes);
    this.statistics.avgCollectionSize = this.getAvgCollectionSize();
    this.statistics.smallestCollections = this.getSmallestCollections(collections);
    this.statistics.largestCollections = this.getLargestCollections(collections);
  },
  
  getCollectionCount(collections) {
    return collections.length;
  },
  
  getMovieCount(collectionsSizes) {
    let movieCount = 0;
    
    for (let collectionSize of collectionsSizes) {
        movieCount += collectionSize;
    }
    
    return movieCount;
  },
  
  getAvgCollectionSize() {
    let avgCollectionSize = 0;

    if (this.statistics.movieCount !== 0) {
       avgCollectionSize = Math.round(this.statistics.movieCount / this.statistics.collectionCount);
    }
    
    return avgCollectionSize;
  },
  
  getSmallestCollections(collections) {
    let smallestCollections = [];
    
    for (let collection of collections) {
      if (collection.movies.length === this.statistics.minSize) {
        smallestCollections.push(collection.title);
      }
    }
    
    return smallestCollections;
  },
  
  getLargestCollections(collections) {
    let largestCollections = [];
    
    
    for (let collection of collections) {
      if (collection.movies.length === this.statistics.maxSize) {
        largestCollections.push(collection.title)
      }
    }
    
    return largestCollections;
  }
}

export default collectionStatistics;