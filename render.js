export class Renderer {
  renderSearchResults(results) {
    const $resultDiv = $("#searchResult");
    $resultDiv.empty();
    if (!Array.isArray(results) || results.length === 0) {
      $resultDiv.text("no results");
      return;
    }
    const $ul = $('<ul class="list-group"></ul>');
    results.forEach((company) => {
      const $li = $(`
        <li class="list-group-item">
          <a href="/company/company.html?symbol=${encodeURIComponent(
            company.symbol
          )}" class="text-decoration-none text-dark">
            ${company.name}
            <span class="badge bg-primary rounded-pill ms-2">${
              company.symbol
            }</span>
          </a>
        </li>
      `);
      $ul.append($li);
    });
    $resultDiv.append($ul);
  }
}
