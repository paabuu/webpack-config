var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
const NeteaseMusic = require('simple-netease-cloud-music')
const nm = new NeteaseMusic()
var db = require('./mongoose');

module.exports = function(app) {
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); //
    app.use(cookieParser());

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

        nm.search(songName, 1, 50).then(function(data) {
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

    app.post('/api/get_music_lyric', upload.array(), function(req, res) {
        var id = req.body.id;
        var newData = [];

        nm.lyric(id).then(function(data) {

            data.lrc.lyric.split('\n').forEach(function(item) {
                newData.push({
                    time: item.split(']')[0].slice(1),
                    lyric: item.split(']')[1]
                })
            })
            res.json({
                meta: {
                    code: 200
                },
                data: newData
            })
        });
    });

    app.post('/api/regist', upload.array(), function(req, res) {
        db.regist({
            username: req.body.username,
            password: req.body.password
        }, function() {
            res.json({
                meta: {
                    code: 200
                }
            })
        }, function() {
            res.json({
                meta: {
                    code: 400
                }
            })
        })
    });

    app.post('/api/login', upload.array(), function(req, res) {
        db.login({
            username: req.body.username,
            password: req.body.password
        }, function() {
            res.json({
                meta: {
                    code: 200
                }
            })
        }, function() {
            res.json({
                meta: {
                    code: 400
                }
            })
        })
    });

    app.post('/api/add_collections', upload.array(), function(req, res) {
        console.log(req.cookies);
        console.log(req.body);
        db.add_collections(req.cookies, req.body, function() {
            res.json({
                meta: {
                    code: 200
                }
            })
        }, function() {
            res.json({
                meta: {
                    code: 400
                }
            })
        })
    });

    app.get('/api/get_collections', function(req, res) {
        db.get_collections(req.cookies, function(collections) {
            res.json({
                meta: {
                    code: 200
                },
                data: collections
            })
        });
    });
}
