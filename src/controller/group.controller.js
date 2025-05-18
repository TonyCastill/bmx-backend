const express_async_handler =  require("express-async-handler");

// const sequelize = require('../config/database');
const { Group, Round, Athlete}  = require("../models");


const GroupController = {
    create_group: express_async_handler(async (req, res) => {
      try {
        const { id_competition , id_category}= req.params;
        const group = await Group.create({id_competition,id_category});
        res.json(group);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    list_groups:express_async_handler(async (req, res) => {
        try {
          const groups = await Group.findAll({
            include:[{model: Round}]});
          console.log(groups);
          if(groups == null){
            res.status(500).send("No groups found");
          }
          res.json(groups);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_group_rounds: express_async_handler(async (req, res) => {
      try {
        const {id_group}=req.params;
        const groups = await Group.findAll({
          include:[
            {
              model: Round,
              include:[
                {model: Athlete}
              ]
            }
          ],
          where:{
            id_group:id_group
          }
        });
        console.log(groups);
        if(groups == null){
          res.status(500).send("No groups found");
        }
        res.json(groups);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    get_group_round: express_async_handler(async (req, res) => {
      try {
        const {id_group,round}=req.params;

        const groups = await Group.findAll({
          include:[
            {
              model: Round,
              where:{
                round:round
              },
              include:[
                {model: Athlete}
              ]
            }
          ],
          where:{
            id_group:id_group
          }
        });
        console.log(groups);
        if(groups == null){
          res.status(500).send("No groups found");
        }
        res.json(groups);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    delete_group: express_async_handler(async (req, res) => {
      try {
        const { id_competition , id_category}= req.params;
        if(id_competition ==null || id_category== null){
          return res.status(400).json({ message: "All fields are required" });
        }
        const category = await Group.destroy({
            where: {
              id_competition: id_competition,
              id_category: id_category
            },
        });
      
        res.status(200).json(category);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    })
    
}

module.exports=GroupController;