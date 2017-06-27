import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

import './music.scss';
import Login from './Login';

export default class Music extends Component {
    constructor() {
        super();
        this.state = {
            musicList: [],
            musicName: '',
            audio: null,
            playing: '',
            thePresentSongIndex: 0,
            playTime: 0,
            onPlay: false,
            lyric: [],
            preTime: '00:00',
            showLogin: false,
            loop: true,
            collections: [],
            showCollections: false,
            searchSongName: ''
        }
    }
    componentDidMount() {
        console.log(this.refs.lyric.scrollTop);
        this.updateCollections();
    }

    updateCollections() {
        axios({
            url: '/api/get_collections',
            method: 'get'
        })
        .then(res => {
            this.setState({
                collections: res.data.data
            })
        })
    }

    componentWillUpdate() {
        if (this.state.musicList.length > 0) {
            const allTime = this.state.musicList[this.state.thePresentSongIndex].dt;
            const { playTime } = this.state;

            this.refs.lyric.scrollTop = playTime / allTime * this.refs.lyric.scrollHeight - 50
        }
    }

    handleInputSong(e) {
        this.setState({
            musicName: e.target.value
        })
    }

    handleKeyDown(e) {
        if(e.keyCode === 13) {
            this.searchMusic();
            this.setState({
                searchSongName: this.state.musicName
            })
        }
    }

    searchMusic() {
        const self = this;

        axios({
            url: '/api/get_music_list',
            method: 'post',
            data: {
                name: self.state.musicName
            },
            contentType: 'application/json'
        })
        .then((res) => {
            if(res.data.data.result.songCount === 0) {
                this.setState({
                    musicList: [],
                    musicName: ''
                })
            } else {
                this.setState({
                    musicList: res.data.data.result.songs,
                    musicName: '',
                    thePresentSongIndex: 0
                })
            }
        })
    }

