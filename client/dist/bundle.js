/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AppBar = React.createClass({
	    displayName: "AppBar",
	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "navbar-fixed" },
	            React.createElement(
	                "nav",
	                null,
	                React.createElement(
	                    "div",
	                    { className: "nav-wrapper teal" },
	                    React.createElement(
	                        "a",
	                        { href: "#", className: "brand-logo center" },
	                        React.createElement(
	                            "strong",
	                            null,
	                            "Chat Room"
	                        )
	                    ),
	                    React.createElement(
	                        "ul",
	                        { id: "nav-mobile", className: "left hide-on-med-and-down" },
	                        React.createElement(
	                            "li",
	                            null,
	                            React.createElement(
	                                "a",
	                                { href: "#" },
	                                "About"
	                            )
	                        )
	                    )
	                )
	            )
	        );
	    }
	});

	var PresencePanel = React.createClass({
	    displayName: "PresencePanel",
	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "h4",
	                null,
	                "Active Users"
	            ),
	            React.createElement(
	                "table",
	                { className: "striped" },
	                React.createElement(
	                    "thead",
	                    null,
	                    React.createElement(
	                        "tr",
	                        null,
	                        React.createElement(
	                            "th",
	                            { "data-field": "id" },
	                            "Nickname"
	                        ),
	                        React.createElement(
	                            "th",
	                            { "data-field": "name" },
	                            "Time joined"
	                        )
	                    )
	                ),
	                React.createElement(
	                    "tbody",
	                    null,
	                    this.props.data.map(function (user, index) {
	                        return React.createElement(
	                            "tr",
	                            { key: user.nickname },
	                            React.createElement(
	                                "td",
	                                null,
	                                user.nickname
	                            ),
	                            React.createElement(
	                                "td",
	                                null,
	                                moment(user.connectTime).format('YYYY-MM-DD HH:mm:ss')
	                            )
	                        );
	                    })
	                )
	            )
	        );
	    }
	});

	var ChatPanel = React.createClass({
	    displayName: "ChatPanel",
	    componentDidMount: function componentDidMount() {
	        var _this = this;

	        var button = document.getElementById('sendBtn');
	        var textField = document.getElementById('message-input');

	        var clickStream = Rx.Observable.fromEvent(button, 'click').map(function (e) {
	            return true;
	        });
	        var enterKeyPressedStream = Rx.Observable.fromEvent(textField, 'keyup').filter(function (e) {
	            return e.keyCode == 13;
	        });
	        var textEnteredStream = Rx.Observable.fromEvent(textField, 'keyup').map(function (e) {
	            return e.target.value;
	        });
	        var sendMessageStream = Rx.Observable.merge(clickStream, enterKeyPressedStream);

	        var mergedStream = textEnteredStream.takeUntil(sendMessageStream);

	        var text = '';
	        var onNext = function onNext(t) {
	            text = t;
	        };
	        var onError = function onError(e) {};
	        var onComplete = function onComplete() {
	            $.post('/message', { 'message': text, 'who': _this.props.data.nickname, 'timestamp': Date.now() });
	            textField.value = '';
	            textField.focus();
	            mergedStream.subscribe(onNext, onError, onComplete);
	        };

	        mergedStream.subscribe(onNext, onError, onComplete);
	    },
	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "h4",
	                null,
	                "Your nickname is ",
	                this.props.data.nickname
	            ),
	            React.createElement(
	                "ul",
	                { className: "collection" },
	                this.props.data.messages.map(function (message, index) {
	                    return React.createElement(
	                        "li",
	                        { className: "collection-item", key: message.timestamp },
	                        React.createElement(
	                            "span",
	                            { className: "title" },
	                            message.who,
	                            "  ",
	                            React.createElement(
	                                "i",
	                                null,
	                                moment(parseInt(message.timestamp)).format('YYYY-MM-DD HH:mm:ss')
	                            )
	                        ),
	                        React.createElement(
	                            "p",
	                            null,
	                            React.createElement(
	                                "strong",
	                                null,
	                                message.message
	                            )
	                        )
	                    );
	                })
	            ),
	            React.createElement(
	                "div",
	                { className: "row" },
	                React.createElement(
	                    "div",
	                    { className: "input-field col s10" },
	                    React.createElement("input", { id: "message-input", type: "text", className: "validate", ref: "message" }),
	                    React.createElement(
	                        "label",
	                        { className: "active", htmlFor: "message-input" },
	                        "Type your chat, enter/return or hit button to send"
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "input-field col s2" },
	                    React.createElement(
	                        "a",
	                        { id: "sendBtn", className: "btn-floating btn-large waves-effect waves-light teal" },
	                        React.createElement(
	                            "i",
	                            { className: "material-icons" },
	                            "send"
	                        )
	                    )
	                )
	            )
	        );
	    }
	});

	var Counter = function (_React$Component) {
	    _inherits(Counter, _React$Component);

	    function Counter() {
	        _classCallCheck(this, Counter);

	        var _this2 = _possibleConstructorReturn(this, (Counter.__proto__ || Object.getPrototypeOf(Counter)).call(this));

	        _this2.state = {
	            counter: "",
	            chatRooms: ['ReactJS', 'RxJS', 'SocketIO', 'NodeJS']
	        };

	        _this2.time = new Rx.Subject();
	        return _this2;
	    }

	    _createClass(Counter, [{
	        key: "timer",
	        value: function timer() {
	            var time = 1000;
	            var self = this;

	            function countdown() {
	                time--;
	                self.time.onNext({ 'time': time });
	            }

	            setInterval(countdown, 1000);
	        }
	    }, {
	        key: "componentDidMount",
	        value: function componentDidMount() {
	            var _this3 = this;

	            this.timer();
	            this.time.subscribe(function (data) {
	                console.log(data);
	                _this3.setState({
	                    counter: data.time
	                });
	            });
	        }
	    }, {
	        key: "onMouseOver",
	        value: function onMouseOver(e) {
	            var activeTab = document.getElementById('tab');
	            console.log(activeTab);

	            var mouseStream = Rx.Observable.fromEvent(activeTab, 'click').map(function (e) {
	                return console.log(e);
	            });
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _this4 = this;

	            return React.createElement(
	                "div",
	                null,
	                React.createElement(
	                    "div",
	                    { className: "row" },
	                    React.createElement(
	                        "h2",
	                        null,
	                        "Observables, Observables, Observables: ",
	                        this.state.counter
	                    ),
	                    React.createElement(
	                        "div",
	                        { className: "row" },
	                        React.createElement(
	                            "div",
	                            { className: "col s12" },
	                            React.createElement(
	                                "ul",
	                                { className: "tabs" },
	                                this.state.chatRooms.map(function (room, i) {
	                                    return React.createElement(
	                                        "div",
	                                        { key: i, className: "col s3" },
	                                        React.createElement(
	                                            "button",
	                                            { onMouseEnter: _this4.onMouseOver, id: "tab", className: "btn btn-large waves-effect waves-light grey darken-1" },
	                                            " ",
	                                            room
	                                        )
	                                    );
	                                })
	                            )
	                        )
	                    )
	                )
	            );
	        }
	    }]);

	    return Counter;
	}(React.Component);

	var Main = React.createClass({
	    displayName: "Main",
	    getInitialState: function getInitialState() {
	        return {
	            users: [],
	            messages: []
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        var socket = io();
	        var props = this.props;
	        var users = this.state.users;
	        var messages = this.state.messages;
	        var self = this;

	        var socketIdStream = Rx.Observable.create(function (observer) {
	            socket.on('my socketId', function (data) {
	                observer.onNext(data);
	            });
	        });

	        socketIdStream.subscribe(function (data) {
	            socket.emit('client connect', {
	                nickname: props.nickname,
	                socketId: data.socketId,
	                connectTime: data.connectTime
	            });
	        });

	        var socketAllUsersStream = Rx.Observable.create(function (observer) {
	            socket.on('all users', function (data) {
	                observer.onNext(data);
	            });
	        });

	        socketAllUsersStream.subscribe(function (data) {
	            self.setState({ users: data });
	        });

	        var socketMessageStream = Rx.Observable.create(function (observer) {
	            socket.on('message', function (data) {
	                observer.onNext(data);
	            });
	        });

	        socketMessageStream.subscribe(function (data) {
	            messages.push(data);
	            self.setState(messages); //data is {'message': text, 'who': nickname, 'timestamp': Date.now}
	        });
	    },
	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(AppBar, null),
	            React.createElement(Counter, null),
	            React.createElement(
	                "div",
	                { className: "row" },
	                React.createElement(
	                    "div",
	                    { className: "col s6" },
	                    React.createElement(ChatPanel, { data: { nickname: this.props.nickname,
	                            messages: this.state.messages } })
	                ),
	                React.createElement(
	                    "div",
	                    { className: "col s6" },
	                    React.createElement(PresencePanel, { data: this.state.users })
	                )
	            )
	        );
	    }
	});

	var createRandomNickname = function createRandomNickname(len) {
	    var text = '';
	    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    for (var i = 0; i < len; i++) {
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }
	    return text;
	};

	ReactDOM.render(React.createElement(Main, { nickname: createRandomNickname(12) }), document.getElementById('container'));

/***/ }
/******/ ]);