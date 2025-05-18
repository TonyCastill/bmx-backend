const express_async_handler =  require("express-async-handler");
// const sequelize = require('../config/database');
const { Bicycle}  = require("../models");

const BicycleController = {
    create_bicycle: express_async_handler(async (req, res) => {
      try {

        const { inches } = req.body;
        if (!inches) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newBicycle = await Bicycle.create({inches}); 
        // await sequelize.query(sql`CALL Registerbicycle('${CURP}','${name}','${birthday}','${gender}','${experience}','${city}');`);
        res.json(newBicycle);
        // res.status(200).send("bicycle successfully created!");
        // res.json(tasks); // Send results as JSON
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    list_bicycles:express_async_handler(async (req, res) => {
        try {
          const bicycles = await Bicycle.findAll();
          console.log(bicycles);
          if(bicycles == null){
            res.status(500).send("No bicycles found");
          }
          res.json(bicycles);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    delete_bicycle: express_async_handler(async (req, res) => {
        try {

          const { id } = req.params;
          await Bicycle.destroy({
            where: {
              id_bicycle:id,
            },
          });
          res.status(204).send("bicycle successfully deleted!");
          // res.json(tasks); // Send results as JSON
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_bicycle: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const bicycle = await Bicycle.findByPk(id);
          res.json(bicycle);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    update_bicycle: express_async_handler(async (req, res) => {
        try {
            const bicycle = await Bicycle.findByPk(req.params.id);
            if (bicycle != null) {
                bicycle.set(req.body);
                await bicycle.save();
                res.json(bicycle); // Works as patch
            } else {
                throw new Errors();
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    
}

module.exports=BicycleController;