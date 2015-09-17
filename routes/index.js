var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cozy.db');

console.log(db)
router.get('/', function(req, res, next) {

      sites = ['OKCupid','Tinder','Hinge','Match']
      res.render('index.jade', {sites: sites}, function(err, html) {
        res.send(200, html);
      });
});

function listusr(req, res){
    var arr = req.params.id.split("@");
    db.all("SELECT * FROM ratings WHERE username='" + arr[0] + "' AND site='" + arr[1] + "'",
        function(err, row) {
            if(err !== null) {
                next(err);
            }
            else {
                console.log(row);
                res.render('view.jade', {ratings: row}, function(err, html) {
                    res.send(200, html);
                });
            }
        }
    );
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
  username = req.body.username;
  site = req.body.site;
  would_do = req.body.would_do;
  crazy_rating = req.body.crazy_rating;
  hot_rating = req.body.hot_rating;
  fbid = 0;
  ip = request.connection.remoteAddress;
  sqlRequest = "INSERT INTO 'ratings' (ip, fbid, username, site, would_do, crazy_rating, hot_rating, timestamp) " +
               "VALUES('" + ip + "', '" + fbid + "', '" + username + "', '" + site  + "', '" + would_do + "', '" + crazy_rating + "', '" + 		       hot_rating + "', datetime())";
  db.run(sqlRequest, function(err) {
    if(err !== null) {
      next(err);
    } else {
      res.redirect('back');
    }
  });
}, listusr);

module.exports = router;
