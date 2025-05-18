const express = require("express");
const ClubController = require('../controller/club.controller');

// const clubController = require("../controller/club.controller")
const router = express.Router();

router.get('/club',ClubController.list_clubs);
router.post('/club',ClubController.create_club);
router.delete('/club/:id',ClubController.delete_club);
router.put('/club/:id',ClubController.update_club);
router.get('/club/:id',ClubController.get_club);
router.get('/club/:id/athletes',ClubController.get_athletes);


module.exports=router;
