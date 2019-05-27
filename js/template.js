var socket = io('http://localhost:3000/');
var url = window.location.href;
var urlSplit = url.split("/");
var roomname = urlSplit[4];
var currentusername = urlSplit[5];
var title = document.getElementById('roomTitle');
var infoBoxUsername = document.getElementById('Username');
var infoBoxRoomName = document.getElementById('Roomname');
window.onload= loadSite();


function loadSite() {
    title.innerHTML = currentusername;
    infoBoxRoomName.innerHTML =roomname;
    infoBoxUsername.innerHTML =currentusername;
}
document.getElementById('cardSet_1').addEventListener('click', card1);
document.getElementById('cardSet_2').addEventListener('click', card2);
document.getElementById('cardSet_3').addEventListener('click', card3);
document.getElementById('cardSet_4').addEventListener('click', card4);
document.getElementById('cardSet_5').addEventListener('click', card5);
document.getElementById('cardSet_6').addEventListener('click', card6);
document.getElementById('cardSet_7').addEventListener('click', card7);
document.getElementById('cardSet_8').addEventListener('click', card8);
document.getElementById('cardSet_9').addEventListener('click', card9);
document.getElementById('cardSet_10').addEventListener('click', card10);
document.getElementById('cardSet_11').addEventListener('click', card11);
document.getElementById('cardSet_12').addEventListener('click', card12);
document.getElementById('cardSet_13').addEventListener('click', card13);

function card1() {
    socket.emit('card_Choosen',{vote: "0", username: currentusername, roomid: roomname });
}
function card2() {
    socket.emit('card_Choosen',{vote: "0.5", username: currentusername, roomid: roomname});
}
function card3() {
    socket.emit('card_Choosen',{vote: "1", username: currentusername, roomid: roomname});
}
function card4() {
    socket.emit('card_Choosen',{vote: "2", username: currentusername, roomid: roomname});
}
function card5() {
    socket.emit('card_Choosen',{vote: '3', username: currentusername, roomid: roomname});
}
function card6() {
    socket.emit('card_Choosen',{vote: '5', username: currentusername, roomid: roomname});
}
function card7() {
    socket.emit('card_Choosen',{vote: '8', username: currentusername, roomid: roomname});
}
function card8() {
    socket.emit('card_Choosen',{vote: '13', username: currentusername, roomid: roomname});
}
function card9() {
    socket.emit('card_Choosen',{vote: '20', username: currentusername, roomid: roomname});
}
function card10() {
    socket.emit('card_Choosen',{vote: '40', username: currentusername, roomid: roomname});
}
function card11() {
    socket.emit('card_Choosen',{vote: '100', username: currentusername, roomid: roomname});
}
function card12() {
    socket.emit('card_Choosen',{vote: '?', username: currentusername, roomid: roomname});
}
function card13() {
    socket.emit('card_Choosen',{vote: 'Pause', username: currentusername, roomid: roomname});
}
socket.on('Table', function (data) {
    var table = document.getElementById('User');
    var notVotedExist = false;
    if(data[0].room_id == roomname) {
        for(var i = 0; i < data.length; i++) {
            if (data[i].Vote =='Not Voted') notVotedExist = true;
        }
        if (notVotedExist) {
            table.innerHTML = insertDefaultTable(data);
        } 
        else {
            table.innerHTML = insertDefaultTable(data);
            document.getElementById('karten_Aufdecken').disabled = false;
        }

    }
});
socket.on('Table_Uncover', function(data) {
    var table = document.getElementById('User');
    table.innerHTML = insertUsers(data);
})

function reset() {
    socket.emit('Table_Reset', {roomid: roomname});
}
function uncover() {
    socket.emit('Uncover',{roomid: roomname});
}
function insertDefaultTable(data) {
    console.log("Table Closed");
    var s = '<tr id="tabletop"><th id="tableInfoHeadN">Name</th><th id="tableInfoHeadV">Vote</th></tr>';
    for (var i = 0; i < data.length; i++) {
        s += "<tr>";
        s += "<td>";
        s += data[i].Username;
        s += "</td>";
        s += "<td>" ; 
        if(data[i].Username == currentusername) {
            console.log("Works: " + currentusername);
            s += data[i].Vote;
        } else {
            console.log("hidden");
            s+= "Vote Hidden";
        } 
        s += "</td>";
        s += "</tr>";
    }
    return s;
}
function insertUsers(data) {
    console.log("Table Open ");
    var s = '<tr id="tabletop"><th id="tableInfoHeadN">Name</th><th id="tableInfoHeadV">Vote</th></tr>';
    for (var i = 0; i<data.length; i++) {
        s += "<tr>";
        s += "<td>";
        s += data[i].Username;
        s += "</td>";
        s += "<td>" ; 
        s += data[i].Vote;
        s += "</td>";
        s += "</tr>";
    }
 return s;
}