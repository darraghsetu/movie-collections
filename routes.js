'use strict';

import express from 'express';
const router = express.Router();

import about from './controllers/about.js';
import accounts from './controllers/accounts.js';
import dashboard from './controllers/dashboard.js';
import index from './controllers/index.js';
import movieCollection from './controllers/movie-collection.js';
import search from './controllers/search.js';
import start from './controllers/start.js';

router.get('/about', about.createView);

router.get('/signup', accounts.renderSignup);
router.post('/register', accounts.registerUser);
router.get('/login', accounts.renderLogin);
router.post('/authenticate', accounts.authenticateUser);
router.get('/logout', accounts.logoutUser);

router.get('/dashboard', dashboard.createView);
router.post('/dashboard/addcollection', dashboard.addCollection);
router.get('/dashboard/deletecollection/:collectionId', dashboard.deleteCollection);

router.get('/', index.createView);

router.get('/movie-collection/:collectionId', movieCollection.createView);
router.post('/movie-collection/:collectionId/addmovie', movieCollection.addMovie);
router.get('/movie-collection/:collectionId/deletemovie/:movieId', movieCollection.deleteMovie);
router.post('/movie-collection/:collectionId/updatemovie/:movieId', movieCollection.updateMovie);

router.get('/search', search.createView);
router.post('/searchGenre', search.genreSearch);

router.get('/start', start.createView);

router.get('*', index.createView);

export default router;