'use strict';

import movieCollectionStore from "../models/movie-collection-store.js";
import accounts from "./accounts.js";

const search = {
  
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
	
    const viewData = {
      title: "Search | The Terror Trove",
      genres: movieCollectionStore.getGenresByUserId(user.userId),
      userName: accounts.getUserName(user),
      image: user.image
    };
    
    response.render('search', viewData);
  },
  
  genreSearch(request, response) {
    const genre = request.body.genre;
    const user = accounts.getCurrentUser(request);

    const viewData = {
      title: `Your ${genre} Movies | The Terror Trove`,
      movies: movieCollectionStore.getUserMoviesByGenre(user.userId, genre),
      genres: movieCollectionStore.getGenresByUserId(user.userId),
      searchedGenre: genre,
      userName: accounts.getUserName(user),
      image: user.image
    };
    
    response.render('search', viewData);
  }
};

export default search;