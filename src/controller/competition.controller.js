const express_async_handler = require("express-async-handler");
// const sequelize = require('../config/database');
const {
  Competition,
  Participation,
  Category,
  Bicycle,
  Group,
  Round,
  Experience,
  CompetitionCategoryStage,
} = require("../models");
const athlete = require("../models/athlete");

const round_distribution = {
  1: [4, 7, 2, 6, 1, 8, 5, 3],
  2: [1, 2, 7, 3, 4, 5, 8, 6],
  3: [7, 5, 4, 8, 6, 3, 2, 1],
};

const CompetitionController = {
  create_competition: express_async_handler(async (req, res) => {
    try {
      const { name, date, city_id } = req.body;

      if (!name || !date || city_id == null) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const newCompetition = await Competition.create({ name, date, city_id });
      // await sequelize.query(sql`CALL Registercompetition('${CURP}','${name}','${birthday}','${gender}','${experience}','${city}');`);
      res.json(newCompetition);
      // res.status(200).send("competition successfully created!");
      // res.json(tasks); // Send results as JSON
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  list_competitions: express_async_handler(async (req, res) => {
    try {
      const competitions = await Competition.findAll();
      if (competitions == null) {
        res.status(500).send("No competitions found");
      }
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  delete_competition: express_async_handler(async (req, res) => {
    try {
      const { id } = req.params;
      await Competition.destroy({
        where: {
          id_competition: id,
        },
      });
      res.status(204).send("competition successfully deleted!");
      // res.json(tasks); // Send results as JSON
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  get_competition: express_async_handler(async (req, res) => {
    try {
      const { id } = req.params;
      const competition = await Competition.findByPk(id);
      res.json(competition);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  get_athletes: express_async_handler(async (req, res) => {
    try {
      const { id } = req.params;
      const competition = await Competition.findByPk(id);
      const athletes = await competition.getAthletes();
      res.json(athletes);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  update_competition: express_async_handler(async (req, res) => {
    try {
      const competition = await Competition.findByPk(req.params.id);
      if (competition != null) {
        competition.set(req.body);
        await competition.save();
        res.json(competition); // Works as patch
      } else {
        throw new Errors();
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  shuffle_groups_category: express_async_handler(async (req, res) => {
    try {
      // Just the function executed when there's an HTTP request
      const { id_competition, id_category } = req.params;
      console.log(id_competition, " ", id_category);
      const result =
        await CompetitionController.initialize_or_reorganize_groups(
          id_competition,
          id_category
        );
      res.json({ message: result });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  // shuffle_groups_category: express_async_handler(async (req, res) => {
  //   try{

  //   } catch (error) {
  //     res.status(500).json({ message: error });
  //   }
  // }),
  initialize_or_reorganize_groups: async (id_competition, id_category) => {
    if (id_competition == null || id_competition == undefined) {
      throw new Error("id_competition is not defined");
    }
    if (id_category == null || id_category == undefined) {
      throw new Error("id_category is not defined");
    }

    if (!CompetitionController.check_competition_started) {
      // Process
      const groupDistribution = new Map();
      const { count: contestants_count, rows: athletes_info } =
        await Participation.findAndCountAll({
          where: {
            competition_id: id_competition,
            category_id: id_category,
          },
        });
      // Destroy any groups and rounds
      // already there
      // CHECK IF IT'S ONLY ROUND 1, IF IT DOES,
      // DELETE THEM, ELSE, DO NOT EXECUTE THIS
      const previousGroups = await Group.findAll({
        where: {
          competition_id: id_competition,
          category_id: id_category,
        },
        // Match those that do not have other rounds registered rather
        // than round 1. Else, it would delete registered rounds from
        // other rounds
        // Locked field indicates if this group
        // is open to modifications
        // include:[{model:Round}]
      });
      console.log(previousGroups);
      if (previousGroups.length > 0 && !previousGroups.locked) {
        console.log("entra");
        await Group.destroy({
          where: {
            competition_id: id_competition,
            category_id: id_category,
          },
        });
      }
      console.log("participations registered so far: ", contestants_count);
      if (contestants_count > 0) {
        if (contestants_count >= 3) {
          // 1 - Check if the number of participations
          // satisfies the minimun number of competitors required
          // to arrange the race
          // Define a number of groups and contestants for each group

          if (contestants_count <= 8) {
            console.log(`Group 1: ${contestants_count}`);
            groupDistribution.set("G1", contestants_count);
            // group_count = 1;
          } else if (contestants_count % 8 === 0) {
            const contestantsR = Math.floor(contestants_count / 8);
            group_count = contestantsR;
            for (let i = 1; i <= contestantsR; i++) {
              // console.log(`Group ${i}: 8`);
              groupDistribution.set(`G${i}`, 8);
            }
          } else if (contestants_count % 8 >= 4) {
            const fullGroups = Math.floor(contestants_count / 8);
            for (let i = 1; i <= fullGroups; i++) {
              // console.log(`Group ${i}: 8`);
              groupDistribution.set(`G${i}`, 8);
            }
            groupDistribution.set(`G${fullGroups + 1}`, contestants_count % 8);
            // console.log(`Group ${fullGroups + 1}: ${contestants % 8}`);
            // group_count = fullGroups + 1;
          } else if (contestants_count <= 16) {
            if (contestants_count % 2 === 0) {
              const perGroup = contestants_count / 2;
              for (let i = 1; i <= 2; i++) {
                groupDistribution.set(`G${i}`, perGroup);
                // console.log(`Group ${i}: ${perGroup}`);
              }
              // group_count = 2;
            } else {
              const group1 =
                contestants_count - Math.floor(contestants_count / 2);
              const group2 = contestants_count - group1;
              groupDistribution.set(`G1`, group1);
              groupDistribution.set(`G2`, group2);
              // console.log(`Group 1: ${group1}`);
              // console.log(`Group 2: ${group2}`);
              // group_count = 2;
            }
          } else {
            const groups_with_8 = Math.floor(contestants_count / 8) - 1;
            let i;
            for (i = 1; i <= groups_with_8; i++) {
              groupDistribution.set(`G${i}`, 8);
              // console.log(`Group ${i}: 8`);
            }

            const contestantsRestantes = contestants_count - groups_with_8 * 8;
            const extra_group1 =
              contestantsRestantes - Math.floor(contestantsRestantes / 2);
            const extra_group2 = contestantsRestantes - extra_group1;
            groupDistribution.set(`G${i}`, extra_group1);
            groupDistribution.set(`G${i + 1}`, extra_group2);
            // console.log(`Group ${i}: ${extra_group1}`);
            // console.log(`Group ${i + 1}: ${extra_group2}`);
            // group_count = i + 1;
          }



          //CREATE GROUPS AND ROUNDS
          groupDistribution.forEach(async function (group, athletes) {
            // group ->  group id
            // athletes -> number of contestants
            // Since we are getting the number
            // of contestants by using the grup
            // as the index, we iterate group
            // variable

            // For each iteration, create a group
            const group_created = await Group.create({
              competition_id: id_competition,
              category_id: id_category,

            });
            for (let i = 0; i < group; i++) {
              // For each participant, crate it's relation to round
              for (let round = 1; round <= 3; round++) {
                // Each stage has 3 rounds
                console.log(`iteración ${i}`);
                let athlete_id = athletes_info[i].athlete_id;
                let group_id = group_created.id_group;
                // let round = 1; // Create loop for 3 times, three rounds in a single group at least
                let arriving_place = null;
                let starting_position = round_distribution[round][i];
                await Round.create({
                  starting_position,
                  arriving_place,
                  round,
                  group_id,
                  athlete_id,
                  score: 0,
                });
              }
            }
          });
        } else {
          console.log("Map: ", groupDistribution);
          const category = await Category.findByPk(id_category, {
            include: [{ model: Bicycle }],
          });
          return `Competitors: ${contestants_count}. Not enough competitors on category: ${category.name} Bicycle: ${category.bicycle.inches}'' `;
        }
      } else {
        return "No competitors registered!";
      }
    } else {
      return "Competition already started, no changes are available!";
    }
  },
  start_competition_category: express_async_handler(async (req, res) => {
    // WARNING
    // Once the competition has started,
    // no athletes shall access the competition
    
    try {
      // Just set locked = true in all group belonging to the competition
      // and category
      const { id_competition, id_category } = req.params;
      const { count: contestants_count, rows: _ } =
          await Participation.findAndCountAll({
            where: {
              competition_id: id_competition,
              category_id: id_category,
            },
          });
      const stage = (contestants_count <=7)?"final":(contestants_count ==8)?"semi-final":"round_0"
      await Group.update(
        { locked: true, stage:stage },
        {
          where: {
            competition_id: id_competition,
            category_id: id_category,
          },
        }
      );
      // Create Stage status to track the competition
      await CompetitionCategoryStage.create({
        id_competition: id_competition,
        id_category: id_category,
        current_stage: stage,
      });
      const result = await Group.findOne({
        where: {
          competition_id: id_competition,
          category_id: id_category,
        },
        include: [
          { model: Competition },
          {
            model: Category,
            include: [{ model: Bicycle }, { model: Experience }],
          },
        ],
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  check_competition_started: async (id_competition, id_category) => {
    const check = await Group.findOne({
      where: {
        id_competition: id_competition,
        id_category: id_category,
      },
    });
    return check.locked;
  },
  continue_or_finalize: express_async_handler(async (req, res) => {
    try {
      // Just the function executed when there's an HTTP request
      const { id_competition, id_category } = req.params;
      // console.log(id_competition," ",id_category);
      
      // Step 1: Get current stage from competition_category_stage table
      const stageEntry = await CompetitionCategoryStage.findOne({
        where: { id_competition: id_competition, id_category: id_category },
      });

      if (!stageEntry) {
        res.status(404).send("Competition hasn't started yet!");
        // throw new Error("Stage entry not found for competition and category");
      }
      if (stageEntry.currentStage == "final") {
        CompetitionController.finalize_competition(id_competition, id_category);
        res.status(200).send("Competition is over");
      } else if (stageEntry.currentStage == "semi-final") {
        // Step 2: Get groups for the current stage
        const groups = await Group.findOne({
          where: {
            id_competition: id_competition,
            id_category: id_category,
            stage: stageEntry.currentStage,
          },
          attributes: ["id_group"],
        });

        let advancingAthletes = [];

        for (const group of groups) {
          // Step 3: Get top 4 athletes based on average score for each group
          const topAthletes = await Round.findAll({
            where: { group_id: group.id_group },
            attributes: [
              "athlete_id",
              [sequelize.fn("SUM", sequelize.col("score")), "total_score"],
            ],
            group: ["athlete_id"],
            order: [[sequelize.fn("SUM", sequelize.col("score")), "DESC"]],
            limit: 4,
            raw: true,
          });

          advancingAthletes.push(...topAthletes.map((a) => a.athlete_id));
        }

        // Step 4: Shuffle and chunk athletes into new groups of 8
        advancingAthletes =
          CompetitionController.shuffleArray(advancingAthletes);

        // Step 5: Create new group and assign athletes

        const newGroup = await Group.create({
          id_competition: id_competition,
          id_category: id_category,
          stage: "final",
          locked: true,
        });
        for (const athleteId of advancingAthletes) {
          for (let round = 1; round <= 3; round++) {
            await Round.create({
              group_id: newGroup.id_group,
              athlete_id: athleteId,
              round: round,
              score: 0,
            });
          }
        }

        // Step 6: Update current stage in competition_category_stage
        await CompetitionCategoryStage.update(
          { current_stage: "final"},
          { where: { id_competition: id_competition, id_category: id_category } }
        );
        res.send("Next stage: final");
      } else {
        const currentStage = stageEntry.current_stage || "round_0";
        const currentStageNumber =
          parseInt(currentStage.replace("round_", "")) || 0;
        const nextStage = `round_${currentStageNumber + 1}`;

        // Step 2: Get all groups for the current stage
        const groups = await Group.findAll({
          where: {
            id_competition: id_competition,
            id_category: id_category,
            stage: currentStage,
          },
          attributes: ["id_group"],
        });

        let advancingAthletes = [];

        for (const group of groups) {
          // Step 3: Get top 4 athletes based on average score for each group
          const topAthletes = await Round.findAll({
            where: { group_id: group.id_group },
            attributes: [
              "athlete_id",
              [sequelize.fn("SUM", sequelize.col("score")), "total_score"],
            ],
            group: ["athlete_id"],
            order: [[sequelize.fn("SUM", sequelize.col("score")), "DESC"]],
            limit: 4,
            raw: true,
          });

          advancingAthletes.push(...topAthletes.map((a) => a.athlete_id));
        }

        // Step 4: Shuffle and chunk athletes into new groups of 8
        advancingAthletes =
          CompetitionController.shuffleArray(advancingAthletes);

        const chunkSize = 8;
        const newGroups = [];
        for (let i = 0; i < advancingAthletes.length; i += chunkSize) {
          newGroups.push(advancingAthletes.slice(i, i + chunkSize));
        }
        /**
         * Aquí, el problema es que ese pequeño minigrupo
         * de 4 atletas va a competir entre ellos de nuevo
         * las veces que se queden sin pareja, es decir,
         * las veces que habrá un numero impar de grupos en este
         * stage
         */

        // Step 5: Create new groups and assign athletes
        for (const group of newGroups) {
          const newGroup = await Group.create({
            id_competition: id_competition,
            id_category: id_category,
            stage: newGroups.length === 1 ? "semi-final" : nextStage,
            locked: true,
          });
          // FALTA ESTO: CREAR LOS 3 SETS DE ROUNDS
          for (const athleteId of group) {
            for (let round = 1; round <= 3; round++) {
              await Round.create({
                group_id: newGroup.id_group,
                athlete_id: athleteId,
                round: round,
                score: 0,
              });
            }
          }
        }

        // Step 6: Update current stage in competition_category_stage
        await CompetitionCategoryStage.update(
          { current_stage: newGroups.length === 1 ? "semi-final" : nextStage },
          { where: { id_competition: id_competition, id_category: id_category } }
        );

        res.send("Next stage: "+nextStage);
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  shuffleArray: (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() })) // Step 1
      .sort((a, b) => a.sort - b.sort) // Step 2
      .map(({ value }) => value); // Step 3
  },
  finalize_competition: async (id_competition, id_category) => {
    // Step 1: Get all group IDs for this category and competition
    const groups = await Group.findAll({
      where: {
        id_category: id_category,
        id_competition: id_competition,
      },
      attributes: ["id_group"],
      raw: true,
    });

    const groupIds = groups.map((g) => g.id_group);

    if (groupIds.length === 0) {
      throw new Error("No groups found for this category and competition.");
    }

    // Step 2: Get athlete total scores across all those groups
    const results = await Round.findAll({
      where: {
        group_id: groupIds,
      },
      attributes: [
        "athlete_id",
        [sequelize.fn("SUM", sequelize.col("score")), "total_score"],
      ],
      group: ["athlete_id"],
      order: [[sequelize.literal("total_score"), "DESC"]],
      raw: true,
    });

    // Step 3: Assign ranking based on total score
    for (let i = 0; i < results.length; i++) {
      const athleteId = results[i].athlete_id;
      const place = i + 1;

      await Participation.update(
        { ranking: place },
        {
          where: {
            athlete_id: athleteId,
            competition_id: id_competition,
            category_id: id_category,
          },
        }
      );
    }
    console.log("Global competition ranking finalized.");
  },
};

module.exports = CompetitionController;
