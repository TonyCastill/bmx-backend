const express = require("express");
const RoundController = require('../controller/round.controller');

// const groupController = require("../controller/group.controller")
const router = express.Router();

router.put('/round/:round/hit/:hit_id/participation/:id_participation',RoundController.register_arriving_place);
router.put('/round/:round/hit/:hit_id/participation/:participation_id/penalty/:id_penalty',RoundController.penalty);
// router.get('/group/:id/athletes',groupController.get_athletes);


module.exports=router;
