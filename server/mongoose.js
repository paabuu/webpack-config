
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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

exports.finish_todo = function(todo, callback) {
    Todo.findByIdAndUpdate(todo._id, { 'finished': true }, function(err, data) {
        if (err) {
            return;
        } else {
            data.finished = true;
            callback(data);
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
}
