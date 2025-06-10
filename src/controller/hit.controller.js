const express_async_handler =  require("express-async-handler");

// const sequelize = require('../config/database');
const { Hit, Round, Participation,Athlete}  = require("../models");


const HitController = {
    create_hit: express_async_handler(async (req, res) => {
      try {
        const { stage_id }= req.params;
        const hit = await Hit.create({stage_id});
        res.json(hit);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    list_hits:express_async_handler(async (req, res) => {
        try {
          const hits = await Hit.findAll({
            include:[{model: Round}]});
          console.log(hits);
          if(hits == null){
            res.status(500).send("No hits found");
          }
          res.json(hits);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_hit_rounds: express_async_handler(async (req, res) => {
      try {
        const {id_hit}=req.params;
        const hits = await Hit.findAll({
          include:[
            {
              model: Round,
              include:[
                {model: Participation,
                  include:[{model: Athlete}]
                }
              ]
            }
          ],
          where:{
            id_hit:id_hit
          }
        });
        console.log(hits);
        if(hits == null){
          res.status(500).send("No hits found");
        }
        res.json(hits);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    get_hit_round: express_async_handler(async (req, res) => {
      try {
        const {id_hit,round}=req.params;

        const hits = await Hit.findAll({
          include:[
            {
              model: Round,
              where:{
                round:round
              },
              include:[
                {model: Participation,
                  include:[{model: Athlete}]
                }
              ]
            }
          ],
          where:{
            id_hit:id_hit
          }
        });
        console.log(hits);
        if(hits == null){
          res.status(500).send("No hits found");
        }
        res.json(hits);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    delete_hit: express_async_handler(async (req, res) => {
      try {
        const { id_hit }= req.params;
        if(id_hit ==null){
          return res.status(400).json({ message: "All fields are required" });
        }
        const hit = await Hit.destroy({
            where: {
              id_hit: id_hit
            },
        });
      
        res.status(200).json(hit);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    })
    
}

module.exports=HitController;