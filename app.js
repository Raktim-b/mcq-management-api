require("dotenv").config();
const express = require("express");
const cors = require("cors");
const DbCon = require("./app/config/db");
const router = require("./app/routes");

const app = express();

DbCon();

app.use(cors());
app.use(express.json());
app.use(router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server created at ${PORT}`);
});
