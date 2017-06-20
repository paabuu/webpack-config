import React, { Component } from 'react';
import axios from 'axios';
import './music.scss';

export default class Music extends Component {
    constructor() {
        super();
        this.state = {
            musicList: [],
            musicName: '',
            audio: null,
            playing: ''
        }
    }
    componentDidMount() {

    }

    handleInputSong(e) {
        this.setState({
            musicName: e.target.value
        })
    }

    handleKeyDown(e) {
        if(e.keyCode === 13) {
            this.searchMusic();
        }
    }

    searchMusic() {
        const self = this;
        this.setState({
            musicName: ''
        })
        axios({
            url: '/api/get_music_list',
            method: 'post',
            data: {
                name: self.state.musicName
            },
            contentType: 'application/json'
        })
        .then((res) => {
            console.log(res.data.data)
            this.setState({
                musicList: res.data.data.result.songs
            })
        })
    }

    handlePlayMusic(id, name) {
        axios({
            url: '/api/get_music_url',
            method: 'post',
            data: {
                id
            },
            contentType: 'application/json'
        })
        .then((res) => {
            if(this.state.audio) this.state.audio.pause();
            const audio = new Audio(res.data.data.data[0].url);
            this.setState({
                audio,
                playing: name
            })
            console.log(this.state.audio)
            this.state.audio.play();
        })
    }
    render() {
        return (
            <div className="music-player">
                <input type="text" className="input" placeholder="输入音乐名称" onChange={ this.handleInputSong.bind(this) } onKeyDown={ this.handleKeyDown.bind(this)} value={ this.state.musicName }/>
                {/*<button className="search" onClick={ this.searchMusic.bind(this) }>搜索</button>*/}
                <span className="playing" style={{ display: this.state.playing === '' ? 'none' : 'block' }}>正在播放: { this.state.playing }</span>
                {
                    this.state.musicList.map((item, index) => {
                        return (
                            <p key={ index } className="song-info" >
                                <span className="song-name">{ item.name }</span>
                                <span className="author">
                                    { item.ar.map((i, order) => {
                                        return (
                                            i.name
                                        )
                                    })}
                                </span>
                                <span className="play" onClick={ this.handlePlayMusic.bind(this, item.id, item.name) }>play</span>
                            </p>
                        )
                    })
                }
            </div>
        )
    }
}
