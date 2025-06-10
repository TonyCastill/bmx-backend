const express_async_handler = require("express-async-handler");
const { Op, fn, col } = require("sequelize");
// const sequelize = require('../config/database');
const {
  Athlete,
  Stage,
  Competition,
  Category,
  Hit,
  Round,
  Bicycle,
  Participation,
} = require("../models");
const { get } = require("http");
const { penalty } = require("./round.controller");
// const stage = require("../models/stage");
// const bicycle = require("../models/bicycle");
// const { where } = require("sequelize");
const round_distribution = {
  1: [4, 7, 2, 6, 1, 8, 5, 3],
  2: [1, 2, 7, 3, 4, 5, 8, 6],
  3: [7, 5, 4, 8, 6, 3, 2, 1],
};

const scores_final = {
  1: 20,
  2: 18,
  3: 16,
  4: 14,
  5: 12,
  6: 10,
  7: 8,
  8: 6,
};

function getFinalScore(place) {
  return scores_final[place] !== undefined ? scores_final[place] : 3;
}

const StageController = {
  create_stage: express_async_handler(async (req, res) => {
    try {
      console.log("hola desde creador");
      const { competition_id, category_id } = req.params;
      const { date } = req.body;
      if (
        date == null ||
        // stage == null ||
        competition_id == null ||
        category_id == null
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const newStage = await Stage.create({
        date: date,
        set: 1,
        competition_id: competition_id,
        category_id: category_id,
      });
      console.log(newStage);
      res.json(newStage);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  get_stage: express_async_handler(async (req, res) => {
    try {
      const { stage_id } = req.params;
      if (stage_id == null) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const stage = await Stage.findByPk(stage_id, {
        include: [
          { model: Competition },
          { model: Category },
          {
            model: Participation,
            // as: "activeParticipations",
            include: [{ model: Athlete }],
            where: { ranking: { [Op.eq]: 0 } },
          },
          // {
          //   model: Participation,
          //   // as: "finishedParticipations",
          //   include: [{ model: Athlete }],
          //   where: { ranking: { [Op.ne]: 0 } },
          // },
          {
            model: Hit,
            include: [
              {
                model: Round,
                // include: [{ model: Athlete }]
              },
            ],
          },
        ],
      });
      if (stage == null) {
        return res.status(404).json({ message: "Stage not found" });
      }
      res.json(stage);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  list_stages: express_async_handler(async (req, res) => {
    try {
      const { competition_id, category_id } = req.params;
      const stages = await Stage.findAll({
        include: [
          { model: Competition, where: { id_competition: competition_id } },
          { model: Category, where: { idcategory: category_id } },
          { model: Hit, include: [{ model: Round }] },
        ],
      });
      console.log(stages);
      if (stages == null) {
        res.status(500).send("No stages found");
      }
      res.json(stages);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  delete_stage: express_async_handler(async (req, res) => {
    try {
      const { stage_id } = req.params;
      if (stage_id == null) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const stage = await Stage.destroy({
        where: {
          stage_id: stage_id,
        },
      });

      res.status(200).json(stage);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  update_stage: express_async_handler(async (req, res) => {
    try {
      const stage = await Stage.findByPk(req.params.stage_id);
      if (stage != null) {
        stage.set(req.body);
        await stage.save();
        res.json(stage); // Works as patch
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
      const { id_stage } = req.params;
      if (id_stage == null || id_stage == undefined) {
        res.json({ message: "no id_stage defined" });
      }
      // console.log(id_competition, " ", id_category);
      const result = await StageController.get_hit_distribution(id_stage);
      res.json({ message: result });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  stage_pre_distribution: async (id_stage) => {
    if (!StageController.check_competition_started(id_stage)) {
      StageController.get_hit_distribution(id_stage);
    } else {
      return "Competition already started, no changes are available!";
    }
  },
  // Receive Athletes sorted
  get_hit_distribution: async (athletes, id_stage) => {
    if (id_stage == null || id_stage == undefined) {
      throw new Error("id_stage is not defined");
    }
    console.log("received athletes: ", athletes);

    const athletes_count = athletes.length;
    let num_rounds = 1;

    const stage = await Stage.findByPk(id_stage);
    console.log("stage set is ", stage.set);
    if (stage.set_global == 1) {
      // First set has 3 rounds
      num_rounds = 3;
      // locked = true;
    }

    // ######################################################################################3
    // Those two have to be in get_hit_distribution
    if (athletes_count <= 8) {
      // There's going to be only one set of rounds
      // So this set is the final set

      await Stage.update(
        { is_last_set: true }, // Last set
        {
          where: {
            id_stage: id_stage,
          },
        }
      );
    }
    // Set the stage tracking ( The ones that actually made it to the next set)
    await Stage.update(
      { stage_tracking: athletes_count },
      {
        where: {
          id_stage: id_stage,
        },
      }
    );

    // ######################################################################################
    // Process
    // const groupDistribution = new Map();
    // const { count: contestants_count, rows: athletes } =
    //   await Participation.findAndCountAll({
    //     where: {
    //       stage_id: id_stage,
    //       ranking: 0,
    //     },
    //   });
    // Destroy any groups and rounds
    // already there
    // CHECK IF IT'S ONLY ROUND 1, IF IT DOES,
    // DELETE THEM, ELSE, DO NOT EXECUTE THIS
    // const locked = false;
    // const previousHits = await Hit.findAll({
    //   where: {
    //     stage_id: id_stage,
    //   },
    //   // Match those that do not have other rounds registered rather
    //   // than round 1. Else, it would delete registered rounds from
    //   // other rounds
    //   // Locked field indicates if this group
    //   // is open to modifications
    //   // include:[{model:Round}]
    // });
    // console.log(previousHits);
    // if (previousHits.length > 0 && !previousHits.locked) {
    //   console.log("entra");
    //   previousHits.forEach(async (hit) => {
    //     // Delete group
    //     await Hit.destroy({
    //       where: {
    //         id_hit: hit.id_hit,
    //       },
    //     });
    //   });
    // } else {
    //   const stage = await Stage.findByPk(stage_id);
    //   if (stage.set != 1) {
    //     num_rounds = 1;
    //     // locked = true;
    //   }
    // }
    // console.log("participations registered so far: ", athletes_count);

    if (athletes_count > 0) {
      if (athletes_count >= 4) {
        const minGroupSize = 4;
        const maxGroupSize = 8;

        // Try smallest number of groups first
        for (
          let numGroups = 1;
          numGroups <= Math.floor(athletes.length / minGroupSize);
          numGroups++
        ) {
          const baseSize = Math.floor(athletes.length / numGroups);
          const remainder = athletes.length % numGroups;

          // Construct group sizes list
          const groupSizes = Array(numGroups).fill(baseSize);
          for (let i = numGroups - remainder; i < numGroups; i++) {
            groupSizes[i] += 1;
          }

          const validSizes = groupSizes.every(
            (size) => size >= minGroupSize && size <= maxGroupSize
          );
          const balanced =
            Math.max(...groupSizes) - Math.min(...groupSizes) <= 1;

          if (validSizes && balanced) {
            // Distribute players
            console.log("num_rounds is ", num_rounds);
            const groups = StageController.distributeSnake(
              athletes,
              numGroups,
              id_stage,
              num_rounds
            );

            return groups; // Return or break after successful grouping
          }
        }
      } else {
        // console.log("Map: ", groupDistribution);
        const stage = await Stage.findByPk(id_stage, {
          include: [{ model: Category, include: [{ model: Bicycle }] }],
        });
        return `Competitors: ${athletes_count}. Not enough competitors on category: ${stage.category.name} Bicycle: ${stage.category.bicycle.inches}'' `;
      }
    } else {
      return "No competitors registered!";
    }
  },
  // num_rounds: number of rounds to create
  distributeSnake: async (players, numGroups, stage_id, num_rounds) => {
    const groups = Array.from({ length: numGroups }, () => []);
    let index = 0;
    let direction = 1;

    // Distribute players in snake pattern
    while (index < players.length) {
      const range =
        direction === 1
          ? [...Array(numGroups).keys()]
          : [...Array(numGroups).keys()].reverse();

      for (const i of range) {
        if (index >= players.length) break;
        groups[i].push(players[index]);
        index++;
      }
      direction *= -1;
    }
    // Create Hit instances and assign players to each Hit
    const hits = [];
    for (let i = 0; i < groups.length; i++) {
      let elimination_rule = groups[i].length > 5 ? 4 : groups[i].length - 1;

      // Create a Hit for this group
      let hit = await Hit.create({
        //Active
        active: true,
        stage_id: stage_id,
        // locked: locked,
        // Elimination rule
        elimination_rule: elimination_rule,
      });

      console.log("before creating rounds");
      groups[i].forEach(async (player, playerIndex) => {
        // Assign player to this Hit
        // await player.update({ hit_id: hit.id_hit });
        for (let roundNum = 1; roundNum <= num_rounds; roundNum++) {
          await Round.create({
            hit_id: hit.id_hit,
            athlete_id: player.id_athlete, // or player.id
            round: roundNum,
            score: 0,
            starting_position: round_distribution[roundNum][playerIndex],
            arriving_place: 0,
            id_penalty: null, // Assuming no penalty initially
          });
        }
      });
      hits.push(hit);
    }

    return hits;
  },
  start_competition_category: express_async_handler(async (req, res) => {
    try {
      const { id_stage } = req.params;
      if (id_stage == null || id_stage == undefined) {
        res.json({ message: "no id_stage defined" });
      }
      // Start creating Hits

      await Stage.update(
        { locked: true }, // No modifications to hits, no more registrations
        {
          where: {
            id_stage: id_stage,
          },
        }
      );
      console.log("holaaa, stage_id:", id_stage, " ranking: ", 0);
      const { count, rows: athletes } = await Participation.findAndCountAll({
        where: {
          stage_id: parseInt(id_stage),
          [Op.or]: [{ ranking: 0 }],
        },
      });
      console.log("llega ", athletes);

      // Just Call get hit distribution
      // The method will do the rest
      StageController.get_hit_distribution(athletes, id_stage);

      console.log("it gets here");
      // const result = await Stage.findOne({
      //   where: {
      //     id_stage: id_stage,
      //   },

      //   include: [
      //     { model: Competition },
      //     {
      //       model: Category,
      //       include: [{ model: Bicycle }, { model: Experience }],
      //     },
      //   ],
      // });
      console.log("it gets to the end");
      res.status(200).json({ message: "Competition has started" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }),
  check_competition_started: async (id_stage) => {
    const check = await Stage.findOne({
      where: {
        id_stage: id_stage,
      },
    });
    return check.locked;
  },
  continue_or_finalize: express_async_handler(async (req, res) => {
    try {
      // This set has finalized
      const { id_stage } = req.params;
      if (id_stage == null || id_stage == undefined) {
        res.json({ message: "no id_stage defined" });
      }
      const stage = await Stage.findByPk(id_stage);
      // console.log("hola desdekkkk",stage);
      //

      if (stage.is_last_set) {
        console.log("es la final");
        console.log("id_stage: ", id_stage);
        // finalize
        StageController.finalize_competition(stage.id_stage, stage.set_global);
        res.status(200).json({ message: "Stage finalized!" });
      } else {
        console.log("no es la final");
        console.log("id_stage: ", id_stage);
        // 1. Get all active hits for the stage
        const hits = await Hit.findAll({
          where: {
            [Op.and]: [{ stage_id: id_stage }, { active: true }],
          },
          // attributes: ["id_hit","elimination_rule"],
        });
        // console.log("hits: ", hits);
        const hitIds = hits.map((hit) => hit.id_hit);
        console.log("hits_ids", hitIds);
        // Get how many additional eliminated people will be eliminated
        const totalEliminationRule = hits.reduce(
          (sum, hit) => sum + (hit.elimination_rule || 0),
          0
        );
        console.log("totalEliminationrule", totalEliminationRule);
        let completion_rule = 0;
        if (!(totalEliminationRule % 8 === 0 || totalEliminationRule < 8)) {
          console.log("aggregar eliminados");
          let current = 8;
          //num_qualified
          while (totalEliminationRule > current) {
            current *= 2;
          }
          // current is now 8, 16, 32, 64, ... just above num_qualified
          // Get the number of players to add to the advancing list
          const toAdvance = Math.floor(
            (current - totalEliminationRule) / hitIds.length
          );
          completion_rule = toAdvance;
        }

        // Assume you have: hits, rounds, stage, and completion_rule defined
        const advancingAll = [];
        const eliminatedAll = [];
        console.log("antes de rounds");
        const rounds = await Round.findAll({
          where: { hit_id: { [Op.in]: hitIds } },
          include: [{ model: Athlete }],
          raw: true,
          nest: true,
        });
        console.log("rounds: ");
        for (const hit of hits) {
          // Get all rounds for this hit
          const hitRounds = rounds.filter((r) => r.hit_id === hit.id_hit);
          // console.log("hit_rounds",hitRounds);
          // Group by athlete and sum arriving_position
          const athleteScores = {};
          hitRounds.forEach((round) => {
            const athleteId = round.athlete_id;
            if (!athleteScores[athleteId]) {
              athleteScores[athleteId] = {
                athlete: round.athlete,
                score: 0,
              };
            }
            athleteScores[athleteId].score += round.arriving_place || 0;
          });
          console.log("scoresss:", athleteScores);
          // Sort athletes in this hit
          let sortedAthletes;
          if (stage.set_global === 1) {
            sortedAthletes = Object.values(athleteScores).sort((a, b) => {
              if (a.score !== b.score) {
                return a.score - b.score;
              }
              const aThirdRound = hitRounds.find(
                (r) => r.athlete_id === a.athlete.id_athlete && r.round === 3
              );
              const bThirdRound = hitRounds.find(
                (r) => r.athlete_id === b.athlete.id_athlete && r.round === 3
              );
              if (aThirdRound && bThirdRound) {
                return (
                  (aThirdRound.arriving_place || Infinity) -
                  (bThirdRound.arriving_place || Infinity)
                );
              }
              if (aThirdRound) return -1;
              if (bThirdRound) return 1;
              return 0;
            });
          } else {
            sortedAthletes = Object.values(athleteScores).sort(
              (a, b) => a.score - b.score
            );
          }

          // Divide into advancing and eliminated
          console.log("antes de advancing count");
          const advancingCount =
            (hit.elimination_rule || 0) + (completion_rule || 0);
          console.log("advancing_count", advancingCount);
          const advancing = sortedAthletes.slice(0, advancingCount);
          const eliminated = sortedAthletes.slice(advancingCount);

          // Instead of just pushing the athlete object, push an object with athlete and index
          advancing.forEach((athlete, idx) => {
            advancingAll.push({
              athlete: athlete.athlete, // or just athlete if that's your structure
              originalIndex: idx,
            });
          });

          // advancingAll.push(...advancing);
          eliminatedAll.push(...eliminated);
        }

        // Now merge and sort all advancing and eliminated athletes globally
        const sortFn = (a, b) => {
          if (a.score !== b.score) {
            return a.score - b.score;
          }
          if (stage.set_global === 1) {
            const aThirdRound = rounds.find(
              (r) => r.athlete_id === a.athlete.id_athlete && r.round === 3
            );
            const bThirdRound = rounds.find(
              (r) => r.athlete_id === b.athlete.id_athlete && r.round === 3
            );
            if (aThirdRound && bThirdRound) {
              return (
                (aThirdRound.arriving_place || Infinity) -
                (bThirdRound.arriving_place || Infinity)
              );
            }
            if (aThirdRound) return -1;
            if (bThirdRound) return 1;
          }
          return 0;
        };

        const sortByOriginalIndex = (a, b) => a.originalIndex - b.originalIndex;

        // advancingMergedSorted: all advancing athletes, sorted
        // eliminatedMergedSorted: all eliminated athletes, sorted
        const advancingMergedSorted = advancingAll
          // .sort(sortFn)
          .sort(sortByOriginalIndex)
          .map((a) => a.athlete);
        const eliminatedMergedSorted = eliminatedAll
          .sort(sortFn)
          .map((a) => a.athlete);
        console.log("advancing: ", advancingMergedSorted);
        // Eliminate players: assign ranking and set status to "eliminated"
        // stage.stage_tracking is your rank counter
        let rankCounter = stage.stage_tracking;
        console.log("eliminated: ", eliminatedMergedSorted);
        for (const athlete of eliminatedMergedSorted) {
          // Update Participation: set ranking and status
          await Participation.update(
            {
              ranking: rankCounter,
              status: "completed",
              score: getFinalScore(rankCounter),
            },
            {
              where: {
                id_athlete: athlete.id_athlete,
                stage_id: stage.id_stage,
              },
            }
          );
          rankCounter -= 1;
        }
        // Set previous
        stage.increment("set_global", { by: 1 }); // New set
        // Set previous hits as inactive
        await Hit.update(
          { active: false },
          {
            where: {
              stage_id: stage.id_stage,
            },
          }
        );
        StageController.get_hit_distribution(
          advancingMergedSorted,
          stage.id_stage
        );

        res.status(200).json({ message: "Next set has initialized!" });
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
  finalize_competition: async (id_stage, set_global) => {
    // 1. Get the hit(s) with the given conditions
    const hit = await Hit.findOne({
      where: { stage_id: id_stage, active: true },
    });

    const scores = await Round.findAll({
      where: { hit_id: hit.id_hit },
      attributes: ["athlete_id", [fn("SUM", col("score")), "total_score"]],
      group: ["athlete_id"],
    });

    const sortedScores = scores.sort((a, b) => {
      // If using Sequelize objects, use .get("total_score")
      // Otherwise, if plain objects, use a.total_score
      const aScore =
        typeof a.get === "function"
          ? Number(a.get("total_score"))
          : Number(a.total_score);
      const bScore =
        typeof b.get === "function"
          ? Number(b.get("total_score"))
          : Number(b.total_score);
      return aScore - bScore;
    });

    sortedScores.forEach(async (score, i) => {
      const athleteId =
        typeof score.get === "function"
          ? score.get("athlete_id")
          : score.athlete_id;
      const totalScore =
        typeof score.get === "function"
          ? score.get("total_score")
          : score.total_score;
      console.log(`Athlete ID: ${athleteId}, Total Score: ${totalScore}`);

      await Participation.update(
        { ranking: i + 1, status: "completed", score: getFinalScore(i + 1) },
        {
          where: {
            id_athlete: athleteId,
            stage_id: id_stage,
          },
        }
      );
    });
    // If you want just one hit (e.g., the first one)
    // const hit = hits[0];

    // // 2. Get all rounds for this hit
    // const rounds = await Round.findAll({
    //   where: { hit_id: hit.id_hit },
    //   attributes: ["athlete_id"], // Only get athlete_id if that's all you need
    // });

    // // 3. Extract all athlete_ids
    // const athleteIds = rounds.map((r) => r.athlete_id);

    // // Final stage: assign rankings by position in the final group (advancingMergedSorted)
    // for (let i = 0; i < athleteIds.length; i++) {
    //   // const athlete = athleteIds[i];
    // await Participation.update(
    //   { ranking: i + 1, status: "completed", score: getFinalScore(i + 1) },
    //   {
    //     where: {
    //       id_athlete: athleteIds[i],
    //       stage_id: id_stage,
    //     },
    //   }
    // );
    //   // Optionally: set eliminated_in or other fields if needed
    // }
  },
};

module.exports = StageController;
