import Matrix from './Matrix.js';
export default class GameArea{
    constructor(rows, col){
        this.gameMatrix= Matrix.create(12, 20);
    }
    clearGameMatrix() {
        this.gameMatrix.forEach(row => row.fill(0));
    }
    setMatrix(matrix){
        this.gameMatrix=matrix;
    }
    removeWholeRows(gameScore) {
        const gameMatrix=this.gameMatrix;
        let mult=1;
        for (let y = gameMatrix.length-1; y >= 0; y--) {
            let solid = true;
            for (let x = 0; x < gameMatrix[0].length; x++) {
                if (gameMatrix[y][x] === 0) {
                    solid=false;
                }
            }
            if (solid === true) {
                gameMatrix.splice(y, 1);
                gameMatrix.unshift(new Array(gameMatrix[0].length).fill(0));
                y++;
                gameScore += mult*10;
                mult*=2;
            }
        }
        return gameScore;
    }
    
}