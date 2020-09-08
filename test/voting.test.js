const assert = require('assert'); //for test purposes
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Web3 (class(constructor is called))
//const web3 = new Web3(ganache.provider());
//const hex2str = require('../hextostring.js');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface , bytecode } = require('../compile.js');
const hex2str = require('../hextostring.js');
/*
const interface = require('../compile.js').interface;
const bytecode = require('../compile.js').bytecode;
*/
var initCandidate = ["0x434f4e4752455353000000000000000000000000000000000000000000000000", //congress
                     "0x4248415254495941204a414e5441205041525459000000000000000000000000", //bjp
                     "0x41414d204141444d492050415254590000000000000000000000000000000000" //aap
                    ]; 

let accounts;
let contractInstance;

beforeEach ( async () => {
    //get a list of all accounts
    accounts = await web3.eth.getAccounts();
    //use one of those accounts to deploy contract  
    contractInstance = await new web3.eth.Contract(JSON.parse(interface))
                .deploy({ data: bytecode, arguments: [initCandidate] })
                .send({ from: accounts[0], gas: '1000000' });
    contractInstance.setProvider(provider);
    //console.log(contractInstance);
});
describe('TEST FOR VOTING DAPP', () => {
     it('checks for contract address', () => {
    //    assert.ok(contractInstance.options.address);
    });

    it('vote function', async () => {
        await contractInstance.methods.voteforcandidate(initCandidate[0]).send({ from: accounts[0], gas: '1000000' });
        await contractInstance.methods.voteforcandidate(initCandidate[1]).send({ from: accounts[0], gas: '1000000' });
        await contractInstance.methods.voteforcandidate(initCandidate[1]).send({ from: accounts[0], gas: '1000000' });
        const cand1 = await contractInstance.methods.totalvotesfor(initCandidate[0]).call();
        const cand2 = await contractInstance.methods.totalvotesfor(initCandidate[1]).call();
        const cand3 = await contractInstance.methods.totalvotesfor(initCandidate[2]).call();
        assert.equal( cand1, 1); 
        assert.equal( cand2, 2);
        assert.equal( cand3, 0);
    });

    it('verifies winner', async() => {
        await contractInstance.methods.voteforcandidate(initCandidate[0]).send({ from: accounts[0], gas: '1000000' });
        await contractInstance.methods.voteforcandidate(initCandidate[1]).send({ from: accounts[0], gas: '1000000' });
        await contractInstance.methods.voteforcandidate(initCandidate[1]).send({ from: accounts[0], gas: '1000000' });
        const winner = await contractInstance.methods.getWinner().call();
        assert.equal(winner,"0x4248415254495941204a414e5441205041525459000000000000000000000000");
        console.log('The Winner is: '+hex2str(winner));
    });

});