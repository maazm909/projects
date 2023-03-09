const article = document.querySelector("article");

if (article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // regex
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  //use same styling as publish info in article header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = ` ${readingTime} min read`;

  // support for API reference docs
  const heading = article.querySelector("h1");
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}