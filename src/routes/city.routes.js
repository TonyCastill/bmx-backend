const express = require("express");
const CityController = require('../controller/city.controller');

// const cityController = require("../controller/city.controller")
const router = express.Router();

router.get('/city',CityController.list_cities);
router.post('/city',CityController.create_city);
router.delete('/city/:id',CityController.delete_city);
router.put('/city/:id',CityController.update_city);
router.get('/city/:id',CityController.get_city);
router.get('/city/:id/athletes',CityController.get_athletes);


module.exports=router;
