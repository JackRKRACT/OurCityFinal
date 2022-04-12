import React from 'react';
import Modal from 'react-modal';
import { Button, InputGroup, FormControl, Form} from 'react-bootstrap';

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

export default class JobApplication extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        fname: 'def_first',
        lname: 'def_last',
        email: 'def@def.def',
        phone: 1234567890,
        resume: 'def.pdf',
        bis_id: 'unknown',
        bis_name: 'unknown',
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
      let url = host + ":" + port + "/submitApplication"
      axios({
          method: 'post',
          url: url,
          data: {
            fname: this.state.fname,
            lname: this.state.lname,
            email: this.state.email,
            phone: this.state.phone,
            resume: this.state.resume,
            bis_id: this.props.job_details.id,
            bis_name: this.props.job_details.bisn,
            status: "active",
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
          contentLabel="Job Application Modal"
        >
          <div className="application">
            <h2>Applying to {this.props.job_details.bisn}</h2>
  
            <InputGroup>
              <InputGroup.Text>First</InputGroup.Text>
              <FormControl id="fname" name="fname" onChange={this.handleChange}/>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Last</InputGroup.Text>
              <FormControl id="lname" name="lname" onChange={this.handleChange}/>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Email</InputGroup.Text>
              <FormControl id="email" name="email" onChange={this.handleChange}/>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Phone #</InputGroup.Text>
              <FormControl id="phone" name="phone" onChange={this.handleChange}/>
            </InputGroup>
            <Form.Label column htmlFor="desc">Upload Resume</Form.Label>
            <InputGroup>
              <FormControl id="resume" name="resume" type="file" onChange={this.handleChange}/>
            </InputGroup>
  
            <Button variant="outline-primary" onClick={this.handleSubmit}>Submit</Button>
            <Button variant="outline-primary" onClick={this.props.closeThis}>Cancel posting</Button>
          </div>
        </Modal>
      </div>
    )
  }
}