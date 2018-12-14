export default class Matrix{
    static create(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }
    static clone(matrix){
        let copy=matrix.slice(0);
        for(let i=0;i<matrix[0].length;i++){
            copy[i]=matrix[i].slice(0);
        }
        return copy;
    }
    static merge(gameMatrix, matrix, pos) {
        let newMatrix = this.clone(gameMatrix);
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                console.log(value);
                if (value !== 0 && value !==undefined) {
                    newMatrix[pos.y + y][pos.x + x] = value;
    
                }
            });
        });
        return newMatrix;
    }
    static rotate(matrix, dir) {
        const M = Matrix.create(matrix.length, matrix[0].length);
        const lenX = matrix[0].length;
        const lenY = matrix.length;
        for (let y = 0; y < lenY; y++) {
            for (let x = 0; x < lenX; x++) {
                let temp = matrix[x][y];
                M[x][y] = matrix[y][lenX - 1 - x];
                M[y][lenY - 1 - x] = matrix[lenX - 1 - x][lenY - 1 - y];
                M[lenX - 1 - x][lenY - 1 - y] = matrix[lenY - 1 - y][x];
                M[lenY - 1 - y][x] = temp;
            }
        }
        return M; 
    }
    
    static draw(context, matrix, offset,blockSize) {
        const colorMap = ['null', 'Red', 'Blue', 'Green', 'Yellow', 'Purple','Black'];
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    
                    context.fillStyle = 'Black';
                    context.fillRect((offset.x + x)*blockSize+1, (offset.y + y)*blockSize+1, blockSize-1, blockSize-1);
                    context.fillStyle = 'white';
                    context.fillRect((offset.x + x)*blockSize, (offset.y + y)*blockSize, blockSize-1, blockSize-1);
                    context.fillStyle = colorMap[value];
                    context.fillRect((offset.x + x)*blockSize+1, (offset.y + y)*blockSize+1, blockSize-2, blockSize-2);
                  
                }
            });
        });
    }
}