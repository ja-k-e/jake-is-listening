const jsonminify = require("jsonminify");
const fs = require("fs");
const download = require("image-downloader");

const data = fs.readFileSync("data-source.json", "utf8");
const json = JSON.parse(data);

let processed = json.reduce((i, v) => v.entries.length + i, 0);

json.forEach(volume => {
  volume.entries.forEach(entry => {
    let url = entry.image;
    let name = `${entry.artist}-${entry.album}`
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/ +?/g, "-");
    let ext = entry.image.match(/\.[^\.]+$/)[0];
    const filename = `${volume.volume}-${name}${ext}`;
    const dest = `docs/assets/${filename}`;
    if (fs.existsSync(dest)) {
      entry.image = filename;
      process();
    } else
      download
        .image({ url, dest })
        .then(() => {
          entry.image = filename;
          process();
        })
        .catch(e => console.error(url, "could not be downloaded to", dest));
  });
});

function process() {
  processed--;
  if (processed !== 0) return;
  const minified = jsonminify(JSON.stringify(json));
  fs.writeFileSync("docs/data.json", minified);
}
