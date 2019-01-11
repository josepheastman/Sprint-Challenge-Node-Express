const express = require("express");

const projectDb = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
  projectDb
    .get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The project information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  projectDb
    .get(id)
    .then(project => {
      if (project) {
        res.status(200).json(project);
      } else {
        res
          .status(404)
          .json({
            message: "The project with the specified ID does not exist."
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The project information could not retrieved." });
    });
});

router.get("/actions/:projectId", (req, res) => {
  const projectId = req.params.projectId;

  projectDb
    .getProjectActions(projectId)
    .then(projectAction => {
      if (!projectAction) {
        res
          .status(404)
          .json({ error: "This project does not have any actions." });
      } else {
        res.status(200).json(projectAction);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({
          error: "The projects action information could not be retrieved."
        });
    });
});

router.post("/", (req, res) => {
  const { name, description, completed } = req.body;

  projectDb
    .insert({ name, description, completed })
    .then(count => {
      projectDb.get().then(projects => {
        res.status(200).json(projects);
      });
    })
    .catch(err => {
      res
        .status(500)
        .json({
          error: "There was an error while saving the project to the database."
        });
    });
});

router.delete("/:projectId", (req, res) => {
  const projectId = req.params.projectId;

  projectDb
    .get(projectId)
    .then(project => {
      if (!project) {
        res
          .status(404)
          .json({
            message: "The project with the specified ID does not exist."
          });
      } else {
        projectDb.remove(projectId).then(count => {
          res.status(200).json(project);
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The project could not be removed." });
    });
});

router.put("/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const { name, description, completed } = req.body;

  projectDb
    .get(projectId)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({
            message: "The project with the specified ID does not exist."
          });
      } else {
        projectDb
          .update(projectId, { name, description, completed })
          .then(count => {
            res.status(200).json(post);
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The project information could not be modified." });
    });
});

module.exports = router;
