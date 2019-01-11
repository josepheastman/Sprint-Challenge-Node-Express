const express = require("express");

const actionsRouter = require("../actions/actionsRouter.js");
const projectsRouter = require("../projects/projectsRouter.js");

const router = express.Router();

router.use("/actions", actionsRouter);
router.use("/projects", projectsRouter);

module.exports = router;
