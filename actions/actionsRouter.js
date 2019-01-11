const express = require("express");

const actionDb = require("../data/helpers/actionModel.js");

const router = express.Router();

router.get("/", (req, res) => {
  actionDb
    .get()
    .then(actions => res.status(200).json(actions))
    .catch(err => {
      res
        .status(500)
        .json({ error: "The actions information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  actionDb
    .get(id)
    .then(action => {
      if (action) {
        res.status(200).json(action);
      } else {
        res
          .status(404)
          .json({
            message: "The action with the specified ID does not exist."
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The action information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const { project_id, description, notes, completed } = req.body;

  actionDb
    .insert({ project_id, description, notes, completed })
    .then(result => {
      actionDb.get(result.id).then(action => {
        res.status(201).json(action);
      });
    })
    .catch(err => {
      res
        .status(500)
        .json({
          error: "There was an error while saving the action to the database."
        });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  actionDb
    .get(id)
    .then(action => {
      if (!action) {
        res
          .status(404)
          .json({
            message: "The action with the specified ID does not exist."
          });
      } else {
        actionDb.remove(id).then(count => {
          res.status(200).json(action);
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The action could not be removed." });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  actionDb
    .get(id)
    .then(action => {
      if (!action) {
        res
          .status(404)
          .json({
            message: "The action with the specified ID does not exist."
          });
      } else if (
        !changes.project_id ||
        !changes.description ||
        !changes.notes
      ) {
        res
          .status(400)
          .json({
            errorMessage:
              "Please make sure to provide a project ID, description, and notes to the action"
          });
      } else {
        actionDb.update(id, changes).then(count => {
          res.status(200).json(action);
        });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
