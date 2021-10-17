"use strict";

/* Made By Bl4ky113 */
var API_DATA = {
  url: "https://pokeapi.co/api/v2/",
  search: {
    pokemon: {
      main: "pokemon/",
      species: "pokemon-species/"
    }
  }
};
var get = {
  id: document.getElementById.bind(document),
  "class": document.getElementsByClassName.bind(document)
};
var INPUT = {
  search: {
    text: get.id("search_txt"),
    btn: get.id("search_btn")
  },
  info: {
    r: get.id("info_r-btn"),
    l: get.id("info_l-btn")
  } // Pk list objs as well, but those are DOM generated

};
var OUTPUT = {
  pokemon: {
    name: get.id("pokemon_name"),
    img: get.id("pokemon_image"),
    types: get.id("pokemon_types")
  },
  pk_list: get.id("pokemon_list")
};

var getPokemonData = function getPokemonData(data_url) {
  var api_response;
  return regeneratorRuntime.async(function getPokemonData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(data_url));

        case 3:
          api_response = _context.sent;

          if (api_response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error("Conection Errror: ".concat(api_response.status));

        case 6:
          return _context.abrupt("return", api_response.json());

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          showData(error = true);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var clearPokemonData = function clearPokemonData(raw_data, num_obj) {
  var main_data = {
    name: "",
    id: 0,
    types: [],
    img_src: "",
    general: {
      color: "",
      height: 0,
      weight: 0,
      game: ""
    },
    stats: {
      hp: 0,
      attack: 0,
      defense: 0,
      special_attack: 0,
      special_defense: 0,
      speed: 0
    }
  };
};

var showData = function showData() {
  var error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  console.log("show error");
};

INPUT.search.btn.onclick = function () {
  var pokemon = INPUT.search.text.value.toLowerCase();
  var api_urls = [];
  var pokemon_data = {};
  Object.values(API_DATA.search.pokemon).forEach(function (search_type) {
    var url = "".concat(API_DATA.url).concat(search_type).concat(pokemon);
    api_urls.push(url);
  });
  api_urls.forEach(function (url, i) {
    data = getPokemonData(url).then(function (pk) {
      pokemon_data["".concat(Object.keys(API_DATA.search.pokemon)[i])] = pk;

      if (Object.values(pokemon_data).length == api_urls.length) {
        pokemon_data = clearPokemonData(pokemon_data);
      }
    });
  });
};