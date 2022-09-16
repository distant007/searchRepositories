const autocomplitBox = document.querySelector(".autocomplit-box");
const searchInput = document.querySelector(".search-input");

const search = document.getElementById("search");
const choosedList = document.querySelector(".choosed-list");

const input = document.querySelector("input");

input.oninput = debounce(searchRepo, 200);

async function searchRepo() {
  const searchValue = input.value;

  if (searchValue) {
    clearSearch();

    await fetch(
      `https://api.github.com/search/repositories?q=${searchValue}&per_page=5`
    ).then((response) => {
      if (response.ok) {
        response.json().then((responce) => {
          responce.items.forEach((repo) => {
            createSearchItem(repo);
          });
        });
      }
    });
  } else {
    clearSearch();
  }
}

function clearSearch() {
  autocomplitBox.innerHTML = " ";
}
function debounce(fn, debounceTime) {
  let timeout;
  return function () {
    const fnCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);

    timeout = setTimeout(fnCall, debounceTime);
  };
}

function createElement(elementTag, elementClass) {
  const element = document.createElement(elementTag);
  if (elementClass) element.classList.add(elementClass);
  return element;
}
function createSearchItem(repoInfo) {
  const item = createElement("li", "item");
  item.textContent = `${repoInfo.name}`;

  autocomplitBox.append(item);

  item.dataset.name = `${repoInfo.name}`;
  item.dataset.owner = `${repoInfo.owner.login}`;
  item.dataset.owner = `${repoInfo.owner.login}`;
  item.dataset.stars = `${repoInfo.stargazers_count}`;

  item.addEventListener("click", () => {
    createInfoBlock(item);
    clearSearch();
    input.value = "";
  });
}

function createInfoBlock(item) {
  const choosedItem = document.createElement("li");

  const button = document.createElement("button");
  button.classList.add("close-btn");

  choosedItem.innerHTML = `<span>Name: ${item.dataset.name}</span><span>Owner: ${item.dataset.owner}</span><span>Stars: ${item.dataset.stars}`;

  const choosed = document.getElementById("choosed");

  choosed.append(choosedItem);
  choosedItem.append(button);

  button.addEventListener("click", () => {
    choosedItem.remove();
  });
}
