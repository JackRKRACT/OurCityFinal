import React, { useContext } from "react";
import { NewsContext } from "./NewsContext";
import NewsCard from "./NewsCard";
import { Element as ScrElement } from 'react-scroll'

export default function News(props) {
  const { data } = useContext(NewsContext);

  return (
    <div style={{overflowY:'scroll', height:'80vh'}}>
      <ScrElement>
        {data ? data.articles.map((news) => (
            <NewsCard data={news} key={news.url} />
          ))
        : "Loading"
        }
      </ScrElement>
    </div>
  );
}