var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cozy.db');

console.log(db)
router.get('/', function(req, res, next) {

      index_error(req, res, null, next);
});

function index_error(req, res, err, next){
  sites = ['OKCupid','Tinder','Hinge','Match']
  res.render('index.jade', {sites: sites, error: err}, function(err, html) {
    res.send(200, html);
  });
}


function listusr(req, res){
    console.log(req);
    var arr = req.params.id.split("@");
    var matches1 = arr[0].match(/^[a-zA-Z0-9_-]{1,25}$/);
    var matches2 = arr[1].match(/^[a-zA-Z0-9_-]{1,25}$/);
    if (matches1 == null || matches2 == null){
      index_error(req, res, "Invalid Username", null);
    }
    db.all("SELECT * FROM ratings WHERE username='" + arr[0].toLowerCase() + "' AND site='" + arr[1].toLowerCase() + "'",
        function(err, row) {
            if(err !== null) {
                next(err);
            }
            else {
                console.log(row);
                var average_hot = 0;
                var average_pers = 0;
                if (row.length){
                  for (i = 0; i < row.length; i++) { 
                    average_hot += row[i].hot_rating;
                    average_pers += row[i].crazy_rating;
                  }
                  average_hot/=row.length;
                  average_pers/=row.length;
                }
                console.log(average_pers);
                console.log(average_hot);
                res.render('view.jade', {ratings: row, username: arr[0].toLowerCase(), site: arr[1].toLowerCase(), average_hot: average_hot, average_pers: average_pers}, function(err, html) {
                    res.status(200).send(html);
                });
            }
        }
    );
}


function listusr_redir(req, res){
    var arr = req.params.id.split("@");
    console.log(arr);
    response.writeHead(301,
      {Location: '/users/'+arr[0].toLowerCase()+'@'+arr[1].toLowerCase()}
    );
    response.end();
}



router.get('/users/:id', listusr);

/*
'("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"ip" VARCHAR(255), ' +
           '"fbid" VARCHAR(255), ' +
           '"username" VARCHAR(255), ' +
           '"site" VARCHAR(255), ' +
           '"would_do" INTEGER, ' +
           '"crazy_rating" INTEGER, ' +
           '"hot_rating" INTEGER, ' +
           '"timestamp" INTEGER, ' +
           'comments VARCHAR(1024))'
*/
// We define a new route that will handle bookmark creation
router.post('/users/:id', function(req, res, next) {
  var arr = req.params.id.split("@");
  var matches1 = arr[0].match(/^[a-zA-Z0-9_-]{1,25}$/);
  var matches2 = arr[1].match(/^[a-zA-Z0-9_-]{1,25}$/);
  var matches3 = req.body.display_name.match(/^[a-zA-Z0-9_-]{1,25}$/);
  if (matches1 == null || matches2 == null || matches3 == null){
    res.redirect('back');
  }
  console.log(arr);
  username = arr[0].toLowerCase();
  site = arr[1].toLowerCase();
  crazy_rating = req.body.crazy_rating;
  hot_rating = req.body.hot_rating;
  comments = req.body.comments;
  display_name = req.body.display_name;
  fbid = 0;
  ip = req.connection.remoteAddress;

  //if(typeof array != "undefined" && array != null && array.length > 0){}
  comments = comments.replace(/"/g, "");
  comments = comments.replace(/'/g, "");
  
  sqlRequest = "INSERT INTO 'ratings' (comments, ip, display_name, username, site, crazy_rating, hot_rating, timestamp) " +
               "VALUES('" + comments + "', '" + ip + "', '" + display_name + "', '" + username + "', '" + site  +  "', '" + crazy_rating + "', '" + hot_rating + "', datetime())";
  
  console.log(sqlRequest);
  db.run(sqlRequest, function(err) {
    if(err !== null) {
      console.log(err);
      next(err);
    } else {
      res.redirect('back');
    }
  });
}, listusr);

router.get('/about/', function(req, res, next){
res.render('about.jade', {}, function(err, html) {
                    res.status(200).send(html);
                });
});

module.exports = router;
