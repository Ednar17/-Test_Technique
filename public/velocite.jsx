import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { Map, Marker, Popup, TileLayer, L } from 'react-leaflet';

const { useState, useEffect } = React;
const { Map, Marker, Popup, TileLayer, L } = require('react-leaflet');

const MapPage = () => {
  let mapContainer = React.createRef();

  useEffect(() => {
    let mymap = L.map(mapContainer.current, { 
      center: [47.2364, 5.987499], 
      zoom: 13 
    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { 
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mymap);

    // Stocker les données de contact
    let contacts = [
      { name: 'Contact 1', description: "salut valeur de test1" , type : "Entreprise" },
      { name: 'Contact 2', description: "salut valeur de test2" , type : "Entreprise" },
      { name: 'Contact 3', description: "salut valeur de test3" , type : "Entreprise" }
    ];

    // Fonction qui affiche la fiche d'un contact
    const displayContact = contact => {
      console.log(`Name: ${contact.name}`);
      console.log(`Description: ${contact.description}`);
      console.log(`Type: ${contact.type}`);
    };

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

    // Ajouter les données de contact au tableau
    contacts.forEach(contact => {
      let tr = document.createElement('tr');
      let nameCell = document.createElement('td');
      nameCell.classList.add("border", "text-center", "px-4", "py-2");
      nameCell.textContent = contact.name;
      tr.appendChild(nameCell);
      tbody.appendChild(tr);

        // Ajouter un marqueur sur la carte pour chaque contact
        let lat = getRandomArbitrary(47, 48);
        let lng = getRandomArbitrary(5, 6);
        let marker = L.marker([lat, lng]).addTo(mymap);
      
        // Ajouter un écouteur d'événement pour ouvrir la fiche de contact lorsque le marqueur est cliqué
        marker.on('click', function() {
          displayContact(contact);
        });
      });
      
      table.appendChild(tbody);
      
      // Ajouter le tableau à la page
      document.querySelector("#contact-list").appendChild(table);
      }, []);
      
      };
      module.exports = MapPage;
        