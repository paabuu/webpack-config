import React, { Component } from 'react';
import axios from 'axios';

export default class Todo extends Component {

    constructor() {
        super();

        this.state = {
            todoList: [],
            newTodo: {
                content: '',
                finished: false
            },
            todoStatus: 'all'
        };
    }

    handleAddNewTodo() {
        let data = this.state.newTodo;

        if (data.content.length === 0) return;

        axios({
            url: '/api/add_todo',
            method: 'post',
            data,
            contentType: 'application/json'
        })
        .then((res) => {
            if (res.data.meta.code == 200) {
                this.setState({
                    newTodo: {
                        content: '',
                        finished: false
                    },
                    todoList: [...this.state.todoList, data]
                })
            }
        })
    }

    handleTodoInput(e) {
        this.setState({
            newTodo: {
                content: e.target.value,
                finished: false
            }
        })
    }

    handleChangeStatus(index) {
        let { todoList } = this.state;

        if (todoList[index].finished) {
            axios({
                url: '/api/remove_todo',
                method: 'post',
                data: todoList[index],
                contentType: 'application/json'
            })
            .then((res) => {
                if (res.data.meta.code == 200) {
                    this.setState({
                        newTodo: {
                            content: '',
                            finished: false
                        },
                        todoList: res.data.data
                    });
                }
            })
        } else {
            axios({
                url: '/api/finish_todo',
                method: 'post',
                data: todoList[index],
                contentType: 'application/json'
            })
            .then((res) => {
                if (res.data.meta.code == 200) {
                    todoList[index].finished = !todoList[index].finished;

                    this.setState({
                        newTodo: {
                            content: '',
                            finished: false
                        },
                        todoList
                    });
                }
            });
        }
    }

    componentDidMount() {
        axios.get('/api/get_todo_list')
             .then((res) => {
                this.setState({
                    todoList: res.data
                });
             })
    }

    showUnfinishedTodo() {
        this.setState({
            todoStatus: 'unfinished'
        });
    }

    showFinishedTodo() {
        this.setState({
            todoStatus: 'finished'
        });
    }

    showAllTodo() {
        this.setState({
            todoStatus: 'all'
        });
    }

    render() {

        const { newTodo, todoList, todoStatus } = this.state;

        return (
            <div>
                <input type="text" value={ newTodo.content } onChange={ this.handleTodoInput.bind(this) }/>
                <button onClick={ this.handleAddNewTodo.bind(this) }>提交</button>
                <button onClick={ this.showFinishedTodo.bind(this) }>已完成</button>
                <button onClick={ this.showUnfinishedTodo.bind(this) }>未完成</button>
                <button onClick={ this.showAllTodo.bind(this) }>全部</button>
                {
                    todoList.map((item, index) => {
                        if (todoStatus === 'finished') {
                            return (
                                <p key={ index } style={{ textDecoration: item.finished === true ? 'line-through' : 'none', display: item.finished === true ? 'block' : 'none' }} onClick={ this.handleChangeStatus.bind(this, index)}>{ item.content }</p>
                            )
                        } else if (todoStatus === 'unfinished'){
                            return (
                                <p key={ index } style={{ textDecoration: item.finished === true ? 'line-through' : 'none', display: item.finished === true ? 'none' : 'block' }} onClick={ this.handleChangeStatus.bind(this, index)}>{ item.content }</p>
                            )
                        } else {
                            return (
                                <p key={ index } style={{ textDecoration: item.finished === true ? 'line-through' : 'none'}} onClick={ this.handleChangeStatus.bind(this, index)}>{ item.content }</p>
                            )
                        }
                    })
                }

            </div>
        )
    }
}
