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
  // Pk list objs as well, but those are DOM generated
}

let OUTPUT = {
  pokemon: {
    name: get.id("pokemon_name"),
    img: get.id("pokemon_image"),
    types: get.id("pokemon_types")
  },
  pk_list: get.id("pokemon_list")
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

    return  api_response.json();

  } catch (e) {
    console.error(e);
    showData(error=true);
  }
}

const clearPokemonData = (raw_data) => {
  const data_final_keys = [
    "name",
    "id",
    "types",
    "sprite",
    "height",
    "weight",
    "game",
    "stats",
    "color",
    "description"
  ];
  const arr_data = [
    ["name", ["main"]],
    ["id", ["main"]],
    ["types", ["main"]], 
    ["front_default", ["main", "sprites"]], 
    ["height", ["main"]],
    ["weight", ["main"]],
    ["version", ["main", "game_indices", "0"]],
    ["stats", ["main"]],
    ["color", ["species"]],
    ["flavor_text_entries", ["species"]]
  ];
  let main_data = {};

  arr_data.forEach(([key, parent], i) => {
    if ( !(key in Object.keys(main_data)) ) {
      let value = searchInObj(raw_data, key, parent);
      main_data[`${data_final_keys[i]}`] = value;
    }
  });
  
  main_data.types = getListDataInObj(main_data.types, "name", "type", main_data.types.length);

  const stats_names = getListDataInObj(main_data.stats, "name", "stat", main_data.stats.length);
  const stats_values = getListDataInObj(main_data.stats, "base_stat", "index", main_data.stats.length);

  main_data.stats = {};
  stats_names.forEach((name, i) => {
    main_data.stats[`${name}`] = stats_values[i];
  });

  main_data.game = searchInObj(main_data.game, "name", "version");
  main_data.color = searchInObj(main_data.color, "name", "color");

  main_data.description = getListDataInObj(main_data.description, "flavor_text", "index", main_data.description.length, 
  (obj) => {
    try { if (obj.language.name === "en") { return true; } else { return false; } } 
      catch { return false; }
  });

  console.log(main_data)
}

const showData = (error=false) => {
  console.log("show error");
}

INPUT.search.btn.onclick = () => {
  let pokemon = INPUT.search.text.value.toLowerCase();
  let api_urls = [];
  let pokemon_data = {};
  
  Object.values(API_DATA.search.pokemon).forEach(search_type => {
    let url = `${API_DATA.url}${search_type}${pokemon}`;
    api_urls.push(url);
  });

  api_urls.forEach((url, i) => {
    data = getPokemonData(url).then(
      pk => { 
        pokemon_data[`${Object.keys(API_DATA.search.pokemon)[i]}`] = pk;
        if (Object.values(pokemon_data).length === api_urls.length) {
          pokemon_data = clearPokemonData(pokemon_data);
        }
      }
    );
  });
}