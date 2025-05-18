const express = require("express");
const AthleteController = require('../controller/athlete.controller');

// const AthleteController = require("../controller/athlete.controller")
const router = express.Router();

router.get('/athlete',AthleteController.list_athletes);
router.post('/athlete',AthleteController.create_athlete);
router.post('/competition/:competition_id/athlete',AthleteController.create_athlete_and_participation);
router.delete('/athlete/:id',AthleteController.delete_athlete);
router.put('/athlete/:id',AthleteController.update_athlete);
router.get('/athlete/:id',AthleteController.get_athlete);
router.put('/athlete/:athlete_id/set_club/:club_id',AthleteController.set_club_to_athlete);
router.get('/athlete/:id/club',AthleteController.get_club);
router.get('/athlete/:id/city',AthleteController.get_city);

module.exports=router;
