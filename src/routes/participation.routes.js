const express = require("express");
const ParticipationController = require('../controller/participation.controller');

// const participationController = require("../controller/participation.controller")
const router = express.Router();

router.get('/participation',ParticipationController.list_participations);
router.get('/participation/competition/:competition_id',ParticipationController.get_competition_participations);
router.get('/participation/athlete/:athlete_id',ParticipationController.get_athlete_participations);
router.post('/participation/:competition_id/:athlete_id',ParticipationController.create_participation);
router.delete('/participation/:competition_id/:category_id/:athlete_id',ParticipationController.delete_participation);
router.put('/participation/:competition_id/:category_id/:athlete_id',ParticipationController.update_participation);

// router.get('/participation/:id/athletes',ParticipationController.get_athletes);


module.exports=router;
