const express = require("express");
const app = express();
const models = require("../models/index");
const admin = models.admin;
const md5 = require("md5");

app.use(express.urlencoded({ extended: true }));

const verifyToken = require("./tokenAdmin");
app.use(verifyToken);

app.get("/", async (req, res) => {
  admin
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
    id_admin: req.params.id,
  };
  let data = await admin.findOne({
    where: param,
    include: ["level"],
  });
  res.json({
    data: data,
  });
});

// app.post("/", async (req, res) => {
//   let data = {
//     username: req.body.username,
//     password: md5(req.body.password),
//     nama_admin: req.body.nama_admin,
//     id_level: req.body.id_level,
//   };
//   admin
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
    id_admin: req.body.id_admin,
  };
  let data = {
    username: req.body.username,
    password: md5(req.body.password),
    nama_admin: req.body.nama_admin,
    id_level: req.body.id_level,
  };
  admin
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
      id_admin: req.params.id,
    };
    admin
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
