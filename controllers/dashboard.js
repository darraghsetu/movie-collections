'use strict';

import movieCollectionStore from "../models/movie-collection-store.js"
import accounts from './accounts.js';
import { v4 as uuidv4 } from 'uuid';

const dashboard = {
  
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    
    if (user) {
      const viewData = {
        title: 'Your Collections | The Terror Trove',
        userCollections: movieCollectionStore.getCollectionsByUserId(user.userId),
        userName: accounts.getUserName(user),
        image: user.image
      };
      
      response.render('dashboard', viewData);
    } else {
        response.redirect('/login');
    }
  },

  addCollection(request, response) {
    const user = accounts.getCurrentUser(request);   
    const timestamp = new Date();
	
    const newCollection = {
      collectionId: uuidv4(),
      userId: user.userId,
      title: request.body.title,
      movies: [],
      date: timestamp,
      image: request.files.image,
    };
    
    movieCollectionStore.addCollection(
      newCollection, 
      () => { response.redirect("/dashboard") }
    );
  },
  
  deleteCollection(request, response) {
    const collectionId = request.params.collectionId;
    
    movieCollectionStore.deleteCollection(
      collectionId,
      () => response.redirect("/dashboard")
    );
  }
};

export default dashboard;