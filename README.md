# Jake Is Listening

A public JSON file containing what I am listening to.

## Development

- write data in `/data-source.json`
- `yarn serve` will start hosting `./docs` at [localhost:8000](http://localhost:8000)
- `yarn build` will clean, paginate and minify the json to `./docs/data/`.

## Publish

- publish by running `yarn pub` which will `build`, commit, and push to `origin master`.
- enable github pages for the `./docs` directory
- data will be available at [https://jakeislistening.com/data/001.json](https://jakeislistening.com/data/001.json)

## Tweeting

- `yarn tweet`
- follow the instructions to select a entry to tweet
- if the entry you are looking for doesn't exist, you probably need to `yarn build`
- I was gonna use the Twitter API to post, but realized it's about just as much work to copy paste.
- This will spit out formatted text within the character limit as a preview as well as copy it to your clipboard (MacOS).

## Importing a Spotify Playlist

Setup a Spotify Developer account and a new application.
Ensure `./secrets.js` exists and has the following content for `spotify`:

```js
module.exports = {
  spotify: {
    id: "<CLIENT_ID>",
    secret: "<CLIENT_SECRET>",
    playlist: "<PLAYLIST_ID>"
  }
};
```

- `yarn spotify` will format the Spotify playlist into `./data-source.tmp.json`.
- Copy and paste the contents into `data-source.json` and fill the rest out.
- I like to paste the contents into `data-source.queue.json` until I am finished editing.
