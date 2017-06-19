var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
const NeteaseMusic = require('simple-netease-cloud-music')
const nm = new NeteaseMusic()
var db = require('./mongoose');

module.exports = function(app) {
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); //

    app.post('/api/add_todo', upload.array(), function(req, res) {
        db.add_todo(req.body, function(data) {
            res.json({
                meta: {
                    code: 200
                },
                data: data
            })
        });
    });

    app.post('/api/finish_todo', upload.array(), function(req, res) {
        db.finish_todo(req.body, function(data) {
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

    app.post('/api/remove_todo', upload.array(), function(req, res) {
        var todo_id = req.body;
        db.remove_todo(todo_id, function(data) {
            res.json({
                meta: {
                    code: 200
                },
                data: data
            })
        });
    });

    app.post('/api/get_music_list', upload.array(), function(req, res) {
        var songName = req.body.name;

        nm.search(songName).then(function(data) {
            res.json({
                meta: {
                    code: 200
                },
                data: data
            })
        });

    });
    app.post('/api/get_music_list', upload.array(), function(req, res) {
        var songName = req.body.name;

        nm.search(songName).then(function(data) {
            res.json({
                meta: {
                    code: 200
                },
                data: data
            })
        });

    });

    app.post('/api/get_music_url', upload.array(), function(req, res) {
        var id = req.body.id;

        nm.url(id).then(function(data) {
            res.json({
                meta: {
                    code: 200
                },
                data: data
            })
        });

    });
}
