const express_async_handler =  require("express-async-handler");
// const sequelize = require('../config/database');
const { Penalty}  = require("../models");
const { list } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/list.js");


const PenaltyController = {
    create_penalty: express_async_handler(async (req, res) => {
        try{
            const { flag, penalty }= req.body;
            if(flag == null || penalty == null || isNaN(penalty)){
                res.status(400).send({message:"Flag and penalty needed!"});
            }
            const newPenalty = await Penalty.create({
                flag: flag,
                penalty: penalty
            });
            res.status(201).json(newPenalty);

        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    list_penalties: express_async_handler(async (req, res) => {
        try{
            const penalties = await Penalty.findAll();
            res.status(200).json(penalties);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    update_penalty: express_async_handler(async (req, res) => {
        try{
            const { id_penalty } = req.params;
            const { flag, penalty }= req.body;
            if(flag == null || penalty == null || isNaN(penalty)){
                res.status(400).send({message:"Flag and penalty needed!"});
            }
            const updatedPenalty = await Penalty.update(
                {
                    flag: flag,
                    penalty: penalty
                },
                {
                    where: { id_penalty: id_penalty }
                }
            );
            if(updatedPenalty[0] === 0) {
                return res.status(404).send({ message: "Penalty not found" });
            }
            res.status(200).json({ message: "Penalty updated successfully" });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
}

module.exports=PenaltyController;