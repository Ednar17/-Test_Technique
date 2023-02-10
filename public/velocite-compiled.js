"use strict";

export function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof =
    typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
      ? function (obj) {
          return typeof obj;
        }
      : function (obj) {
          return obj &&
            typeof Symbol === "function" &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? "symbol"
            : typeof obj;
        },
    _typeof(obj);
}
export var _react = _interopRequireWildcard(require("react"));
export var _reactDom = _interopRequireDefault(require("react-dom"));
export var _reactLeaflet = require("react-leaflet");
export function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
export function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(
    nodeInterop
  ) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
export function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (
      key !== "default" &&
      Object.prototype.hasOwnProperty.call(obj, key)
    ) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
(0, _react.useEffect)(function () {
  var mymap = _reactLeaflet.L.map(mapContainer.current, {
    center: [47.2364, 5.987499],
    zoom: 13
  });
  _reactLeaflet.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(mymap);

  // Stocker les données de contact
  var contacts = [{
    name: 'Contact 1',
    description: "salut valeur de test1",
    type: "Entreprise"
  }, {
    name: 'Contact 2',
    description: "salut valeur de test2",
    type: "Entreprise"
  }, {
    name: 'Contact 3',
    description: "salut valeur de test3",
    type: "Entreprise"
  }];

  // Fonction qui affiche la fiche d'un contact
  var displayContact = function displayContact(contact) {
    console.log("Name: ".concat(contact.name));
    console.log("Description: ".concat(contact.description));
    console.log("Type: ".concat(contact.type));
  };

  // Positionnement random sur la map 
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Créer un tableau pour afficher les données de contact
  var table = document.querySelector("#contacts-table");
  table.classList.add("table");
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');

  // Ajouter les en-têtes de colonne au tableau
  var headers = ['Contacts'];
  var headerRow = document.createElement('tr');
  headers.forEach(function (header) {
    var th = document.createElement('th');
    th.classList.add("border", "text-center", "px-4", "py-2");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Ajouter les données de contact au tableau
  contacts.forEach(function (contact) {
    var tr = document.createElement('tr');
    var nameCell = document.createElement('td');
    nameCell.classList.add("border", "px-4", "py-2");
    nameCell.textContent = contact.name;
    tr.appendChild(nameCell);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // Ajouter le tableau à la colonne de droite
  document.querySelector('#contact-list').appendChild(table);

  // Ajouter des marqueurs à la carte pour chaque contact
  var markerIcon = _reactLeaflet.L.icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [30, 30]
  });
  contacts.forEach(function (contact) {
    var randomLat = Math.random() * 0.05 + 47.2364;
    var randomLng = Math.random() * 0.05 + 5.987499;
    _reactLeaflet.L.marker([randomLat, randomLng], {
      icon: markerIcon
    }).addTo(mymap).bindPopup(contact.name);
  });

  //Ecouteur sur la map 
  mymap.on('click', function (e) {
    var latlng = e.latlng;
    var lat = latlng.lat;
    var lng = latlng.lng;
    document.querySelector("#form").style.display = "block";
    document.querySelector("#btnAjouter").addEventListener("click", function () {
      var nameInput = document.querySelector("#nom");
      var name = nameInput.value;
      var newContact = {
        name: name
      };
      contacts.push(newContact);

      // Mettre à jour le tableau
      var tr = document.createElement('tr');
      var nameCell = document.createElement('td');
      nameCell.classList.add("border", "px-4", "py-2");
      nameCell.textContent = newContact.name;
      tr.appendChild(nameCell);
      tbody.appendChild(tr);

      // Ajouter un marqueur pour le nouveau contact
      _reactLeaflet.L.marker([lat, lng], {
        icon: markerIcon
      }).addTo(mymap).bindPopup(newContact.name);

      // Vider les champs du formulaire
      nameInput.value = '';
      document.querySelector("#form").style.display = "none";
    });
  });
  // Événement qui se déclenche lorsqu'on clique sur un contact
  document.addEventListener("click", function (event) {
    // Récupération de l'élément cliqué
    var target = event.target;

    // Vérification si l'élément cliqué correspond à un contact
    var contact = contacts.find(function (contact) {
      return target.textContent === contact.name;
    });
    if (contact) {
      if (confirm("Voulez-vous vraiment supprimer ".concat(contact.name, "?"))) {
        // Suppression du contact du tableau
        var index = contacts.indexOf(contact);
        contacts.splice(index, 1);

        // Suppression du contact de la page HTML
        target.parentNode.remove();
      }
    }
  });
});
