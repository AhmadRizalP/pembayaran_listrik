const express = require("express");
const app = express();
const models = require("../models/index");
const level = models.level;

app.use(express.urlencoded({ extended: true }));

const verifyToken = require("./tokenAdmin");
app.use(verifyToken);

app.get("/", async (req, res) => {
  level
    .findAll()
    .then((result) => {
      res.json({
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.get("/:id", async (req, res) => {
  let param = {
    id_level: req.params.id,
  };
  level
    .findOne({ where: param })
    .then((result) => {
      res.json({
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.post("/", async (req, res) => {
  let data = {
    nama_level: req.body.nama_level,
  };
  level
    .create(data)
    .then((result) => {
      res.json({
        message: "data has been inserted",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.put("/", async (req, res) => {
  let param = {
    id_level: req.body.id_level,
  };
  let data = {
    nama_level: req.body.nama_level,
  };
  level
    .update(data, { where: param })
    .then((result) => {
      res.json({
        message: "data has been updated",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.delete("/:id", async (req, res) => {
  try {
    let param = {
      id_level: req.params.id,
    };
    level
      .destroy({ where: param })
      .then((result) => {
        res.json({
          message: "data has been deleted",
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

module.exports = app;
