/*
Database query methods specifically for CustomerOrder table
*/

const root = require("rootrequire");
const knex = require(root + "/database/db-setup");
const s = require(root + "/statics/sql")
const u = require(root + "/util");

module.exports = {
  insert,
  insertOrderItemRows,
  selectAllIds,
  selectItemsForOrder,
  selectCostOfOrder,
}


function insert(customerId) {
  const now = u.getTimestamp();
  
  const query = `insert into ?? (??, ??) values (?, ?); select SCOPE_IDENTITY() as ??;`;
  const parameters = [
    // insert into
    s.table_Order,
    s.col_orderDate,
    s.col_customerId,
    // values (
    now,
    customerId,
    // )
    // select SCOPE_IDENTITY() as
    s.col_id
  ];
  
  return knex.raw(query, parameters)
  .then(u.pluckId)
  .then(u.first);
}

function insertOrderItemRows(orderId, itemIds, quantities, itemCosts) {
  const rows = itemIds.map((itemId, index) => {
    const quantity = quantities[index];
    const cost = itemCosts[index];
    const extendedCost = quantity * cost;
    return createOrderItemRow(orderId, itemId, quantity, extendedCost);
  })
  
  
  return knex(s.table_Order_Item)
  .returning(s.col_all)
  .insert(rows);
}

function selectAllIds() {
  const query = `select ?? from ?? order by ?? ${s.val_descending}`;
  const parameters = [
    // select
    s.col_id,
    // from
    s.table_Order,
    // order by
    s.col_orderDate,
    // desc
  ]
  
  return knex.raw(query, parameters)
  .then(u.pluckId);
}

function selectItemsForOrder(orderId) {
  // select itemId, quantity from CustomerOrder_Item where orderId = 13;
  const query = `select ??, ?? from ?? where ?? = ?`;
  const parameters =[
    // select 
    s.col_itemId,
    s.col_quantity,
    // from 
    s.table_Order_Item,
    // where 
    s.col_orderId,
    // = 
    orderId
  ];
  
  return knex.raw(query, parameters)
}

function selectCostOfOrder(orderId) {
  // select SUM(extendedCost) as totalCost from CustomerOrder_Item where orderId = 18;
  const query = `select SUM(??) as ?? from ?? where ?? = ?;`;
  const parameters = [
    // select SUM(
    s.col_extendedCost,
    // as
    s.col_totalCost,
    // from
    s.table_Order_Item,
    // where
    s.col_orderId,
    // = 
    orderId
  ];
  
  return knex.raw(query, parameters)
  .then(u.first)
  .then(result => {
    return result[s.col_totalCost];
  })
}

////////////////////
////////////////////
///* Unexported *///
////////////////////
////////////////////
function createOrderItemRow(orderId, itemId, quantity, extendedCost) {
  return {
    [s.col_orderId] : orderId,
    [s.col_itemId] : itemId,
    [s.col_quantity] : quantity,
    [s.col_extendedCost] : extendedCost
  }
}
