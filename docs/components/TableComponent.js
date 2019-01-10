Vue.component("table-component", {
  props: ["entries"],
  computed: {},
  data() {
    return {};
  },
  template: tableTemplate()
});

function tableTemplate() {
  return /* html */ `
<table class="table">
  <thead>
    <tr>
      <th>Track</th>
      <th>Artist</th>
      <th>Album</th>
      <th>Links</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="entry in entries">
      <td>{{ entry.track }}</td>
      <td>{{ entry.artist }}</td>
      <td>
        <a v-if="entry.links.spotify" :href="entry.links.spotify" target="_blank">
          {{ entry.album }}
        </a>
        <span v-else>{{ entry.album }}</span>
      </td>
      <td>
        <div class="links">
          <links-component :links="entry.links"></links-component>
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="4" style="text-align:center">
        <a href="https://jakealbaugh.github.io/jake-is-listening/data.json" target="_blank">Raw JSON</a>
      </td>
    </tr>
  </tbody>
</table>
  `;
}
