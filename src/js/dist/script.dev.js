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
  },
  pk_list: get.id("pokemon_list")
};
var OUTPUT = {
  pokemon: {
    name: get.id("pokemon_name"),
    img: get.id("pokemon_image"),
    types: get.id("pokemon_types"),
    info: get.id("pokemon_info")
  },
  pk_list: get.id("pokemon_list")
};
var NUM_PK_LIST_OBJ = 12;
var menuInfo = [];
var menuInfo_index = 0;
var listInfo = [];

var clearString = function clearString(string) {
  var list_unicode = [/\n/g, /\f/g];
  var cleanStr = string;
  list_unicode.forEach(function (_char) {
    cleanStr = cleanStr.replaceAll(_char, " ");
  });
  return cleanStr;
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
          showData(data = {}, error = true);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getListData = function getListData(main_data_url) {
  var pokemon_list_url;
  return regeneratorRuntime.async(function getListData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {
            pokemon_list_url = [];
            OUTPUT.pk_list.innerHTML = "";
            getPokemonData(main_data_url).then(function (pk) {
              for (var id = pk.id; id < pk.id + NUM_PK_LIST_OBJ; id += 1) {
                pokemon_list_url.push("".concat(API_DATA.url).concat(API_DATA.search.pokemon.main).concat(id));
              }

              pokemon_list_url.forEach(function (url) {
                getPokemonData(url).then(function (pk) {
                  list_data = clearListData(pk);
                  showListData(data = list_data);
                })["catch"](function (e) {
                  return console.error(e);
                });
              });
            })["catch"](function (e) {
              return console.error(e);
            });
          } catch (e) {
            console.error(e);
            showListData(list = [], error = true);
          }

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var clearPokemonData = function clearPokemonData(raw_data) {
  var arr_data = [["name", "name", ["main"]], ["id", "id", ["main"]], ["types", "types", ["main"]], ["sprite", "front_default", ["main", "sprites"]], ["height", "height", ["main"]], ["weight", "weight", ["main"]], ["game", "version", ["main", "game_indices", "0"]], ["stats", "stats", ["main"]], ["color", "color", ["species"]], ["descriptions", "flavor_text_entries", ["species"]]];
  var main_data = {};
  arr_data.forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 3),
        name = _ref4[0],
        key = _ref4[1],
        parent = _ref4[2];

    if (!(key in Object.keys(main_data))) {
      var value = searchInObj(raw_data, key, parent);
      main_data["".concat(name)] = value;
    }
  });
  main_data.types = getListDataInObj(main_data.types, "name", "type", main_data.types.length);
  var stats_names = getListDataInObj(main_data.stats, "name", "stat", main_data.stats.length);
  var stats_values = getListDataInObj(main_data.stats, "base_stat", "index", main_data.stats.length);
  main_data.stats = {};
  stats_names.forEach(function (name, i) {
    if (name.includes("special-") === true) {
      name = name.replaceAll("special-", "S. ");
    }

    main_data.stats["".concat(name)] = stats_values[i];
  });
  main_data.game = searchInObj(main_data.game, "name", "version");
  main_data.color = searchInObj(main_data.color, "name", "color");
  main_data.descriptions = getListDataInObj(main_data.descriptions, "flavor_text", "index", main_data.descriptions.length, function (obj) {
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
  main_data.descriptions.forEach(function (str, i) {
    main_data.descriptions[i] = clearString(str);
  });
  return main_data;
};

var clearListData = function clearListData(raw_data) {
  var arr_data = [["name", "name", ["main"]], ["id", "id", ["main"]], ["types", "types", ["main"]]];
  var main_data = {};
  arr_data.forEach(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 3),
        name = _ref6[0],
        key = _ref6[1],
        parent = _ref6[2];

    if (!(key in Object.keys(main_data))) {
      var value = searchInObj(raw_data, key, parent);
      main_data["".concat(name)] = value;
    }
  });
  main_data.types = getListDataInObj(main_data.types, "name", "type", main_data.types.length);
  return main_data;
};

