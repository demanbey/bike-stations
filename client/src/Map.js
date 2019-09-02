import React, { Component } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import axios from "axios";

import { ReactComponent as Icon } from "./assets/pin.svg";

import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

const TOKEN =
  "pk.eyJ1IjoiaGRlbWFuYmV5IiwiYSI6ImNqdjg5bmJuNjBvZnozeW81c2Z1a2tnaTcifQ.VGfAG6v33hRLl0ZxEydjMw";

class Map extends Component {
  state = {
    viewport: {
      latitude: 45.52619,
      longitude: -73.59531,
      zoom: 12.5,
      width: "100vw",
      height: "100vh"
    },
    selectedStation: null,
    stations: []
  };

  setSelectedStation(val) {
    this.setState({ selectedStation: val });
  }

  onViewportChange(val) {
    if (this.state.isMounted) {
      this.setState({ viewport: val });
    }
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    axios
      .get("http://localhost:8000/stations")
      .then(response => {
        this.setState({ stations: response.data });
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  render() {
    const { viewport, selectedStation, stations } = this.state;
    return (
      <div>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={TOKEN}
          mapStyle="mapbox://styles/hdemanbey/cjw1dgx0d08981cpqbpcky2w1"
          onViewportChange={viewport => this.onViewportChange(viewport)}
        >
          {stations.map(station => (
            <Marker
              key={station.stationId}
              latitude={station.lat}
              longitude={station.lon}
            >
              <Icon
                className="icon-button"
                onClick={e => {
                  e.preventDefault();
                  this.setSelectedStation(station);
                }}
              />
            </Marker>
          ))}
          {selectedStation ? (
            <Popup
              className="popup"
              latitude={selectedStation.lat}
              longitude={selectedStation.lon}
              onClose={() => {
                this.setSelectedStation(null);
              }}
            >
              <div className="popup-text">
                <span>Bikes: {selectedStation.bikesAvailable}</span>
                <span>Docks: {selectedStation.docksAavailable}</span>
              </div>
            </Popup>
          ) : null}
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
