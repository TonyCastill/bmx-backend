const express_async_handler =  require("express-async-handler");
// const sequelize = require('../config/database');
const { City}  = require("../models");

const CityController = {
    create_city: express_async_handler(async (req, res) => {
      try {

        const { city } = req.body;
    
        if (!city) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newcity = await City.create({city}); 
        // await sequelize.query(sql`CALL Registercity('${CURP}','${name}','${birthday}','${gender}','${experience}','${city}');`);
        res.json(newcity);
        // res.status(200).send("city successfully created!");
        // res.json(tasks); // Send results as JSON
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    list_cities:express_async_handler(async (req, res) => {
        try {
          const citys = await City.findAll();
          console.log(citys);
          if(citys == null){
            res.status(500).send("No citys found");
          }
          res.json(citys);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    delete_city: express_async_handler(async (req, res) => {
        try {

          const { id } = req.params;
          await City.destroy({
            where: {
              id_city:id,
            },
          });
          res.status(204).send("city successfully deleted!");
          // res.json(tasks); // Send results as JSON
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_city: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const city = await City.findByPk(id);
          res.json(city);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_athletes: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const city = await City.findByPk(id);
          const athletes = await city.getAthletes();
          res.json(athletes);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    update_city: express_async_handler(async (req, res) => {
        try {
            const city = await City.findByPk(req.params.id);
            if (city != null) {
                city.set(req.body);
                await city.save();
                res.json(city); // Works as patch
            } else {
                throw new Errors();
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    
}

module.exports=CityController;