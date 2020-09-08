import React, { useState, useEffect } from 'react';
import firebase from '../utils/firebase';
import {
    Card,
    Row,
    Container,
    Col,
    FormGroup,
    FormLabel,
    FormControl,
    Form,
    Button
} from "react-bootstrap";
import { Redirect } from 'react-router-dom';


const database = firebase.firestore();


const Error = ({ error }) => {
    return (
        <Container fluid>
            <Row style={{ minHeight: "90vh" }}>
                <Col md={4} className="m-auto">
                    <Card className="shadow"
                        style={{ padding: "25px", verticalAlign: "middle", borderColor: "#3472F7" }}>
                        <h4>{error.status} Error</h4>
                        <p>{error.mess}</p>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

let recaptcha, e;

function Auth() {

    const [voters, setVoters] = useState([]);
    const [selectedVoter, setSelectedVoter] = useState();
    const [mobiles, setMobiles] = useState([]);
    //const [error, setError] = useState();

    const selectVoter = (voter) => {
        setSelectedVoter(voter);
        {
            database.collection("voters").doc(voter.id).update({
              done : "yes"
            });
        }
        database.collection('voters').doc(voter.id).collection('mobiles').get()
            .then(response => {
                const fetchedMobiles = [];
                response.forEach(document => {
                    const fetchedMobile = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedMobiles.push(fetchedMobile);
                });
                setMobiles(fetchedMobiles);
                setFormData({ ...formData, phoneNo: fetchedMobiles[0].number });
            })
            .catch(error => {
                setState({
                    ...state,
                    toError: true,
                    error
                });
            });
    }

    useEffect(() => {
        database.collection('voters')
        .where("done", "==", "no")
        .get()
            .then(response => {
                const fetchedVoters = [];
                response.docs.forEach(document => {
                    const fetchedVoter = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedVoters.push(fetchedVoter);
                });
                setVoters(fetchedVoters);
            })
            .catch(error => {
                setState({
                    ...state,
                    toError: true,
                    error
                });
            });
    }, []);

    const [state, setState] = useState({
        phone: false,
        otp: true,
        toDashboard: false,
        toError: false,
        error: {}
    });

    const [formData, setFormData] = useState({
        otp: '',
        phoneNo: ''
    });

    const {
        phone,
        otp,
        toDashboard,
        toError,
        error
    } = state;

    const onSubmit = async event => {
        event.preventDefault();

        if (!phone) {
            try {
                recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha');
                e = await firebase.auth().signInWithPhoneNumber('+91' + formData.phoneNo, recaptcha)
                setState({ ...state, phone: true, otp: false });
            } catch (error) {
                setState({
                    ...state,
                    toError: true,
                    error
                });
            }
        }
        else {
            try {
                console.log(formData.otp);
                const result = await e.confirm(formData.otp);
                console.log(result.user);
                setState({ ...state, toDashboard: true });
            } catch (error) {
                setState({
                    ...state,
                    toError: true,
                    error
                });
            }
        }
    }

    const handleChange = event => setFormData({ ...formData, [event.target.name]: event.target.value });


    if (toDashboard) {
        return <Redirect to='/voting' />;
    }

    else if (toError) {
        return <Error error={error} />;
    }

    else {
        return (
            <div>
                <div style={{ background: "#ADD8E6",
                paddingTop: '50px', //border: '2px solid red',  
                paddingBottom: '20px', 
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
                    }} >
                    <h1 id="headline"><b> Voter login</b></h1>
            </div>
            <div style={{ 
                paddingTop: '50px', //border: '2px solid red',  
                paddingBottom: '20px', 
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
                    }} >
                <ul>
                    {voters.map(voter => (
                        <li key={voter.id} onClick={() => selectVoter(voter)}>
                            <h3><b>{voter.adhaar}</b></h3>
                        </li>
                    ))}
                </ul>
                {selectedVoter ? (
                    <ul>
                        {mobiles.map(mobile => (
                            <li key={mobile.id}>
                                <b>Mobile no. received proceed to get otp</b>
                            </li>
                        ))}
                    </ul>
                ) : null}
                </div>
                <Container fluid>
                    <Row style={{ minHeight: "90vh" }}>
                        <Col md={4} className="m-auto">
                            <Card className="shadow"
                                style={{ padding: "25px", verticalAlign: "middle", borderColor: "#3472F7" }}>
                                <h4>Login</h4>
                                <Form onSubmit={(event) => { onSubmit(event) }}>
                                    <FormGroup>
                                        <FormLabel>Click and verify to get otp</FormLabel>
                                        <FormControl
                                            type="text"
                                            name="phoneNo"
                                            disabled={phone}
                                            //value={formData.phoneNo}
                                            onChange={handleChange}
                                            //maxLength={10}
                                            //minLength={10}
                                            //required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormLabel>Otp</FormLabel>
                                        <FormControl
                                            type="password"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            disabled={otp}
                                            required />
                                    </FormGroup>
                                    <FormGroup>
                                        <div id="recaptcha"></div>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button type="submit">Submit</Button>
                                    </FormGroup>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                
            </div>
        );
    }
}

export default Auth;
