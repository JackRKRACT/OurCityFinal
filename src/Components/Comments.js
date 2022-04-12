import React from 'react';
import Modal from 'react-modal';
import { Button, InputGroup, FormControl, Form} from 'react-bootstrap';
import Comment from './Comment';
import { Element as ScrElement } from 'react-scroll'

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

export default class Comments extends React.Component {
    // Each pin / application will have a comments section.
    /* Props
        - userCookie
        - comment_details
    */
    constructor(props) {
        super(props);
        this.state = {
            is_open: false,
            comment_text: "def_text",
            comment_arr: [],
            loaded_comments: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.openMe = this.openMe.bind(this);
        this.closeMe = this.closeMe.bind(this);
        this.getComments = this.getComments.bind(this);
        this.renderComments = this.renderComments.bind(this);
    }

    getComments() {
        let host = "http://127.0.0.1"
        let port = "5000"
        let url = host + ":" + port + "/getComments"

        let data = {
            bisn: this.props.comment_details.bisn,
            cookie: this.props.userCookie,
        }
        console.log("Grabbing comment section for " + this.props.comment_details.bisn)
        axios.post(url, data).then((response) => {
            if (response.data === "empty" || response.data === "invalid_cookie") {
                console.log("Successful getComments request, but no data was returned.")
            } else {
                console.log("Successful getComments request.")
                console.log(response.data);
    
                let comment_array = Object.values(response.data)
                console.log(comment_array);
                
                this.setState ({
                    comment_arr: comment_array,
                    loaded_comments: true
                })
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    closeMe() {
        this.setState({
            is_open: false,
        })
    }

    openMe() {
        this.getComments()
        this.setState({
            is_open: true,
        })
    }

    handleChange(e) {
        //console.log(e.target.name + " : " + e.target.value)
        this.setState ({
            [e.target.name]: e.target.value
        })
    }

    submitComment(e) {
        let host = "http://127.0.0.1"
        let port = "5000"
        let url = host + ":" + port + "/postComment"

        var currentdate = new Date(); 
        var datetime = currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes()

        console.log("Posting comment as " + this.props.userCookie.this_user + " at time : " + datetime);

/*         axios({
            method: 'post',
            url: url,
            data: {
                bisn: this.props.comment_details.bisn,
                comment_text: this.state.comment_text,
                cookie: this.props.userCookie,
                post_time: datetime,
            }
        }); */

        var data = {
            bisn: this.props.comment_details.bisn,
            comment_text: this.state.comment_text,
            cookie: this.props.userCookie,
            post_time: datetime,
        }

        axios.post(url, data).then((response) => {
            console.log("Successful submitComment request.")
            console.log(response.data)
            this.getComments();
        }).catch((error) => {
            console.log(error);
        });

        e.preventDefault();
    }

    render() {
    return (
        <div>
        <Button variant="outline-danger" onClick={this.openMe} style={{marginLeft:"-1px"}}>Discuss</Button>
        <Modal
            isOpen={this.state.is_open}
            onRequestClose={this.closeMe}
            style={customStyles}
            contentLabel="Comments Modal"
        >
            <div className="application">
            <h2>Comments for {this.props.comment_details.bisn}</h2>
            <h4>Logged in as : {this.props.userCookie.this_user}</h4>
            {this.state.loaded_comments && this.renderComments()}
            <Form.Label column htmlFor="desc">Comment Text</Form.Label>
            <InputGroup>
                    <FormControl id="comment_text" name="comment_text" as="textarea" aria-label="With textarea" onChange={this.handleChange}/>
            </InputGroup>
            <Button variant="outline-primary" onClick={this.submitComment}>Submit</Button>
            <Button variant="outline-primary" onClick={this.closeMe}>Close</Button>
            </div>
        </Modal>
        </div>
    )
    }

    // These cards will represent entries (often tied with pins), 
    renderComments() {
        return (
            <div style={{overflowY: 'scroll', height:'30vh'}}>
            <ScrElement>
                {this.state.comment_arr.map(details => {
                return (
                    <div key={"div" + details.id}>
                        <Comment comment_details={details} userCookie={this.props.userCookie}/>
                    </div>
                );
            })}
            </ScrElement>
        </div>
        );
    }
}