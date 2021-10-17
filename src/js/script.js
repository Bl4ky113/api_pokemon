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

const clearPokemonData = (raw_data, num_obj) => {
  let main_data = {
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
        if (Object.values(pokemon_data).length == api_urls.length) {
          pokemon_data = clearPokemonData(pokemon_data);
        }
      }
    );
  });
}