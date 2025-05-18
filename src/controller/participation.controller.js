const express_async_handler =  require("express-async-handler");
const { Op } = require('sequelize');

// const sequelize = require('../config/database');
const { Participation, Bicycle, Category, Athlete, Experience}  = require("../models");

const ParticipationController = {
    create_participation: express_async_handler(async (req, res) => {
      try {
        const { competition_id, athlete_id } = req.params;
        const {ranking=0, status="registered",bicycleInches}= req.body;
        if(bicycleInches == null){return res.status(400).json({ message: "All fields are required" });}
        const athlete = await Athlete.findByPk(athlete_id);
        if (!athlete) {res.status(404).send("No athlete found");}
        const years_competing = 0;
        if(athlete.years_compiting!=undefined){years_competing=athlete.years_competing}        
        const category = await Category.findOne({
            include: [
              { model: Bicycle, where: { inches: bicycleInches } },
              { model: Experience, where: { years_required: { [Op.lte]: years_competing } } }
            ],
            where: {
              min_age: { [Op.lte]: athlete.current_age },
              max_age: { [Op.gte]: athlete.current_age }
            },
        });
        if (!category)  {res.status(404).send("No category found");}

        const newParticipation = await Participation.create({athlete_id, competition_id, category_id:category.idcategory , ranking,status}); 
        res.status(200).json(newParticipation);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    list_participations:express_async_handler(async (req, res) => {
        try {
          const participations = await Participation.findAll({include:[{model: Athlete}, {model:Category}]});
          console.log(participations);
          if(participations == null){
            res.status(500).send("No participations found");
          }
          res.json(participations);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_competition_participations:express_async_handler(async (req, res) => {
      const { competition_id } = req.params;
      if(competition_id ==null){res.status(404).send("No competition found");}
      try {
        const participations = await Participation.findAll({
          include:[
            {model: Athlete},
            {model:Category}
          ],
          where:{
            competition_id:competition_id
          }
        });
        if(participations == null){
          res.status(500).send("No participations found");
        }
        res.json(participations);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    get_athlete_participations:express_async_handler(async (req, res) => {
      const { athlete_id } = req.params;
      if(athlete_id ==null){res.status(404).send("No athlete found");}
      try {
        const participations = await Participation.findAll({
          include:[
            {model: Athlete},
            {model:Category}
          ],
          where:{
            athlete_id:athlete_id 
          }
        });
        if(participations == null){
          res.status(500).send("No participations found");
        }
        res.json(participations);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    delete_participation: express_async_handler(async (req, res) => {
      try {
        const { competition_id,category_id, athlete_id } = req.params;
        if(competition_id ==null || category_id== null || athlete_id== null){
          return res.status(400).json({ message: "All fields are required" });
        }
        const participation = await Participation.destroy({
            where: {
              competition_id: competition_id,
              category_id: category_id,
              athlete_id: athlete_id
            },
        });
      
        res.status(200).json(participation);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    update_participation: express_async_handler(async (req, res) => {
        try {

          const { competition_id,category_id, athlete_id } = req.params;
          const {ranking, status}= req.body;
          if(!status || ranking == null ||
            competition_id == null || category_id == null ||
            athlete_id == null
          ){
            return res.status(400).json({ message: "All fields are required" });
          }

            const participation = await Participation.findOne({
              where:{
                competition_id:competition_id,
                category_id:category_id,
                athlete_id:athlete_id
              }
            });
            if (participation != null) {
                participation.set(req.body);
                await participation.save();
                res.json(participation); // Works as patch
            } else {
              return res.status(404).json({ message: "Participation not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    
}

module.exports=ParticipationController;