const jsonminify = require("jsonminify");
const fs = require("fs");

const data = fs.readFileSync("data-source.json", "utf8");
const parsed = JSON.parse(data);
parsed.forEach(entry => {
  if (!entry.time) entry.time = new Date().getTime();
});

const sorted = parsed.sort((a, b) => {
  if (a.time > b.time) return -1;
  if (a.time < b.time) return 1;
  return 0;
});

const final = JSON.stringify(sorted, null, 2);
fs.writeFileSync("data-source.json", final);

const DATA_PER_PAGE = 50;
const pages = generatePages(sorted);

pages.forEach(page => {
  fs.writeFileSync(
    `docs/data/${page.pagination.page.toString().padStart(3, "0")}.json`,
    jsonminify(JSON.stringify(page))
  );
});

function generatePages(items) {
  const pages = [];
  var page = 1;
  const count = Math.ceil(items.length / DATA_PER_PAGE);
  while (items.length > 0) {
    const entries = items.splice(0, DATA_PER_PAGE);
    const next = page < count ? page + 1 : null;
    const prev = page > 1 ? page - 1 : null;
    const obj = {
      pagination: { page, pages: count, next, prev },
      entries
    };
    page++;
    pages.push(obj);
  }
  return pages;
}
