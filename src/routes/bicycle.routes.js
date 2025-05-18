const express = require("express");
const BicycleController = require('../controller/bicycle.controller');

// const bicycleController = require("../controller/bicycle.controller")
const router = express.Router();

router.get('/bicycle',BicycleController.list_bicycles);
router.post('/bicycle',BicycleController.create_bicycle);
router.delete('/bicycle/:id',BicycleController.delete_bicycle);
router.put('/bicycle/:id',BicycleController.update_bicycle);
router.get('/bicycle/:id',BicycleController.get_bicycle);



module.exports=router;
