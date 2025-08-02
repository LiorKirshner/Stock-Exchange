export class Renderer {
  renderSearchResults(results) {
    const $resultDiv = $("#searchResult");
    $resultDiv.empty();
    if (!Array.isArray(results) || results.length === 0) {
      $resultDiv.text("no results");
      return;
    }
    const $ul = $("<ul></ul>");
    results.forEach((company) => {
      const $li = $(`<li>${company.name} (${company.symbol})</li>`);
      $ul.append($li);
    });
    $resultDiv.append($ul);
  }
}
