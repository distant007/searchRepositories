class View {
  constructor() {
    this.search = document.getElementById("search");
    this.searchBox = this.createElement("div", "search-input");
    this.searchInput = this.createElement("input", "input");
    this.searchInput.placeholder = "Search repositories..";

    this.autocomplitBox = this.createElement("div", "autocomplit-box");

    this.search.append(this.searchBox);
    this.searchBox.append(this.searchInput);
    this.searchBox.append(this.autocomplitBox);

    this.choosed = document.getElementById("choosed");
    this.itemLi;

    this.autocomplitBox.addEventListener(
      "click",
      this.closeAutocomplit.bind(this)
    );
  }
  closeAutocomplit() {
    this.autocomplitBox.innerHTML = " ";
    this.searchInput.value = "";
    this.searchInput.placeholder = "Search repositories..";
  }
  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) element.classList.add(elementClass);
    return element;
  }
  createSearchItem(repoInfo) {
    const item = this.createElement("li", "item");
    item.textContent = `${repoInfo.name}`;

    this.autocomplitBox.append(item);

    item.dataset.name = `${repoInfo.name}`;
    item.dataset.owner = `${repoInfo.owner.login}`;
    item.dataset.owner = `${repoInfo.owner.login}`;
    item.dataset.stars = `${repoInfo.stargazers_count}`;

    item.addEventListener("click", this.createInfoBlock.bind(item));
  }
  createInfoBlock() {
    const choosedItem = document.createElement("li");

    this.button = document.createElement("button");
    this.button.classList.add("close-btn");

    choosedItem.innerHTML = `<span>Name: ${this.dataset.name}</span><span>Owner: ${this.dataset.owner}</span><span>Stars: ${this.dataset.stars}`;
    const choosed = document.getElementById("choosed");

    choosed.append(choosedItem);
    choosedItem.append(this.button);

    this.button.addEventListener("click", () => {
      choosedItem.remove();
    });
  }
}
class Search {
  constructor(view) {
    this.view = view;

    this.view.searchInput.addEventListener(
      "keyup",
      this.debounce(this.searchRepo.bind(this), 200)
    );
  }
  async searchRepo() {
    const searchValue = this.view.searchInput.value;
    if (searchValue) {
      this.clearSearch();

      await fetch(
        `https://api.github.com/search/repositories?q=${searchValue}&per_page=5`
      ).then((response) => {
        if (response.ok) {
          response.json().then((responce) => {
            responce.items.forEach((repo) => {
              this.view.createSearchItem(repo);
            });
          });
        }
      });
    } else {
      this.clearSearch();
    }
  }

  clearSearch() {
    this.view.autocomplitBox.innerHTML = " ";
  }
  debounce(fn, debounceTime) {
    let timeout;
    return function () {
      const fnCall = () => fn.apply(this, arguments);

      clearTimeout(timeout);

      timeout = setTimeout(fnCall, debounceTime);
    };
  }
}

new Search(new View());
