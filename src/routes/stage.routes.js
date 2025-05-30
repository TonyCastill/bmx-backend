const express = require("express");
const StageController = require('../controller/stage.controller');

// const groupController = require("../controller/group.controller")
const router = express.Router();

router.post('/stage/competition/:competition_id/category/:category_id',StageController.create_stage);
router.get('/stage/competition/:competition_id/category/:category_id',StageController.list_stages);

router.get('/stage/:stage_id',StageController.get_stage);
router.delete('/stage/:stage_id',StageController.delete_stage);
router.put('/stage/:stage_id',StageController.update_stage);
router.post('/stage/:id_stage',StageController.shuffle_groups_category);
router.put('/stage/start/:id_stage',StageController.start_competition_category);
router.put('/stage/continue/:id_stage',StageController.continue_or_finalize);
// router.put('/round/:round/group/:group_id/athlete/:athlete_id',StageController.register_arriving_place);
// router.get('/group/:id/athletes',groupController.get_athletes);


module.exports=router;
