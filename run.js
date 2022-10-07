const { series } = require("async");
const { exec } = require("child_process");

series([() => exec(`PORT=${process.env.PORT || "4343"} npm start`)]);
