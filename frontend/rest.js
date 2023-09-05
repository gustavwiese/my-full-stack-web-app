"use strict";

import { displayArtists, addGenreToOutput, removeGenreToOutput, displayFavorites } from "./app.js";

let selectedArtist;
let globalArtists;

const endpoint = "http://localhost:1989";

async function readArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  const artists = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
  return artists;
}
// CREATE
async function createArtist(event) {
  event.preventDefault();
  console.log("Opret bruger");

  const form = event.target;
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const label = form.label.value;
  const website = form.website.value;
  const genres = form.genre.textContent;
  const shortDescription = form.description.value;
  const image = form.image.value;
  const favorite = false;

  const newArtist = {
    name,
    birthdate,
    activeSince,
    label,
    website,
    genres,
    shortDescription,
    image,
    favorite,
  };

  const artistAsJson = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: artistAsJson,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    updateArtistsGrid();

    scrollToTop();
  }
}

// UPDATE
function selectArtist(artist) {
  document.querySelector("#dialog-update-artist").showModal();

  console.log(artist);
  selectedArtist = artist;

  const form = document.querySelector("#form-edit-artist");

  form.name.value = artist.name;
  form.birthdate.value = artist.birthdate;
  form.activeSince.value = artist.activeSince;
  form.label.value = artist.label;
  form.website.value = artist.website;
  form.genres.value = artist.genres;
  document.querySelector("#genre-output-edit").textContent = artist.genres;
  form.description.value = artist.shortDescription;
  form.image.value = artist.image;

  document
    .querySelector("#extra-genre-btn-edit")
    .addEventListener("click", () =>
      addGenreToOutput(document.querySelector("#edit-genres"), document.querySelector("#genre-output-edit"))
    );
  document
    .querySelector("#remove-genre-btn-edit")
    .addEventListener("click", () => removeGenreToOutput(document.querySelector("#genre-output-edit")));

  document.querySelector("#form-edit-artist").addEventListener("submit", updateArtist);
}

async function updateArtist(event) {
  console.log(event);
  event.preventDefault();

  const form = event.target;

  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const label = form.label.value;
  const website = form.website.value;
  const genres = form.genreOutput.textContent;
  const shortDescription = form.description.value;
  const image = form.image.value;

  const artistToUpdate = {
    name,
    birthdate,
    activeSince,
    label,
    website,
    genres,
    shortDescription,
    image,
  };
  const artistAsJson = JSON.stringify(artistToUpdate);
  const response = await fetch(`${endpoint}/artists/${selectedArtist.id}`, {
    method: "PUT",
    body: artistAsJson,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    updateArtistsGrid();
    scrollToTop();
  }
}

async function updateArtistFavorite(artist) {
  console.log(artist);

  const name = artist.name;
  const birthdate = artist.birthdate;
  const activeSince = artist.activeSince;
  const label = artist.label;
  const website = artist.website;
  const genres = artist.genres;
  const shortDescription = artist.shortDescription;
  const image = artist.image;
  const favorite = artist.favorite;

  const artistToUpdate = {
    name,
    birthdate,
    activeSince,
    label,
    website,
    genres,
    shortDescription,
    image,
    favorite,
  };
  const artistAsJson = JSON.stringify(artistToUpdate);
  const response = await fetch(`${endpoint}/artists/${artist.id}`, {
    method: "PUT",
    body: artistAsJson,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    updateArtistsGrid();
    scrollToTop();
  }
}

// DELETE

async function deleteArtist(id) {
  console.log(id);
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    updateArtistsGrid();
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updateArtistsGrid() {
  const artists = await readArtists();
  globalArtists = artists;
  // const filteredList = filterList(artists);
  displayArtists(artists);
  displayFavorites(artists.filter((artist) => artist.favorite == true));
}

export { updateArtistsGrid, createArtist, deleteArtist, selectArtist, updateArtistFavorite, globalArtists };
