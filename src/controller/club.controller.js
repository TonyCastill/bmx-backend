const express_async_handler =  require("express-async-handler");
// const sequelize = require('../config/database');
const { Club}  = require("../models");

const ClubController = {
    create_club: express_async_handler(async (req, res) => {
      try {

        const { club } = req.body;
    
        if (!club) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newClub = await Club.create({club}); 
        // await sequelize.query(sql`CALL Registerclub('${CURP}','${name}','${birthday}','${gender}','${experience}','${city}');`);
        res.json(newClub);
        // res.status(200).send("club successfully created!");
        // res.json(tasks); // Send results as JSON
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    list_clubs:express_async_handler(async (req, res) => {
        try {
          const clubs = await Club.findAll();
          console.log(clubs);
          if(clubs == null){
            res.status(500).send("No clubs found");
          }
          res.json(clubs);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    delete_club: express_async_handler(async (req, res) => {
        try {

          const { id } = req.params;
          await Club.destroy({
            where: {
              id_club:id,
            },
          });
          res.status(204).send("club successfully deleted!");
          // res.json(tasks); // Send results as JSON
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_club: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const club = await Club.findByPk(id);
          res.json(club);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_athletes: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const club = await Club.findByPk(id);
          const athletes = await club.getAthletes();
          res.json(athletes);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    update_club: express_async_handler(async (req, res) => {
        try {
            const club = await Club.findByPk(req.params.id);
            if (club != null) {
                club.set(req.body);
                await club.save();
                res.json(club); // Works as patch
            } else {
                throw new Errors();
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    
}

module.exports=ClubController;