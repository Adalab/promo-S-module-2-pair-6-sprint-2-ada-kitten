"use strict";

/* Elementos que usamos en el HTML */
const newFormElement = document.querySelector(".js-new-form");
const listElement = document.querySelector(".js-list");
const searchButton = document.querySelector(".js-button-search");
const buttonAdd = document.querySelector(".js-btn-add");
const buttonCancelForm = document.querySelector(".js-btn-cancel");
const inputDesc = document.querySelector(".js-input-desc");
const inputPhoto = document.querySelector(".js-input-photo");
const inputName = document.querySelector(".js-input-name");
const inputRace = document.querySelector(".js-input-race");
const linkNewFormElememt = document.querySelector(".js-button-new-form");
const labelMessageError = document.querySelector(".js-label-error");
const input_search_desc = document.querySelector(".js_in_search_desc");
const input_search_race = document.querySelector(".js_in_search_race");
//variables para almacenar el usuario de Github y la url para hacer petición al servidor
const GITHUB_USER = "raquelgm88";
const SERVER_URL = `https://dev.adalab.es/api/kittens/${GITHUB_USER}`;
// variable para almacenar la información de la API en localStorage.
const kittenListStored = JSON.parse(localStorage.getItem("kittensList"));

//Objetos con cada gatito
const kittenData_1 = {
  image: "https://dev.adalab.es/gato-siames.webp",
  name: "Anastacio",
  desc: "Porte elegante, su patrón de color tan característico y sus ojos de un azul intenso, pero su historia se remonta a Asía al menos hace 500 años, donde tuvo su origen muy posiblemente.",
  race: "Siamés",
};
const kittenData_2 = {
  image: "https://dev.adalab.es/sphynx-gato.webp",
  name: "Fiona",
  desc: "Produce fascinación y curiosidad. Exótico, raro, bello, extraño… hasta con pinta de alienígena han llegado a definir a esta raza gatuna que se caracteriza por la «ausencia» de pelo.",
  race: "Sphynx",
};
const kittenData_3 = {
  image: "https://dev.adalab.es/maine-coon-cat.webp",
  name: "Cielo",
  desc: " Tienen la cabeza cuadrada y los ojos simétricos, por lo que su bella mirada se ha convertido en una de sus señas de identidad. Sus ojos son grandes y las orejas resultan largas y en punta.",
  race: "Maine Coon",
};

let kittenDataList = [];

//Funciones
function renderKitten(kittenData) {
  /*const kitten = `<li class="card">
    <article>
      <img
        class="card_img"
        src=${kittenData.image}
        alt="gatito"
      />
      <h3 class="card_title">${kittenData.name}</h3>
      <h3 class="card_race">${kittenData.race}</h3>
      <p class="card_description">
      ${kittenData.desc}
      </p>
    </article>
    </li>`;*/

  const liElement = document.createElement('li');
  liElement.setAttribute('class', 'card');
  listElement.appendChild(liElement);
  
  
  const artElement = document.createElement('article');
  liElement.appendChild(artElement);
  
  const imgElement = document.createElement('img');
  imgElement.setAttribute('class', 'card_img');
  imgElement.setAttribute('src', kittenData.image);
  imgElement.setAttribute('alt', 'gatito');
  artElement.appendChild(imgElement);
  
  const h3Title = document.createElement('h3');
  h3Title.setAttribute('class', 'card_title');
  const h3TitleText = document.createTextNode(kittenData.name);
  artElement.appendChild(h3Title);
  h3Title.appendChild(h3TitleText);
  
  const h3Race = document.createElement('h3');
  h3Race.setAttribute('class', 'card_race');
  const h3RaceText = document.createTextNode(kittenData.race);
  artElement.appendChild(h3Race);
  h3Race.appendChild(h3RaceText);
  
  const pElement = document.createElement('p');
  pElement.setAttribute('class', 'card_description');
  const pElementText = document.createTextNode(kittenData.desc);
  artElement.appendChild(pElement);
  pElement.appendChild(pElementText);
    
  return kitten;
}

