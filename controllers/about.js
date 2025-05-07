'use strict'

import appStore from '../models/app-store.js';
import collectionStatistics from './collection-statistics.js';
import accounts from './accounts.js';

const about = {
  
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    
    if(!user){
      response.redirect("/login")
    } else {
      const viewData = {
        title: "About | The Terror Trove", 
        companyInfo: appStore.getCompanyInfo(),
        developmentInfo: appStore.getDevelopmentInfo(),
        userName: accounts.getUserName(user),
        image: user.image
      };

      response.render('about', viewData);
    }
  }
};

export default about;