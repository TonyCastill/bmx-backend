const express = require("express");
const ExperienceController = require('../controller/experience.controller');

// const experienceController = require("../controller/experience.controller")
const router = express.Router();

router.get('/experience',ExperienceController.list_experiences);
router.post('/experience',ExperienceController.create_experience);
router.delete('/experience/:id',ExperienceController.delete_experience);
router.put('/experience/:id',ExperienceController.update_experience);
router.get('/experience/:id',ExperienceController.get_experience);



module.exports=router;
