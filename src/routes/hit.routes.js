const express = require("express");
const HitController = require('../controller/hit.controller');

// const groupController = require("../controller/group.controller")
const router = express.Router();

router.get('/hit',HitController.list_hits);
router.get('/hit/:id_hit/rounds',HitController.get_hit_rounds);
// router.get('/hit/:hit/round/:round',HitController.list_groups);
router.post('/hit/:id_stage',HitController.create_hit);
router.delete('/hit/:id_hit',HitController.delete_hit);
// router.get('/group/:id/athletes',groupController.get_athletes);


module.exports=router;
