const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

app.get('/',async(req,res)=>{

    const snapshot = await admin.firestore().collection("books").get();

  let books = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    books.push({ id, ...data });
  });

  res.status(200).send(JSON.stringify(books));

});

app.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection('books').doc(req.params.id).get();

    const bookId = snapshot.id;
    const bookData = snapshot.data();

    res.status(200).send(JSON.stringify({id: bookId, ...bookData}));
})


app.post('/',async(req,res)=>{
   const book=req.body;
  await admin.firestore().collection('books').add(book); 
  res.status(201).send();
});

app.put("/:id", async (req, res) => {
    const body = req.body;

    await admin.firestore().collection('books').doc(req.params.id).update(body);

    res.status(200).send()
});

app.delete("/:id", async (req, res) => {
    await admin.firestore().collection("books").doc(req.params.id).delete();

    res.status(200).send();
})

exports.book=functions.https.onRequest(app);



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
