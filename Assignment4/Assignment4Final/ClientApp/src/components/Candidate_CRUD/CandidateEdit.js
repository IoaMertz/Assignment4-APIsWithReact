﻿import React, { useEffect, useState } from "react";

import { ListGroup, ListGroupItem, Button, Table, Row, Col, Stack, Form, CloseButton } from 'react-bootstrap';

import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

export default function CandidateEdit(props) {

    const params = useParams();
    const router = useNavigate();
    const [genders, setGenders] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [photoIdTypes, setPhotoIdTypes] = useState([]);
    const [countries, setCountries] = useState([]);
    const [allUsers, setAllusers] = useState([]);

    const [registerCand, setRegisterCand] = useState([]);
    //console.log(params.id);
    const [candidate, setCandidate] = useState({
        dateOfBirth: null,
        photoIdIssueDate: null,
        gender: [],
        language: [],
        photoIdType: [],
        address: []
    });

    const fetchData = () => {
        if (params.id !== undefined) {
            axios.get(`https://localhost:7196/api/Candidate/${params.id}`).then((response) => {
                setCandidate(response.data.data);
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            axios.get(`https://localhost:7196/api/accounts/listUsers`).then((response) => {
                setAllusers(response.data);
            }).catch(function (error) {
                console.log(error);
            });


        }

        axios.get(`https://localhost:7196/api/Genders`).then((response) => {
            setGenders(response.data.data);
        }).catch(function (error) {
            console.log(error);
        });

        axios.get(`https://localhost:7196/api/Languages`).then((response) => {
            setLanguages(response.data.data);
        }).catch(function (error) {
            console.log(error);
        });

        axios.get(`https://localhost:7196/api/PhotoIdTypes`).then((response) => {
            setPhotoIdTypes(response.data.data);
        }).catch(function (error) {
            console.log(error);
        });

        axios.get(`https://localhost:7196/api/Countries`).then((response) => {
            setCountries(response.data.data);

        }).catch(function (error) {
            console.log(error);
        });

    }

      useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(params.id);
        if (params.id === undefined) {
            console.log("send post")
            axios.post(`https://localhost:7196/api/Candidate`, candidate)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            console.log("send put")
            axios.put(`https://localhost:7196/api/Candidate/${params.id}`, candidate)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }



        console.log("THIS IS MINE ", candidate);
    }

    const handleChangeRegister = (event) => {
        const { name, value, type } = event.target;

        console.log(name);
        console.log(type);
        console.log(value);
        setRegisterCand({ ...registerCand, [name]: value });

        console.log(registerCand);


    }


    const handleChange = (event, addressIndex) => {
        //console.log(candidate);

        const { name, value, type } = event.target;
        //console.log(event.target)
        //console.log(name);
        //console.log(type);
        //console.log(value);
        if (addressIndex === undefined) {
            if (name === "gender") {
                setCandidate({ ...candidate, [name]: genders.find(item => item.id === Number(value)) });
            } else if (name === "language") {
                setCandidate({ ...candidate, [name]: languages.find(item => item.id === Number(value)) });
            } else if (name === "photoIdType") {
                setCandidate({ ...candidate, [name]: photoIdTypes.find(item => item.id === Number(value)) });
            } else if (type === "date") {
                setCandidate({ ...candidate, [name]: convertStringToDate(value) });
            } else {
                setCandidate({ ...candidate, [name]: value });
            }
        } else {
            setCandidate({
                ...candidate, address: candidate.address.map((address, index) => {
                    if (index === addressIndex) {
                        if (name === "country") {
                            return {
                                ...address, [name]: countries.find(item => item.id === Number(value))
                            };
                        } else {
                            return {
                                ...address, [name]: value
                            };
                        }
                    }
                    return address;
                })
            });
        }
    };

    const addAddress = () => {
        setCandidate({
            ...candidate, address: [...candidate.address,
                { id: 0, address1: "", address2: "", city: "", state: "", country: {} }
            ]
        })
    }

    const removeAddress = (removeIndex) => {

        const updatedAddress = [...candidate.address];
        updatedAddress.splice(removeIndex, 1);
        console.log(updatedAddress)
        setCandidate({ ...candidate, address: updatedAddress });

    }
    const convertStringToDate = (dateString) => {
        //intial format 
        //2015-07-15
        const date = new Date(dateString);
        //Wed Jul 15 2015 00:00:00 GMT-0700 (Pacific Daylight Time)
        const finalDateString = date.toISOString(date)
        //2015-07-15T00:00:00.000Z

        console.log(finalDateString); // "1930-07-17T00:00:00.000Z"
        return finalDateString;
    }

    const convertDateToString = (date) => {
        //console.log(date);
        let kati = new Date(date);
        //console.log(candidate.dateOfBirth)
        //console.log(kati);

        let formattedDate = kati.toISOString().substr(0, 10);

        //console.log(formattedDate);


        return formattedDate;
    }

    //console.log(candidate)

    return (
        <div>
            <fieldset disabled={false }>
            <Form onSubmit={handleSubmit} className="lead" disabled={ true} >
                <p>{params.id}</p>
                <Stack gap={3}>

                    {!params.id && <div>
                        need to add register part

                        {/*<Row>*/}
                        {/*    <Col>*/}
                        {/*        <Form.Group >*/}
                        {/*            <Form.Label>Username</Form.Label>*/}
                        {/*            <Form.Control type="text" name="username" value={registerCand.username} onChange={handleChangeRegister} />*/}
                        {/*        </Form.Group>*/}
                        {/*    </Col>*/}
                        {/*    <Col>*/}
                        {/*        <Form.Group >*/}
                        {/*            <Form.Label>Email</Form.Label>*/}
                        {/*            <Form.Control type="email" name="email" value={registerCand.email} onChange={handleChangeRegister} />*/}
                        {/*        </Form.Group>*/}
                        {/*    </Col>*/}
                        {/*    <Col>*/}
                        {/*        <Form.Group >*/}
                        {/*            <Form.Label>Password</Form.Label>*/}
                        {/*            <Form.Control type="password" name="password" value={registerCand.password} onChange={handleChangeRegister} />*/}
                        {/*        </Form.Group>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}

                    </div>}
                    <div className="display-6 fs-2" >Personal Details</div>

                    <Row>
                        <Col>
                            <Form.Group >
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="firstName" value={candidate.firstName} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group >
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control type="text" name="middleName" value={candidate.middleName} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group >
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="lastName" value={candidate.lastName} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group >
                                <Form.Label>Gender</Form.Label>
                                <Form.Select as="select" name="gender"
                                    value={candidate.gender.id}
                                    onChange={handleChange}
                                    required>
                                    <option value="" hidden>Please choose a gender... </option>
                                    {genders.map((gender, index) =>
                                        <option key={index}
                                            value={gender.id}
                                        >{gender.genderType}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <Form.Group >
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date"
                                    name="dateOfBirth"
                                    value={convertDateToString(candidate.dateOfBirth)}
                                    onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group >
                                <Form.Label>Native Language</Form.Label>
                                <Form.Select as="select" name="language"
                                    value={candidate.language.id}
                                    onChange={handleChange}>
                                    <option value="" hidden >Please choose your native Language... </option>

                                    {languages.map((lan, index) =>
                                        <option key={index}
                                            value={lan.id}
                                        >{lan.nativeLanguage}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <hr />
                    <div className="display-6 fs-2" >Contact Details</div>
                    <Row>
                        <Col>
                            <Form.Group >
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={candidate.email} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group >
                                <Form.Label>Candidate Number</Form.Label>
                                <Form.Control type="number" name="candidateNumber" value={candidate.candidateNumber} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group >
                                <Form.Label>Landline Number</Form.Label>
                                <Form.Control type="text" name="landline" value={candidate.landline} onChange={handleChange} />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group >
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control type="text" name="mobile" value={candidate.mobile} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                    </Row>
                        <div>
                            <Stack gap={3 }>
                        {candidate.address &&
                            candidate.address.map((item, index) => (
                                <div key={index} name={item.id} className="my-1 ">

                                    <Row>
                                        <details className="display-6 fs-4">
                                            <summary>
                                                Address {index + 1}
                                            </summary>
                                            <div className="card card-body ">
                                                <div className="justify-content-end">
                                                    <CloseButton onClick={() => removeAddress(index)} />
                                                </div>

                                            <Row>
                                                <Col>
                                                    <Form.Group >
                                                        <Form.Label>address1</Form.Label>
                                                        <Form.Control type="text" name="address1" value={item.address1} onChange={(event) => handleChange(event, index)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group >
                                                        <Form.Label>address2</Form.Label>
                                                        <Form.Control type="text" name="address2" value={item.address2} onChange={(event) => handleChange(event, index)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group >
                                                        <Form.Label>postalCode</Form.Label>
                                                        <Form.Control type="text" name="postalCode" value={item.postalCode} onChange={(event) => handleChange(event, index)} />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Form.Group >
                                                        <Form.Label>city</Form.Label>
                                                        <Form.Control type="text" name="city" value={item.city} onChange={(event) => handleChange(event, index)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group >
                                                        <Form.Label>state</Form.Label>
                                                        <Form.Control type="text" name="state" value={item.state} onChange={(event) => handleChange(event, index)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group >
                                                        <Form.Label>country</Form.Label>
                                                        <Form.Select as="select" name="country"
                                                                value={item.country.id}
                                                                onChange={(event) => handleChange(event, index)} required>
                                                                <option value="" hidden >Please choose your Country... </option>

                                                            {countries.map((country, index) =>
                                                                <option key={index}
                                                                    value={country.id}
                                                                >{country.countryOfResidence}</option>
                                                            )}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            </div>
                                        </details>

                                    </Row>
                                </div>
                            ))}
                                <Button onClick={addAddress}>add address</Button>
                            </Stack>
                    </div>



                    <hr />

                    <div className="display-6 fs-2" >Identification Details</div>

                    <Row>
                        <Col>
                            <Form.Group >
                                <Form.Label>Photo ID Number</Form.Label>
                                <Form.Control type="text" name="photoIdNumber" value={candidate.photoIdNumber} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group >
                                <Form.Label>Photo Issue Date</Form.Label>
                                <Form.Control type="date"
                                    name="photoIdIssueDate"
                                    value={convertDateToString(candidate.photoIdIssueDate)}
                                    onChange={handleChange} required />
                            </Form.Group>

                        </Col>
                        <Col>
                            <Form.Group >
                                <Form.Label>Type of Id</Form.Label>
                                <Form.Select as="select" name="photoIdType"
                                    value={candidate.photoIdType.id}
                                    onChange={handleChange}
                                    required>
                                    <option value="" hidden >Please choose your ID type... </option>

                                    {photoIdTypes.map((pId, index) =>
                                        <option key={index}
                                            value={pId.id}
                                        >{pId.idType}</option>
                                    )}
                                </Form.Select>

                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit">Save</Button>
                    <Button variant="primary" onClick={() => router(-1)}>Go back</Button>
                    </Stack>

            </Form>
            </fieldset>
        </div>
    )
}

//