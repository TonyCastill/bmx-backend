const express = require("express");
const GroupController = require('../controller/group.controller');

// const groupController = require("../controller/group.controller")
const router = express.Router();

router.get('/group',GroupController.list_groups);
router.get('/group/:id_group/rounds',GroupController.get_group_rounds);
router.get('/group/:id_group/round/:round',GroupController.list_groups);
router.post('/group/:id_competition/:id_category',GroupController.create_group);
router.delete('/group/:id_competition/:id_category',GroupController.delete_group);
// router.get('/group/:id/athletes',groupController.get_athletes);


module.exports=router;
