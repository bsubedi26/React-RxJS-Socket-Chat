var AppBar = React.createClass({
    render() {        
        return (
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper teal">
                      <a href="#" className="brand-logo center"><strong>Chat Room</strong></a>
                        <ul id="nav-mobile" className="left hide-on-med-and-down">
                            <li><a href="#">About</a></li>                            
                      </ul>
                    </div>
                </nav>
            </div>
        );
    }
});

var PresencePanel = React.createClass({
    render() {    
        return (        
            <div>
                <h4>Active Users</h4>
                <table className="striped">
                    <thead>
                        <tr>
                            <th data-field="id">Nickname</th>
                            <th data-field="name">Time joined</th>              
                        </tr>
                    </thead>

                    <tbody>                    
                    { 
                        this.props.data.map((user, index) => {
                            return <tr key={user.nickname}> 
                                <td>{user.nickname}</td>
                                <td>{moment(user.connectTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                            </tr>
                        })
                    }
                    </tbody>
                 </table>    
            </div>
        );
    }
});

var ChatPanel = React.createClass({    
    componentDidMount() {        
        var button = document.getElementById('sendBtn');
        var textField = document.getElementById('message-input');
        
        var clickStream = Rx.Observable.fromEvent(button, 'click').map(e => true);        
        var enterKeyPressedStream = Rx.Observable.fromEvent(textField, 'keyup').filter(e => e.keyCode == 13);
        var textEnteredStream = Rx.Observable.fromEvent(textField, 'keyup').map(e => e.target.value);
        var sendMessageStream = Rx.Observable.merge(clickStream, enterKeyPressedStream);        
                
        var mergedStream = textEnteredStream.takeUntil(sendMessageStream);
        
        var text = '';
        var onNext = t => { text = t; }
        var onError = e => {}
        var onComplete = () => {            
            $.post('/message', {'message': text, 'who': this.props.data.nickname, 'timestamp': Date.now()});
            textField.value = '';
            textField.focus();
            mergedStream.subscribe(onNext, onError, onComplete);
        }
        
        mergedStream.subscribe(onNext, onError, onComplete);                
    },
    render() {                      
        return (
            <div>
                <h4>Your nickname is {this.props.data.nickname}</h4>
                <ul className="collection">
                    { 
                        this.props.data.messages.map((message, index) => {
                            return <li className="collection-item" key={message.timestamp}>
                            <span className="title">{message.who}  <i>{moment(parseInt(message.timestamp)).format('YYYY-MM-DD HH:mm:ss')}</i></span>
                            <p>                            
                            <strong>{message.message}</strong>
                            </p>
                            </li>
                        })
                    }   
                </ul>
                <div className="row">
                    <div className="input-field col s10">
                        <input id="message-input" type="text" className="validate" ref="message" />
                        <label className="active" htmlFor="message-input">Type your chat, enter/return or hit button to send</label>
                    </div>
                    <div className="input-field col s2">
                        <a id="sendBtn" className="btn-floating btn-large waves-effect waves-light teal"><i className="material-icons">send</i></a>
                    </div>
                </div>
            </div>
        );
    }
});

class Counter extends React.Component {
    constructor() {
        super()
        
        this.state = {
            counter: "",
            chatRooms: ['ReactJS', 'RxJS', 'SocketIO', 'NodeJS']
        }

        this.time = new Rx.Subject()
    }

    timer() {
        var time = 1000;
        var self = this;

        function countdown() {
            time--;
            self.time.onNext({'time': time});
        }
        
        setInterval(countdown, 1000)
            
    }

    componentDidMount() {
        this.timer()
        this.time.subscribe(data => {            
            console.log(data)
            this.setState({
                counter: data.time
            })
            
        });

    }

    onMouseOver(e) {
        var activeTab = document.getElementById('tab');
        console.log(activeTab)

        var mouseStream = Rx.Observable.fromEvent(activeTab, 'click').map(e => console.log(e));        

    }

    render() {
        return (

            <div>
                <div className="row">
                <h2>Observables, Observables, Observables: {this.state.counter}</h2>
                  <div className="row">
                    <div className="col s12">
                    <ul className="tabs">
                        {this.state.chatRooms.map( (room, i) => {
                            return (
                                <div key={i} className="col s3">
                                    <button onMouseEnter={this.onMouseOver} id="tab" className="btn btn-large waves-effect waves-light grey darken-1"> {room}</button>

                                </div>
                            ) 
                        })}
                    </ul>
                    </div>
                    </div>
          
                </div>
            </div>
        );
    }
}

var Main = React.createClass({
    getInitialState() {
        return {
            users: [],
            messages: []
        }    
    },
    componentDidMount() {        
        var socket = io();
        var props = this.props;
        var users = this.state.users;
        var messages = this.state.messages;
        var self = this;
        
        var socketIdStream = Rx.Observable.create(observer => {
            socket.on('my socketId', data => { observer.onNext(data); });
        });  
        
        socketIdStream.subscribe(data => {            
            socket.emit('client connect', {
                nickname: props.nickname,
                socketId: data.socketId,
                connectTime: data.connectTime 
            });
        });
        
        var socketAllUsersStream = Rx.Observable.create(observer => {
            socket.on('all users', data => { observer.onNext(data); });            
        });

        socketAllUsersStream.subscribe(data => {
            self.setState({users: data});
        });
        
        var socketMessageStream = Rx.Observable.create(observer => {
            socket.on('message', data => { observer.onNext(data); });            
        });
        
        socketMessageStream.subscribe(data => {
            messages.push(data);
            self.setState(messages); //data is {'message': text, 'who': nickname, 'timestamp': Date.now}
        });                
    },
    render() {
        return (
            <div>
                <AppBar />
                <Counter />
                <div className="row">          
                    <div className="col s6"><ChatPanel data={{nickname: this.props.nickname, 
                        messages: this.state.messages}}/></div>
                    <div className="col s6"><PresencePanel data={this.state.users} /></div>
                </div>
            </div>
        );
    }
});

var createRandomNickname = len => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

ReactDOM.render(<Main nickname={createRandomNickname(12)}/>, document.getElementById('container'));

