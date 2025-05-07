'use strict';

import movieCollectionStore from "../models/movie-collection-store.js";
import accounts from './accounts.js';
import collectionStatistics from './collection-statistics.js';

const start = {
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    
    if (user) {
      const statistics = collectionStatistics.getUserCollectionsStatistics(user);
      
      const viewData = {
        userName: accounts.getUserName(user),
        title: `Welcome ${user.firstName} | The Terror Trove`,
        userStatistics: statistics,
        image: user.image
      };
      
      response.render('start', viewData);
    }
    else {
      response.redirect('/login');
    }
  }
};

export default start;