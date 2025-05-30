const express = require("express");
const RoundController = require('../controller/round.controller');

// const groupController = require("../controller/group.controller")
const router = express.Router();

router.put('/round/:round/hit/:hit_id/athlete/:athlete_id',RoundController.register_arriving_place);
// router.get('/group/:id/athletes',groupController.get_athletes);


module.exports=router;
