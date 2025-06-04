document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results");

  if (!searchInput) return;

  fetch("/search.json")
    .then(response => response.json())
    .then(docs => {
      const idx = lunr(function () {
        this.ref("url");
        this.field("title");
        this.field("content");

        docs.forEach(doc => this.add(doc));
      });

      searchInput.addEventListener("input", function () {
        const query = this.value.trim();
        resultsContainer.innerHTML = "";

        if (query === "") return;

        const results = idx.search(query);

        if (results.length === 0) {
          resultsContainer.innerHTML = "<li>No results found</li>";
          return;
        }

        results.forEach(result => {
          const match = docs.find(doc => doc.url === result.ref);
          const item = document.createElement("li");
          item.innerHTML = `<a href="${match.url}">${match.title}</a>`;
          resultsContainer.appendChild(item);
        });
      });
    })
    .catch(error => {
      console.error("Search load error:", error);
    });
});
