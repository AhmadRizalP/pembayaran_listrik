const express = require("express");
const app = express();

const models = require("../models/index");
const tarif = models.tarif;

app.use(express.urlencoded({ extended: true }));

const verifyToken = require("./tokenAdmin");
app.use(verifyToken);

app.get("/", (req, res) => {
  tarif
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

app.get("/:id_tarif", (req, res) => {
  let param = {
    id_tarif: req.params.id_tarif,
  };
  tarif
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
    daya: req.body.daya,
    tarifperkwh: req.body.tarifperkwh,
  };
  tarif
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
    id_tarif: req.body.id_tarif,
  };
  let data = {
    daya: req.body.daya,
    tarifperkwh: req.body.tarifperkwh,
  };
  tarif
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

app.delete("/:id_tarif", async (req, res) => {
  try {
    let param = {
      id_tarif: req.params.id_tarif,
    };
    tarif
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
