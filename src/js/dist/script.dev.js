"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var searchInObj = function searchInObj(obj, needed_key, parent_key) {
  var obj_conditional = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (obj) {
    return true;
  };
  var needed_value = undefined;

  if (_typeof(obj) === "object") {
    Object.entries(obj).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      if (key === needed_key && obj_conditional(obj) === true) {
        needed_value = value;
      } else if (parent_key.indexOf(key) >= 0 && _typeof(value) === "object") {
        needed_value = searchInObj(value, needed_key, parent_key, obj_conditional = obj_conditional);
      }
    });
  }

  return needed_value;
};

var getListDataInObj = function getListDataInObj(obj, needed_key, parent_key, num_list) {
  var conditional = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function (obj) {
    return true;
  };
  var arr_data = [];

  for (var i = 0; i < num_list; i += 1) {
    var _data = void 0;

    if (parent_key === "index") {
      _data = searchInObj(obj, needed_key, "".concat(i), obj_conditional = conditional);
    } else {
      _data = searchInObj(obj[i], needed_key, parent_key, obj_conditional = conditional);
    }

    if (_data != undefined) {
      arr_data.push(_data);
    }
  }

  return arr_data;
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

var clearPokemonData = function clearPokemonData(raw_data) {
  var data_final_keys = ["name", "id", "types", "sprite", "height", "weight", "game", "stats", "color", "description"];
  var arr_data = [["name", ["main"]], ["id", ["main"]], ["types", ["main"]], ["front_default", ["main", "sprites"]], ["height", ["main"]], ["weight", ["main"]], ["version", ["main", "game_indices", "0"]], ["stats", ["main"]], ["color", ["species"]], ["flavor_text_entries", ["species"]]];
  var main_data = {};
  arr_data.forEach(function (_ref3, i) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        parent = _ref4[1];

    if (!(key in Object.keys(main_data))) {
      var value = searchInObj(raw_data, key, parent);
      main_data["".concat(data_final_keys[i])] = value;
    }
  });
  main_data.types = getListDataInObj(main_data.types, "name", "type", main_data.types.length);
  var stats_names = getListDataInObj(main_data.stats, "name", "stat", main_data.stats.length);
  var stats_values = getListDataInObj(main_data.stats, "base_stat", "index", main_data.stats.length);
  main_data.stats = {};
  stats_names.forEach(function (name, i) {
    main_data.stats["".concat(name)] = stats_values[i];
  });
  main_data.game = searchInObj(main_data.game, "name", "version");
  main_data.color = searchInObj(main_data.color, "name", "color");
  main_data.description = getListDataInObj(main_data.description, "flavor_text", "index", main_data.description.length, function (obj) {
    try {
      if (obj.language.name === "en") {
        return true;
      } else {
        return false;
      }
    } catch (_unused) {
      return false;
    }
  });
  console.log(main_data);
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

      if (Object.values(pokemon_data).length === api_urls.length) {
        pokemon_data = clearPokemonData(pokemon_data);
      }
    });
  });
};