function renderKittenList(kittenDataList) {
  listElement.innerHTML = "";
  for (const kittenItem of kittenDataList) {
    listElement.innerHTML += renderKitten(kittenItem);
  }
}
//petición al servidor de los datos de los gatitos
if (kittenListStored) {
  kittenDataList = kittenListStored;
  renderKittenList(kittenDataList);
} else {
  fetch(SERVER_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      kittenDataList = data.results;
      renderKittenList(kittenDataList);
      localStorage.setItem("kittensList", JSON.stringify(kittenDataList));
    });
}

//Mostrar/ocultar el formulario
function showNewCatForm() {
  newFormElement.classList.remove("collapsed");
}
function hideNewCatForm() {
  newFormElement.classList.add("collapsed");
}

function handleClickNewCatForm(event) {
  event.preventDefault();
  if (newFormElement.classList.contains("collapsed")) {
    showNewCatForm();
  } else {
    hideNewCatForm();
  }
}
//Adicionar nuevo gatito
function addNewKitten(event) {
  event.preventDefault();

  //obtener la información de los gatitos del formulario
  const valueDesc = inputDesc.value;
  const valuePhoto = inputPhoto.value;
  const valueName = inputName.value;
  const valueRace = inputRace.value;

  // Crea un nuevo objeto para el gatito
  const newKittenDataObject = {
    image: valuePhoto,
    name: valueName,
    desc: valueDesc,
    race: valueRace,
  };

  // Agregar nuevo gatito al array de kittenDataList

  fetch(`https://dev.adalab.es/api/kittens/${GITHUB_USER}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newKittenDataObject),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        //Agrega el nuevo gatito al listado
        kittenDataList.push(newKittenDataObject);
        //Guarda el listado actualizado en el local storage
        localStorage.setItem("kittensList", JSON.stringify(kittenDataList));
        // Pinta de nuevo la lista de gatitos, incluyendo el nuevo
        renderKittenList(kittenDataList);

        //Limpia los inputs del form
        inputDesc.value = "";
        inputPhoto.value = "";
        inputName.value = "";
        inputRace.value = "";
        // Envía mensaje para el nuevo gatito
        labelMessageError.innerHTML = "Mola! Un nuevo gatito en Adalab!";
      } else {
        //muestra un mensaje de error.
        if (valueDesc === "" && valuePhoto === "" && valueName === "") {
          labelMessageError.innerHTML = "¡Uy! parece que has olvidado algo";
        } else {
          if (valueDesc !== "" && valuePhoto !== "" && valueName !== "") {
            labelMessageError.innerHTML = "";
          }
        }
      }
    });
}

//Cancelar la búsqueda de un gatito
function cancelNewKitten(event) {
  event.preventDefault();
  newFormElement.classList.add("collapsed");
  inputDesc.value = "";
  inputPhoto.value = "";
  inputName.value = "";
}

//Filtrar por descripción

function filterKitten(event) {
  event.preventDefault();
  const descrSearchText = input_search_desc.value;
  const raceSearchText = input_search_race.value;

  //Limpiamos la lista de gatitos antes de buscar
  listElement.innerHTML = "";

  //Método para filtrar en el array de la lista de gatos si su descripción o raza coincide con el input
  const filterList = kittenDataList
    .filter((kitten) => kitten.desc.includes(descrSearchText))
    .filter((kitten) => kitten.race === raceSearchText);

  //Imprimir la lista con el filtro
  renderKittenList(filterList);
}

//Mostrar el litado de gatitos en ell HTML
renderKittenList(kittenDataList);

//Eventos
linkNewFormElememt.addEventListener("click", handleClickNewCatForm);
searchButton.addEventListener("click", filterKitten);
buttonAdd.addEventListener("click", addNewKitten);
buttonCancelForm.addEventListener("click", cancelNewKitten);
