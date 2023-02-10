require('dotenv').config();
/********************************************************** 
 *              Chargement des modules 
 **********************************************************/
// Express : serveur web 
const express = require('express');
// path : chemin
const path = require('path');
const fs = require('fs');
const readline = require('readline');
// logger : logger ce qui se passe
const { logger } = require('./middleware/logger');
// errorHandler : recuperer les erreurs
const errorHandler = require('./middleware/errorHandler');
//req->json
const bodyParser = require('body-parser')
const parentDirectory = path.resolve(__dirname, "..");
const { client } = require("./config/serverConnection");


/*****************************************************
 *             Chargement des fonctions/routes
 *****************************************************/
const users = require("./Users");

const trajet = require("./Trajet");
/*****************************************************
 *             Lancement du serveur web
 *****************************************************/
const app = express();
const PORT = process.env.PORT || 8080;


app.use(logger);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

app.use(errorHandler);

app.listen(PORT , () => console.log('Server Runnning actually on port '+PORT));

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(parentDirectory + '/public/velocite.html');
});

app.get('/velocite.css', function(req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(parentDirectory + '/public/velocite.css');
});

app.get('/velocite.js', function(req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(parentDirectory + '/public/velocite.js');
});
app.get('/velocite.tsx', function(req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(parentDirectory + '/public/velocite.tsx');
});
app.get('/velocite.jsx', function(req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(parentDirectory + '/public/velocite.tsx');
});

app.get('/velocite-compiled.js', function(req, res) {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(parentDirectory + '/public/velocite.tsx');
});



/********************************************************
 *          Définition de routes spécifiques 
 ********************************************************/

// renvoie la liste des stations
app.get('/stations', function(req, res) {
    console.log("Reçu : GET /stations");
    res.setHeader('Content-type', 'application/json');
    if (stations.length > 0) {
        res.json( { status: 0, data: stations });
    }
    else {
        res.json({ status: -1, message: "Liste de station vide."});
    }
});

// renvoie la liste des vélos présents dans la station identifiée par :id
app.get('/stations/:id', function(req, res) {
    console.log("Reçu : GET /stations/" + req.params.id);
    res.setHeader('Content-type', 'application/json');
    let velos = bornes[Number(req.params.id)];
    if (velos !== undefined) {
        res.json({ status: 0, data: velos });
    }
    else {
        res.json({ status: -1, message: "Identifiant de station inconnu."});
    }
    
});

// ajoute un nouveau contact dans la station identifiée par :id 
// (les paramètres du vélos sont passés dans le corps de la requête HTTP)
app.put('/stations/:id', function(req, res) {
    console.log("Reçu : PUT /stations/" + req.params.id);
    console.log("body=" + JSON.stringify(req.body));
    res.setHeader('Content-type', 'application/json');
});

// supprime un contact existant de la station identifiée par :id
// (l'identifiant du vélo sera passé dans le corps de la requête HTTP)
app.delete('/stations/:id', function(req, res) {
    console.log("Reçu : DELETE /stations/" + req.params.id);
    console.log("body=" + JSON.stringify(req.body));
    res.setHeader('Content-type', 'application/json');
    res.json(supprimerVelo(Number(req.params.id), req.body.borne));
});


/******************************************************************************
 *                      Gestion des stations et des vélos
 ******************************************************************************/

/** Stations : tableau d'objets { nom: string, long: number, lag: number } */
const contact = [];
/** Bornes : tableau d'objet vélos, indexé sur les numéros des stations */