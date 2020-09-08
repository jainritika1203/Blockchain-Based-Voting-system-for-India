import React, { useEffect, useState } from 'react';
import './App.css';
import web3 from './web3';
import voting from './voting';
import hex2string from './hextostring.js';

const initCandidate = [
  "0x434f4e4752455353000000000000000000000000000000000000000000000000", //congress
  "0x4248415254495941204a414e5441205041525459000000000000000000000000", //bjp
  "0x41414d204141444d492050415254590000000000000000000000000000000000", //aap
  "0x4e4f544100000000000000000000000000000000000000000000000000000000" //nota
];

const initialState = {
  winner: '',
  message: '',
  vote: '',
  votesfor1: '',
  votesfor2: '',
  votesfor3: '',
  votesfor4: ''
};

const App = () => {

  const [formData, setFormData] = useState(initialState);

  const fetchData = async () => {
    try {
      let votes = [];
      Promise.all(
        initCandidate.map(async candidate => {
          const vote = await voting.methods.totalvotesfor(candidate).call();
          console.log(candidate, vote);
          votes.push(vote);
        })
      );

      setFormData({
        votesfor1: vote[0],
        votesfor2: vote[1],
        votesfor3: vote[2],
        votesfor4: vote[3]
      });

    } catch (error) {
      console.error(error.message);
    }

  }

  useEffect(() => {
    console.log(voting.options.address);
    fetchData();
  }, [])

  const {
    winner,
    message,
    vote,
    votesfor1,
    votesfor2,
    votesfor3,
    votesfor4
  } = formData;

  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log('account is: ', accounts[0]);

    let candidate = '';

    if (vote === "CONGRESS")
      candidate = initCandidate[0];
    else if (vote === "BJP")
      candidate = initCandidate[1];
    else if (vote === "AAP")
      candidate = initCandidate[2];
    else if (vote === "NOTA")
      candidate = initCandidate[3];
    else
      return;

    try {
      await voting.methods.voteforcandidate(candidate)
        .send({ from: accounts[0] });
    } catch (error) {
      console.error(error.message);
    }

    setFormData({ message: 'Thank you for voting!' });
  }

  const onClick = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const declareWinner = async () => {
    const winner1 = await voting.methods.getWinner().call();
    const winner = hex2string(winner1);
    setFormData({
      ...initialState,
      winner
    });
  };

  return (
    <div className='header' >
      <h2 id="headline">Decentralized Voting App</h2>
      <p id="text">
        There are currently{' '}
        {3} candidates/political parties entered.
        </p>

      <hr />
      <div className='column'>
        <img src="./bjp.png" alt=''
          style={{ height: '400', width: 'auto' }}
          alt-text="congress"
        />
        <b>CONGRESS</b>
      </div>
      <div className='column' >
        <img src='./congress.jpg' alt=''
          style={{ height: '400', width: 'auto' }}
          alt-text="bjp" />
        <b font-size="1px">BJP</b>
      </div>
      <div className='column' >
        <img src='./aap.jpg' alt=''
          style={{ height: '400', width: 'auto' }}
          alt-text="aap" />
        <b>AAM AADMI PARTY</b>
      </div>
      <br />
      <form onSubmit={() => onSubmit()} style={{ paddingTop: '450px' }} >
        <h4 style={{ color: 'red' }}>Type the Political Party's Name</h4>
        <div>
          <input
            name='vote'
            value={vote}
            onChange={event => onClick(event)}
          />
        </div>
      </form>
      <h2>{message}</h2>
      <hr />
      <h2>CONGRESS: {votesfor1} </h2>
      <hr />
      <h2>BHARTIYA JANTA PARTY: {votesfor2} </h2>
      <hr />
      <h2>AAM AADMI PARTY: {votesfor3} </h2>
      <hr />
      <h2>NONE OF THE ABOVE(NOTA): {votesfor4} </h2>
      <hr />
      <button className="Button" onClick={() => declareWinner()}><b>END VOTING</b></button>
      <h2>The winner: {winner}</h2>
    </div>
  );
}

export default App;
