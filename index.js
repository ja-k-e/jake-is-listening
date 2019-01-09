const jsonminify = require("jsonminify");
const fs = require("fs");

const data = fs.readFileSync("data-source.json", "utf8");
const parsed = JSON.parse(data);
parsed.forEach(entry => {
  if (!entry.time) entry.time = new Date().getTime();
});
const final = JSON.stringify(parsed, null, 2);
fs.writeFileSync("data-source.json", final);

const minified = jsonminify(final);
fs.writeFileSync("docs/data.json", minified);
