const jsonminify = require("jsonminify");
const fs = require("fs");

const data = fs.readFileSync("data-source.json", "utf8");
const minified = jsonminify(data);
fs.writeFileSync("docs/data.json", minified);
