const express = require("express");
const PenaltyController = require('../controller/penalty.controller');

// const groupController = require("../controller/group.controller")
const router = express.Router();

// router.put('/round/:round/hit/:hit_id/athlete/:athlete_id',PenaltyController.register_arriving_place);
router.post('/penalty', PenaltyController.create_penalty);
router.get('/penalties', PenaltyController.list_penalties);
router.put('/penalty/:id_penalty', PenaltyController.update_penalty);

// router.get('/group/:id/athletes',groupController.get_athletes);


module.exports=router;
