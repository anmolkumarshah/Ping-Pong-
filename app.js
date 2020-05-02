console.log("Made by Anmolkumar Shah");

const canvas = document.querySelector('canvas');
canvas.height = window.innerHeight - 100;
canvas.width = window.innerWidth - 100;

const c = canvas.getContext('2d');

/*********************** Resize ********************************/

window.addEventListener('resize', function () {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
})

/*******************************************************/

/********************** Mouse Position *************************************/

window.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

window.addEventListener('touchmove', function(event){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clienty;
})

/*
window.addEventListener('touchend', function(event){
    mouse.x = event.changedTouches[0].clientX;
    mouse.y = event.changedTouches[0].clienty;
})
*/



const mouse = {
    x: undefined,
    y: undefined,
}




/*******************************************************/





/************************* DISTANCE FORMULA ******************************/

function getDist(x1, y1, x2, y2) {
    let distX = x2 - x1;
    let disty = y2 - y1;
    return Math.sqrt(Math.pow(distX, 2) + Math.pow(disty, 2));
}

/*******************************************************/



/* NET DRAWN */
function drawNet() {
    let width = 20;
    let x = canvas.width / 2 - width / 2;
    for (let i = 0; i < canvas.height; i += 35) {
        c.beginPath();
        c.rect(x, i, width, 30);
        c.fillStyle = "white";
        c.fill();
        c.stroke();
    }
}

function text() {
    let x = canvas.width / 2;
    let y = 100;
    c.beginPath();
    c.fillStyle = 'white';
    c.font = '100px fantasy';
    c.fillText(score.user, x - 200, y)

    c.beginPath();
    c.fillStyle = 'white';
    c.font = '100px fantasy';
    c.fillText(score.comp, x + 150, y)

    let speed = parseInt(ballProperty.dx) + parseInt(ballProperty.dy);

    c.beginPath();
    c.fillStyle = 'white';
    c.font = '50px fantasy';
    c.fillText("Speed " + ballProperty.speed, 50, 50)

}

function reset() {
    ballProperty.currentX = canvas.width / 2;
    ballProperty.currentY = canvas.height / 2;
}


/*********************** RACTANGLE CLASS ********************************/

class Rectangle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.score = 0;
    }

    draw() {


        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height);
        c.strokeStyle = 'white';
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
    }

    update() {

        if (this.centerX + this.width / 2 > canvas.width || this.centerX - this.width / 2 < 0) {
            ballProperty.dx = -ballProperty.dx;
        }
        if (this.centerY + this.height / 2 > canvas.height || this.centerY - this.height / 2 < 0) {
            ballProperty.dy = -ballProperty.dy;
        }

        if (this.centerX + this.width / 2 > canvas.width) {
            score.user++;


        } else if (this.centerX - this.width / 2 < 0) {
            score.comp++;

        }

        this.x = this.x /*+  ballProperty.speed*/ + ballProperty.dx;
        this.y = this.y /*+ ballProperty.speed*/ + ballProperty.dy;

        ballProperty.currentX = this.x;
        ballProperty.currentY = this.y;

        this.draw();
    }

    get top() {
        return this.y
    };
    get bottom() {
        return this.y + this.height
    };
    get right() {
        return this.x + this.width
    };
    get left() {
        return this.x
    };
    get centerX() {
        return this.left + this.width / 2
    };
    get centerY() {
        return this.y + this.height / 2
    };


    testCollision(rect) {
        if (this.top > rect.bottom || this.right < rect.left || this.left > rect.right || this.bottom < rect.top) {
            return false;
        } else {
            return true;
        }
    }

    collisionPoint(rect) {

        let point = (this.centerY - rect.centerY) / (this.height / 2);
        if (point < 0) {
            return 1;
        } else if (point > 0) {
            return -1;
        } else {
            return 0;
        }

    }


    responseCollision(rect) {
        let vector_x, vector_y;

        vector_x = this.centerX - rect.centerX;
        vector_y = this.centerY - rect.centerY;

        if (vector_y * vector_y > vector_x * vector_x) {

            if (vector_y > 0) {
                this.y = rect.bottom;
            } else {
                this.y = rect.y - this.height;
            }
        } else {
            if (vector_x > 0) {
                this.x = rect.right;
            } else {
                this.x = rect.right - this.width;
            }
        }

    }

}

/*******************************************************/

let ballProperty = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 10,
    dy: 10,

    speed: 5,

    currentX: 100,
    currentY: 100,
}

let user = new Rectangle(0, 100, 30, 200, 'white');
let comp = new Rectangle(canvas.width - 30, 100, 30, 200, 'white');
let ball = new Rectangle(ballProperty.x, ballProperty.y, 30, 30, 'gold');

let score = {
    user: 0,
    comp: 0,
}


const increaseSpeed = function () {
    
    if(ballProperty.dx < 20 && ballProperty.dy < 20){
        ballProperty.dx++;
        ballProperty.dy++;
    }
    
    
    let show = Math.sqrt((ballProperty.dx * ballProperty.dx) + (ballProperty.dy * ballProperty.dy));
    ballProperty.speed;
}



function animate() {
    requestAnimationFrame(animate);

    user.y = mouse.y - user.height / 2;
    comp.y = ballProperty.currentY - comp.height/2;

    c.clearRect(0, 0, canvas.width, canvas.height);

    user.draw();
    ball.update();
    comp.draw();
    drawNet();
    text();



    let player = (ballProperty.currentX < canvas.width / 2) ? user : comp;

    if (player.testCollision(ball)) {
        increaseSpeed();
        this.color = "gold";
        if(player == 'user'){
            score.user ++;
        }
        let decider = player.collisionPoint(ball)
        if (decider === 0) {
            ballProperty.dy = -ballProperty.dy;
            ballProperty.dx = -ballProperty.dx;;
        } else if (decider === -1) {
            ballProperty.dx = -ballProperty.dx;
            ballProperty.dy += 0.5;
            ballProperty.dx += 0.5;
        } else {
            ballProperty.dx = -ballProperty.dx;
            ballProperty.dy += 0.5;
            ballProperty.dx += 0.5;
        }
    }


//  document.querySelector('.end').addEventListener('click', );  
    console.log(mouse.x, mouse.y);

}

//animate();

document.querySelector('.play').addEventListener('click', function(){
    let x = document.querySelector('#music');
    x.play();
    animate();
});

//console.log(getDistance(1,2,4,3));



/*function showCoordinates(event) {
  var x = event.touches[0].clientX;
  var y = event.touches[0].clientY;
    return x,y;
}

console.log(showCoordinates());*/







































