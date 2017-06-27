
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var db = mongoose.connect('mongodb://127.0.0.1:27017/todo-list');

var Todo = mongoose.model('todo',{
    content: String,
    finished: Boolean
});

var User = mongoose.model('user', {
    username: String,
    password: String,
    collections: Array
});

exports.add_todo = function(data,callback) {
    var todo = new Todo({
        content: data.content,
        finished: data.finished
    });

    todo.save(function(err) {
        if (err) {
            callback(err.message);
        } else {
            Todo.find({},function(err,todo){
                callback(todo)
            });
        }
    })
};

exports.todo_list = function(callback) {
    Todo.find({},function(err, todo){
        callback(todo);
    });
};

exports.finish_todo = function(todo, callback) {
    Todo.findByIdAndUpdate(todo._id, { 'finished': true }, function(err, data) {
        if (err) {
            console.log('finish todo error')
            return;
        } else {
            console.log('success', data)
            callback();
        }
    })
};

exports.remove_todo = function(todo_id, callback) {
    Todo.remove({_id: todo_id}, function(err) {
        if (err) {
            console.log(err);
        } else {
            Todo.find({}, function(err, todo) {
                callback(todo);
            });
        }
    });
};

exports.regist = function(info, callback, fallback) {
    var user = new User({
        username: info.username,
        password: info.password
    });

    User.find({ username: info.username }, function(err, users) {
        if (users.length === 0) {
            user.save(function(err) {
                if (err) {
                    console.log(err);
                    return;
                }

                callback();
            })
        } else {
            fallback()
        }
    })


};

exports.login = function(info, callback, fallback) {

    User.find({ username: info.username }, function(err, users) {
        if (err) {
            console.log(err);
            return;
        }

        var lock = true;
        users.forEach(function(item, index) {
            if (item.password = info.password) {
                callback();
                lock = false;
            }
        });

        if (lock) fallback('error')
    })
}

exports.add_collections = function(info, data, callback, fallback) {

    if (data.isLiked) {
        User.update(
            { username: info.pabu_username},
            { $pull: {
                collections: {
                    id: data.id
                }
            }},
            function(err) {
                callback()
            }
        )
    } else {
        User.update(
            { username: info.pabu_username },
            { $push: {
                collections: {
                    $each: [
                        {
                            id: data.id,
                            name: data.name,
                            dt: data.dt,
                            ar: data.ar
                        }
                    ]
                }
            }},
            function(err, users) {
                callback();
        })
    }
}

exports.get_collections = function(info, callback) {
    User.find({ username: info.pabu_username}, function(err, users) {
        if (users.length == 0) {
            callback([]);
        } else {
            callback(users[0].collections)
        }
    });
}
