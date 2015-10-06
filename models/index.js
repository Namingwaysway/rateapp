var Sequelize = require('sequelize')
  , sequelize = new Sequelize('lastnightwas', 'raviolilabs', 'chiefspooker1', {
      dialect: "postgres", // or 'sqlite', mysql', 'mariadb'
      port:    5432, // or 5432 (for postgres)
      host: "lastnightwas-dev.cj0xhiyyryfy.us-west-2.rds.amazonaws.com"
    })
 
// load models
var models = [
  'ratings'
];
models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

var test = sequelize.authenticate()
    .then(function () {
        console.log("CONNECTED!");
    })
    .catch(function (err) {
        console.log(err);
    })
    .done();

//sequelize.sync({force:true});
sequelize.sync();

function Models(sequlize) {
    var ratings = require('./ratings');
}

module.exports.sequelize = sequelize;