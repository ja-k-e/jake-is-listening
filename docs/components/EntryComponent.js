Vue.component("entry-component", {
  props: ["entry"],
  data() {
    return {
      iframeLoaded: false
    };
  },
  methods: {
    cleanOrphan(desc) {
      return desc.replace(/ ([^ ]+)$/g, "&nbsp;$1");
    },
    time(time) {
      const date = new Date(time);
      const arr = date
        .toLocaleDateString()
        .split("/")
        .map(s => s.padStart(2, "0"));
      const yr = [arr[2][2], arr[2][3]].join("");
      return [yr, arr[0], arr[1]].join(" ");
    },
    uriToEmbedUrl(uri) {
      let [origin, type, id] = uri.split(":");
      if (origin === "spotify")
        return `https://open.spotify.com/embed/${type}/${id}`;
      if (origin === "youtube") return `https://www.youtube.com/embed/${type}`;
      if (origin === "soundcloud")
        return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${type}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    }
  },
  template: entryTemplate()
});

function entryTemplate() {
  return /* html */ `
<article class="entry" :key="entry.embed_uri" :class="{ loaded: iframeLoaded }">
  <div class="embed">
    <iframe :src="uriToEmbedUrl(entry.embed_uri)" :key="'iframe-' + entry.embed_uri"
      @load="iframeLoaded = true"
      width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"
    ></iframe>
  </div>

  <div class="meta">
    <h3 class="track" v-html="cleanOrphan(entry.track)"></h3>
    <p class="album" v-html="cleanOrphan(entry.album)"></p>
    <p class="artist" v-html="cleanOrphan(entry.artist)"></p>
    <p class="description" v-html="cleanOrphan(entry.description)"></p>

    <links-component :links="entry.links"></links-component>
    <ul class="links" v-if="entry.extra_links">
      <li v-for="[title, url] in entry.extra_links">
        <a :href="url" target="_blank" class="text">{{ title }}</a>
      </li>
    </ul>
  </div>
</article>
`;
}
