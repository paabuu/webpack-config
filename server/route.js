var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var db = require('./mongoose');

module.exports = function(app) {
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); //

    app.post('/api/add_todo', upload.array(), function(req, res) {
        db.add_todo(req.body, function() {
            res.json({
                meta: {
                    code: 200
                }
            })
        });
    });

    app.post('/api/modify_todo_status', upload.array(), function(req, res) {
        db.modify_todo_status(req.body, function(data) {
            res.json({
                meta: {
                    code: 200
                },
                data: data
            })
        });
    });

    app.get('/api/get_todo_list', function(req, res) {
        db.todo_list(function(data) {
            res.send(data);
        })
    });
}
