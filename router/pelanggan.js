const express = require("express");
const app = express();
const md5 = require("md5");

const models = require("../models/index");
const pelanggan = models.pelanggan;

app.use(express.urlencoded({ extended: true }));

const verifyToken = require("./tokenAdmin");
app.use(verifyToken);

app.get("/", async (req, res) => {
  pelanggan
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

app.get("/:id_pelanggan", async (req, res) => {
  let param = {
    id_pelanggan: req.params.id_pelanggan,
  };
  pelanggan
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

// app.post("/", async (req, res) => {
//   let data = {
//     username: req.body.username,
//     password: md5(req.body.password),
//     nomor_kwh: req.body.nomor_kwh,
//     nama_pelanggan: req.body.nama_pelanggan,
//     alamat: req.body.alamat,
//     id_tarif: req.body.id_tarif,
//   };
//   pelanggan
//     .create(data)
//     .then((result) => {
//       res.json({
//         message: "data has been inserted",
//       });
//     })
//     .catch((error) => {
//       res.json({
//         message: error.message,
//       });
//     });
// });

app.put("/", async (req, res) => {
  let param = {
    id_pelanggan: req.body.id_pelanggan,
  };
  let data = {
    username: req.body.username,
    passowrd: md5(req.body.passowrd),
    nomor_kwh: req.body.nomor_kwh,
    nama_pelanggan: req.body.nama_pelanggan,
    alamat: req.body.alamat,
    id_tarif: req.body.id_tarif,
  };
  pelanggan
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

app.delete("/:id_pelanggan", async (req, res) => {
  try {
    let param = {
      id_pelanggan: req.params.id_pelanggan,
    };
    pelanggan
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
