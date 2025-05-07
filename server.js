'use strict';

import express from 'express';
import routes from './routes.js'; 
import logger from "./utils/logger.js";
import { create } from 'express-handlebars';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(cookieParser());
app.use(fileUpload({useTempFiles: true}));

const handlebars = create({
  extname: '.hbs',
  helpers: {
    
    toJSON: (string) => {
      return JSON.stringify(string);
    },
    
    isOdd: (number) => {
      return number % 2 !== 0;
    },
    
    isEven: (number) => {
      return number % 2 === 0;
    },
    
    uppercase: (inputString) => {
      return inputString.toUpperCase();
    },
    
    formatDate: (date) => {
      let dateCreated = new Date(date);
      let options = {
        
        year: "numeric",
        month: "long",
        day: "2-digit",
      };
      return `${dateCreated.toLocaleDateString("en-IE", options)}`;
    },
    
    formatMinutes: (mins) => {
      let hours = 0;
      const pluralise = (a, b, c) => handlebars.helpers.pluralise(a, b, c);
      let returnString = "";
      
      hours = Math.floor(mins / 60);
      mins %= 60;
      
      returnString += hours < 1 ? "" : `${hours} ${pluralise(hours, 'hour', 'hours')} `;
      returnString += mins === 0 ? "" : `${mins} ${pluralise(mins, 'minute', 'minutes')}`;
      
      return returnString;
    },
    
    formatNumber: (number) => {
      const numbers = {
        0: "Zero",
        1: "One",
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine',
        10: 'Ten'
      };
      
      return numbers[number] || Intl.NumberFormat("en-IE").format(number);
    },
    
    getCurrentYear: () => {
      return new Date().getFullYear();
    },
    
    pluralise: (count, singular, plural) => {
      return count === 1 ? singular : plural;
    },
    
    notEmpty: (item) => {
      try{
        if (item.hasOwnProperty(length)) return item.length > 0
        else return false
      } catch {
        return false  
      }
    },
    
    /* 
     * PLAGIARISM DISCLAIMER:
     * Not Original Work - The following helpers are not my own work. 
     * Source: https://stackoverflow.com/a/31632215
     */
    equals: (v1, v2) => {
      return v1 === v2
    },
    
    notEquals: (v1, v2) => {
      return v1 !== v2
    },
    
    lessThan: (v1, v2) => { 
      return v1 < v2
    },
    
    greaterThan: (v1, v2) => { 
      return v1 > v2
    },
    
    lessThanOrEquals: (v1, v2) => {
      return v1 <= v2
    },
    
    greaterThanOrEquals: (v1, v2) => {
      return v1 >= v2
    },
    
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
  }
});

app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

app.use("/", routes);
app.listen(port, () => logger.info("Your app is listening on port " + port));