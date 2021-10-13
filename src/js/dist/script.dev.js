"use strict";

/* Made By Bl4ky113 */
var API_DATA = {
  url: "https://pokeapi.co/api/v2/",
  search: {
    pokemons: "pokemon/"
  }
};
var search_data = "";
var api_url = "".concat(API_DATA.url).concat(API_DATA.search.pokemons).concat(search_data);
fetch(api_url).then(function (data) {
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