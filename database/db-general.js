/*
General queries that can apply to various tables
*/

const root = require("rootrequire");
const knex = require(root + "/database/db-setup");
const s = require(root + "/statics/sql")
const u = require(root + "/util");

module.exports = {
  selectIds,
  selectById,
}


function selectIds(table, limit, offset) {
  const query = 'select ?? from ?? order by ?? offset ? rows fetch next ? rows only;';
  const parameters = [
    // select
    s.col_id,
    // from
    table,
    // order by
    s.col_id,
    // offset
    parseInt(offset),
    // rows fetch next
    parseInt(limit)
    // rows only
  ]
  
  return knex.raw(query, parameters)
  .then(u.pluckId)
}

function selectById(table, id) {
  const query = 'select ?? from ?? where ?? = ?;';
  const parameters = [
    // select
    s.col_all,
    // from
    table,
    // where
    s.col_id,
    // = 
    id
  ]
  
  return knex.raw(query, parameters)
  .then(u.first);
}
