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
      const $li = $(
        `<li class="list-group-item">
          <span>
            ${company.name}
            <span class="badge bg-primary rounded-pill ms-2">${company.symbol}</span>
          </span>
        </li>`
      );
      $ul.append($li);
    });
    $resultDiv.append($ul);
  }
}
