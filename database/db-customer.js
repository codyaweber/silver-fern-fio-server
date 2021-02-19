/*
Database query methods for Customer table
*/

const root = require("rootrequire");
const knex = require(root + "/database/db-setup");
const s = require(root + "/statics/sql")
const u = require(root + "/util");

module.exports = {
  selectTopCustomers
}


function selectTopCustomers(count) {
  // select top 10 customerId, Sum(extendedCost) as total from CustomerOrder_Item coi
  // join CustomerOrder co on co.id = coi.orderId
  // join Customer c on c.id = co.customerId 
  // group by customerId order by total desc;
  const query = `select top ${count} ??, Sum(??) as ?? from ?? coi
                join ?? co on co.?? = coi.??
                join ?? c on c.?? = co.??
                group by ?? order by ?? ${s.val_descending}`
                
  const parameters = [
    // select top ${count} 
    s.col_customerId,
    // , Sum(
    s.col_extendedCost,
    // ) as
    s.col_total,
    // from
    s.table_Order_Item,
    // coi join
    s.table_Order,
    // co on co.
    s.col_id,
    // = coi.
    s.col_orderId,
    // join
    s.table_Customer,
    // c on c.
    s.col_id,
    // = co.
    s.col_customerId,
    // group by
    s.col_customerId,
    // order by
    s.col_total,
    // desc
  ]
  
  return knex.raw(query, parameters);
}
