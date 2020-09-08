//compile.js to read the contents of inbox.sol
//we did not use require('voting.sol') because
//it only considers .js files

const path = require('path'); //to ensure cross platform run 
const fs = require('fs');
const solc= require('solc');

const votingPath = path.resolve(__dirname, 'contracts', 'voting.sol');
//to read
const source = fs.readFileSync(votingPath,'UTF8');

//We make the compiled file public.
//.contracts['Inbox'] is the reference to that
//part of file what we want the most out of
//the compiled file i.e, ABI and bytecode is referenced.
module.exports = solc.compile(source,1).contracts[':voting'];
//console.log(solc.compile(source,1));
//1 is the number of files to be compiled
