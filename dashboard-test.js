var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs');

var app        = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var jsonFilePath = './list-of-objects.json'

app.get('/objects', function(req, res) {
  fs.readFile(jsonFilePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    } else {
      var objects = JSON.parse(data);
      res.json(objects);
    }
  });
});

app.post('/objects/create', function(req, res) {
  var objectString = req.body.objectString;
  if (typeof objectString === 'undefined' || objectString === "") {
    res.json({ message: "You must specify an 'objectString'"});
  } else {
    fs.readFile(jsonFilePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      } else {
        var objects = JSON.parse(data);
        objects.push(objectString);
        fs.writeFile(jsonFilePath, JSON.stringify(objects), function(err) {
          if(err) {
            res.json({ message: "Error: " + err});
            console.log(err);
          } else {
            res.json("objectString '" + objectString + "' added to the end of the server-side JSON file.");
          }
        });
      }
    });
  }
});

server = app.listen(8080);
console.log('Express server started on port %s', server.address().port);
