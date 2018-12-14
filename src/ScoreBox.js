import Matrix from './Matrix.js'

export default class ScoreBox{
    constructor(context,blockSize){
        this.widthX=6*blockSize;
        this.heightY=10*blockSize;
        this.blockSize=blockSize;
        this.context =context;
        
    }
    drawGameScore(gameScore){
        this.context.fillStyle='Black';
        this.context.fillRect(0*this.blockSize,1*this.blockSize,6*this.blockSize,3*this.blockSize);
        this.context.font = `${this.blockSize}px Arial`;
        this.context.fillStyle='White';
        this.context.fillText(gameScore,(3*this.blockSize-this.context.measureText(gameScore).width/2) | 0,3*this.blockSize);
    }
    draw(gameScore){
        const blockSize = this.blockSize;
        this.context.fillStyle = 'Black';
       
        for(let y=0;y<this.heightY/blockSize;y++){
            for(let x=0;x<this.widthX/blockSize;x++){
                this.context.fillStyle = 'Black';
                this.context.fillRect(x*blockSize+1, y*blockSize+1, blockSize-1, blockSize-1);
                this.context.fillStyle = 'white';
                this.context.fillRect(x*blockSize, y*blockSize, blockSize-1, blockSize-1);
                this.context.fillStyle = 'Grey';
                this.context.fillRect(x*blockSize+1, y*blockSize+1, blockSize-2, blockSize-2);
            
            }
        }
        this.drawGameScore(gameScore);
        
    }
}
