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

const searchInObj = (obj, needed_key, parent_key) => {
  let needed_value = undefined;
  if (typeof obj === "object") {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === needed_key) {
        needed_value = value;
      } else if (key === parent_key && typeof value === "object") {
        needed_value = searchInObj(value, needed_key, parent_key);
      }
    });
  }
  return needed_value;
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
  const arr_data = [
    ["name", "main"], 
    ["id", "main"], 
    ["types", "main"], 
    ["sprites", "main"], 
    ["height", "main"], 
    ["weight", "main"], 
    ["game_indices", "main"], 
    ["stats", "main"],
    ["color", "species"],
    ["flavor_text_entries", "species"]
  ];
  let main_data = {};

  arr_data.forEach(([key, parent]) => {
    if ( !(key in Object.keys(main_data)) ) {
      value = searchInObj(raw_data, key, parent);
      main_data[`${key}`] = value;
      console.log(main_data);
    }
  });
  console.log(main_data, "final");
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