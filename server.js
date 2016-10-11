var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Rx = require('rx'),
    Immutable = require('immutable');

var usersMap = Immutable.Map({});
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/', express.static(path.join(__dirname, 'client')));

var server = app.listen(5002);
var io = require('socket.io')(server);
var connections = [];


//////////////////timer observable////////////////////
// var timer = Rx.Observable.create(function(observer) {
    
//         var time = 1000;
//         function countdown() {
//             time--;
//             // console.log(time)
//             observer.onNext({'time': time}); 
            
//         }
//         var timerInterval = setInterval(countdown, 1000)

//         return function() {
//             clearTimeout(timerInterval);

//         }

// });    

// timer.subscribe(function(time) {
//     // console.log(obj)
//     io.sockets.emit("new time", time)
// })

//////////////////connection observable////////////////////
// Main function for user initial connection using sockets
var sourceConnect = Rx.Observable.create(function(observer) {
    
    io.on('connection', function(socket) {
        //console.log('Client connection notified to server first. Client socketId is ', socket.id);
        connections.push(socket);
        socket.emit('my socketId', {'socketId': socket.id, 'connectTime': Date.now()});
        socket.on('client connect', function(data) {
            observer.onNext({'socket': socket, 'data': data, 'event': 'client connect'});       
        }); 

    });    
    
    return function() {
        io.close();
    }
});

// Main function for user disconnection using sockets
var sourceDisconnect = Rx.Observable.create(function(observer) {
    
    io.on('connection', function(socket) {                
        socket.on('disconnect', function(data) {
            observer.onNext({'socketId': socket.id, 'event': 'client disconnect'});       
        });
    });    
    
    return function() {
        io.close();
    }
});

// CONNECTION SUBSCRIBE
var observerConnect = sourceConnect
.subscribe(function(obj) {    
    obj.socket.emit('new user', obj.data);
    //io.emit('new user', obj.data);    
    //console.log('New client connected ', obj.data);
    var socketId = obj.data.socketId;
    usersMap = usersMap.set(socketId, obj.data);
    // console.log(usersMap.toArray());
    io.emit('all users', usersMap.toArray());
});

// DISCONNECTION SUBSCRIBE
var observerDisconnect = sourceDisconnect
.subscribe(function(obj) { 
    //console.log(usersMap);
    // var socketId = obj.socketId;
    //console.log(socketId);
    // var user = usersMap.get(socketId);
    // console.log('Client disconnected ', user.socketId, user.nickname);
    // usersMap = usersMap.delete(obj.socketId);
    // io.emit('all users', usersMap.toArray());
});

app.post('/message', function(req, res) {
    console.log("-------------");
    console.log(req.body);
    io.emit('message', req.body);
});




