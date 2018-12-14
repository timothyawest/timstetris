import Matrix from './Matrix.js';
export default class TetrisPiece{
    constructor(matrix){
        this.matrix =matrix;
        this.pos = { x: 0, y: 0 };
        this.matrix = null;
        this.pieces =
        {
            'T':
                [[0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]],
            'L':
                [[0, 2, 0],
                [0, 2, 0],
                [0, 2, 2]],
            'B':[[ 3, 3],
                [ 3, 3]],
            'I':
                [[0, 4, 0, 0],
                [0, 4, 0, 0],
                [0, 4, 0, 0],
                [0, 4, 0, 0]],
            'S':
                [[0, 0, 0],
                [0, 5, 5],
                [5, 5, 0]],
            'J':
                [[0, 0, 2],
                [0, 0, 2],
                [0, 2, 2]],
            'Z':
                [[0, 0, 0],
                [5, 5, 0],
                [0, 5, 5]],
        };
    }
    gravity() {
        this.pos.y++;
        return 0;
    }
    create(type) {        
        return this.pieces[type];
    }
    next(gameMatrixLength,nextPiece) {
        const pieces = "SZILJBT";
        if(nextPiece ===null){
             nextPiece =this.create(pieces[Math.floor(pieces.length * Math.random())]);
        }
        this.matrix = nextPiece;
        nextPiece =this.create(pieces[Math.floor(pieces.length * Math.random())]);
        this.pos.y = 0;
        this.pos.x = (Math.floor(gameMatrixLength/ 2)) - Math.floor(this.matrix[0].length / 2);
        return nextPiece;
    }
    isACollision(gameMatrix) {
        const { matrix: m, pos: o } = this;
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x] !== 0 &&
                    (gameMatrix[o.y + y] &&
                        gameMatrix[o.y + y][o.x + x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }
    move(gameMatrix,dir) {
        this.pos.x += dir;
        if (this.isACollision(gameMatrix, this)) {
            console.log(this.pos.x);
            this.pos.x -= dir;
        }
    }
    rotate(gameMatrix,dir) {
        const pos = this.pos.x;
        let offset = 1;
        this.matrix = Matrix.rotate(this.matrix, dir);
        while (this.isACollision(gameMatrix, this)) {
            this.pos.x += offset;
            offset = -(offset + 1)
            if (offset >this.matrix[0].length) {
                this.matrix = this.rotate(this.matrix, -dir)
                this.pos.x = pos;
                return;
            }
        }
    }
}