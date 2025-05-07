'use strict';

import userStore from '../models/user-store.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const accounts = {
  
  renderIndex(request, response) {
    response.redirect('/');
  },
  
  renderLogin(request, response) {
    let errorMsg = request.query.error;
    
    switch(errorMsg) {
      case "authError":
        errorMsg = "The login details provided did not match an account, please try again";
        break;
      case "appError":
        errorMsg = "There was a server error while logging you in, please try again";
        break;
      default:
        errorMsg = false;
    }
    
    const viewData = {
      title: 'Login | The Terror Trove',
      error: errorMsg
    };

    response.render('login', viewData);
  },
  
  renderSignup(request, response) {
    let errorMsg = request.query.error;
    
    switch(errorMsg) {
      case "emailRegistered":
        errorMsg = "The email provided is already in use. Forgot password? Too bad";
        break;
      case "appError":
        errorMsg = "There was a server error while registering your account, please try again";
        break;
      default:
        errorMsg = false;
    }
    
    const viewData = {
      title: 'Sign Up | The Terror Trove',
      error: errorMsg
    };
    
    response.render('signup', viewData);
  },
  
  loginUser(user, response) {
    response.cookie('terrortrove', user.email);
    response.redirect('/start');
  },
  
  logoutUser(request, response) {
    response.cookie('terrortrove', '');
    response.redirect('/');
  },
  
  async registerUser(request, response) {
    const user = request.body;
    user.email = user.email.toLowerCase();
    const emailRegistered = userStore.emailExists(user.email);
    let responseError = "";
    
    if (!emailRegistered) {
      user.userId = uuidv4();
      user.image = request.files.image;
    
      try{
        user.password = await accounts.hashString(request.body.password.toString());
        await userStore.addUser(
          user,
          () => { accounts.loginUser(user, response) }
        );
        return;
      } catch(error) {
        console.log(`Error adding user: ${error}`);
        responseError = "?error=appError";
      }
    } else {
      responseError = "?error=emailRegistered";
    }
    
    response.redirect('/signup' + responseError);
  },
  
  async authenticateUser(request, response) {
    const user = userStore.getUserByEmail(request.body.email.toLowerCase());
    let responseError = "";
    
    if (user) {
      try{
        const password = await accounts.authenticatePassword(user.password, request.body.password);
      
        if (password) {
          accounts.loginUser(user, response);
          return;
        }
      } catch (error) {
        console.log(`Error authenticating password: ${error}`);
        responseError = "?error=appError";
      }
    } 
    
    responseError = "?error=authError";  
    
    response.redirect('/login' + responseError );
  },
  
  async authenticatePassword(userPassword, password) {
    return await bcrypt.compare(password, userPassword)
      .catch( error => { throw error });
  },
      
  async hashString(string) {
    try {
      const rounds = 5;
      const salt = await bcrypt.genSalt(rounds);
      const hash = await bcrypt.hash(string, salt);
      
      return hash;
    } 
    catch (error) {
      throw error;
    }
  },
  
  getCurrentUser(request) {
    const userEmail = request.cookies.terrortrove;
    return userStore.getUserByEmail(userEmail);
  },
  
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
}

export default accounts;