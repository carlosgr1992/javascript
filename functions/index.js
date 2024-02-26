/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Hola mundo inicial
 exports.helloWorld = onRequest((request, response) => {
   logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });


 /*Una funcion trigger que mediante una request de Http, se puede 
 insertar en la base de datos un elemento con distintos 
 atributos. La respuesta tiene que poner “Elemento con 
 ID XXXXXXXXXX fue insertado correctamente”. (1,5 puntos)*/

 // URL: https://us-central1-kyty-carlosgr.cloudfunctions.net/insertItem

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


/*Una función trigger de tipo Http request que elimine un componente de 
alguna colección de elementos. La respuesta deberá poner que “El elemento 
con ID XXXXXXX de elimino correctamente”*/

// URL: https://us-central1-kyty-carlosgr.cloudfunctions.net/deleteItem?id=Myb1gNypoHYgRY0aH5JV

exports.deleteItem = functions.https.onRequest(async (request, response) => {
  // Verificar que la solicitud es DELETE o POST, según prefieras
  if (request.method !== 'DELETE') {
    return response.status(405).send('Método no permitido');
  }

  try {
    // El ID del documento a eliminar podría pasarse como un parámetro en la URL
    const docId = request.query.id; 

    // Verifica que se haya proporcionado un ID
    if (!docId) {
      return response.status(400).send('No se proporcionó el ID del documento a eliminar');
    }

    // Eliminar el documento en Firestore
    await admin.firestore().collection('usuarios').doc(docId).delete();

    // Enviar la respuesta con el ID del documento eliminado
    response.send(`El elemento con ID ${docId} se eliminó correctamente`);
  } catch (error) {
    console.error('Error eliminando el documento: ', error);
    // Si el documento no existe:
    if (error.code === 'not-found') {
      return response.status(404).send(`El elemento con ID ${request.query.id} no existe`);
    }
    response.status(500).send('Error interno del servidor');
  }
});


/* Una función trigger de tipo HTTP request que muestre todos los elementos
   de la colección en formato JSON en la pantalla del navegador. */

   // URL: https://us-central1-kyty-carlosgr.cloudfunctions.net/listItems

   exports.listItems = functions.https.onRequest(async (request, response) => {
    try {
      // Referencia a la colección de la que queremos obtener los documentos
      const usuariosRef = admin.firestore().collection('usuarios');
      const snapshot = await usuariosRef.get();
  
      // Crear un array para almacenar los datos de los usuarios
      const usuarios = [];
      snapshot.forEach(doc => {
        usuarios.push({ id: doc.id, ...doc.data() });
      });
  
      // Establecer el tipo de contenido de la respuesta a JSON
      response.set('Content-Type', 'application/json');
  
      // Enviar la respuesta con los usuarios en formato JSON
      response.status(200).send(JSON.stringify(usuarios));
    } catch (error) {
      console.error('Error obteniendo los documentos: ', error);
      response.status(500).send('Error interno del servidor');
    }
  });

  