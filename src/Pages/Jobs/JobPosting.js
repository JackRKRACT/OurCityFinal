import React from 'react';
import Modal from 'react-modal';
import { Button, InputGroup, FormControl, Form} from 'react-bootstrap';

const axios = require('axios').default;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: '60%',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export default class JobPosting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bisn: 'def_bisn',
            jobn: 'def_jobn',
            salry: 0,
            phone: 1234567890,
            lat: 0,
            lng: 0,
            desc: 'def_desc',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        //console.log(e.target.name + " : " + e.target.value)
        this.setState ({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        let host = "http://127.0.0.1"
        let port = "5000"
        let url = host + ":" + port + "/submitPosting"
        axios({
            method: 'post',
            url: url,
            data: {
                bisn: this.state.bisn,
                jobn: this.state.jobn,
                salry: this.state.salry,
                phone: this.state.phone,
                parent: "job",
                lat: this.props.locationDetails.lat,
                lng: this.props.locationDetails.lng,
                desc: this.state.desc,
                cookie: this.props.userCookie,
            }
        });

        this.props.closeThis();
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.closeThis}
                style={customStyles}
                contentLabel="Job Posting Modal"
                >
                <div className="posting">
                    <h1>New posting</h1>
                    <InputGroup>
                        <InputGroup.Text>Business Name</InputGroup.Text>
                        <FormControl id="bisn" name="bisn" onChange={this.handleChange}/>
                    </InputGroup>
                        <InputGroup>
                        <InputGroup.Text>Job Title</InputGroup.Text>
                        <FormControl id="jobn" name="jobn" onChange={this.handleChange}/>
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Text>Salary</InputGroup.Text>
                        <FormControl id="salry" name="salry" onChange={this.handleChange}/>
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Text>Phone #</InputGroup.Text>
                        <FormControl id="phone" name="phone" onChange={this.handleChange}/>
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Text>Latitude</InputGroup.Text>
                        <FormControl id="lat" name="lat" value={this.props.locationDetails.lat} onChange={this.handleChange}/>
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Text>Longitude</InputGroup.Text>
                        <FormControl id="lng" name="lng" value={this.props.locationDetails.lng} onChange={this.handleChange}/>
                    </InputGroup>

                    <Form.Label column htmlFor="desc">Description</Form.Label>
                    <InputGroup>
                    <FormControl id="desc" name="desc" as="textarea" aria-label="With textarea" onChange={this.handleChange}/>
                    </InputGroup>

                    <Button variant="outline-primary" onClick={this.handleSubmit}>Submit</Button>
                    <Button variant="outline-primary" onClick={this.props.closeThis}>Cancel posting</Button>
                </div>
                </Modal>
            </div>
        )
    }
}