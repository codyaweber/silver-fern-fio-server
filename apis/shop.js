/*
Request handling middleware
*/

const root = require('rootrequire');
const dbGeneral = require(root + "/database/db-general");
const dbOrder = require(root + "/database/db-order");
const dbItem = require(root + "/database/db-item");
const dbCustomer = require(root + "/database/db-customer");
const s = require(root + "/statics/sql")


module.exports = {
  getItemIds,
  getItemById,
  submitOrder
}

async function getItemIds(req, res, next) {
  const { limit = 50, offset = 0} = req.query;
  
  try {
    const itemIds = await dbGeneral.selectIds(s.table_Item, limit, offset);
    res.status(200).json(itemIds);
  } catch (e) {
    console.log("Error getting item ids: ", e);
    res.sendStatus(500);
  }
}

async function getItemById(req, res, next) {
  const {id} = req.params;
  
  try {
    const item = await dbGeneral.selectById(s.table_Item, id);
    res.status(200).json(item);
  } catch (e) {
    console.log(`Error getting item id ${id}: ${e}`)
    res.sendStatus(500);
  }
}

async function submitOrder(req, res, next) {
  const { customerId, itemIds, itemQuantities } = req.body;
  
  try {
    // Insert Order row
    const orderId = await dbOrder.insert(customerId);
    
    // Select costs of each item ordered
    const itemCostRows = await dbItem.selectCostsForItemIds(itemIds);
    const itemCosts = getCostsArrayForItems(itemCostRows, itemIds);
    
    // Insert that data, and calculated extended cost, into CustomerOrder_Item
    const results = await dbOrder.insertOrderItemRows(orderId, itemIds, itemQuantities, itemCosts);
    res.status(200).json({
      orderId
    })
  } catch(e) {
    console.log("Error processing order: ", e);
    res.sendStatus(500);
  }
}



////////////////////
////////////////////
///* Unexported *///
////////////////////
////////////////////

// Given cost rows matching itemIds, return array of each items costs in same order
// as itemIds
function getCostsArrayForItems(costRows, itemIds) {
  return itemIds.map(id => {
    const costRow = costRows.filter(o => o.id == id)[0]
    return costRow[s.col_cost];
  })
}
