import React from 'react';
import { Element as ScrElement } from 'react-scroll'
import { Button, Popover, OverlayTrigger, ButtonGroup } from 'react-bootstrap';
import JobCard from './JobCard';
import JobPosting from './JobPosting';
import ViewApplication from './ViewApplications';

const axios = require('axios').default;

/* Goals of the Jobseeker class :
    - Get the current job listings around the city. (Both on map, and on cards)
    - Load comments from primary job seekers page.
    - On user request, add new job posting on map.
    - On user request, start applying for job posting on map.
*/

export default class JobHome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
			postJob: false,
            currentPostings: [],
            card_list: [],
            loaded_cards: false,
            isValid: false,
        };
        this.renderCards = this.renderCards.bind(this);
        this.startPosting = this.startPosting.bind(this);
        this.stopPosting = this.stopPosting.bind(this);
        this.finishedSelection = this.finishedSelection.bind(this);
        this.selectPopup = this.selectPopup.bind(this);
        this.exitJobs = this.exitJobs.bind(this);
        this.validateUser = this.validateUser.bind(this);
    }

    getListings() {

        let host = "http://127.0.0.1"
        let port = "5000"
        let url = host + ":" + port + "/"

        axios.get(url + "jobListings")
        .then((response) => {
            // Success
            let post_array = Object.values(response.data)
            console.log(post_array);
            
            this.setState ({
                currentPostings: post_array,
                card_list: post_array,
                loaded_cards: true
            })

            var updateMarkers = this.props.updateMarkers;
            // This will update the markers in the parent map.
            updateMarkers(post_array);
        })
        .catch((error) => {
            // handle error
            console.log(error);
        })
        .then(() => {
            // always executed
        });
    }

    startPosting() {
        if (!this.props.selectPosition) {
            console.log(this.props.selectPosition)
            // Select a new location on the map to begin your new job posting...
            console.log("Starting a new job posting.")
            //document.querySelector('#newPost').innerText = 'Select a new location';
            this.props.startSelection();
        }
    }

    finishedSelection() {
        if (this.props.currPosition) {
            //document.querySelector('#newPost').innerText = 'New posting';
            this.props.stopSelection();
            this.setState({
                postJob: true
            })
        }
    }

    stopPosting() {
        this.setState({
            postJob: false
        })
    }

    exitJobs() {
        var returnHome = this.props.returnHome;
        // This will update the markers in the parent map.
        returnHome();
    }

    validateUser() {
        let host = "http://127.0.0.1"
        let port = "5000"
        let url = host + ":" + port + "/" + "validateUser"
        let data = {
            cookie: this.props.userCookie
        }

        axios.post(url, data).then((response) => {
            console.log("Validating user...")
            console.log(response.data);
            if (response.data) {
                this.setState ({
                    isValid: true
                })    
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        // Pull any postings from the backend (currently dummy data function)
        this.getListings();
        this.validateUser();
    }

    render() {
        return (
            <div style={{overflow: 'auto'}}>
                <ButtonGroup aria-label="Job Header Buttons">
                    {this.state.isValid &&
                        <OverlayTrigger trigger="click" placement="right" overlay={this.selectPopup}>
                            <Button variant="light" id="newPost" onClick={this.startPosting}>Post</Button>
                        </OverlayTrigger>   
                    }
                    {this.props.userCookie.this_cookie != "none" && <ViewApplication userCookie={this.props.userCookie}/>}
                    <Button variant="light" id="returnHome" onClick={this.exitJobs}>Back</Button>
                </ButtonGroup>
                <JobPosting isOpen={this.state.postJob} closeThis={this.stopPosting} locationDetails={this.props.currPosition} userCookie={this.props.userCookie}/>
                {this.state.loaded_cards && this.renderCards()}
            </div>
        )
    }

    selectPopup() {
        return (
            <div>
                {this.props.selectPosition && 
                    <Popover id="popover-basic" style={{ zIndex: 1, position: "absolute", top: '130px', left: '300px'}}>
                    <Popover.Header as="h3">Select a location</Popover.Header>
                        <Popover.Body>
                            <strong>Right click</strong> on the map to grab a new location for your job posting!
                                <div>
                                    <div key="selectedpos">Selected position</div>
                                    <div key="currlat">Latitude : {this.props.currPosition.lat}</div>
                                    <div key="currlng">Longitude : {this.props.currPosition.lng}</div>
                                    <Button variant="outline-primary" onClick={this.finishedSelection}>Confirm location</Button>
                                </div>
                        </Popover.Body>
                    </Popover>   
                }
            </div>
        )
    }

    // These cards will represent entries (often tied with pins), 
    renderCards() {
        return (
            <div style={{overflow: 'scroll', height:'80vh'}}>
            <ScrElement>
                {this.state.card_list.map(details => {
                return (
                    <div key={"div" + details.id}>
                        <JobCard card_details={details} userCookie={this.props.userCookie}></JobCard>
                    </div>
                );
            })}
            </ScrElement>
        </div>
        );
    }
}

