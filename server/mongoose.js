
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1:27017/todo-list');

var Todo = mongoose.model('todo',{
    content: String,
    finished: Boolean
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

exports.modify_todo_status = function(todo, callback) {
    console.log(!todo.finished)
    Todo.findByIdAndUpdate(todo._id, { 'finished': !todo.finished }, function(err, data) {
        if (err) {
            return;
        } else {
            data.finished = !!todo.finished;
            callback(data);
        }
    })
};
