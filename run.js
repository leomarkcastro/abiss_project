const {series} = require('async');
const {exec} = require('child_process');

series([
 () => exec(`PORT=${process.env.PORT || "3000"} npm start`),
]); 
