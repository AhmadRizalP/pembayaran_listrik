const express = require("express");
const multer = require("multer");
const app = express();

const models = require("../models/index");
const pembayaran = models.pembayaran;
const tagihan = models.tagihan;
const penggunaan = models.penggunaan;
const pelanggan = models.pelanggan;
const path = require("path");
const fs = require("fs");
const dateformat = require("dateformat");

app.use(express.urlencoded({ extended: true }));

//Verify Token
const verifyToken = require("./tokenAdmin");
const verifyToken2 = require("./tokenPelanggan");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./image");
  },
  filename: (req, file, cb) => {
    cb(null, "img-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
});

app.get("/", verifyToken, async (req, res) => {
  pembayaran
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

app.get("/:id", verifyToken, async (req, res) => {
  let param = {
    id_pembayaran: req.params.id,
  };
  let data = await pembayaran.findOne({
    where: param,
    include: ["tagihan"],
  });
  res.json({
    data: data,
  });
});

app.post("/", verifyToken2, upload.single("bukti"), async (req, res) => {
  if (!req.file) {
    res.json({
      message: "no upload file",
    });
  } else {
    let param1 = { id_tagihan: req.body.id_tagihan };
    let result = await tagihan.findOne({ where: param1 });
    if (result.status == 1) {
      res.json({
        message: "Tagihan Sudah Terbayar",
      });
    } else {
      let data = { status: 1 };
      tagihan.update(data, { where: param1 });

      const act1 = await tagihan.findOne({ where: param1 });
      let param2 = { id_penggunaan: act1.id_penggunaan };
      let jumlahmeter = act1.jumlah_meter;

      const act2 = await penggunaan.findOne({ where: param2 });
      let param3 = { id_pelanggan: act2.id_pelanggan };
      //Last
      pelanggan
        .findOne({ where: param3, include: ["tarif"] })
        .then((result) => {
          let tarif = result.tarif.tarifperkwh;
          let totalbiaya = jumlahmeter * tarif;
          let biayaadmin = (totalbiaya * 10) / 100;
          let data = {
            id_tagihan: req.body.id_tagihan,
            tanggal_pembayaran: dateformat(new Date(), "yyyy-mm-dd"),
            bulan_bayar: req.body.bulan_bayar,
            biaya_admin: biayaadmin,
            total_bayar: totalbiaya,
            status: 0,
            bukti: req.file.filename,
            id_admin: req.body.id_admin,
          };
          pembayaran
            .create(data)
            .then((result) => {
              res.json({
                message: "Data has been inserted",
              });
            })
            .catch((error) => {
              res.json({
                message: error.message,
              });
            });
        })
        .catch((error) => {
          res.json({
            message: error.message,
          });
        });
    }
  }
});

app.put("/", verifyToken, upload.single("bukti"), async (req, res) => {
  let param = { id_pembayaran: req.body.id_pembayaran };
  let param1 = { id_tagihan: req.body.id_tagihan };
  if (param1.id_tagihan != null) {
    let data = { status: 1 };
    tagihan.update(data, { where: param1 });

    const act1 = await tagihan.findOne({ where: param1 });
    let param2 = { id_penggunaan: act1.id_penggunaan };
    let jumlahmeter = act1.jumlah_meter;

    const act2 = await penggunaan.findOne({ where: param2 });
    let param3 = { id_pelanggan: act2.id_pelanggan };

    const act3 = await pembayaran.findOne({ where: param });
    //last
    pelanggan
      .findOne({ where: param3, include: ["tarif"] })
      .then((result) => {
        let tarif = result.tarif.tarifperkwh;
        let totalbiaya = jumlahmeter * tarif;
        let biayaadmin = (totalbiaya * 10) / 100;
        let data = {
          id_tagihan: req.body.id_tagihan,
          bulan_bayar: req.body.bulan_bayar,
          biaya_admin: biayaadmin,
          total_bayar: totalbiaya,
          id_admin: req.body.id_admin,
        };
        if (req.file) {
          let oldName = act3.bukti;
          let dir = path.join(__dirname, "../image", oldName);
          fs.unlink(dir, (err) => console.log(err));
          data.bukti = req.file.filename;
        }
        pembayaran
          .update(data, { where: param })
          .then((result) => {
            res.json({
              message: "Data has been updated",
            });
          })
          .catch((error) => {
            res.json({
              message: error.message,
            });
          });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  } else {
    let data = {
      bulan_bayar: req.body.bulan_bayar,
      id_admin: req.body.id_admin,
    };
    if (req.file) {
      let oldName = act3.bukti;
      let dir = path.join(__dirname, "../image", oldName);
      fs.unlink(dir, (err) => console.log(err));
      data.bukti = req.file.filename;
    }
    pembayaran
      .update(data, { where: param })
      .then((result) => {
        res.json({
          message: "Data has been updated",
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  }
});

app.delete("/:id", verifyToken, async (req, res) => {
  try {
    let param = {
      id_pembayaran: req.params.id,
    };
    let act = await pembayaran.findOne({ where: param });
    let oldName = act.bukti;
    let dir = path.join(__dirname, "../image", oldName);
    fs.unlink(dir, (err) => console.log(err));

    pembayaran
      .destroy({ where: param })
      .then((result) => {
        res.json({
          message: "Data has been deleted",
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

app.post("/verifikasi/:id", verifyToken, async (req, res) => {
  let param = {
    id_pembayaran: req.params.id,
  };
  let data = {
    status: 1,
  };
  const act1 = await pembayaran.findOne({ where: param });
  if (act1.status == 1) {
    res.json({
      message: "Verifikasi Gagal!! Pembayaran sudah Terverifikasi sebelumnya",
    });
  } else {
    pembayaran
      .update(data, { where: param })
      .then((result) => {
        res.json({
          message: "Data has been Verified",
          data: act1,
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  }
});
module.exports = app;
