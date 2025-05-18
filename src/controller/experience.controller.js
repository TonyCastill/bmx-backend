const express_async_handler =  require("express-async-handler");
// const sequelize = require('../config/database');
const { Experience}  = require("../models");

const ExperienceController = {
    create_experience: express_async_handler(async (req, res) => {
      try {

        const { name, years_required } = req.body;
        if (name == null || years_required == null) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newExperience = await Experience.create({name: name, years_required: years_required}); 
        // await sequelize.query(sql`CALL Registerexperience('${CURP}','${name}','${birthday}','${gender}','${experience}','${city}');`);
        res.json(newExperience);
        // res.status(200).send("experience successfully created!");
        // res.json(tasks); // Send results as JSON
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    list_experiences:express_async_handler(async (req, res) => {
        try {
          const experiences = await Experience.findAll();
          console.log(experiences);
          if(experiences == null){
            res.status(500).send("No experiences found");
          }
          res.json(experiences);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    delete_experience: express_async_handler(async (req, res) => {
        try {

          const { id } = req.params;
          await Experience.destroy({
            where: {
              id_experience:id,
            },
          });
          res.status(204).send("experience successfully deleted!");
          // res.json(tasks); // Send results as JSON
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_experience: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const experience = await Experience.findByPk(id);
          res.json(experience);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    update_experience: express_async_handler(async (req, res) => {
        try {
            const experience = await Experience.findByPk(req.params.id);
            if (experience != null) {
                experience.set(req.body);
                await experience.save();
                res.json(experience); // Works as patch
            } else {
                throw new Errors();
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    
}

module.exports=ExperienceController;