var showData = function showData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var pokeball_img = "<img src=\"./src/img/pokeball_red.png\" alt=\"\" class=\"pokemon__pokeball\">";

  if (error != true) {
    OUTPUT.pokemon.img.style = "background-image: url(".concat(data.sprite, ")");
    OUTPUT.pokemon.name.innerHTML = pokeball_img + "".concat(data.name);
    OUTPUT.pokemon.types.innerHTML = "";
    data.types.forEach(function (type_name) {
      var type_HTML = "\n      <div class=\"pokemon__type pokemon__type--".concat(type_name, "\">\n        <div class=\"pokemon__type-image\"></div>\n      </div>\n      ");
      OUTPUT.pokemon.types.innerHTML += type_HTML;
    });
    menuInfo = createMenuInfo(data);
    changeMenuInfo();
  } else {
    OUTPUT.pokemon.img.style = "background-image: url('./src/img/pokeball_red.png')";
    OUTPUT.pokemon.name.innerHTML = pokeball_img;
    OUTPUT.pokemon.types.innerHTML = "<div class=\"pokemon__type\"><div class=\"pokemon__type-image\"></div></div>";
    OUTPUT.pokemon.info.innerHTML = "";
  }
};

var showListData = function showListData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (error != true) {
    var type_HTML = "";
    data.types.forEach(function (type_name) {
      type_HTML += "\n        <div class=\"pk__type pk__type--".concat(type_name, "\">\n          <div class=\"pk__type-image\"></div>\n        </div>\n      ");
    });
    var HTML_OBJ = "\n    <div class=\"pk\">\n      ".concat(data.name, "\n      <div class=\"types-wrapper\"> \n        ").concat(type_HTML, "\n      </div>\n    </div>\n    ");
    OUTPUT.pk_list.innerHTML += HTML_OBJ;
  } else {
    OUTPUT.pk_list.innerHTML = "";
  }
};

var createMenuInfo = function createMenuInfo(menu_data) {
  var arr_info = [];
  var HTML_info = "";
  var needed_char = ["color", "game", "height", "id", "weight"];
  HTML_info += "<div class='info__title'>Base Stats</div>";
  Object.entries(menu_data.stats).forEach(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        key = _ref8[0],
        val = _ref8[1];

    HTML_info += "<div class='info__label'>".concat(key, "</div>");
    HTML_info += "<div class='info__text'>".concat(val, "</div>");
  });
  arr_info.push(HTML_info);
  HTML_info = "";
  HTML_info += "<div class='info__title'>Characteristics</div>";
  Object.entries(menu_data).forEach(function (_ref9) {
    var _ref10 = _slicedToArray(_ref9, 2),
        key = _ref10[0],
        val = _ref10[1];

    if (needed_char.indexOf(key) >= 0) {
      HTML_info += "<div class='info__label'>".concat(key, "</div>");
      HTML_info += "<div class='info__text'>".concat(val, "</div>");
    }
  });
  arr_info.push(HTML_info);
  HTML_info = "";
  HTML_info += "<div class='info__title'>Description</div>";
  HTML_info += "<div class='info__paragraph'>".concat(menu_data.descriptions[Math.floor(Math.random() * menu_data.descriptions.length)], "</div>");
  arr_info.push(HTML_info);
  return arr_info;
};

var changeMenuInfo = function changeMenuInfo() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Boolean;

  if (menuInfo.length > 0) {
    if (element === true && menuInfo_index !== menuInfo.length - 1) {
      menuInfo_index += 1;
    } else if (element === false && menuInfo_index !== 0) {
      menuInfo_index -= 1;
    }

    OUTPUT.pokemon.info.innerHTML = menuInfo[menuInfo_index];
  }
};

INPUT.info.r.onclick = function () {
  return changeMenuInfo(true);
};

INPUT.info.l.onclick = function () {
  return changeMenuInfo(false);
};

INPUT.search.btn.onclick = function () {
  var pokemon = INPUT.search.text.value.toLowerCase();
  var api_urls = [];
  var pokemon_data = {};
  listInfo = [];
  menuInfo = [];
  Object.values(API_DATA.search.pokemon).forEach(function (search_type) {
    var url = "".concat(API_DATA.url).concat(search_type).concat(pokemon);
    api_urls.push(url);
  });
  api_urls.forEach(function (url, i) {
    getPokemonData(url).then(function (pk) {
      pokemon_data["".concat(Object.keys(API_DATA.search.pokemon)[i])] = pk;

      if (Object.values(pokemon_data).length === api_urls.length) {
        pokemon_data = clearPokemonData(pokemon_data);
        showData(pokemon_data);
      }
    })["catch"](function (e) {
      return console.log(e);
    });
  });
  getListData(api_urls[0], pokemon_data);
};