import React from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { Element as ScrElement } from 'react-scroll'
import ApplicationCard from './ApplicationCard';

const axios = require('axios').default;

const customStyles = {
  content: {
    top: '50%',
    left: '55%',
    right: '40%',
    bottom: '0%',
    height: '70%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export default class ViewApplication extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        isOpen: false,
        active_apps: [],
        responses: [],
        recieved_data: false,
      };

      this.requestData = this.requestData.bind(this);
      this.openMe = this.openMe.bind(this);
      this.closeMe = this.closeMe.bind(this);
      this.renderActiveApplications = this.renderActiveApplications.bind(this);
      this.renderResponses = this.renderResponses.bind(this);
  }

  openMe() {
    this.requestData();
    this.setState({
        isOpen: true
    })
  }

  closeMe() {
    this.setState({
        isOpen: false
    })
  }

  requestData() {
    let host = "http://127.0.0.1"
    let port = "5000"
    let url = host + ":" + port + "/getApplications"
    let data = {
      cookie: this.props.userCookie
    }
    // We want to get both a list of the applications from our own postings, and a list of the applications that we have applied to.
    // From people applying to ours, we wanna be able to approve or deny applications. (allowing server side changes)
    //this.props.userCookie

    axios.post(url, data).then((response) => {
      console.log("Successful request for user applications")
      console.log(response.data)
      this.setState({
        active_apps: response.data.apps,
        responses: response.data.responses,
        recieved_data: true,
      })
    }).catch((error) => {
        console.log(error);
    });
  }

  render() {
    return (
      <div>
        <Button variant="light" onClick={this.openMe}>Applications</Button>
        {this.state.isOpen &&
          <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.closeMe}
          style={customStyles}
          contentLabel="Application Overview Modal">
          <div className="application" style={{display:'flex'}}>
            <div style={{flexDirection: 'column', width:'100%'}}>
              <h1>My applications</h1>
              {this.state.recieved_data && this.renderActiveApplications()}
            </div>
            <div style={{flexDirection: 'column', marginLeft:'5%', width:'100%'}}>
              <h1>My responses</h1>
              {this.state.recieved_data && this.renderResponses()}
            </div>
          </div>
          <Button variant="outline-primary" onClick={this.closeMe}>Close</Button>
          </Modal> 
        }
      </div>
    )
  }

  renderActiveApplications() {
    return (
      <div style={{overflowY: 'scroll',paddingRight: '20px', height:'50vh'}}>
        <ScrElement>
          {this.state.active_apps.map(details => {
          return (
            <div key={"div" + details.bis_id}>
              <ApplicationCard bis_id={details.bis_id} bisn={details.bis_name} card_details={details} userCookie={this.props.userCookie} type="response"></ApplicationCard>
            </div>
          );
          })}
        </ScrElement>
      </div>
    );
  }

  renderResponses() {
    return (
      <div style={{overflowY: 'scroll',paddingRight: '20px', height:'50vh'}}>
        <ScrElement>
          {this.state.responses.map(details => {
          return (
            <div key={"div" + details.bis_id}>
              <ApplicationCard bis_id={details.bis_id} bisn={details.bis_name} card_details={details} userCookie={this.props.userCookie} type="app"></ApplicationCard>
            </div>
          );
          })}
        </ScrElement>
      </div>
    );
  }
}