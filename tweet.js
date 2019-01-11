const List = require("prompt-list");
const fs = require("fs");
const entries = JSON.parse(fs.readFileSync("./data-source.json", "utf8"));
const colors = require("colors");
const wrap = require("word-wrap");
const MAX_CHARS = 280;

const choices = entries.map(({ artist, album, track }, i) => {
  const string = s => s.substring(0, 20).padEnd(20, " ");
  return [string(artist), string(album), string(track)].join(" - ") + " # " + i;
});

const list = new List({
  name: "entry",
  message: "What would you like to tweet about?",
  choices
});

list.run().then(processEntry);

function processEntry(key) {
  if (key === undefined) {
    console.log("Please make a selection".red);
    return;
  }
  let index = parseInt(key.match(/ # (\d+)$/)[1]);
  let tweet = generateTweet(entries[index]);
  printPreviewToConsole(tweet);
  pbcopy(tweet);
  console.log("👍   Good to go. It's on your clipboard!".yellow);
  return true;
}

function pbcopy(data) {
  let proc = require("child_process").spawn("pbcopy");
  proc.stdin.write(data);
  proc.stdin.end();
}

function generateTweet({ description, embed_uri }) {
  let link = linkFromEmbedURI(embed_uri);
  let tweet = cleanDescription(description, link.length);
  return `${tweet}\n${link}`;
}

function printPreviewToConsole(tweet) {
  let text = wrap(tweet, { width: 70 });
  text = text.split(/\n/);
  text = text
    .map((ln, i) => {
      t = ln.padEnd(74, " ");
      if (i === text.length - 1) return t.cyan;
      return t;
    })
    .join("\n");
  console.log(" ");
  console.log("HERES WHAT IT WILL LOOK LIKE".yellow.bold);
  console.log(" ");
  console.log("".padEnd(74, " ").bgBlack);
  console.log(text.white.bgBlack.bold);
  console.log("".padEnd(74, " ").bgBlack);
  console.log(" ");
}

function cleanDescription(description, linkSize) {
  let max = MAX_CHARS - linkSize - 1; // the newline
  if (description.length <= max) return description;
  let regex = /([\.\?\!\”\"])[^\.\?\!\”\"]+[\.\?\!\”\"] ?$/;
  description = description.replace(regex, "$1");
  if (description.length <= max) return description;
  description = description.replace(regex, "$1");
  if (description.length <= max) return description;
  return "COULDNT MAKE THIS SMALL ENOUGH";
}

function linkFromEmbedURI(uri) {
  let [source, typeOrId, id] = uri.split(":");
  if (source === "youtube") return `https://youtu.be/${typeOrId}`;
  if (source === "spotify") return `https://open.spotify.com/${typeOrId}/${id}`;
  return uri;
}
