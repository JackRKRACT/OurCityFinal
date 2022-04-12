import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import MenuNavigation from './MenuNavigation';
import JobIW from '../Pages/Jobs/JobIW';
import StudentIW from '../Pages/Student/StudentIW';
import TourismIW from '../Pages/Tourism/TourismIW';

const containerStyle = {
  height: '100vh',
};

const center = {
  lat: 44.811348,
  lng: -91.498497
};

export default class CityMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
      places: [],
      info_location: center,
      marker_details:[],
      loaded_default: false,
      selectPosition: false,
      currPosition: {},
    };

    this.renderOverlay = this.renderOverlay.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.changeDetails = this.changeDetails.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.renderMarkerDetails = this.renderMarkerDetails.bind(this);
    this.getMarkers = this.getMarkers.bind(this);
    this.getSelectedPosition = this.getSelectedPosition.bind(this);
    this.startSelection = this.startSelection.bind(this);
    this.stopSelection = this.stopSelection.bind(this);
  }

  getMarkers(defaultMarkers) {
    if (defaultMarkers != null) {
      this.setState({
        places: defaultMarkers,
        loaded_default: true
      })
    }
  }
  
  addMarker(e) {
    const newPlace = { id: this.state.places.length, lat: e.latLng.lat(), lng: e.latLng.lng() };
      this.setState({
      places: [...this.state.places,newPlace],
    })
  }

  changeDetails(new_id, index) {
    this.setState({
      marker_details:[this.state.places[index]]
    })
  }

  closeInfoWindow() {
    this.setState({
      marker_details:[]
    })
  }

/*   componentDidMount() {
    this.getMarkers();
  } */

  startSelection() {
    this.setState({
      selectPosition: true
    })
  }

  stopSelection() {
    this.setState({
      selectPosition: false
    })
  }

  getSelectedPosition(e) {
    if (this.state.selectPosition) {
      console.log("Somehow made it here...")
      // Allow user to actually post a new marker.
      const newPlace = { id: this.state.places.length, lat: e.latLng.lat(), lng: e.latLng.lng() };
      console.log(newPlace)
      this.setState({
        currPosition: newPlace,
      })
    }
  }

  renderOverlay() {
    this.setState({
      hasLoaded: true
    })
  }

  render() {
    return (
      <div style={{zIndex: 0}}>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY}
          mapIds={["1fa39135d78d81b6"]}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            options={{ mapId: "1fa39135d78d81b6" }}
            onLoad={this.renderOverlay}
            center={center}
            onRightClick={this.getSelectedPosition}
            zoom={16}
          >
            { /* Child components, such as markers, info windows, etc. */ }
            {this.state.hasLoaded && 
              <MenuNavigation updateMarkers={this.getMarkers} 
                              currPosition={this.state.currPosition} 
                              startSelection={this.startSelection}
                              stopSelection={this.stopSelection}
                              selectPosition={this.state.selectPosition}
                              userCookie={this.props.userCookie}/>
            }
            {this.state.loaded_default && this.renderMarkers()}
            {this.state.loaded_default && this.renderMarkerDetails()}
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }

  renderMarkers() {
    return ( 
      <div className="allMarkers">
        {this.state.places.map((place, index) => {
          return (
            <Marker
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => this.changeDetails(place.id, index)}
            />
          );
        })}
      </div>
    )
  }

  renderMarkerDetails() {
    // This render function will get InfoWindow structure based on what is given from the parent class.
    // The getInfoWindow prop will return a JSX formatted object containing relevant info from the parent component.
    return (
      <div className="markerDetails">
        {this.state.marker_details.map(details => {
          if (details.parent === "job") {
            return (
              <InfoWindow position={details} onCloseClick={this.closeInfoWindow}>
                <JobIW iw_details={details} expandModal={this.expandModal} collapseModal={this.collapseModal} isExpanded={this.state.isExpanded} userCookie={this.props.userCookie}></JobIW>
              </InfoWindow>
            );
          }

          if (details.parent === "student") {
            return (
              <InfoWindow position={details} onCloseClick={this.closeInfoWindow}>
                <StudentIW iw_details={details} expandModal={this.expandModal} collapseModal={this.collapseModal} isExpanded={this.state.isExpanded} userCookie={this.props.userCookie}></StudentIW>
              </InfoWindow>
            );
          }

          if (details.parent === "tourism") {
            return (
              <InfoWindow position={details} onCloseClick={this.closeInfoWindow}>
                <TourismIW iw_details={details} expandModal={this.expandModal} collapseModal={this.collapseModal} isExpanded={this.state.isExpanded} userCookie={this.props.userCookie}></TourismIW>
              </InfoWindow>
            );
          }

          return (
            <></>
          )
        })}
      </div>
    )
  }
}