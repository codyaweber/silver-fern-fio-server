/*
Exports caching middleware, which automatically handles the generation and
checking of etags (If-None-Match header) for requests when mounted
*/

"use strict";


const root = require("rootrequire");
const etag = require("etag");
const s = require(root + "/statics/sql");

const currentEtags = {}

// Send 304 to fresh requests, else generate response and cache etag value
function cache(maxAge = 86400) {
  return function(req, res, next) {
    const fresh = checkFresh(req)
    if(fresh) {
      res.sendStatus(304);
      return;
    } else {
      wrapResponseMethod(req, res, maxAge);
      next();
    }
  }
}

// Return boolean for freshness of request based on etag value
const checkFresh = function(req) {
  const key = req.url;
    
  // The etag on the incoming request
  const eTagReq = req.header("If-None-Match");

  // If no etag, request is stale
  if (!eTagReq) return false;

  // Request is only fresh if this is true
  return (eTagReq === currentEtags[key]);
}


// Wrap HTTP response method to cache before sending
function wrapResponseMethod(req, res, maxAge) {
  res.sendResponse = res.send;
  res.send = (body) => {
    if(res.statusCode === 404) {
      res.sendResponse(body);
      return;
    }
    
    const eTagGenerated = generateEtag(body);

    const key = req.url;
    
    currentEtags[key] = eTagGenerated;
    
    res.setHeader("Etag", eTagGenerated);
    //Cache is good for maxAge, and only valid for single user (not
    //any intermediate caches)
    res.setHeader("Cache-Control", `max-age=${maxAge}, private`);
    res.sendResponse(body);
  }
}


// Generate etag from object after stringifying. When express generates etags,
// it uses the body object after stringifying, so this method does the same
// for consistency's sake
const generateEtag = function(obj) {
  const str = JSON.stringify(obj);
  return etag(str, { weak: true });
}

module.exports = cache;
