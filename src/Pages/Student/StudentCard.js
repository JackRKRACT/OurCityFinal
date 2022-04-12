import React from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import Comments from '../../Components/Comments';

export default class StudentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.renderStudentCard = this.renderStudentCard.bind(this);
  }

  render() {
    return (
      <div>
        {this.renderStudentCard()}
      </div>
    )
  }

  renderStudentCard() {
    return (
      <Card>
        <Card.Body>
            <Card.Title>{this.props.card_details.bisn}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{this.props.card_details.lat} {this.props.card_details.lng}</Card.Subtitle>
            <Card.Text>
                {this.props.card_details.desc}
            </Card.Text>
            <ButtonGroup>
              <Button variant="outline-secondary" onClick={() => window.open("https://www.google.com/maps/dir//" + this.props.card_details.lat + "," + this.props.card_details.lng)}>Directions</Button>{' '}
              {this.props.isValid && <Comments comment_details={this.props.card_details} userCookie={this.props.userCookie}/>}
            </ButtonGroup>
        </Card.Body>
      </Card>
    )
  }
}