const express_async_handler =  require("express-async-handler");
// const sequelize = require('../config/database');
const { Category, Bicycle, Experience}  = require("../models");

const CategoryController = {
    create_category: express_async_handler(async (req, res) => {
      try {

        const { name, min_age, max_age, bicycle_id, experience_id } = req.body;
        if (!name || min_age==null || max_age==null || bicycle_id==null || experience_id==null) {
          return res.status(400).json({ error: "All fields are required" });
        }
        const newCategory = await Category.create({name, min_age, max_age, bicycle_id, experience_id});
        res.json(newCategory);
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }),
    list_categories:express_async_handler(async (req, res) => {
        try {
          console.log("hoola")
          const categories = await Category.findAll({include:[{model: Bicycle}, {model:Experience}]});
          console.log(categories);
          if(categories == null){
            res.status(500).send("No categorys found");
          }
          res.json(categories);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    delete_category: express_async_handler(async (req, res) => {
        try {

          const { id } = req.params;
          await Category.destroy({
            where: {
              id_category:id,
            },
          });
          res.status(204).send("category successfully deleted!");
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    get_category: express_async_handler(async (req, res) => {
        try {
          const { id } = req.params;
          const category = await Category.findByPk(id,{include:[{model: Bicycle}, {model:Experience}]});
          res.json(category);
        } catch (error) {
          res.status(500).json({ message: error });
        }
    }),
    update_category: express_async_handler(async (req, res) => {
        try {
            const category = await Category.findByPk(req.params.id);
            if (category != null) {
                category.set(req.body);
                await category.save();
                res.json(category); // Works as patch
            } else {
                throw new Errors();
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    
}

module.exports=CategoryController;