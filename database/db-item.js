/*
Database query methods for Item table
*/

const root = require("rootrequire");
const knex = require(root + "/database/db-setup");
const s = require(root + "/statics/sql")
const u = require(root + "/util");

module.exports = {
  selectCostsForItemIds,
  selectTopItems
}

function selectCostsForItemIds(itemIds) {
  // select id, cost from Item where id in (1,2,3,4,5,6,7,8,9,10);
  return knex.select([s.col_id, s.col_cost])
  .from(s.table_Item)
  .whereIn(s.col_id, itemIds);
}

function selectTopItems(count) {
   // select top 10 itemId, Sum(extendedCost) as total from CustomerOrder_Item coi group by itemId order by total desc;
   
   const query = `select top ${count} ??, Sum(??) as ?? from ?? group by ?? order by ?? ${s.val_descending};`;
   
   const parameters = [
     // select top
     // count,
     s.col_itemId,
     // sum(
     s.col_extendedCost,
     // ) as
     s.col_total,
     // from
     s.table_Order_Item,
     // group by
     s.col_itemId,
     // order by
     s.col_total,
     // desc
   ]
   
   return knex.raw(query, parameters);
}
