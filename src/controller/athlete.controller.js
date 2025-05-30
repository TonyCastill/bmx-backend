const express_async_handler =  require("express-async-handler");
const sequelize = require('../config/database');
const { Athlete, Club, City, Category, Experience, Bicycle, Participation, Stage, Competition }  = require("../models");
// const StageController = require("./stage.controller");
const { Op } = require('sequelize');

const AthleteController = {
    create_athlete: express_async_handler(async (req, res) => {
      try {
        console.log(req.body);
        const { CURP:CURP, birthday:birthday,city:city,gender:gender,name:name } = req.body;
    
        if (!CURP || !name || !birthday || !gender || !city) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const checkCURP = await Athlete.findOne({where:{CURP:CURP}});
        if(checkCURP){
          return res.status(409).json({ message: "CURP already registered" });
        }
        // await sequelize.query(sql`CALL RegisterAthlete('${CURP}','${name}','${birthday}','${gender}','${experience}','${city}');`);
        await sequelize.query(
            "CALL RegisterAthlete(:curp, :name, :birthday, :gender, :city)",
            {
              replacements: {
                curp: CURP,
                name,
                birthday,
                gender,
                // experience,
                city
              }
            }
          );

           // Emit update to connected clients
          const io = req.app.get("io");
          // CURP:CURP, birthday:birthday,city:city,experience:experience, gender:gender,name:name
          io.emit("athleteRegistered", { CURP, name, birthday });
          
          return res.status(201).json({ message: "Athlete added successfully" });
        // res.json(tasks); // Send results as JSON
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    }),
    create_athlete_and_participation:express_async_handler(async (req, res) => {
      try {
        // console.log(req.body);
        const {
          CURP:CURP, birthday:birthday,
          city:city,
          experience:experience, // ID of type of category (Junior, ELite, Athlete)
          gender:gender,name:name,
          bicycleInches: bicycleInches,
          // date:date
        } = req.body;
        const {stage_id} = req.params;

        if (!CURP || !name || !birthday || !gender || bicycleInches== null || !city) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const checkCURP = await Athlete.findOne({where:{CURP:CURP}});
        console.log("hola desde ejecucion",checkCURP);
        let athlete = null;
        if(checkCURP != null){
          console.log("entra")
          //
          athlete = checkCURP;
          // return res.status(409).json({ message: "CURP already registered" });
        }else{
          
           await sequelize.query(
            "CALL RegisterAthlete(:curp, :name, :birthday, :gender, :city)",
            {
              replacements: {
                curp: CURP,
                name,
                birthday,
                gender,
                city
              }
            }
          );
          
          athlete = await Athlete.findOne({where:{CURP:CURP}});
        }
        console.log("hola d2222")
        // console.log(checkCURP);
        // await sequelize.query(sql`CALL RegisterAthlete('${CURP}','${name}','${birthday}','${gender}','${experience}','${city}');`);

        // console.log(athlete);
        
          if(athlete != null){
            const years_competing = 0;
            if(athlete.years_compiting!=undefined){years_competing=athlete.years_competing}
            const category = await Category.findOne({
              include: [
                { model: Bicycle, where: { inches: bicycleInches } },
                { model: Experience, where: { id_experience: experience } }
                ],
                where: {
                min_age: { [Op.lte]: athlete.current_age },
                max_age: { [Op.gte]: athlete.current_age },
                gender: athlete.gender
              },
            });
            if (!category)  {res.status(404).send("No category found");}

            const stage = await Stage.findOne({
              include: [
                // { model: Competition, where: { id_competition: stage_id } },
                { model: Category, where: { idcategory: category.idcategory  } }
              ],
              where: {
                id_stage: stage_id
              },
            });
            if(!stage){
              res.status(404).send("No category found");
            }else if(stage.locked){
              res.status(400).json({message:"No more registrations are allowed"});
            }

            const newParticipation = await Participation.create(
              {
                id_athlete:athlete.id_athlete,
                ranking:0,
                score:0,
                stage_id:stage.id_stage,
                status:'registered'
              }
            );
            // StageController.stage_pre_distribution(stage.id_stage);
            res.status(200).json(newParticipation);
          }else{
            return res.status(404).json({ message: "Athlete not found" });
          }
        // res.json(tasks); // Send results as JSON
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    }),
    list_athletes:express_async_handler(async (req, res) => {
        try {

          const athletes = await Athlete.findAll({include:[{model: City}, {model:Club}]});
        //   console.log(athletes[0].name);
          if(athletes == null){
            res.status(500).send("No Athletes found");
          }
          res.json(athletes);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    delete_athlete: express_async_handler(async (req, res) => {
        try {

          const { id } = req.params;
          await Athlete.destroy({
            where: {
              id_athlete:id,
            },
          });
          res.status(204).send("Athlete successfully deleted!");
          // res.json(tasks); // Send results as JSON
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_athlete: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const athlete = await Athlete.findByPk(id);
          if(!athlete){
            res.status(404).json({message:"Athlete not found"});
          }
          res.json(athlete);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    update_athlete: express_async_handler(async (req, res) => {
        try {
            const athlete = await Athlete.findByPk(req.params.id);
            if (athlete != null) {
                athlete.set(req.body);
                await athlete.save();
                res.json(athlete); // Works as patch
            } else {
                throw new Errors();
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    set_club_to_athlete: express_async_handler(async (req, res) => {
        try {
            const {athlete_id, club_id} = req.params;
            const athlete = await Athlete.findByPk(athlete_id);
            if (athlete != null) {
                const club = await Club.findByPk(club_id);
                if(club != null){
                    await Athlete.update(
                        {club_id:club.id_club},
                        {
                            where:{
                                id_athlete: athlete_id
                            }
                        }
                    );
                    res.status(200).send("User added to a new club")
                }else{
                    res.status(404).send("Club Not Found");    
                }
            } else {
                res.status(404).send("Athlete Not Found");
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    get_club: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const athlete = await Athlete.findByPk(id);
          const club = await athlete.getClub();
          res.json(club);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_city: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const athlete = await Athlete.findByPk(id);
          const city = await athlete.getCity();
          res.json(city);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    })
}

module.exports=AthleteController;
// // Add a new user
// app.post("/users", (req, res) => {
//     console.log(req.body);
//     const { CURP, birthday,city,experience, gender,name } = req.body;
//   //   console.log(req.body)
//     // experience debe ser validado
//     // como null, ya que si solo se
//     // evalua como !experience, simplemente
//     // dará error porque su valor por defecto
//     // es 0, y 0 es igual a !experience
//     if (!CURP || !name || !birthday || !gender || experience==null || !city) {
//       console.log("falla");
//       return res.status(400).json({ error: "All fields are required" });
//     }
  
//     // const sql = "INSERT INTO user (CURP, name, birthday, gender) VALUES (?, ?, ?, ?)";
//     //RegisterUser(CURP,name,birthday,gender,years_compiting,city)
//     const sql = "CALL RegisterUser(?,?,?,?,?,?)";
//     db.query(sql, [CURP, name, birthday, gender,experience,city], (err) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.status(201).json({ message: "User added successfully" });
//     });
//   });