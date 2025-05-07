'use strict'

import collectionStatistics from "./collection-statistics.js";
import accounts from "./accounts.js";

const index = {
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    
    if (user) {
      response.redirect("/start");
    } else {
      
      const viewData = {
        title: `The Terror Trove`,
        statistics: collectionStatistics.getAllCollectionsStatistics()
      };

      response.render('index', viewData);
    }
  }
};

export default index;