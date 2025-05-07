'use strict';

import movieCollectionStore from '../models/movie-collection-store.js';
import accounts from './accounts.js';
import { v4 as uuidv4 } from 'uuid';

const movieCollection = {
    
  createView(request, response) {
    const collectionId = request.params.collectionId;
    const collectionTitle = movieCollectionStore.getCollectionById(collectionId).title;
    const user = accounts.getCurrentUser(request);
    
    const viewData = {
      title: `${collectionTitle} | The Terror Trove`,
      collection: movieCollectionStore.getCollectionById(collectionId),
      userName: accounts.getUserName(user),
      image: user.image
    };

    response.render('movie-collection', viewData);
  },
  
  addMovie(request, response) {
    const collectionId = request.params.collectionId;
    
    let directors = request.body['directors[]'];
    directors = directors.filter(value => value && value !== "");
    
    let cast = request.body['cast[]'];
    cast = cast.filter(value => value && value !== "");
    
    let genres = request.body['genres[]'];
    genres = ['Horror', genres[0], genres[1]]; // So 'Horror' is always first when displaying genres
    genres = genres.filter (value => value && value !== "");
    
    const newMovie = {
      movieId: uuidv4(),
      title: request.body.title,
      releaseYear: request.body.releaseYear, 
      runtime: request.body.runtime, 
      directors: directors,
      cast: cast, 
      genres: genres, 
      image: request.files.image,
      favourite: request.body.favourite === 'on' ? true : false
    };

    movieCollectionStore.addMovie(
      collectionId, 
      newMovie, 
      () => response.redirect(`/movie-collection/${collectionId}`)
    );
  },
  
  deleteMovie(request, response) {
    const collectionId = request.params.collectionId;
    const movieId = request.params.movieId;
    
    movieCollectionStore.deleteMovie(
      collectionId,
      movieId,
      () => response.redirect(`/movie-collection/${collectionId}`)
    );
  },
  
  updateMovie(request, response) {
    const collectionId = request.params.collectionId;
    const movieId = request.params.movieId;
    const movie = movieCollectionStore.getMovieFromCollection(collectionId, movieId);
    
    let directors = request.body.directors;
    directors = directors.filter(value => value !== "");
    
    let cast = request.body.cast;
    cast = cast.filter(value => value && value !== "");
    
    let genres = request.body.genres;
    genres = ['Horror', genres[0], genres[1]]; // So 'Horror' is always first when displaying genres
    genres = genres.filter (value => value && value !== "");
    
    const updatedMovie = {
      movieId: movieId,
      title: request.body.title,
      releaseYear: request.body.releaseYear, 
      runtime: request.body.runtime, 
      directors: directors, 
      cast: cast, 
      genres: genres, 
      image: movie.image,
      favourite: request.body.favourite === 'on' ? true : false
    };
    
    movieCollectionStore.updateMovie(
      collectionId, 
      movieId,
      updatedMovie,
      () => response.redirect(`/movie-collection/${collectionId}`)
    );
  }
};

export default movieCollection;