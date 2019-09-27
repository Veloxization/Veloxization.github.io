var playspace = document.getElementById("playspace");
var render = playspace.getContext("2d");
var dropdown = document.getElementById("playareasize");
var startbutton = document.getElementById("startbutton");
var minenumber = document.getElementById("minenumber");
var flag = document.getElementById("flag");
var bomb = document.getElementById("mine");
var size = 0;
var mines = 0;
var started = false;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function generate() {
    mines = 0;
    if (!started) {
        var tile = [];
        started = true;
        startbutton.innerHTML = "STOP GAME";
        size = parseInt(dropdown.value);
        playspace.width = size * 25;
        playspace.height = size * 25;

        for (var x = 0; x < size; x++) {
            tile[x] = [];
            for (var y = 0; y < size; y++) {
                tile[x][y] = { value: 0, status: 0 };
            }
        }

        for(var x = 0; x < size; x++) {
            for(var y = 0; y < size; y++) {
                rand = Math.random();
                var isMine = rand <= 0.2;
                if (isMine) {
                    mines++;
                    tile[x][y].value = 9;
                    try{if(tile[x-1][y-1].value != 9) tile[x-1][y-1].value += 1;}
                    catch{}

                    try{if(tile[x][y-1].value != 9) tile[x][y-1].value += 1;}
                    catch{}

                    try{if(tile[x+1][y-1].value != 9) tile[x+1][y-1].value += 1;}
                    catch{}

                    try{if(tile[x-1][y].value != 9) tile[x-1][y].value += 1;}
                    catch{}

                    try{if(tile[x+1][y].value != 9) tile[x+1][y].value += 1;}
                    catch{}

                    try{if(tile[x-1][y+1].value != 9) tile[x-1][y+1].value += 1;}
                    catch{}

                    try{if(tile[x][y+1].value != 9) tile[x][y+1].value += 1;}
                    catch{}

                    try{if(tile[x+1][y+1].value != 9) tile[x+1][y+1].value += 1;}
                    catch{}
                }

                render.beginPath();
                render.rect(x*25+5, y*25+5, 20, 20);
                render.fillStyle = "gray";
                render.fill();
                render.closePath();
                }
            minenumber.innerHTML = mines;
            var winningScore = size*size-mines;
            }
        var score = 0;
        var emptyFound = false;
        for (var c = 0; c < size; c++) {
            if (emptyFound) break;
            for (var r = 0; r < size; r++) {
                if (tile[c][r].value === 0) {
                    render.beginPath();
                    render.rect(c*25+5, r*25+5, 20, 20);
                    render.fillStyle = "lightgray";
                    render.fill();
                    render.closePath();
                    emptyFound = true;
                    score++;
                    tile[c][r].status = 1;
                    break;
                }
            }
        }

        playspace.addEventListener('click', function(e) {
            var pos = getMousePos(playspace, e);
            var x = Math.floor(pos.x / 25);
            var y  = Math.floor(pos.y / 25);
            render.beginPath();
            render.rect(x*25+5, y*25+5, 20, 20);
            render.fillStyle = "lightgray";
            render.fill();
            if (tile[x][y].value === 9) {
                render.drawImage(bomb, x*25+5, y*25+5);
                alert("GAME OVER");
                document.location.reload();
            }
            else if (tile[x][y].value != 0) {
                render.fillStyle = "black";
                render.font = "20px Arial";
                render.fillText(tile[x][y].value, x*25+10, y*25+22);
            }
            if (tile[x][y].value != 9 && tile[x][y].status != 1) score++;
            render.closePath();
            tile[x][y].status = 1;
            if (score === winningScore) {
                alert("VICTORY");
                document.location.reload();
            }
        }, false);
        
        playspace.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            var pos = getMousePos(playspace, e);
            var x = Math.floor(pos.x / 25);
            var y  = Math.floor(pos.y / 25);
            if (tile[x][y].status === 0) {
                render.beginPath();
                render.drawImage(flag, x*25+5, y*25+5);
                render.closePath();
                tile[x][y].status = 2;
            } else if (tile[x][y].status === 2) {
                render.beginPath();
                render.rect(x*25+5, y*25+5, 20, 20);
                render.fillStyle = "gray";
                render.fill();
                render.closePath();
                tile[x][y].status = 0;
            }
        }, false);
    } else {
        render.clearRect(0, 0, playspace.width, playspace.height);
        started = false;
        startbutton.innerHTML = "START GAME";
        minenumber.innerHTML = "";
    }
}