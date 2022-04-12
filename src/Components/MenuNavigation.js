import React from 'react';
import JobHome from '../Pages/Jobs/JobHome';
import { Button, ButtonGroup } from 'react-bootstrap';
import BusinessHome from '../Pages/Business/BusinessHome';
import StudentHome from '../Pages/Student/StudentHome';
import TourismHome from '../Pages/Tourism/TourismHome';

export default class MenuNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        home: true,
        jobs: false,
        student: false,
        tourism: false,
        business: false,
        card_list: [],
        loaded_cards: false
    };

    this.gotoJobs = this.gotoJobs.bind(this);
    this.resetStates = this.resetStates.bind(this);
    this.gotoBusiness = this.gotoBusiness.bind(this);
    this.gotoStudent = this.gotoStudent.bind(this);
    this.gotoTourism = this.gotoTourism.bind(this);
  }

  gotoJobs() {
    this.resetStates();
    this.setState({
        home: false,
        jobs: true,
    })
  }

  gotoStudent() {
    this.resetStates();
    this.setState({
        home: false,
        student: true,
    })
  }

  gotoTourism() {
    this.resetStates();
    this.setState({
        home: false,
        tourism: true,
    })
  }

  gotoBusiness() {
    this.resetStates();
    this.setState({
        home: false,
        business: true,
    })
  }

  resetStates() {
    this.setState({
      home: true,
      jobs: false,
      business: false,
      student: false,
      tourism: false,
    })

    this.props.updateMarkers([]);
  }

  render() {
    // The map children div will contain all subcomponents for the navigation sidebar. 
    return (
      <div className="MapChildren" style={{ zIndex: 1, position: "absolute", top: '70px', left: '10px', height:'80vh', width:'20vw'}}>
        <h1 style={{color:"white"}}>{this.props.userCookie.this_user}</h1>
        {this.state.home && 
        <ButtonGroup aria-label="Main button group">
          <Button variant="light" onClick={this.gotoJobs}>Jobs</Button>
          <Button variant="light" onClick={this.gotoStudent}>Student</Button>
          <Button variant="light" onClick={this.gotoBusiness}>Business</Button>
          <Button variant="light" onClick={this.gotoTourism}>Tourism</Button>
        </ButtonGroup>
        }
        {this.state.jobs &&
          <JobHome updateMarkers={this.props.updateMarkers} currPosition={this.props.currPosition} 
          startSelection={this.props.startSelection} stopSelection={this.props.stopSelection}
          selectPosition={this.props.selectPosition} returnHome={this.resetStates} userCookie={this.props.userCookie}/>
        }
        {this.state.student &&
          <StudentHome updateMarkers={this.props.updateMarkers} currPosition={this.props.currPosition} 
          startSelection={this.props.startSelection} stopSelection={this.props.stopSelection}
          selectPosition={this.props.selectPosition} returnHome={this.resetStates} userCookie={this.props.userCookie}/>
        }

        {this.state.tourism &&
          <TourismHome updateMarkers={this.props.updateMarkers} currPosition={this.props.currPosition} 
          startSelection={this.props.startSelection} stopSelection={this.props.stopSelection}
          selectPosition={this.props.selectPosition} returnHome={this.resetStates} userCookie={this.props.userCookie}/>
        }

        {this.state.business &&
          <BusinessHome returnHome={this.resetStates}/>
        }
      </div>
    )
  }
}