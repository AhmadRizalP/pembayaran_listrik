const express = require("express");
const app = express();
const models = require("../models/index");
const tagihan = models.tagihan;
const penggunaan = models.penggunaan;

app.use(express.urlencoded({ extended: true }));

const verifyToken = require("./tokenAdmin");
app.use(verifyToken);

app.get("/", async (req, res) => {
  tagihan
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

app.get("/:id_tagihan", async (req, res) => {
  let param = {
    id_tagihan: req.params.id_tagihan,
  };
  tagihan
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
  let param1 = {
    id_penggunaan: req.body.id_penggunaan,
  };
  penggunaan
    .findOne({ where: param1 })
    .then((result) => {
      let meterawal = result.meter_awal;
      let meterakhir = result.meter_akhir;
      let jumlahmeter = meterakhir * 1 - meterawal * 1;
      let data = {
        id_penggunaan: req.body.id_penggunaan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        jumlah_meter: jumlahmeter,
        status: 0,
      };
      tagihan.create(data).then((result) => {
        res.json({
          message: "data has been inserted",
        });
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
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
    id_tagihan: req.body.id_tagihan,
  };
  let param2 = {
    id_penggunaan: req.body.id_penggunaan,
  };
  if (param2.id_penggunaan != null) {
    const act1 = await penggunaan.findOne({ where: param2 });
    let meterawal = act1.meter_awal;
    let meterakhir = act1.meter_akhir;
    let jumlahmeter = meterakhir * 1 - meterawal * 1;
    let data = {
      id_penggunaan: req.body.id_penggunaan,
      bulan: req.body.bulan,
      tahun: req.body.tahun,
      jumlah_meter: jumlahmeter,
      status: 0,
    };
    tagihan
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
  } else {
    let data = {
      bulan: req.body.bulan,
      tahun: req.body.tahun,
      status: 0,
    };
    tagihan
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
  }
});

app.delete("/:id_tagihan", async (req, res) => {
  try {
    let param = {
      id_tagihan: req.params.id_tagihan,
    };
    tagihan
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
