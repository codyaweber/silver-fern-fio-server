/*
Custom server error class
*/

"use strict";

class ServerError {
  constructor(error, message) {
    //Add stack trace to variable
    Error.captureStackTrace(this, this.constructor);
    this.error = error;
    this.message = message;
  }
}

module.exports = ServerError;
