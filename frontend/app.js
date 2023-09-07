"use strict";

import {
  updateArtistsGrid,
  deleteArtist,
  selectArtist,
  createArtist,
  updateArtistFavorite,
  globalArtists,
} from "./rest.js";

// import { updateFavoritesGrid, displayFavorites } from "./favorites.js";

let sortType = "default";
let filterOption;

window.addEventListener("load", initApp);

async function initApp() {
  console.log("js is working");
  eventListeners();
  updateArtistsGrid();
}
function eventListeners() {
  document.querySelector("#create-artist-btn").addEventListener("click", showCreateUserDialog);
  document.querySelector("#form-create-artist").addEventListener("submit", createArtist);

  document
    .querySelector("#extra-genre-btn-create")
    .addEventListener("click", () =>
      addGenreToOutput(document.querySelector("#create-genres"), document.querySelector("#genre-output-create"))
    );
  document
    .querySelector("#remove-genre-btn-create")
    .addEventListener("click", () => removeGenreToOutput(document.querySelector("#genre-output-create")));
  document.querySelector("#filterByGenre").addEventListener("change", genreSelected);

  document.querySelector("#sortBy").addEventListener("change", sortSelected);
}

async function genreSelected(event) {
  const select = event.target.value;

  displayArtists(filterByGenre(globalArtists, select));
}

function filterByGenre(list, filterSelected) {
  return list.filter((artist) => artist.genres.includes(filterSelected));
}

function sortSelected(event) {
  const selectedType = event.target.value;
  sortType = selectedType;
  if (sortType == "reverse") {
    displayArtists(globalArtists.sort((a, b) => b.name.localeCompare(a.name)));
  }
  if (sortType == "default") {
    displayArtists(globalArtists.sort((a, b) => a.name.localeCompare(b.name)));
  }
}

function showCreateUserDialog() {
  document.querySelector("#dialog-create-artist").showModal();
}

function displayArtists(list) {
  document.querySelector("#artists-grid").innerHTML = "";
  for (const artist of list) {
    document.querySelector("#artists-grid").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
            <article class="grid-item-user">
            <img src="${artist.image}">
                <h2>${artist.name}</h2>
                <h3>${artist.shortDescription}</h3>
                <p>Born: ${artist.birthdate}</p>
                <p>Career start: ${artist.activeSince}</p>
                <p>Genres: ${artist.genres} </p>
                <p>Label: ${artist.label}</p>
                <a href="${artist.website}">Artist website</a>
    
                <div class="btns">
                    <button class="btn-update">edit</button>
                    <button class="btn-delete">delete</button>
                    <button class="btn-favorite">add to favorites</button>
                </div> 
            </article>
        `
    );
    document
      .querySelector("#artists-grid article:last-child .btn-update")
      .addEventListener("click", () => selectArtist(artist));

    document
      .querySelector("#artists-grid article:last-child .btn-delete")
      .addEventListener("click", () => deleteClicked(artist));

    document
      .querySelector("#artists-grid article:last-child .btn-favorite")
      .addEventListener("click", () => addToFavoritesClicked(artist));
  }
}

function addToFavoritesClicked(artist) {
  artist.favorite = true;
  updateArtistFavorite(artist);

  console.log(artist);

  updateArtistsGrid();
}

function displayFavorites(list) {
  document.querySelector("#favorites").innerHTML = "";

  for (const artist of list) {
    document.querySelector("#favorites").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
            <article class="grid-item-user">
            <img src="${artist.image}">
                <h2>${artist.name}</h2>
                <h3>${artist.shortDescription}</h3>
                <p>Born: ${artist.birthdate}</p>
                <p>Career start: ${artist.activeSince}</p>
                <p>Genres: ${artist.genres} </p>
                <p>Label: ${artist.label}</p>
                <a href="${artist.website}">Artist website</a>

                <div class="btns">
                    <button class="btn-favorite">Remove from favorites</button>
                </div>
            </article>
        `
    );

    document
      .querySelector("#favorites article:last-child .btn-favorite")
      .addEventListener("click", () => removeFromFavorites(artist));
  }
}

async function removeFromFavorites(artist) {
  artist.favorite = false;
  updateArtistFavorite(artist);

  console.log(artist);

  updateArtistsGrid();
}

function addGenreToOutput(genreSelector, outputSelector) {
  console.log(genreSelector);
  const genreValue = genreSelector.value;
  if (genreValue != "" && outputSelector.textContent.includes(genreValue) == false)
    if (outputSelector.textContent != "") outputSelector.textContent += ", " + genreValue;
    else outputSelector.textContent += genreValue;
}

function removeGenreToOutput(outputSelector) {
  outputSelector.textContent = "";
}

function deleteClicked(artist) {
  console.log("Knappen Virker");
  console.log(artist);
  document.querySelector("#dialog-delete-artist").showModal();
  document.querySelector("#dialog-delete-artist-name").textContent = artist.name;
  document.querySelector("#btn-no").addEventListener("click", function () {
    document.querySelector("#dialog-delete-artist").close();
  });
  document.querySelector("#form-delete-artist").addEventListener("submit", () => deleteArtist(artist.id));
}

export { displayArtists, addGenreToOutput, removeGenreToOutput, displayFavorites };
