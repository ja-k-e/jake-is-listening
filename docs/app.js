new Vue({
  el: "#app",
  data() {
    return {
      entries: [],
      loaded: false,
      loading: true,
      pagination: {},
      start: 0,
      stop: 0
    };
  },
  computed: {
    canLoadMore() {
      return this.entries.length && this.entries.length - 1 > this.stop;
    },
    currentEntries() {
      return this.entries.slice(this.start, this.stop);
    },
    size() {
      let w = window.innerWidth;
      return w >= 1320 ? 8 : 6;
    }
  },
  methods: {
    loadMore() {
      this.stop = Math.min(this.entries.length, this.stop + this.size);
      if (
        this.stop === this.entries.length &&
        this.pagination.next &&
        !this.loading
      ) {
        this.fetchData(this.pagination.next).then(() => {
          console.log("fetched more!");
        });
      }
    },
    onScroll() {
      if (window.innerHeight + window.scrollY < document.body.offsetHeight)
        return;
      this.loadMore();
    },
    fetchData(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const path = `data/${page.toString().padStart(3, "0")}.json`;
        axios
          .get(path)
          .then(({ data }) => {
            let { entries, pagination } = data;
            this.pagination = pagination;
            entries.forEach(d => this.entries.push(d));
            this.loading = false;
            resolve();
          })
          .catch(reject);
      });
    }
  },
  mounted() {
    this.fetchData(1).then(() => {
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
      <transition-group name="entries" tag="section" class="entries">
        <entry-component v-for="entry in currentEntries"
          :entry="entry" :key="entry.embed_uri">
        </entry-component>
      </transition-group>
      <button class="big-full-button" @click="loadMore" v-if="canLoadMore" :disabled="loading">
        <span v-if="loading">LOADING</span><span v-else>LOAD MORE</span>
      </button>
    </div>
  </main>
  `;
}
