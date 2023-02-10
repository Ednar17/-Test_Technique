
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

interface Contact {
    name: string;
    description: string;
    type: string;
    lat: number;
    lng: number;
}

function App() {
    const [contacts, setContacts] = useState([
        { name: 'Contact 1', description: "salut valeur de test1", type: "Entreprise", lat: 47.2364, lng: 5.987499 },
        { name: 'Contact 2', description: "salut valeur de test2", type: "Entreprise", lat: 47.2664, lng: 5.957499 },
        { name: 'Contact 3', description: "salut valeur de test3", type: "Entreprise", lat: 47.2464, lng: 5.997499 }
      ]);

  const [center, setCenter] = useState([47.2364, 5.987499]);
  const [zoom, setZoom] = useState(13);

  const displayContact = (contact: Contact) => {
    window.console.log(`Name: ${contact.name}`);
    window.console.log(`Description: ${contact.description}`);
    window.console.log(`Type: ${contact.type}`);
  };

  const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const addContact = (name: string, lat?: number, lng?: number) => {
    let newContact = { name: name, lat: lat, lng: lng };
    setContacts([...contacts, newContact]);
  };

  return (
    <div>
      <MapContainer center={center} zoom={zoom}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
          maxZoom={19}
        />
        {contacts.map(contact => {
          let lat = 0;
          let lng = 0;
          if (contact.lat && contact.lng) {
            lat = contact.lat;
            lng = contact.lng;
          } else {
            let randomLat = getRandomArbitrary(47.2364, 47.2864);
            let randomLng = getRandomArbitrary(5.987499, 6.037499);
            lat = randomLat;
            lng = randomLng;
          }

          return (
            <Marker key={contact.name} position={[lat, lng]}>
              <Popup>{contact.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <table id="contacts-table" className="table">
        <thead>
            <tr>
                <th className="border text-center px -4 py-2">Contacts</th>
            </tr>
        </thead>
    <tbody>
    {contacts.map(contact => (
    <tr key={contact.name} onClick={() => displayContact(contact)}>
<td className="border px-4 py-2">{contact.name}</td>
    </tr>
    ))}
    </tbody>
<tfoot>
    <tr>
    <td className="border px-4 py-2">
    <input type="text" placeholder="Add contact" onKeyUp={e => {
const target = e.target as HTMLInputElement;
if (e.key === 'Enter') {
addContact(target.value);
}
}} />
    </tr>
    </tfoot>
    </table>
    </div>
);
};

export default App;
ReactDOM.render(<App />, document.getElementById("app"));




