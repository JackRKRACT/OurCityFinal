import React from 'react';
import { Card } from 'react-bootstrap';

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

  render() {
    return (
        <Card>
        <Card.Body>
            <Card.Title>{this.props.comment_details.cookie.this_user}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{this.props.comment_details.post_time}</Card.Subtitle>
            <Card.Text>
            {this.props.comment_details.comment_text}
            </Card.Text>
        </Card.Body>
        </Card>
    )
  }
}