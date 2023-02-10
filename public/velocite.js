document.addEventListener("DOMContentLoaded", async function(e) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZWRuYXIiLCJhIjoiY2xkb3NxNWJsMDNzYTN4bHA5cWRpeXJydyJ9.gdvpAxSofXv20G23728SrA';
  const mymap = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, 
  });
    // Stocker les données de contact
    let contacts = [
      { name: 'Contact 1', description: "salut valeur de test1" , type : "Entreprise" },
      { name: 'Contact 2', description: "salut valeur de test2" , type : "Entreprise" },
      { name: 'Contact 3', description: "salut valeur de test3" , type : "Entreprise" }
    ];
    let markers = [];
 // Stocker les données de contact
 const displayContact = contact => {
  let contactName = document.getElementById("contactName");
  let contactDescription = document.getElementById("contactDescription");
  let contactType = document.getElementById("contactType");

  if (contactName) {
    contactName.value = contact.name;
  }

  if (contactDescription) {
    contactDescription.value = contact.description;
  }

  if (contactType) {
    contactType.value = contact.type;
  }
};
// Fonction qui affiche la fiche d'un contact
// Positionnement random sur la map 
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
// Créer un tableau pour afficher les données de contact
let table = document.querySelector("#contacts-table");
table.classList.add("table");
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');

// Ajouter les en-têtes de colonne au tableau
let headers = ['Contacts'];
let headerRow = document.createElement('tr');
headers.forEach(header => {
  let th = document.createElement('th');
  th.classList.add("border", "text-center", "px-4", "py-2");
  th.textContent = header;
  headerRow.appendChild(th);
});
thead.appendChild(headerRow);
table.appendChild(thead);
document.querySelector("#form1").style.display = "none";
// Ajouter les données de contact au tableau
contacts.forEach(contact => {
  let tr = document.createElement('tr');
  let nameCell = document.createElement('td');
  nameCell.classList.add("border", "px-4", "py-2");
  nameCell.textContent = contact.name;
  nameCell.addEventListener("click" , function(){
    document.querySelector("#nom1").value = contact.name;
    document.querySelector("#description1").value = contact.description;
    document.querySelector("#type1").value = contact.type;
    document.querySelector("#form1").style.display = "block";
  });
  tr.appendChild(nameCell);
  tbody.appendChild(tr);
});

document.querySelector(".btnClose1").addEventListener("click", function() {
  document.querySelector("#form1").style.display = "none";
});

table.appendChild(tbody);

// Ajouter le tableau à la colonne de droite
document.querySelector('#contact-list').appendChild(table);


function checkFormDisplay() {
let form = document.querySelector("#form");
let computedStyle = window.getComputedStyle(form);
if (computedStyle.display === "block") {
  document.querySelector("#btnAjouter").addEventListener("click", function() {
    let nameInput = document.querySelector("#nom");
    let name = nameInput.value;
    let descInput = document.querySelector("#description");
    let description = descInput.value;
    let typeInput = document.querySelector("#type");
    let type = typeInput.value;
    let newContact = { name: name, description: description, type: type };
    contacts.push(newContact.name);

      // Mettre à jour le tableau
      let tr = document.createElement('tr');
      let nameCell = document.createElement('td');
      nameCell.classList.add("border", "px-4", "py-2");
      nameCell.textContent = newContact.name;
      tr.appendChild(nameCell);
      tbody.appendChild(tr);

      // Ajouter un marqueur pour le nouveau contact
      let lat = 0;
      let lng = 0;
      if (newContact.lat && newContact.lng) {
          lat = newContact.lat;
          lng = newContact.lng;
      } else {
          let randomLat = getRandomArbitrary(-73.2364, -74.2864);
          let randomLng = getRandomArbitrary(30.987499, 40.037499);
          lat = randomLat;
          lng = randomLng;
      }
      document.querySelector("#form").style.display = "";
      new mapboxgl.Marker({ color: 'red' })
      .setLngLat([randomLat, randomLng])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(contact.name + '<br>' + contact.description + '<br>' + contact.type))
      .addTo(mymap)
      .getElement().on('click', () => {
        document.querySelector("#form").style.display = "none";
      });
     
      

      // Vider les champs du formulaire
      nameInput.value = '';
      descInput.value = '';
      });
  }
}
// Ajouter un bouton "Ajouter" pour lancer un formulaire d'ajout de contact

let addButton = document.createElement("button");
addButton.textContent = "Ajouter";
addButton.classList.add("btn", "btn-primary", "d-flex", "mx-auto", "my-3");
addButton.style.width = "100px";
addButton.style.backgroundColor = "blue";
addButton.addEventListener("click", function() {
  document.querySelector("#form").style.display = "block";
  checkFormDisplay();
});
document.querySelector("#contact-list").appendChild(addButton);
//  Fermeture du formulaire 
document.querySelector(".btnClose").addEventListener("click",function(){
document.querySelector("#form").style.display = "";
});
//Positon random des contacts 
  contacts.forEach(contact => {
      let randomLat = Math.random() * -5 + -74;
      let randomLng = Math.random() * 0.05 + 40;
      new mapboxgl.Marker({ color: 'red' })
      .setLngLat([randomLat, randomLng])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(contact.name + '<br>' + contact.description + '<br>' + contact.type))
      .addTo(mymap)
      .getElement().addEventListener('click', () => {
        //block Formulaire 
      });
      
      
      
});
      //Ecouteur sur la map 
      mymap.on('click', function(e) {

          let latlng = e.lngLat;
          let lat = latlng.lat;
          let lng = latlng.lng;
          document.querySelector("#form").style.display = "block";
          document.querySelector("#btnAjouter").addEventListener("click", function() {
              let nameInput = document.querySelector("#nom");
              let name = nameInput.value;
              let descInput = document.querySelector("#description");
              let description = descInput.value;
              let typeInput = document.querySelector("#type");
              let type = typeInput.value;
              let newContact = { name: name, description: description, type: type };
              contacts.push(newContact.name);
      
              // Mettre à jour le tableau
              let tr = document.createElement('tr');
              let nameCell = document.createElement('td');
              nameCell.classList.add("border", "px-4", "py-2");
              nameCell.textContent = newContact.name;
              nameCell.addEventListener("click" , function(){
                document.querySelector("#nom1").value = newContact.name;
                document.querySelector("#description1").value = newContact.description;
                document.querySelector("#type1").value = newContact.type;
                document.querySelector("#form1").style.display = "block";
              });
              tr.appendChild(nameCell);
              tbody.appendChild(tr);
              document.querySelector("#form").style.display = "";
              // Ajouter un marqueur pour le nouveau contact
              new mapboxgl.Marker({ color: 'red' })
              .setLngLat([lng, lat])
              .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(newContact.name + '<br>' + newContact.description + '<br>' + newContact.type))
              .addTo(mymap)
              .getElement().addEventListener('click', () => {
                document.querySelector("#form").style.display = "none";
              });
             
              
              // Vider les champs du formulaire
              nameInput.value = '';
              descInput = ''
              document.querySelector("#form").style.display = "";
          
          })
      })
    });