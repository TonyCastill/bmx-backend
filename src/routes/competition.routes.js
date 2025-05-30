const express = require("express");
const CompetitionController = require('../controller/competition.controller');

// const competitionController = require("../controller/competition.controller")
const router = express.Router();

router.get('/competition',CompetitionController.list_competitions);
router.post('/competition',CompetitionController.create_competition);
router.post('/competition/:category_id/category',CompetitionController.create_competition_with_stages_single_category);
router.post('/competition/categories',CompetitionController.create_competition_with_stages_all_categories);
router.delete('/competition/:id',CompetitionController.delete_competition);
router.put('/competition/:id',CompetitionController.update_competition);
router.get('/competition/:id',CompetitionController.get_competition);
router.get('/competition/:id/athletes',CompetitionController.get_athletes);


// router.post('/competition/:id_competition/category/:id_category/stage/:stage',CompetitionController.shuffle_groups_category);
// router.put('/competition/:id_competition/start_category/:id_category',CompetitionController.start_competition_category);
module.exports=router;
