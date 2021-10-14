"use strict";

/* Made By Bl4ky113 */
var API_DATA = {
  url: "https://pokeapi.co/api/v2/",
  search: {
    pokemons: "pokemon/",
    species: "pokemon-species/"
  }
};
var search_data = "crobat";
var api_url = "".concat(API_DATA.url).concat(API_DATA.search.pokemons).concat(search_data);

function getPokemonData(data_url) {
  fetch(data_url).then(function (data) {
    if (data.ok) {
      return data.json();
    } else {
      throw new Error("Error al Conectar con la Api");
    }
  }).then(function (pokemon) {
    return console.log(pokemon);
  })["catch"](function (error) {
    return console.error("Error: ".concat(error));
  });
}