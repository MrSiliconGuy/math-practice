const path = require("path");
const fs = require("fs");

const express = require("express");

const PORT = process.env.PORT || 8080;
const app = express();

app.use("/", express.static(path.join(__dirname, "./build")));

app.listen(PORT, () => {
  console.log(`😎 Server is listening on port ${PORT}`);
});
