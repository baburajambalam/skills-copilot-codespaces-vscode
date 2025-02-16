// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Read comments.json file and convert to JSON object
var comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

// Function to write comments to comments.json file
function writeComments() {
  fs.writeFileSync('comments.json', JSON.stringify(comments), 'utf8');
}

// Function to find a comment by id
function findComment(id) {
  for (var i = 0; i < comments.length; i++) {
    if (comments[i].id == id) {
      return i;
    }
  }
  return -1;
}

// Function to get all comments
app.get('/comments', function(req, res) {
  res.json(comments);
});

// Function to get a comment by id
app.get('/comments/:id', function(req, res) {
  var commentId = req.params.id;
  var index = findComment(commentId);
  if (index != -1) {
    res.json(comments[index]);
  } else {
    res.status(404).send('Comment not found');
  }
});

// Function to create a new comment
app.post('/comments', function(req, res) {
  var newComment = req.body;
  newComment.id = comments.length + 1;
  comments.push(newComment);
  writeComments();
  res.json(newComment);
});

// Function to update a comment by id
app.put('/comments/:id', function(req, res) {
  var commentId = req.params.id;
  var index = findComment(commentId);
  if (index != -1) {
    comments[index] = req.body;
    writeComments();
    res.json(comments[index]);
  } else {
    res.status(404).send('Comment not found');
  }
});

// Function to delete a comment by id
app.delete('/comments/:id', function(req, res) {
  var commentId = req.params.id;
  var index = findComment(commentId);
  if (index != -1) {
    comments.splice(index, 1);
    writeComments();
    res.status(204).send();
  } else {
    res.status(404).send('Comment not found');
  }
});

// Start web server
app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});