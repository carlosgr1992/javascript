/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

 exports.helloWorld = onRequest((request, response) => {
   logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });


 /*Una funcion trigger que mediante una request de Http, se puede 
 insertar en la base de datos un elemento con distintos 
 atributos. La respuesta tiene que poner “Elemento con 
 ID XXXXXXXXXX fue insertado correctamente”. (1,5 puntos)*/

 // URL: https://us-central1-kyty-carlosgr.cloudfunctions.net/insertItem

 const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.insertItem = functions.https.onRequest(async (request, response) => {
  // Verificar que la solicitud es POST
  if (request.method !== 'POST') {
    return response.status(405).send('Método no permitido');
  }

  try {
    // Obtener los datos enviados en la solicitud
    const data = request.body;

    // Insertar el documento en Firestore y obtener el ID del documento
    const docRef = await admin.firestore().collection('usuarios').add(data);
    const docId = docRef.id;

    // Enviar la respuesta con el ID del documento insertado
    response.send(`Elemento con ID ${docId} fue insertado correctamente`);
  } catch (error) {
    console.error('Error insertando el documento: ', error);
    response.status(500).send('Error interno del servidor');
  }
});

