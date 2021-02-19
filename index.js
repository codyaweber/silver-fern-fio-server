/*
Worker cluster setup
*/

"use strict";

const root = require("rootrequire");
require("dotenv").config();

const express = require("express");
const app = express();
const router = require(root + "/routes");

const cors = require("cors");

const bodyParser = require("body-parser");


setUpWorker();

function setUpWorker() {
  // Parse query parameters
  // app.use(bodyParser.urlencoded({ extended: true }));
  
  // Parse JSON and set to req.body
  app.use(bodyParser.json());
  app.use(handleBodyParserErrors);
  app.use(cors({
    // Sets Access-Control-Allow-Credentials for all responses to true
    credentials: true,
    // Sets Access-Control-Allow-Origin to the req.origin, giving origin access to all resources
    origin: true
  }));


  const port = process.env.PORT;
  
  // Prevent returning arrays as body root (always return object)
  app.all("*", objectifyArrays);
  app.use("/", router);
  // Using my own etag system
  // app.disable("etag");

  app.listen(port, function() {
    console.log("Server listening on port " + port);
  });
}


function handleBodyParserErrors(error, req, res, next) {
  if (error instanceof SyntaxError) {
    const err = {
      "error" : "invalid_json",
      "message" : "Invalid json in request body."
    };
    return res.status(400).json(err);
  } else {
    next();
  }
}

// Alter express res.json method to wrap arrays in a JSON object before sending
function objectifyArrays(req, res, next) {
  res.sendJSON = res.json;
  res.json = function(result) {
    let editedResult = result;

    /** Embed an array in a JSON object with key "array" */
    if(Array.isArray(result)) {
      editedResult = {
        array : result
      };
    }
    res.sendJSON(editedResult);
  }

  next();
}
