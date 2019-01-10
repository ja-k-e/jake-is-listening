new Vue({
  el: "#app",
  data() {
    return {
      entries: [],
      loaded: false,
      start: 0,
      stop: 0,
      view: "browse"
    };
  },
  computed: {
    canLoadMore() {
      return this.entries.length && this.entries.length - 1 > this.stop;
    },
    currentEntries() {
      return this.sortedEntries.slice(this.start, this.stop);
    },
    size() {
      let w = window.innerWidth;
      return w >= 1320 ? 8 : 6;
    },
    sortedEntries() {
      return this.entries.sort((a, b) => {
        if (a.time > b.time) return -1;
        if (a.time < b.time) return 1;
        return 0;
      });
    }
  },
  methods: {
    loadMore() {
      this.stop = Math.min(this.entries.length, this.stop + this.size);
    },
    onScroll() {
      if (window.innerHeight + window.scrollY < document.body.offsetHeight)
        return;
      this.loadMore();
    },
    toggle() {
      if (this.view === "browse") this.view = "all";
      else this.view = "browse";
    }
  },
  mounted() {
    axios.get("data.json").then(({ data }) => {
      data.forEach(d => this.entries.push(d));
      this.loaded = true;
      window.addEventListener("scroll", this.onScroll.bind(this));
      setTimeout(() => this.loadMore(), 0);
    });
  },
  template: appTemplate()
});

function appTemplate() {
  return /* html */ `
  <main>
    <div v-if="this.loaded">
      <!--
      <nav>
        <button @click="toggle">
          <span v-if="view === 'browse'">View Table</span>
          <span v-else>View Browser</span>
        </button>
      </nav>
      -->
      <div v-if="view === 'browse'">
        <transition-group name="entries" tag="section" class="entries">
          <entry-component v-for="entry in currentEntries"
            :entry="entry" :key="entry.embed_uri">
          </entry-component>
        </transition-group>
        <button class="big-full-button" @click="loadMore" v-if="canLoadMore">LOAD MORE</button>
      </div>
      <div v-if="view === 'all'">
        <table-component :entries="sortedEntries"></table-component>
      </div>
    </div>
  </main>
  `;
}
