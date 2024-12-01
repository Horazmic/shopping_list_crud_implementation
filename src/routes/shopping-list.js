const express = require("express");
const Joi = require("joi");
const router = express.Router();
const authorize = require("../authorize");

const shoppingLists = [
  {
    id: "1",
    name: "Grocery Shopping",
    items: [
      { id: "item1", name: "Milk", amount: 2, unit: "l" },
      { id: "item2", name: "Bread", amount: 1, unit: "pcs" },
      { id: "item3", name: "Eggs", amount: 12, unit: "pcs" },
    ],
    owner: "user1",
  },
  {
    id: "2",
    name: "Hardware Store",
    items: [
      { id: "item4", name: "Screwdriver", amount: 1, unit: "pcs" },
      { id: "item5", name: "Paint", amount: 5, unit: "l" },
      { id: "item6", name: "Nails", amount: 100, unit: "pcs" },
    ],
    owner: "user2",
  },
];

const listSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  items: Joi.array().items(
    Joi.object({
      name: Joi.string().required().min(1).max(100),
      amount: Joi.number().required().positive(),
      unit: Joi.string().required().valid("pcs", "l", "kg", "g"),
    })
  ),
  owner: Joi.string().required(),
});

router.get("/getList/list", authorize("read"), (req, res) => {
  res.json({ status: "success", lists: shoppingLists });
});

router.get("/getList/:id", authorize("read"), (req, res) => {
  const id = req.params.id;
  const list = shoppingLists.find((list) => list.id === id);

  if (!list) {
    return res.status(404).json({ status: "error", message: "List not found" });
  }

  res.json({ status: "success", list });
});

router.post("/createList", authorize("write"), (req, res) => {
  // check for empty request
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Request body cannot be empty",
    });
  }

  // input validation
  const { error, value } = listSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  // generate new id
  const newId = (shoppingLists.length + 1).toString();

  // create new list and add it to shoppingLists array
  const newList = { id: newId, ...value };
  shoppingLists.push(newList);

  res.status(201).json({
    status: "success",
    message: "Shopping list created successfully",
    data: newList,
  });
});

router.put("/updateList/:id", authorize("write"), (req, res) => {
  const id = req.params.id;
  const listIndex = shoppingLists.findIndex((list) => list.id === id);

  if (listIndex === -1) {
    return res.status(404).json({ status: "error", message: "List not found" });
  }

  const { error, value } = listSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  shoppingLists[listIndex] = { id, ...value };

  res.json({
    status: "success",
    message: "Shopping list updated successfully",
    data: shoppingLists[listIndex],
  });
});

router.delete("/deleteList/:id", authorize("delete"), (req, res) => {
  const id = req.params.id;
  const listIndex = shoppingLists.findIndex((list) => list.id === id);

  if (listIndex === -1) {
    return res.status(404).json({ status: "error", message: "List not found" });
  }

  shoppingLists.splice(listIndex, 1);

  res.json({
    status: "success",
    message: "Shopping list deleted successfully",
  });
});

module.exports = router;
