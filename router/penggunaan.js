const express = require("express");
const app = express();
const models = require("../models/index");
const penggunaan = models.penggunaan;

app.use(express.urlencoded({ extended: true }));

const verifyToken = require("./tokenAdmin");
app.use(verifyToken);

app.get("/", async (req, res) => {
  penggunaan
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

app.get("/:id_penggunaan", async (req, res) => {
  let param = {
    id_penggunaan: req.params.id_penggunaan,
  };
  penggunaan
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
    id_pelanggan: req.body.id_pelanggan,
    bulan: req.body.bulan,
    tahun: req.body.tahun,
    meter_awal: req.body.meter_awal,
    meter_akhir: req.body.meter_akhir,
  };
  penggunaan
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
    id_penggunaan: req.body.id_penggunaan,
  };
  let data = {
    id_pelanggan: req.body.id_pelanggan,
    bulan: req.body.bulan,
    tahun: req.body.tahun,
    meter_awal: req.body.meter_awal,
    meter_akhir: req.body.meter_akhir,
  };
  penggunaan
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

app.delete("/:id_penggunaan", async (req, res) => {
  try {
    let param = {
      id_penggunaan: req.params.id_penggunaan,
    };
    penggunaan
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
