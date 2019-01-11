# Jake Is Listening

A public JSON file containing what I am listening to.

## Development

- write data in `/data-source.json`
- `yarn serve` will start hosting `./docs` at [localhost:8000](http://localhost:8000)
- `yarn build` will clean and minify the json to `./docs`.

## Publish

- publish by running `yarn pub` which will `build`, commit, and push to `origin master`.
- enable github pages for the `docs` directory
- data will be available at [https://jakealbaugh.github.io/jake-is-listening/data.json](https://jakealbaugh.github.io/jake-is-listening/data.json)

## Tweeting

- `yarn tweet`
- follow the instructions to select a entry to tweet
- if the entry you are looking for doesn't exist, you probably need to `yarn build`
