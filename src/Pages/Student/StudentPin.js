import React from 'react';
import Modal from 'react-modal';
import { Button, InputGroup, FormControl, Form, DropdownButton, Dropdown, ButtonGroup} from 'react-bootstrap';

const axios = require('axios').default;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export default class StudentPin extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        bisn: "def_name",
        desc: "def_desc",
        lat: 0,
        lng: 0,
        phone: 1234567890,
        type: 'def_type',
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleType = this.handleType.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
      console.log(e.target.name + " : " + e.target.value)
      this.setState ({
          [e.target.name]: e.target.value
      })
  }

  handleType(e) {
    console.log(e.target.name)
    this.setState ({
        type: e.target.name
    })
}

  handleSubmit(e) {
      let host = "http://127.0.0.1"
      let port = "5000"
      let url = host + ":" + port + "/submitStudentPin"
      axios({
          method: 'post',
          url: url,
          data: {
            bisn: this.state.bisn,
            desc: this.state.desc,
            phone: this.state.phone,
            type: this.state.type,
            parent: "student",
            lat: this.props.locationDetails.lat,
            lng: this.props.locationDetails.lng,
            cookie: this.props.userCookie,
          }
      });

      var close = this.props.closeThis;
      close();

      e.preventDefault();
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          onRequestClose={this.props.closeThis}
          style={customStyles}
          contentLabel="New Student Pin Modal"
        >
          <div className="application">
            <h2>New Student Pin</h2>
  
            <InputGroup>
              <InputGroup.Text>Name</InputGroup.Text>
              <FormControl id="bisn" name="bisn" onChange={this.handleChange}/>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Phone #</InputGroup.Text>
              <FormControl id="phone" name="phone" onChange={this.handleChange}/>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Latitude</InputGroup.Text>
              <FormControl id="lat" name="lat" onChange={this.handleChange} defaultValue={this.props.locationDetails.lat}/>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Longitude</InputGroup.Text>
              <FormControl id="lng" name="lng" onChange={this.handleChange} defaultValue={this.props.locationDetails.lng}/>
            </InputGroup>
            <Form.Label column htmlFor="desc">Description</Form.Label>
            <InputGroup>
                <FormControl id="desc" name="desc" as="textarea" aria-label="With textarea" onChange={this.handleChange}/>
            </InputGroup>

            <ButtonGroup>
                <DropdownButton id="dropdown-basic-button" title="Type">
                    <Dropdown.Item onClick={this.handleType} id={"lib"} name={"lib"}>Libraries</Dropdown.Item>
                    <Dropdown.Item onClick={this.handleType} id={"gym"} name={"gym"}>Gyms</Dropdown.Item>
                    <Dropdown.Item onClick={this.handleType} id={"bar"} name={"bar"}>Bars</Dropdown.Item>
                    <Dropdown.Item onClick={this.handleType} id={"coll"} name={"coll"}>Colleges</Dropdown.Item> 
                </DropdownButton>
    
                <Button variant="outline-primary" onClick={this.handleSubmit}>Submit</Button>
                <Button variant="outline-primary" onClick={this.props.closeThis}>Cancel</Button>
            </ButtonGroup>
          </div>
        </Modal>
      </div>
    )
  }
}