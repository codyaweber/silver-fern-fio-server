module.exports = {
    first,
    getTimestamp,
    pluckId
    
}

// Return first item from array if present, else null
function first(array) {
  if(array === undefined || array.length === 0) {
    return null;
  }
  return array[0];
}

// Return ISO8601 now timestamp
function getTimestamp() {
  const date = new Date();
  return date.toISOString();
}

/* Given an array of objects with the same key, return an array of just that
key's value from all of the objects */
function pluckId(objects, key = "id") {
  return objects.map( obj => obj[key] );
}
