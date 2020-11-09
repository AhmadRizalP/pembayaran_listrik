const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const models = require("../models/index");
const pelanggan = models.pelanggan;
const admin = models.admin;
app.use(express.urlencoded({ extended: true }));

app.post("/pelanggan", async (req, res) => {
  let parameter = {
    username: req.body.username,
    password: md5(req.body.password),
  };
  let act = await pelanggan.findOne({ where: parameter });
  if (act == null) {
    res.json({
      message: "Invalid Username or Password",
    });
  } else {
    let jwtHeader = {
      algorithm: "HS256",
      expiresIn: "1d",
    };
    let payload = { data: act };
    let secretKey = "ListrikPelanggan";
    let token = jwt.sign(payload, secretKey, jwtHeader);
    res.json({
      message: "Anda Berhasil Login",
      data: act,
      token: token,
    });
  }
});

app.post("/admin", async (req, res) => {
  let parameter = {
    username: req.body.username,
    password: md5(req.body.password),
  };
  let act = await admin.findOne({ where: parameter, include: ["level"] });
  if (act == null) {
    res.json({
      message: "Invalid Username or Password",
    });
  } else {
    if (act.id_level == 1) {
      let jwtHeader = {
        algorithm: "HS256",
        expiresIn: "1d",
      };
      let payload = { data: act };
      let secretKey = "ListrikAdmin";
      let token = jwt.sign(payload, secretKey, jwtHeader);
      res.json({
        message: "Anda Berhasil Login",
        data: act,
        token: token,
      });
    } else {
      let jwtHeader = {
        algorithm: "HS256",
        expiresIn: "1d",
      };
      let payload = { data: act };
      let secretKey = "ListrikAdmin";
      let token = jwt.sign(payload, secretKey, jwtHeader);
      res.json({
        message: "Anda Berhasil Login",
        data: act,
        token: token,
      });
    }
  }
});

module.exports = app;
