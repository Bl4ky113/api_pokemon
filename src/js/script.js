/* Made By Bl4ky113 */

const API_DATA = {
  url: "https://pokeapi.co/api/v2/",
  search: {
    pokemons: "pokemon/",

  }
}

let search_data = ``;

let api_url = `${API_DATA.url}${API_DATA.search.pokemons}${search_data}`;


fetch(api_url)
  .then((data) => {
    if (data.ok) {
      return data.json();  
    } else {
      throw new Error("Error al Conectar con la Api");
    }
  })
  .then ( pokemon => console.log(pokemon) )
  .catch( error => console.error(`Error: ${error}`) );
