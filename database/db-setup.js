/*
Setup for Knex query builder
*/

"use strict";

let username;
let password;
let database;
let host;

if(process.env.LOCAL_DB) {
  username = process.env.DB_LOCAL_USER;
  password = process.env.DB_LOCAL_PASSWORD;
  database = process.env.DB_LOCAL_DATABASE;
  host = process.env.DB_LOCAL_HOST;
} else {
  username = process.env.DB_REMOTE_USER;
  password = process.env.DB_REMOTE_PASSWORD;
  database = process.env.DB_REMOTE_DATABASE;
  host = process.env.DB_REMOTE_HOST;
}

let knex;

try {
  knex = require('knex')({
    client: 'mssql',
    connection: {
      host: host,
      user: username,
      password: password,
      database: database,
      options : {
        encrypt: true,
        enableArithAbort : true
      }
    }
  });  
  
  knex.on("query", (data) => {
    console.log(data.sql);
  })

  knex.on("query-error", (data) => {
    console.log("Query error:")
    console.log(data);
  })
} catch(e) {
  console.log("Error connecting to database: ", e);
}





module.exports = knex;
