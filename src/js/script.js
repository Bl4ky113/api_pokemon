/* Made By Bl4ky113 */

const API_DATA = {
  url: "https://pokeapi.co/api/v2/",
  search: {
    pokemon: {
      main: "pokemon/", 
      species: "pokemon-species/"
    }
  }
}

const get = {
  id: document.getElementById.bind(document),
  class: document.getElementsByClassName.bind(document)
}

let INPUT = {
  search: {
    text: get.id("search_txt"),
    btn: get.id("search_btn")
  },
  info: {
    r: get.id("info_r-btn"),
    l: get.id("info_l-btn")
  },
  pk_list: get.id("pokemon_list")
}

let OUTPUT = {
  pokemon: {
    name: get.id("pokemon_name"),
    img: get.id("pokemon_image"),
    types: get.id("pokemon_types"),
    info: get.id("pokemon_info")
  },
  pk_list: get.id("pokemon_list")
}

const NUM_PK_LIST_OBJ = 10;

let menuInfo = [];
let menuInfo_index = 0;
let listInfo = [];

const clearString = (string) => {
  let list_unicode = [/\n/g, /\f/g];
  let cleanStr = string;

  list_unicode.forEach(char => {
    cleanStr = cleanStr.replaceAll(char, " ");
  });

  return cleanStr;
}

const searchInObj = (obj, needed_key, parent_key, obj_conditional = (obj) => true) => {
  let needed_value = undefined;
  
  if (typeof obj === "object") {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === needed_key && obj_conditional(obj) === true) {
        needed_value = value;
      } else if (parent_key.indexOf(key) >= 0 && typeof value === "object") {
        needed_value = searchInObj(value, needed_key, parent_key, obj_conditional=obj_conditional);
      }
    });
  }
  return needed_value;
}

const getListDataInObj = (obj, needed_key, parent_key, num_list, conditional = (obj) => true) => {
  let arr_data = [];
  
  for (let i = 0; i < num_list; i += 1) {
    let data;
    if (parent_key === "index") {
      data = searchInObj(obj, needed_key, `${i}`, obj_conditional=conditional);
    } else {
      data = searchInObj(obj[i], needed_key, parent_key, obj_conditional=conditional);
    }

    if (data != undefined) {
      arr_data.push(data);
    }
  }

  return arr_data;
}

const getPokemonData = async (data_url) => {
  try {
    let api_response = await fetch(data_url);

    if (!api_response.ok) { throw new Error(`Conection Errror: ${api_response.status}`) }

    return api_response.json();

  } catch (e) {
    console.error(e);
    showData(data={}, error=true);
  }
}

const getListData = async (main_data_url) => {
  try {
    let pokemon_list_url = [];
    OUTPUT.pk_list.innerHTML = "";
    OUTPUT.pk_list.style = `grid-template-rows: repeat(${NUM_PK_LIST_OBJ}, 1fr)`;

    getPokemonData(main_data_url)
      .then(pk => {
        for (let id = pk.id; id < (pk.id + NUM_PK_LIST_OBJ); id += 1) {
          pokemon_list_url.push(`${API_DATA.url}${API_DATA.search.pokemon.main}${id}`);
        }

        pokemon_list_url.forEach(url => {
          getPokemonData(url)
            .then(pk => {
              list_data = clearListData(pk);

              showListData(data=list_data);
            }).catch(e => console.error(e));
        });
      }).catch(e => console.error(e));
  } catch (e) {
    console.error(e);
    showListData(list=[], error=true);
  }
}

const clearPokemonData = (raw_data) => {
  const arr_data = [
    ["name", "name", ["main"]],
    ["id", "id", ["main"]],
    ["types", "types", ["main"]], 
    ["sprite", "front_default", ["main", "sprites"]], 
    ["height", "height", ["main"]],
    ["weight", "weight", ["main"]],
    ["game", "version", ["main", "game_indices", "0"]],
    ["stats", "stats", ["main"]],
    ["color", "color", ["species"]],
    ["descriptions", "flavor_text_entries", ["species"]]
  ];
  let main_data = {};

  arr_data.forEach(([name, key, parent]) => {
    if ( !(key in Object.keys(main_data)) ) {
      let value = searchInObj(raw_data, key, parent);
      main_data[`${name}`] = value;
    }
  });
  
  main_data.types = getListDataInObj(main_data.types, "name", "type", main_data.types.length);

  let stats_names = getListDataInObj(main_data.stats, "name", "stat", main_data.stats.length);
  const stats_values = getListDataInObj(main_data.stats, "base_stat", "index", main_data.stats.length);

  main_data.stats = {};
  stats_names.forEach((name, i) => {
    if (name.includes("special-") === true) { name = name.replaceAll("special-", "S. "); }
    main_data.stats[`${name}`] = stats_values[i];
  });

  main_data.game = searchInObj(main_data.game, "name", "version");
  main_data.color = searchInObj(main_data.color, "name", "color");

  main_data.descriptions = getListDataInObj(main_data.descriptions, "flavor_text", "index", main_data.descriptions.length, 
  (obj) => {
    try { if (obj.language.name === "en") { return true; } else { return false; } } 
      catch { return false; }
  });

  main_data.descriptions.forEach((str, i) => {
    main_data.descriptions[i] = clearString(str);
  });

  return main_data;
}

