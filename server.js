const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
/*const { mongosecret } = require(__dirname + "/secrets.js");*/
const { v4: uuidv4 } = require("uuid");

const mongosecret = process.env.MONGOSECRET;
const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));

// Mongo Connection

mongoose.connect(
  `mongodb+srv://admin:${mongosecret}@cluster0.7qjbl.mongodb.net/crossnoteDB?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Mongo Schemas/Models

const noteSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
});
const Note = mongoose.model("Note", noteSchema, "notes");

app
  .route("/notes")
  .get((req, res) => {
    Note.find({}, (err, result) => {
      if (err) console.log(err);
      else res.send(result);
    });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);
    const newNote = new Note({
      id: uuidv4(),
      title: req.body.title,
      content: req.body.content,
    });
    newNote.save((err) => {
      if (err) console.log(err);
      else res.send("Successfully saved note");
    });
  })
  .delete((req, res) => {
    Note.deleteMany({}, (err) => {
      if (err) console.log(err);
      else res.send("Successfully deleted notes");
    });
  });

app
  .route("/notes/:id")
  .delete((req, res) => {
    Note.deleteOne({ id: req.params.id }, (err) => {
      if (err) console.log(err);
      else res.send("Successfully deleted note");
    });
  })
  .patch((req, res) => {
    Note.updateOne(
      { id: req.params.id },
      {
        $set: req.body,
      },
      (err) => {
        if (err) res.send(err);
        else res.send("Success");
      }
    );
  });

app.listen(port, () => {
  console.log("App started on " + port);
});
