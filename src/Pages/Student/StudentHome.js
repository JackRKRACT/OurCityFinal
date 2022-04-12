import React from 'react';
import { Element as ScrElement } from 'react-scroll'
import { Button, Popover, ButtonGroup, Dropdown, OverlayTrigger } from 'react-bootstrap';
import StudentCard from './StudentCard';
import StudentPin from './StudentPin';

const axios = require('axios').default;

/* Goals of the Jobseeker class :
    - Get the current job listings around the city. (Both on map, and on cards)
    - Load comments from primary job seekers page.
    - On user request, add new job posting on map.
    - On user request, start applying for job posting on map.
*/

export default class StudentHome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
			postPin: false,
            currentPins: [],
            card_list: [],
            loaded_cards: false,
            isValid: false,
            curr_filter: "none"
        };
        this.renderCards = this.renderCards.bind(this);
        this.createPin = this.createPin.bind(this);
        this.finishPin = this.finishPin.bind(this);
        this.finishedSelection = this.finishedSelection.bind(this);
        this.selectPopup = this.selectPopup.bind(this);
        this.exitStudent = this.exitStudent.bind(this);
        this.validateUser = this.validateUser.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }

    getListings() {
        let host = "http://127.0.0.1"
        let port = "5000"
        let url = host + ":" + port + "/"

        axios.get(url + "studentListings")
        .then((response) => {
            // Success
            let post_array = Object.values(response.data)
            if (this.state.curr_filter != "none") {
                let filtered_data = []
                post_array.map((element) => {
                    if (element.type == this.state.curr_filter) {
                        filtered_data.push(element)
                    }
                })
                post_array = filtered_data
            }
            
            this.setState ({
                currentPins: post_array,
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

    createPin() {
        if (!this.props.selectPosition) {
            console.log(this.props.selectPosition)
            // Select a new location on the map to begin your new job posting...
            console.log("Starting a new student posting.")
            //document.querySelector('#newPost').innerText = 'Select a new location';
            this.props.startSelection();
        }
    }

    finishedSelection() {
        if (this.props.currPosition) {
            //document.querySelector('#newPost').innerText = 'New posting';
            this.props.stopSelection();
            this.setState({
                postPin: true
            })
        }
    }

    finishPin() {
        this.setState({
            postPin: false
        })
    }

    exitStudent() {
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

    setFilter(e) {
        this.setState({
            curr_filter: e.target.name
        })
        this.getListings()
    }

    componentDidMount() {
        // Pull any postings from the backend (currently dummy data function)
        this.getListings();
        this.validateUser();
    }

    render() {
        return (
            <div className="main">
                <ButtonGroup aria-label="Main button group">
                    {this.state.isValid &&
                        <OverlayTrigger trigger="click" placement="right" overlay={this.selectPopup}>
                            <Button variant="light" id="newPost" onClick={this.createPin}>New pin</Button>
                        </OverlayTrigger>          
                    }
                    <Button variant="light" id="returnHome" onClick={this.props.returnHome}>Go back</Button>
                    <Dropdown>
                        <Dropdown.Toggle id="student_filter" variant="light">
                        Filter
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                        <Dropdown.Item onClick={this.setFilter} name="lib" key="lib">Libraries</Dropdown.Item>
                        <Dropdown.Item onClick={this.setFilter} name="gym" key="gym">Gyms</Dropdown.Item>
                        <Dropdown.Item onClick={this.setFilter} name="bar" key="bar">Bars</Dropdown.Item>
                        <Dropdown.Item onClick={this.setFilter} name="coll" key="coll">Colleges</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.setFilter} name="none" key="none">No filter</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <StudentPin isValid={this.state.isValid} isOpen={this.state.postPin} closeThis={this.finishPin} locationDetails={this.props.currPosition} userCookie={this.props.userCookie}/>
                </ButtonGroup>
                {this.state.loaded_cards &&
                    this.renderCards()
                }
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
            <div style={{overflowY:'scroll', height:'80vh'}}>
            <ScrElement>
                {this.state.card_list.map(details => {
                return (
                    <div key={"div" + details.id}>
                        <StudentCard isValid={this.state.isValid} card_details={details} userCookie={this.props.userCookie}></StudentCard>
                    </div>
                );
            })}
            </ScrElement>
        </div>
        );
    }
}

