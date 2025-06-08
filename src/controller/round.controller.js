const express_async_handler =  require("express-async-handler");
// const sequelize = require('../config/database');
const { Round, Penalty}  = require("../models");


/**
 * Punatajes fijos de acuerdo al
 * lugar en el que quedaron
 */
// const scores = {
//     1:20,
//     2:18,
//     3:16,
//     4:14,
//     5:12,
//     6:10,
//     7:8,
//     8:6
// }

const RoundController = {
    register_arriving_place: express_async_handler(async (req, res) => {
        try{
            const {round,hit_id,athlete_id} = req.params;
            const { arriving_place }= req.body;
            if(arriving_place == null || isNaN(arriving_place)){
                res.status(400).send({message:"Arriving place needed!"})
            }else{

                await Round.update(
                    {
                        arriving_place:arriving_place,
                        score: arriving_place
                    },
                    {
                        where:{
                            round:round,
                            hit_id:hit_id,
                            athlete_id:athlete_id
                        }
                    }
                )
                res.status(200).send("Status successfully updated");
            }

        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    penalty: express_async_handler(async (req, res) => {
        try{
            const {round,hit_id,athlete_id,id_penalty} = req.params;
            // const { id_penalty }= req.body;
            if(id_penalty == null || isNaN(id_penalty)){
                res.status(400).send({message:"Penalty needed!"})
            }else{
                // Check if penalty exists
                const penalty = await Penalty.findByPk(id_penalty);
                if(!penalty){
                    return res.status(404).send({message:"Penalty not found!"});
                }

                await Round.update(
                    {
                        id_penalty:id_penalty,
                        arriving_place:penalty.penalty,
                        score: penalty.penalty
                    },
                    {
                        where:{
                            round:round,
                            hit_id:hit_id,
                            athlete_id:athlete_id
                        }
                    }
                )
                res.status(200).send("Status successfully updated");
            }

        } catch (error) {
            res.status(500).json({ message: error });
        }
    })
}

module.exports=RoundController;