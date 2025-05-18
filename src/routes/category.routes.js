const express = require("express");
const CategoryController = require('../controller/category.controller');

// const categoryController = require("../controller/category.controller")
const router = express.Router();

router.get('/category',CategoryController.list_categories);
router.post('/category',CategoryController.create_category);
router.delete('/category/:id',CategoryController.delete_category);
router.put('/category/:id',CategoryController.update_category);
router.get('/category/:id',CategoryController.get_category);



module.exports=router;
