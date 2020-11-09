const express = require("express");
const app = express();
const md5 = require("md5");
const models = require("../models/index");
const pelanggan = models.pelanggan;
const admin = models.admin;
app.use(express.urlencoded({ extended: true }));

app.post("/pelanggan", async (req, res) => {
  let data = {
    username: req.body.username,
    password: md5(req.body.password),
    nomor_kwh: req.body.nomor_kwh,
    nama_pelanggan: req.body.nama_pelanggan,
    alamat: req.body.alamat,
    id_tarif: req.body.id_tarif,
  };
  pelanggan
    .create(data)
    .then((result) => {
      res.json({
        message: "Registrasi Pelanggan Berhasil",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.post("/admin", async (req, res) => {
  let data = {
    username: req.body.username,
    password: md5(req.body.password),
    nama_admin: req.body.nama_admin,
    id_level: 2,
  };
  admin
    .create(data)
    .then((result) => {
      res.json({
        message: "Registrasi Admin Berhasil",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

module.exports = app;
