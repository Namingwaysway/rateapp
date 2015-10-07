var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cozy.db');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var models  = require('../models');
var ratings = models.ratings;

console.log(db)
router.get('/', function(req, res, next) {

      index_error(req, res, null, next);
});

function index_error(req, res, err, next){
  sites = ['OKCupid','Hinge','Match','POF','Tinder', 'Zoosk', 'eHarmony', 'Lovestruck', 'AshleyMadison', 'Mysinglefriend']
  ratings.findAll({ limit: 10, order: 'timestamp DESC', where: {
                                                        comments:{$notLike: 'None.'},
                                                        comments:{$notLike: ''},
                                                        comments:{$notLike: ' '}
                                                      } 
  }).then( function(rows){
    console.log(rows);
    res.render('index.jade', {sites: sites, error: err, recent: rows}, function(err, html) {
      res.send(200, html);
    });
  });
}


function listusr(req, res){
    var arr = req.params.id.split("@");
    var matches1 = arr[0].match(/^[a-zA-Z0-9_-]{1,25}$/);
    var matches2 = arr[1].match(/^[a-zA-Z0-9_-]{1,25}$/);
    if (matches1 == null || matches2 == null){
      index_error(req, res, "Invalid Username", null);
    }

    url = "none"
    /*
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://www.okcupid.com/profile/#{username}", true); // will fail if not logged in to okc
    xmlHttp.send(null);
    var index = xmlHttp.responseText.indexOf("http://k0.okccdn.com/php/load_okc_image.php");
    var sub_str = xmlHttp.responseText.slice(index,xmlHttp.responseText.length);
    var last_index = sub_str.indexOf("\"");
    var url = sub_str.slice(0,last_index);

    console.log(xmlHttp.responseText)
    */
    console.log(models)
    models.ratings.findAll({
      where: {
        username: arr[0].toLowerCase(),
        site: arr[1].toLowerCase()
      }
    }).then(
        function(row) {
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
            average_hot = Math.round( average_hot * 10 ) / 10;
            average_pers = Math.round( average_pers * 10 ) / 10;
            console.log(average_pers);
            console.log(average_hot);
            res.render('view.jade', {img_url: url, ratings: row, username: arr[0].toLowerCase(), site: arr[1].toLowerCase(), average_hot: average_hot, average_pers: average_pers}, function(err, html) {
                res.status(200).send(html);
            });
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
  console.log(req.body);
  username = arr[0].toLowerCase();
  site = arr[1].toLowerCase();
  crazy_rating = req.body.crazy_rating;
  hot_rating = req.body.hot_rating;
  comments = req.body.comments;
  display_name = req.body.display_name;
  fbid = 0;
  ip = req.connection.remoteAddress;

  var xmlHttp = new XMLHttpRequest();
  var body = "secret=\"6LddIw4TAAAAAOVHSpDTsbUisOkUmnBMJy84LDBk\"&response="+req.body['g-recaptcha-response'];
  xmlHttp.open("POST", "https://www.google.com/recaptcha/api/siteverify?"+body, false); // true for asynchronous 
  xmlHttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  xmlHttp.send(null);
  var gres = xmlHttp.responseText;
  console.log(gres)

  if (!gres.success){
      res.redirect('back');
  }

  if (crazy_rating < 0 || crazy_rating > 10){
      res.redirect('back');
  }  
  if (hot_rating < 0 || hot_rating > 10){
      res.redirect('back');
  }

  //if(typeof array != "undefined" && array != null && array.length > 0){}
  comments = comments.replace(/"/g, "");
  comments = comments.replace(/'/g, "");
  
  ratings.create({ comments: comments,
   ip: ip,
   display_name: display_name, 
   username: username, 
   site: site, 
   crazy_rating: crazy_rating, 
   hot_rating: hot_rating, 
   timestamp: new Date() }).then(function(rating) {
    // you can now access the newly created task via the variable task
  });
}, listusr);

router.get('/about/', function(req, res, next){
res.render('about.jade', {}, function(err, html) {
                    res.status(200).send(html);
                });
});

module.exports = router;
