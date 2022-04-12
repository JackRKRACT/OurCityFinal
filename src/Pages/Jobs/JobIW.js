import React from 'react';
import JobApplication from './JobApplication';
import { Button, Card } from 'react-bootstrap';
import Comments from '../../Components/Comments';

export default class JobIW extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      applying: false
    };

    this.startApplication = this.startApplication.bind(this);
    this.stopApplication = this.stopApplication.bind(this);
  }

  startApplication() {
    this.setState({
      applying: true
    })
  }

  stopApplication() {
    this.setState({
      applying: false
    })
  }

  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>{this.props.iw_details.bisn}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.iw_details.lat} {this.props.iw_details.lng}</Card.Subtitle>
          <Card.Text>
            {this.props.iw_details.desc}
          </Card.Text>
          <Card.Text>
            Phone # : {this.props.iw_details.phone}
          </Card.Text>
          <>
            {this.props.userCookie.this_cookie != "none" && <Button variant="outline-primary" onClick={this.startApplication}>Apply</Button>}
            <Button variant="outline-secondary" onClick={() => window.open("https://www.google.com/maps/dir//" + this.props.iw_details.lat + "," + this.props.iw_details.lng)}>Directions</Button>{' '}
            {this.props.userCookie.this_cookie != "none" && <Comments comment_details={this.props.iw_details} userCookie={this.props.userCookie}/>}
          </>
          <JobApplication isOpen={this.state.applying} closeThis={this.stopApplication} job_details={this.props.iw_details} userCookie={this.props.userCookie}/>
        </Card.Body>
      </Card>
    )
  }
}