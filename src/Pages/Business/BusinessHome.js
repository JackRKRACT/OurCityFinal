import { NewsContextProvider } from "./News/NewsContext";
import News from "./News/News";
import React from 'react';
import { Button } from 'react-bootstrap';
export default class BusinessHome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="main">
            <Button variant="light" onClick={this.props.returnHome}>Go back</Button>
			<NewsContextProvider>
				<News />
			</NewsContextProvider>
            </div>
        )
    }
}
