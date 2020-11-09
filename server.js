const express = require("express");
const app = express();
const tarif = require("./router/tarif");
const pelanggan = require("./router/pelanggan");
const penggunaan = require("./router/penggunaan");
const tagihan = require("./router/tagihan");
const level = require("./router/level");
const admin = require("./router/admin");
const pembayaran = require("./router/pembayaran");
const registrasi = require("./router/register");
const login = require("./router/login");

app.use("/tarif", tarif);
app.use("/pelanggan", pelanggan);
app.use("/penggunaan", penggunaan);
app.use("/tagihan", tagihan);
app.use("/level", level);
app.use("/admin", admin);
app.use("/pembayaran", pembayaran);
app.use("/registrasi", registrasi);
app.use("/login", login);

app.listen(8000, () => {
  console.log("server run on port 8000");
});
