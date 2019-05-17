//Get NodeJs modules
var express = require('express');
var app = express();
var http = require('http');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (request, response) =>  response.sendFile(`${__dirname}/Index/index.html`));
app.use('/', express.static(__dirname + '/index'));
app.use('/styles', express.static(__dirname + '/styles'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/template', express.static(__dirname + '/template'));
app.use('/views',express.static(__dirname +'/views'));
app.use('/index',express.static(__dirname +'/Index'));

function createId() { //Six digit number for the UID of the room
    var randomNumber = Math.random();
    var  decimaluid= randomNumber *100000;
    var uid = Math.trunc(decimaluid);
    return uid;
} 
var database = mysql.createConnection({ 
    host: "localhost",
    port: "3309",
    user: "projektadmin",
    password: "adminprojekt",
    database: "poker"
})
function insertIdToDatabase(id) {
    database.query("INSERT INTO `Room` VALUES ('"+id+"')", function(err, res) {
         if(err) throw err;
         console.log("Successfully inserted id " + id);
    })
}
function insertUserName(username,id) {
    database.query("INSERT INTO `Users` VALUES ('"+username+"','"+id+"')", function(err, res) {
        if(err) throw err;
        console.log("Successfully inserted User " + username + " on roomid " + id);
   })
}
function checkVotes(result) {
    var notAllVoted = false;
    for(var i = 0; i < result.length; i++) {
        if(result[i].Vote = "Not Voted") notAllVoted = true;
    }
    return notAllVoted
}
app.post('/Index/data', (req, res) => {
    const roomId = createId();
    const username = req.body.Input_UserName;
    insertIdToDatabase(roomId);
    insertUserName(username,roomId); 
    res.redirect(`/room/${roomId}/${username}`);
});
app.get('/room/:id', (req, res) => {
    var id = {
        id : req.params.id
    }
    res.cookie('ID',id);
    res.sendFile(`${__dirname}/Index/roomconnect.html`);
});
app.post('/Index/join', (req, res) => {
    const username = req.body.Input_UserNameJoin;
    const roomId = req.body.Input_Roomname;
    if(username != "undefined" && roomId !="undefined") insertUserName(username,roomId);
    res.redirect(`/room/${roomId}/${username}`);
});
app.get('/room/:id/:username', (req, res) => {
    const id = req.params.id;
    res.sendFile(`${__dirname}/template/roomtemplate.html`, function(err, res) {
        console.log("SendFile: " + res)
    });
    io.on('connection', function(socket) {
        console.log("ID: " + socket.id);
        database.query("INSERT INTO Votes(Username, room_id) VALUES('"+req.params.username+"', '"+req.params.id+"') ON DUPLICATE KEY UPDATE Username = '"+req.params.username+"', room_id = '"+req.params.id+"'", function(err, res) {
            if(err) throw err;
            database.query("SELECT * FROM `Votes` WHERE room_id = '"+id+"'", function(error, result) {
                if(error) throw error;
                console.log(result);
                io.sockets.emit('Table', result);
           })
       })
        socket.on('card_Choosen', function(data){
            console.log("Vote from: " + data.username + "= " + data.vote);
            if(req.params.id == data.roomid) {
                database.query("INSERT INTO Votes VALUES('"+data.username+"','"+data.vote+"','"+data.roomid+"')ON DUPLICATE KEY UPDATE Vote = '"+data.vote+"'", function(err, res) {
                    if(err) throw err;
                    console.log("Successfully inserted Vote: " + data.vote + " on roomid " + data.roomid);
                    database.query("SELECT * FROM `Votes` WHERE room_id = '"+data.roomid+"'", function(error, result) {
                        if(error) throw error;
                        io.sockets.emit('Table', result);
                    })
                })
            }
        })
    })
})
server.listen(3000);