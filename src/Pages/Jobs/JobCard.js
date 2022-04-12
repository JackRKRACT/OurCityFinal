import React from 'react';
import JobApplication from './JobApplication';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import Comments from '../../Components/Comments';

export default class JobCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
			applying: false,
    };

    this.renderJobCard = this.renderJobCard.bind(this);
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
      <div>
        {this.renderJobCard()}
      </div>
    )
  }

  renderJobCard() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>{this.props.card_details.bisn}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.card_details.lat} {this.props.card_details.lng}</Card.Subtitle>
          <Card.Text>
            {this.props.card_details.desc}
          </Card.Text>
          <ButtonGroup aria-label="Job Header Buttons">
            {this.props.userCookie.this_cookie != "none" && <Button variant="outline-primary" onClick={this.startApplication}>Apply</Button>}
            <Button variant="outline-secondary" onClick={() => window.open("https://www.google.com/maps/dir//" + this.props.card_details.lat + "," + this.props.card_details.lng)}>Directions</Button>
            {this.props.userCookie.this_cookie != "none" && <Comments comment_details={this.props.card_details} userCookie={this.props.userCookie}/>}
          </ButtonGroup>
          <JobApplication isOpen={this.state.applying} closeThis={this.stopApplication} job_details={this.props.card_details} userCookie={this.props.userCookie}/>
        </Card.Body>
      </Card>
    )
  }
}