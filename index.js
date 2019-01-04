const jsonminify = require("jsonminify");
const fs = require("fs");

const data = fs.readFileSync("data-source.json", "utf8");
const minified = jsonminify(data);

if (!fs.existsSync("docs")) fs.mkdirSync("docs");
fs.writeFileSync("docs/data.json", minified);
