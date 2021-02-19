/*
Request handling middleware
*/

const root = require('rootrequire');
const dbGeneral = require(root + "/database/db-general");
const dbItem = require(root + "/database/db-item"); 
const dbOrder = require(root + "/database/db-order");
const dbCustomer = require(root + "/database/db-customer");
const s = require(root + "/statics/sql")

module.exports = {
  getCustomerIds,
  getCustomerById,
  getTopCustomers,
  getTopItems,
  getOrderIds,
  getOrderById,
  getOrderDetails
}

async function getCustomerIds(req, res, next) {
  const {limit = 50, offset = 0} = req.query;
  
  try {
    const ids = await dbGeneral.selectIds(s.table_Customer, limit, offset);
    res.status(200).json(ids);
  } catch(e) {
    console.log(`Error getting customer ids: ${e}`);
    res.sendStatus(500);
  }
}

async function getCustomerById(req, res, next) {
  const {id} = req.params;

  try {
    const customer = await dbGeneral.selectById(s.table_Customer, id)
    res.status(200).json(customer);
  } catch(e) {
    console.log(`Error getting customer by id ${id}: ${e}`);
    res.sendStatus(500);
  }
}

async function getTopCustomers(req, res, next) {
  const {count} = req.params;
  
  try {
    const topCustomers = await dbCustomer.selectTopCustomers(count);
    res.status(200).json(topCustomers);
  } catch(e) {
    console.log(`Error getting top customers: ${e}`);
    res.sendStatus(500);
  }
}

async function getTopItems(req, res, next) {
  const {count} = req.params;
  
  try {
    const topItems = await dbItem.selectTopItems(count);
    res.status(200).json(topItems);
  } catch(e) {
    console.log(`Error getting top items: ${e}`);
    res.sendStatus(500);
  }
}

async function getOrderIds(req, res, next) {
  
  try {
    const itemIds = await dbOrder.selectAllIds(s.table_Order);
    res.status(200).json(itemIds);
  } catch (e) {
    console.log("Error getting item ids: ", e);
    res.sendStatus(500);
  }
}

async function getOrderById(req, res, next) {
  const {id} = req.params;

  try {
    const order = await dbGeneral.selectById(s.table_Order, id)
    const cost = await dbOrder.selectCostOfOrder(id);
    order.cost = cost;
    res.status(200).json(order);
  } catch(e) {
    console.log(`Error getting order by id ${id}: ${err}`);
    res.sendStatus(500);
  }
}

async function getOrderDetails(req, res, next) {
  const {id} = req.params;
  
  try {
    let order = await dbGeneral.selectById(s.table_Order, id);
    // Get list of items, quantities and extended costs in order
    const itemsInOrder = await dbOrder.selectItemsForOrder(id);
    const orderCost = await dbOrder.selectCostOfOrder(id);
    
    const orderItemIds = itemsInOrder.map(i => i[s.col_itemId]);
    const orderItemQuantities = itemsInOrder.map(i => i[s.col_quantity]);
    const orderDetails = {
      items : orderItemIds,
      quantities : orderItemQuantities,
      orderCost
    };
    
    order = {
      ...order,
      ...orderDetails,
    }
    res.status(200).json(order);
    // Get total cost of order
    
  } catch(e) {
    console.log("Error getting order details: ", e);
    res.sendStatus(500);
  }
  
}
