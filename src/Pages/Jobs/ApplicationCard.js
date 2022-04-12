import React from 'react';
import { Button, ButtonGroup, Card, Form, InputGroup, FormControl } from 'react-bootstrap';

const axios = require('axios').default;

export default class ApplicationCard extends React.Component {
  constructor(props) {
    // <ApplicationCard bisn={details.bis_name} card_details={details} userCookie={this.props.userCookie}></ApplicationCard>
    super(props);

    this.state = {
      isRemoved: false,
      startCancel: false,
      startApprove: false,
      startReject: false,
      responseDesc: "",
    };
    this.renderApplicationCard = this.renderApplicationCard.bind(this);
    this.cancelApp = this.cancelApp.bind(this);
    this.approveApp = this.approveApp.bind(this);
    this.rejectApp = this.rejectApp.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
  }

  render() {
    return (
      <div>
        {this.renderApplicationCard()}
      </div>
    )
  }

  updateDescription(e) {
    this.setState({
      responseDesc: e.target.value
    })
  }

  updateApplication(new_status) {
    let host = "http://127.0.0.1"
    let port = "5000"
    let url = host + ":" + port + "/updateApplication"
    let data = {
      'cookie': this.props.card_details.cookie,
      'bis_id': this.props.bis_id,
      'description': this.state.responseDesc,
      'status': new_status
    }
    axios.post(url, data).then((response) => {
      this.setState({
        isRemoved: true
      })
    }).catch((error) => {
        console.log(error);
    });
  }

  cancelApp() {
    if (this.state.startCancel) {
      // Redirect to POST stuff
      this.updateApplication("canceled")
    } else {
      this.setState({
        startCancel: true
      })
    }
  }

  approveApp() {
    if (this.state.startApprove) {
      // Redirect to POST stuff
      this.updateApplication("approved")
    } else {
      this.setState({
        startApprove: true
      })
    }
  }

  rejectApp() {
    if (this.state.startReject) {
      // Redirect to POST stuff
      this.updateApplication("rejected")
    } else {
      this.setState({
        startReject: true
      })
    }
  }

  renderApplicationCard() {
    return (
      <>
        {!this.state.isRemoved &&
            <Card>
            <Card.Body>
                <Card.Title>{this.props.bisn}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{this.props.card_details.cookie.this_user} - {this.props.card_details.status}</Card.Subtitle>
                <Card.Text>
                    {this.props.card_details.email}
                </Card.Text>
                    {this.props.type == "app" && this.props.card_details.status == "active" &&
                      <>
                        {!this.state.startReject && <Button onClick={this.approveApp} variant="outline-primary">Approve</Button>}
                        {this.state.startApprove &&
                          <>
                            <br></br>
                            <Form.Label column htmlFor="approvalForm">Approval response :</Form.Label>
                            <InputGroup>
                            <FormControl id="approvalForm" name="approvalForm" as="textarea" aria-label="With textarea" onChange={this.updateDescription}/>
                            </InputGroup>
                          </>
                        }
                        {!this.state.startApprove && <Button onClick={this.rejectApp} variant="outline-primary">Reject</Button>}
                        {this.state.startReject &&
                          <>
                            <br></br>
                            <Form.Label column htmlFor="rejectForm">Rejection response :</Form.Label>
                            <InputGroup>
                            <FormControl id="rejectForm" name="rejectForm" as="textarea" aria-label="With textarea" onChange={this.updateDescription}/>
                            </InputGroup>
                          </>
                        }
                      </>
                    }
                    {this.props.type == "response" &&
                    <>
                      {this.props.card_details.status != "active" &&
                      <>
                        <Card.Text>Response : {this.props.card_details.description}</Card.Text>
                        <Button onClick={this.cancelApp} variant="outline-primary">Remove</Button>
                      </>
                      }
                      {this.props.card_details.status == "active" &&<Button onClick={this.cancelApp} variant="outline-primary">Cancel</Button>}
                      {this.state.startCancel &&
                        <>
                          <br></br>
                          <Form.Label column htmlFor="cancelForm">Cancellation reason :</Form.Label>
                          <InputGroup>
                          <FormControl id="cancelForm" name="cancelForm" as="textarea" aria-label="With textarea" onChange={this.updateDescription}/>
                          </InputGroup>
                        </>
                      }
                    </>
                    }
            </Card.Body>
          </Card>      
        }      
      </>
    )
  }
}