    handlePlayMusic(id, name, index) {
        this.setState({
            thePresentSongIndex: index
        });
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
            // audio.loop = true;
            audio.addEventListener('ended', () => {
                this.handleNextSong();
            });

            clearInterval(this.state.timer);
            audio.addEventListener('canplay',() => {
                var timer = setInterval(() => {
                    if (this.state.playTime >= this.state.musicList[this.state.thePresentSongIndex].dt) {
                        this.setState({
                            playTime: 0
                        });
                        clearInterval(timer);
                    } else {
                        this.setState({
                            playTime: this.state.playTime + 100
                        })
                    }
                }, 100);
                this.setState({
                    timer
                })
            });
            this.setState({
                audio,
                playing: name,
                onPlay: true,
                playTime: 0
            });
            this.state.audio.play();
        });

        axios({
            url: '/api/get_music_lyric',
            method: 'post',
            data: {
                id
            },
            contentType: 'application/json'
        })
        .then(res => {
            this.setState({
                lyric: res.data.data
            })
        })
    }

    handleNextSong() {
        if (this.state.thePresentSongIndex === this.state.musicList.lenght - 1) {
            this.setState({
                thePresentSongIndex: -1
            })
        }

        if (this.state.loop) {
            var nextSong = this.state.musicList[this.state.thePresentSongIndex + 1];
            this.handlePlayMusic(nextSong.id, nextSong.name, this.state.thePresentSongIndex + 1);
        } else {
            var nextSong = this.state.musicList[this.state.thePresentSongIndex];
            this.handlePlayMusic(nextSong.id, nextSong.name, this.state.thePresentSongIndex);
        }
    }

    handlePreSong() {
        if (this.state.thePresentSongIndex === 0) return;

        var preSong = this.state.musicList[this.state.thePresentSongIndex - 1];
        this.handlePlayMusic(preSong.id, preSong.name, this.state.thePresentSongIndex -1);
    }

    transformTime(time) {
        const min = parseInt(time / 1000 / 60) < 10 ? '0' + parseInt(time / 1000 / 60) : parseInt(time / 1000 / 60);
        const sec = parseInt(time / 1000) % 60 < 10 ? '0' + parseInt(time / 1000) % 60 : parseInt(time / 1000) % 60;

        return `${min}:${sec}`
    }

    handlePlayPause() {
        if(this.state.playing == '') return;

        if(this.state.onPlay) {
            this.setState({
                onPlay: false
            });
            clearInterval(this.state.timer);
            this.state.audio.pause();
        } else {
            var timer = setInterval(() => {
                if (this.state.playTime >= this.state.musicList[this.state.thePresentSongIndex].dt) {
                    this.setState({
                        playTime: 0
                    });
                    clearInterval(this.state.timer);
                } else {
                    this.setState({
                        playTime: this.state.playTime + 100
                    })
                }
            }, 100);
            this.setState({
                onPlay: true,
                timer
            });
            this.state.audio.play();
        }
    }

    compareTime(time, arr, index) {
        var playTime = this.transformTime(this.state.playTime);
        if(playTime >= time && (index < arr.length -1) && playTime < (arr[index + 1]).time ) {
            return true;
        } else {
            return false;
        }
    }

    handleLikeSong(isLiked, index) {
        if (this.state.playing === '') return;
        if (!cookie.load('pabu_username')) {
            this.setState({
                showLogin: true
            })
        } else {
            console.log('已登录!');
            const theSong = this.state.musicList[this.state.thePresentSongIndex];
            const data = {
                id: theSong.id,
                name: theSong.name,
                dt: theSong.dt,
                ar: theSong.ar,
                isLiked
            };

            axios({
                url: '/api/add_collections',
                method: 'post',
                data,
                contentType: 'application/json'
            })
            .then(res => {
                if (res.data.meta.code === 200) {
                    console.log('liked');
                    if (isLiked) {
                        this.state.collections.splice(index, 1);
                        this.setState({
                            collections: this.state.collections
                        })
                    } else {
                        this.setState({
                            collections: [
                                ...this.state.collections,
                                data
                            ]
                        })
                    }
                }
            })
        }
    }

    handleCloseLogin() {
        this.setState({
            showLogin: false
        })
    }

    handlePlayPattern() {
        this.setState({
            loop: !this.state.loop
        })
    }

    handleShowCollections() {
        if (!cookie.load('pabu_username')) {
            this.setState({
                showLogin: true
            })
        } else {
            this.setState({
                showCollections: !this.state.showCollections
            })
        }
    }
    render() {
        const nowPlayMusic = this.state.musicList[this.state.thePresentSongIndex];
        let isLiked = false;
        let likedIndex = -1;
        if (this.state.collections.length > 0 && nowPlayMusic) {
            this.state.collections.forEach((item, index) => {
                if (item.id === nowPlayMusic.id) {
                    isLiked = true;
                    likedIndex = index;
                }
            })
        }

        const showList = !this.state.showCollections ? this.state.musicList : this.state.collections;
        const { searchSongName } = this.state;
        return (
            <div>
                <div className="music-player">
                    <input type="text" className="input" placeholder="" onChange={ this.handleInputSong.bind(this) } onKeyDown={ this.handleKeyDown.bind(this)} value={ this.state.musicName }/>
                    {/*<button className="search" onClick={ this.searchMusic.bind(this) }>搜索</button>*/}
                    <div className="lyric" ref="lyric" style={{ width: !this.state.audio ? '0%' : '50%' }}>
                        {
                            this.state.lyric.map((item, index, arr) => {
                                return (
                                    <p key={ index } style={{ color: this.compareTime(item.time, arr, index) ? 'red' : '#000'}} >{ item.lyric }</p>
                                )
                            })
                        }
                    </div>
                    <div className="song-list" style={{ width: !this.state.audio ? '100%' : '50%', display: this.state.musicList.length > 0 ? 'block' : 'none' }}>

                        <p className="song-info">
                            { this.state.showCollections ? '你喜欢的歌曲列表' : `${ searchSongName } 搜索结果:` }
                        </p>
                        <p className="song-info" style={{ fontWeight: 'bold'}}>
                            <span className="song-name">歌曲标题</span>
                            <span className="author">歌手</span>
                            <span className="song-time">时长</span>
                        </p>
                        {
                            showList.map((item, index) => {
                                return (
                                    <p key={ index } className="song-info" style={{ backgroundColor: this.state.thePresentSongIndex == index ? '#f5f5f5' : '' }}>
                                        <span className="song-name" onClick={ this.handlePlayMusic.bind(this, item.id, item.name, index) }>{ item.name }</span>
                                        <span className="author">
                                            { item.ar.map((i, order) => {
                                                return (
                                                    i.name
                                                )
                                            })}
                                        </span>
                                        <span className="song-time">{ this.transformTime(item.dt) }</span>
                                    </p>
                                )
                            })
                        }
                    </div>
                    <div className="bottom-player" style={{ opacity: !this.state.audio ? '0' : '1'}}>
                        <div className="pre-play-next">
                            <span className="pre-song" onClick={ this.handlePreSong.bind(this) }></span>
                            <span className={ this.state.onPlay === false ? 'on-play play-pause ' : 'on-pause play-pause ' } onClick={ this.handlePlayPause.bind(this) }></span>
                            <span className="next-song" onClick={ this.handleNextSong.bind(this) }></span>
                        </div>
                        <div className="song-info">
                            <div className="song-info-pic">
                                <img src={ this.state.musicList[this.state.thePresentSongIndex] && this.state.musicList[this.state.thePresentSongIndex].al.picUrl } alt=""/>
                            </div>
                            <div className="song-progress">
                                <span className="start-time">{ this.transformTime(this.state.playTime) }</span>
                                <span className="progress-bar-total progress-bar"></span>
                                <span className="progress-bar-new progress-bar" style={{ width: nowPlayMusic ? `${ this.state.playTime / nowPlayMusic.dt * 100 * .8 }%` : '0' }}></span>
                                <span className="total-time">{ nowPlayMusic && this.transformTime(nowPlayMusic.dt) }</span>
                            </div>
                        </div>
                        <div className="setting">
                            <span className={ this.state.showCollections ? 'show-collections' : 'hide-collections' } onClick={ this.handleShowCollections.bind(this) }></span>
                            <span className={ isLiked ? 'like' : 'dislike'} onClick={ this.handleLikeSong.bind(this, isLiked, likedIndex)}></span>
                            <span className={ this.state.loop === true ? 'loop' : 'single-circle' } onClick={ this.handlePlayPattern.bind(this) }></span>
                        </div>
                        <div className="volume">
                            <span className="volume-icon"></span>
                            <span className="volume-percentage"></span>
                        </div>
                    </div>
                </div>
                <Login show={ this.state.showLogin } close={ this.handleCloseLogin.bind(this) } updateCollections={ this.updateCollections.bind(this) }></Login>
                { /*<div className="collections-list">
                    <p className="each-collection header">
                        <span className="song-name">音乐标题</span>
                        <span className="author">歌手</span>
                        <span className="song-time">时长</span>
                    </p>
                    {
                        this.state.collections.map((item, index) => {
                            return (
                                <p className="each-collection">
                                    <span className="song-name">{ item.name }</span>
                                    <span className="author">
                                        { item.ar.map((i, order) => {
                                            return (
                                                i.name
                                            )
                                        })}
                                    </span>
                                    <span className="song-time">{ this.transformTime(item.dt) }</span>
                                </p>
                            )
                        })
                    }
                </div>*/ }
            </div>
        )
    }
}