const clearListData = (raw_data) => {
  const arr_data = [
    ["name", "name", ["main"]],
    ["id", "id", ["main"]],
    ["types", "types", ["main"]]
  ];
  let main_data = {};

  arr_data.forEach(([name, key, parent]) => {
    if ( !(key in Object.keys(main_data)) ) {
      let value = searchInObj(raw_data, key, parent);
      main_data[`${name}`] = value;
    }
  });

  main_data.types = getListDataInObj(main_data.types, "name", "type", main_data.types.length);

  return main_data;
}

const showData = (data={}, error=false) => {
  const pokeball_img = `<img src="./src/img/pokeball_red.png" alt="" class="pokemon__pokeball">`;

  if (error != true) {
    OUTPUT.pokemon.img.style = `background-image: url(${data.sprite})`;
    OUTPUT.pokemon.name.innerHTML = pokeball_img + `${data.name}`;
    
    OUTPUT.pokemon.types.innerHTML = "";
    data.types.forEach(type_name => {
      let type_HTML = `
      <div class="pokemon__type pokemon__type--${type_name}">
        <div class="pokemon__type-image"></div>
      </div>
      `;

      OUTPUT.pokemon.types.innerHTML += type_HTML;
    });
    
    menuInfo = createMenuInfo(data);
    changeMenuInfo();
    
  } else {
    OUTPUT.pokemon.img.style = `background-image: url('./src/img/pokeball_red.png')`;
    OUTPUT.pokemon.name.innerHTML = pokeball_img;
    OUTPUT.pokemon.types.innerHTML = `<div class="pokemon__type"><div class="pokemon__type-image"></div></div>`;
    OUTPUT.pokemon.info.innerHTML = "";
  }
}

const showListData = (data={}, error=false) => {
  if (error != true) {
    let type_HTML = "";
    data.types.forEach(type_name => {
      type_HTML += `
        <div class="pk__type pk__type--${type_name}">
          <div class="pk__type-image"></div>
        </div>
      `;
    });

    let HTML_OBJ = `
    <div class="pk">
      ${data.name}
      <div class="types-wrapper"> 
        ${type_HTML}
      </div>
    </div>
    `;

    OUTPUT.pk_list.innerHTML += HTML_OBJ;

  } else {
    OUTPUT.pk_list.innerHTML = "";
  }
}

const createMenuInfo = (menu_data) => {
  let arr_info = [];
  let HTML_info = "";
  let needed_char = ["color", "game", "height", "id", "weight"];

  HTML_info += `<div class='info__title'>Base Stats</div>`
  Object.entries(menu_data.stats).forEach(([key, val]) => {
    HTML_info += `<div class='info__label'>${key}</div>`;
    HTML_info += `<div class='info__text'>${val}</div>`;
  });
  arr_info.push(HTML_info);

  HTML_info = "";
  HTML_info += `<div class='info__title'>Characteristics</div>`;
  Object.entries(menu_data).forEach(([key, val]) => {
    if (needed_char.indexOf(key) >= 0) {
      HTML_info += `<div class='info__label'>${key}</div>`;
      HTML_info += `<div class='info__text'>${val}</div>`;
    }
  });
  arr_info.push(HTML_info);

  HTML_info = "";
  HTML_info += `<div class='info__title'>Description</div>`;
  HTML_info += `<div class='info__paragraph'>${menu_data.descriptions[Math.floor(Math.random() * menu_data.descriptions.length)]}</div>`;
  arr_info.push(HTML_info);

  return arr_info;
}

const changeMenuInfo = (element=Boolean) => {
  if (menuInfo.length > 0) {
    if (element === true && menuInfo_index !== (menuInfo.length - 1)) { menuInfo_index += 1; }
      else if (element === false && menuInfo_index !== 0) { menuInfo_index -= 1; }

    OUTPUT.pokemon.info.innerHTML = menuInfo[menuInfo_index];
  }
}

INPUT.info.r.onclick = () => changeMenuInfo(true);
INPUT.info.l.onclick = () => changeMenuInfo(false);

INPUT.pk_list.onclick = (e) => {
  if (e.target.className === "pk") {
    let pokemon = e.target.innerText.toLowerCase();
    let api_urls = [];
    let pokemon_data = {};
    listInfo = [];
    menuInfo = [];
    
    Object.values(API_DATA.search.pokemon).forEach(search_type => {
      let url = `${API_DATA.url}${search_type}${pokemon}`;
      api_urls.push(url);
    });

    api_urls.forEach((url, i) => {
      getPokemonData(url)
        .then( pk => { 
            pokemon_data[`${Object.keys(API_DATA.search.pokemon)[i]}`] = pk;
            if (Object.values(pokemon_data).length === api_urls.length) {
              pokemon_data = clearPokemonData(pokemon_data);
              showData(pokemon_data);
            }
        }).catch (e => console.log(e));
    });
    getListData(api_urls[0], pokemon_data);
  }
}

INPUT.search.btn.onclick = () => {
  let pokemon = INPUT.search.text.value.toLowerCase();
  let api_urls = [];
  let pokemon_data = {};
  listInfo = [];
  menuInfo = [];
  
  Object.values(API_DATA.search.pokemon).forEach(search_type => {
    let url = `${API_DATA.url}${search_type}${pokemon}`;
    api_urls.push(url);
  });

  api_urls.forEach((url, i) => {
    getPokemonData(url)
      .then( pk => { 
          pokemon_data[`${Object.keys(API_DATA.search.pokemon)[i]}`] = pk;
          if (Object.values(pokemon_data).length === api_urls.length) {
            pokemon_data = clearPokemonData(pokemon_data);
            showData(pokemon_data);
          }
      }).catch (e => console.log(e));
  });
  getListData(api_urls[0], pokemon_data);
}