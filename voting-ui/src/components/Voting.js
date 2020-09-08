import React, { useEffect, useState } from 'react';
import web3 from '../utils/web3';
import voting from '../utils/voting';
import hex2string from '../utils/hextostring.js';
import './Voting.css'




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

const Voting = () => {

    const [formData, setFormData] = useState(initialState);

    const [state, setState] = useState({
        dis: false
    });

    const {
        dis
      } = state;

    const fetchData = async () => {

        try {

            let votesfor1 = await voting.methods.totalvotesfor(initCandidate[0]).call();
            let votesfor2 = await voting.methods.totalvotesfor(initCandidate[1]).call();
            let votesfor3 = await voting.methods.totalvotesfor(initCandidate[2]).call();
            let votesfor4 = await voting.methods.totalvotesfor(initCandidate[3]).call();
           

        } catch (error) {
            console.error(error.message);
        }

    }

    useEffect(() => { fetchData() }, []);

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
                    .send({ from: accounts[0], gas: '1000000' });
                fetchData();
            } catch (error) {
                console.error(error.message);
            }

            setFormData({
                ...formData,
                message: 'Thank you for voting!'
            });
          
    }

    const onClick = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const declareWinner = async () => {
        const winner1 = await voting.methods.getWinner().call();
        const winner = hex2string(winner1);
        let votesfor1 = await voting.methods.totalvotesfor(initCandidate[0]).call();
        let votesfor2 = await voting.methods.totalvotesfor(initCandidate[1]).call();
        let votesfor3 = await voting.methods.totalvotesfor(initCandidate[2]).call();
        let votesfor4 = await voting.methods.totalvotesfor(initCandidate[3]).call();
        setFormData({
            ...initialState,
            winner,
            votesfor1,
            votesfor2,
            votesfor3,
            votesfor4
        });
        setState({ ...state, dis: true });
    };

    if (dis) {
        return (<div className='header' >
        <div style={{ background: "#ADD8E6",
        paddingTop: '50px', //border: '2px solid red',  
        paddingBottom: '20px', 
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
            }} >
            <h1 id="headline"><b> Decentralized Voting App</b></h1>
            </div>
            <div style={{
        paddingTop: '10px', background: "#ADD8E6",  
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
            }} >
            <p id="text">
                There are currently{' '}
                {3} candidates/political parties entered.
            </p>
            </div>
            <hr />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }} >
            <div className='column'>
                <img src="https://5.imimg.com/data5/MQ/CW/IU/SELLER-4261172/3d-congress-logo-500x500.jpg" alt=''
                    style={{ height: '400', width: '400' }}
                    alt-text="congress"
                />
                <b>CONGRESS</b>
            </div>            
            <div className='column' >
                <img src='https://5.imimg.com/data5/DG/WR/MY-805539/bjp-flag-500x500.jpg' alt=''
                    style={{ height: '400', width: '400' }}
                    alt-text="bjp" />
                <b fontSize="1px">BJP</b>
            </div>
            <div className='column' >
                <img src='https://i1.sndcdn.com/artworks-000083087011-onx7v6-t500x500.jpg' alt=''
                    style={{ height: '400', width: '400' }}
                    alt-text="aap" />
                <b>AAM AADMI PARTY</b>
            </div>
            </div>
            <br />
            
            <div >
            <h3 style={{   
        display: "flex", background: "#ADD8E6",
        justifyContent: "center",
        alignItems: "center"
            }} >{message}</h3>
            <hr />
            <h3 style={{   
        display: "flex", background: "#ADD8E6",
        justifyContent: "center",
        alignItems: "center"
            }} >CONGRESS: {votesfor1} </h3>
            <hr />
            <h3 style={{   
        display: "flex", background: "#ADD8E6",
        justifyContent: "center",
        alignItems: "center"
            }} >BHARTIYA JANTA PARTY: {votesfor2} </h3>
            <hr />
            <h3 style={{   
        display: "flex", background: "#ADD8E6",
        justifyContent: "center",
        alignItems: "center"
            }} >AAM AADMI PARTY: {votesfor3} </h3>
            <hr />
            <h3 style={{   
        display: "flex", background: "#ADD8E6",
        justifyContent: "center",
        alignItems: "center"
            }} >NONE OF THE ABOVE(NOTA): {votesfor4} </h3>
            <hr />
            <div style={{   
        display: "flex", bgColor: "red",
        justifyContent: "center",
        alignItems: "center"}} >
            <button style={{bgColor: 'red'}} className="Button" onClick={() => declareWinner()}><b>END VOTING</b></button>
            </div>
            <h3 style={{   
        display: "flex", background: "#ADD8E6",
        justifyContent: "center",
        alignItems: "center"}} >The Winner: {winner}</h3>
            </div>
        </div>);
    }
    else{
        return (
            <div className='header' >
            <div style={{ background: "#ADD8E6",
            paddingTop: '50px', //border: '2px solid red',  
            paddingBottom: '20px', 
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
                }} >
                <h1 id="headline"><b> Decentralized Voting App</b></h1>
                </div>
                <div style={{
            paddingTop: '10px', background: "#ADD8E6",  
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
                }} >
                <p id="text">
                    There are currently{' '}
                    {3} candidates/political parties entered.
                </p>
                </div>
                <hr />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }} >
                <div className='column'>
                    <img src="https://5.imimg.com/data5/MQ/CW/IU/SELLER-4261172/3d-congress-logo-500x500.jpg" alt=''
                        style={{ height: '400', width: '400' }}
                        alt-text="congress"
                    />
                    <b>CONGRESS</b>
                </div>            
                <div className='column' >
                    <img src='https://5.imimg.com/data5/DG/WR/MY-805539/bjp-flag-500x500.jpg' alt=''
                        style={{ height: '400', width: '400' }}
                        alt-text="bjp" />
                    <b fontSize="1px">BJP</b>
                </div>
                <div className='column' >
                    <img src='https://i1.sndcdn.com/artworks-000083087011-onx7v6-t500x500.jpg' alt=''
                        style={{ height: '400', width: '400' }}
                        alt-text="aap" />
                    <b>AAM AADMI PARTY</b>
                </div>
                </div>
                <br />
                <div style={{   
            display: "flex", background: "#ADD8E6",
            justifyContent: "center",
            alignItems: "center"
                }} >
                <form onSubmit={(event) => onSubmit(event)} style={{ paddingTop: '50px', paddingBottom: '50px' }} >
                    <h3 style={{ color: 'red' }}x><b>Type the Political Party's Name</b></h3>
                    <div style={{   
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
                }} >
                        <input
                            name='vote'
                            value={vote}
                            onChange={event => onClick(event)}
                        />
                    </div>
                </form>
                </div>
                <div >
                <h3 style={{   
            display: "flex", background: "#ADD8E6",
            justifyContent: "center",
            alignItems: "center"
                }} >{message}</h3>
                <hr />
                <h3 style={{   
            display: "flex", background: "#ADD8E6",
            justifyContent: "center",
            alignItems: "center"
                }} >CONGRESS: {votesfor1} </h3>
                <hr />
                <h3 style={{   
            display: "flex", background: "#ADD8E6",
            justifyContent: "center",
            alignItems: "center"
                }} >BHARTIYA JANTA PARTY: {votesfor2} </h3>
                <hr />
                <h3 style={{   
            display: "flex", background: "#ADD8E6",
            justifyContent: "center",
            alignItems: "center"
                }} >AAM AADMI PARTY: {votesfor3} </h3>
                <hr />
                <h3 style={{   
            display: "flex", background: "#ADD8E6",
            justifyContent: "center",
            alignItems: "center"
                }} >NONE OF THE ABOVE(NOTA): {votesfor4} </h3>
                <hr />
                <div style={{   
            display: "flex", bgColor: "red",
            justifyContent: "center",
            alignItems: "center"}} >
                <button style={{bgColor: 'red'}} className="Button" onClick={() => declareWinner()}><b>END VOTING</b></button>
                </div>
                <h3 style={{   
            display: "flex", background: "#ADD8E6",
            justifyContent: "center",
            alignItems: "center"}} >The winner: {winner}</h3>
                </div>
            </div>
        );
    }    
}

export default Voting;
