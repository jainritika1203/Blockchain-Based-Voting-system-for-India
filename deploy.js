const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile.js');
const provider = new HDWalletProvider(
    'topic witness argue lab junk profit slot infant switch vague crumble check',
    'https://ropsten.infura.io/v3/390beb2ecdba4b8098e96c0659fc4d2a'
);
const web3 = new Web3(provider);

const hex2str = require('./hextostring.js');

var initCandidate = ["0x434f4e4752455353000000000000000000000000000000000000000000000000", //congress
                     "0x4248415254495941204a414e5441205041525459000000000000000000000000", //bjp
                     "0x41414d204141444d492050415254590000000000000000000000000000000000", //aap
                     "0x4e4f544100000000000000000000000000000000000000000000000000000000" //nota
                    ]; 

console.log('initializing..');

//write a function JUST to use async ( bcoz there are
// two asynchron. calls in this program)
const deploy = async() => {
    //get a list of all accounts
    const accounts = await web3.eth.getAccounts();
    //use one of those accounts to deploy contract
    console.log('Attempting to deploy from account', accounts[0]);  
    const contractInstance = await new web3.eth.Contract(JSON.parse(interface))
                .deploy({ data: bytecode, arguments: [initCandidate] })
                .send({ from: accounts[0], gas: '1000000' });
    //contractInstance.setProvider(provider);
    
    console.log('Contract deployed to', contractInstance.options.address);
    //await contractInstance.methods.voteforcandidate(initCandidate[0]).send({ from: accounts[0], gas: '1000000' });
    //await contractInstance.methods.voteforcandidate(initCandidate[1]).send({ from: accounts[0], gas: '1000000' });
    //await contractInstance.methods.voteforcandidate(initCandidate[1]).send({ from: accounts[0], gas: '1000000' });
    const cand1 = await contractInstance.methods.totalvotesfor(initCandidate[0]).call();
    const cand2 = await contractInstance.methods.totalvotesfor(initCandidate[1]).call();
    const cand3 = await contractInstance.methods.totalvotesfor(initCandidate[2]).call();
    const winner = await contractInstance.methods.getWinner().call();
    console.log('Votes for CONGRESS: '+ cand1);
    console.log('\nVotes for BHARTIYA JANTA PARTY: '+ cand2);
    console.log('\nVotes for AAM AADMI PARTY: '+ cand3);
    console.log('\nThe Winner is: '+hex2str(winner));
};   
deploy();