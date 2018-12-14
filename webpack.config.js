var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./src/tetris.js",
    output:{
        filename: "tetris.bundle.js",
        path: path.resolve(__dirname,'build')
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader: 'babel-loader',
                }    
            }
        ]
    }
};
