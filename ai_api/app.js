const express = require("express");

const app = express();
const mongoConnectAPI = require("./utils/database").mongoConnectAPI;
const designsRoutes = require("./routes/designs");

app.use(express.json({ limit: "50mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});








app.use(designsRoutes);

mongoConnectAPI(() => {
  app.listen(process.env.PORT || 8080).on("error", (err) => {
    console.log(err);
  });
});

process.on("uncaughtException", function (err) {
  console.log("process.on handler");
  console.log(err);
});
