import ScoreBox from './ScoreBox.js';
import Matrix from './Matrix.js';
import TetrisPiece from './TetrisPiece.js';
import GameArea from './GameArea.js';
import NextPieceBox from  './NextPieceBox.js';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const canvas_score = document.getElementById('score');
const context_score = canvas_score.getContext('2d');
const canvas_next_piece = document.getElementById('next_piece');
const context_next_piece = canvas_next_piece.getContext('2d');

let Scale=null;
if(window.innerHeight > window.innerWidth){
    Scale =Math.floor((Math.min(window.innerHeight/520,document.documentElement.clientHeight/520,window.innerWidth/280,document.documentElement.clientWidth/280))*10)/10;
    document.getElementById("tetris").style.display = "block";
    document.getElementById("score").style.display = "inline-block";
    document.getElementById("next_piece").style.display = "inline-block";
}else{
    Scale =Math.floor((Math.min(window.innerHeight/400,document.documentElement.clientHeight/400,window.innerWidth/560,document.documentElement.clientWidth/560))*10)/10;

}
console.log(Scale);
const blockSize=20*Scale;
context.scale(Scale,Scale);
canvas.width=canvas.width*Scale;
canvas.height=canvas.height*Scale;
context_score.scale(Scale,Scale);
canvas_score.width=canvas_score.width*Scale;
canvas_score.height=canvas_score.height*Scale;
canvas_next_piece.width=canvas_next_piece.width*Scale;
canvas_next_piece.height=canvas_next_piece.height*Scale;

let nextPiece = null; 
let gameScore =0;
let mouseDown = null;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

const gameArea =new GameArea(12,20);
const scoreBox  = new ScoreBox(context_score,blockSize);
const nextPieceBox = new NextPieceBox(context_next_piece,blockSize);
const tetrisPiece = new TetrisPiece();

console.log(tetrisPiece);
nextPiece=tetrisPiece.next(gameArea.gameMatrix[0].length,nextPiece);


function draw() {
    const gameMatrix=gameArea.gameMatrix;
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    Matrix.draw(context,tetrisPiece.matrix, tetrisPiece.pos,blockSize);
    Matrix.draw(context,gameMatrix, { x: 0, y: 0 },blockSize);
    scoreBox.draw(gameScore);
    nextPieceBox.draw(nextPiece);
}


function isGameOver() {
    const gameMatrix=gameArea.gameMatrix;
    if (tetrisPiece.isACollision(gameMatrix, tetrisPiece)) {
        return true;
    }
    return false;
}


function update(time = 0) {
    const delta = time - lastTime;
    lastTime = time;
    dropCounter += delta;
    if (dropCounter > dropInterval) {
        dropCounter=tetrisPiece.gravity();
    }
    if (tetrisPiece.isACollision(gameArea.gameMatrix, tetrisPiece)) {
        tetrisPiece.pos.y--;
        gameArea.setMatrix(Matrix.merge(gameArea.gameMatrix, tetrisPiece.matrix,tetrisPiece.pos));
        
        if(mouseDown!==null){
            clearInterval(mouseDown);
            mouseDown=null;
        } // make sure we don't have an active mouse down
        gameScore=gameArea.removeWholeRows(gameScore);
        nextPiece= tetrisPiece.next(gameArea.gameMatrix[0].length,nextPiece);
    }
    if (isGameOver()) {
        gameArea.clearGameMatrix();
        gameScore=0;
    }
    draw();
    requestAnimationFrame(update);
}

function keyBoardDispatch(key){
    const gameMatrix=gameArea.gameMatrix;
    const keyBoardDisp = {
        ArrowRight: () => tetrisPiece.move(gameMatrix,1),
        ArrowLeft: () => tetrisPiece.move(gameMatrix,-1),
        ArrowDown: () => dropCounter=tetrisPiece.gravity(),
        ArrowUp: () => tetrisPiece.rotate(gameMatrix,1),
    };
    keyBoardDisp[key] && keyBoardDisp[key]();

}

/*
    code based on https://www.geeksforgeeks.org/check-whether-a-given-point-lies-inside-a-triangle-or-not/
*/
function areaTriangle(x1,  y1,  x2,  y2, x3, y3) { 
    return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0); 
} 
/*
    code based on https://www.geeksforgeeks.org/check-whether-a-given-point-lies-inside-a-triangle-or-not/
*/

function isInsideTriangle([x1,  y1],  [x2,  y2], [x3, y3],[pX,pY]) {    
    /* Calculate area of triangle ABC */
    const A = areaTriangle (x1, y1, x2, y2, x3, y3); 

    /* Calculate area of triangle PBC */  
    const A1 = areaTriangle (pX, pY, x2, y2, x3, y3); 

    /* Calculate area of triangle PAC */  
    const A2 = areaTriangle (x1, y1, pX, pY, x3, y3); 

    /* Calculate area of triangle PAB */   
    const A3 = areaTriangle (x1, y1, x2, y2, pX, pY); 

    /* Check if sum of A1, A2 and A3 is same as A */
    return (A == A1 + A2 + A3); 
} 
document.addEventListener("keydown", event => {
    console.log(event.code);
    keyBoardDispatch(event.code);    
});

//  screen is divided into 4 logical triangles with all of them intersecting in the middle of the tetris piece
//  a click in the triangle produces the action
//      \rotate /
//       \     /
//        \   /
//   left   T  right 
//        /   \
//       /     \
//      / down  \

function handleMouseTouchDown(x,y){
    let centerX =tetrisPiece.pos.x*blockSize+40;  //pos is in blocks not px 
    let centerY =tetrisPiece.pos.y*blockSize+40;   //40 is the center of the matrix in px
    let action = null;
    if(isInsideTriangle([canvas.width,0],[centerX,centerY],[canvas.width,canvas.height],[x,y])){     //right triangle
        action ="ArrowRight";
    }else if(isInsideTriangle([0,0],[centerX,centerY],[0,canvas.height],[x,y])){     //left triangle
        action ="ArrowLeft";
    }else if(isInsideTriangle([0,0],[centerX,centerY],[canvas.width,0],[x,y])){     //rotate triangle
        action= "ArrowUp";
    }else if(isInsideTriangle([0,canvas.height],[centerX,centerY],[canvas.width,canvas.height],[x,y])){     //rotate triangle
        action ="ArrowDown";
    }
    keyBoardDispatch(action);
    if(mouseDown !==null){          // make sure we don't accidently overright the interval variable
        clearInterval(mouseDown);
    }
    if(action !== null){
        mouseDown = setInterval(function (){
            keyBoardDispatch(action);
        },action==="ArrowUp"?200:100); 
    }
 
}
canvas.addEventListener('mousedown',(e)=>{
    console.log('mousedown');
    e.preventDefault();
    handleMouseTouchDown(e.clientX,e.clientY);     
});
canvas.addEventListener('touchstart',(e)=>{

    console.log("touchstart");
    e.preventDefault();
    handleMouseTouchDown(e.changedTouches[0].clientX,e.changedTouches[0].clientY);
});
canvas.addEventListener('mouseup',(e)=>{
    console.log('mouseup');
    e.preventDefault();
    if(mouseDown!==null){
        clearInterval(mouseDown);
    }
    mouseDown=null;
});
canvas.addEventListener('touchend',(e)=>{    
    console.log('mouseend');
    e.preventDefault();
    if(mouseDown!==null){
        clearInterval(mouseDown);
    }
    mouseDown=null;
});
canvas.addEventListener("mouseleave",(e)=>{
    if(mouseDown!==null){
        clearInterval(mouseDown);
    }
    mouseDown=null;
})
update();

