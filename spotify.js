const secrets = require("./secrets.js");
const fs = require("fs");
const Spotify = require("node-spotify-api");
const spotify = new Spotify({
  id: secrets.spotify.id,
  secret: secrets.spotify.secret
});
let fields = "tracks.items(track(name,uri,album(name,id),artists(name)))";
fields = fields.replace(/,/g, "%2C");
const root = "https://api.spotify.com/v1/playlists";
const path = `${root}/${secrets.spotify.playlist}?fields=${fields}`;

spotify
  .request(path)
  .then(handleData)
  .catch(console.error);

function handleData(data) {
  const res = data.tracks.items.map(formattedData);
  fs.writeFileSync("data-source.tmp.json", JSON.stringify(res, null, 2));
  return true;
}

function formattedData({ track }) {
  const { album, artists, uri, name } = track;
  const artist = artists.map(a => a.name).join(", ");
  const discogs = `${discogsQS(artists[0].name)}+${discogsQS(album.name)}`;
  const apple = `${searchQS(artists[0].name)} ${searchQS(album.name)}`;
  return {
    artist,
    album: album.name,
    track: name,
    links: {
      apple: `apple music ${apple}`,
      spotify: `https://open.spotify.com/album/${album.id}`,
      discogs: `https://www.discogs.com/search/?q=${discogs}&type=master`
    },
    embed_uri: uri,
    description: ""
  };
}

function searchQS(item) {
  return item.toLowerCase().replace(/[^a-z0-9 ]+/g, "");
}

function discogsQS(item) {
  return item
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, "")
    .split(" ")
    .join("+");
}
