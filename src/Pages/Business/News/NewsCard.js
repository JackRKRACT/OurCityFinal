import React from "react";
import { Card } from 'react-bootstrap';

function NewsArticle({ data }) {
/*   return (
    <div className="news">
      <h1 className="news__title">{data.title}</h1>
      <p className="news__desc">{data.description}</p>
      <span className="news__author">{data.author}</span> <br />
      <span className="news__published">{data.publishedAt}</span>
      <span className="news__source">{data.source.name}</span>
    </div>
  ); */
  
  var date = data.publishedAt.split('T')
  date[1] = date[1].substring(0, (date[1].indexOf('Z')))

  return (
    <Card>
      <Card.Body>
        <Card.Title>{data.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{data.author}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">{date[0]} @ {date[1]}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">{data.source.name}</Card.Subtitle>
        <Card.Link href={data.url}>Source</Card.Link>
        <Card.Text>
          {data.description}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}




export default NewsArticle;