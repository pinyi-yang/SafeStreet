import React from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
const TOKEN = 'pk.eyJ1IjoidmluY2VudGRqaWUiLCJhIjoiY2p4ZXo1NTVzMHVkMTN5bnhobHZpamdueCJ9.SVkMVxpKo8jqJ4iAuAGBoQ'

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 375,
        height: 200,
        latitude: props.center[1],
        longitude: props.center[0],
        zoom: 12,
      },
      showPopup: true
    }
  }

  render() {
    const {showPopup} = this.state;
    return(
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
        mapboxApiAccessToken={TOKEN}
        mapStyle='mapbox://styles/mapbox/streets-v9'>
          <Marker latitude={this.props.center[1]}
                  longitude={this.props.center[0]}
                  offsetLeft={-20} 
                  offsetTop={-10}
                  >
            <div className="marker" onClick={() => this.setState({showPopup: true})}>📍</div>
          </Marker>
          {showPopup && <Popup
          latitude={this.props.center[1]}
          longitude={this.props.center[0]}
          closeButton={true}
          closeOnClick={false}
          onClose={() => this.setState({showPopup: false})}
          anchor="bottom-left" >
          <div className='map-popup'>{this.props.address}</div>
        </Popup>}
        </ReactMapGL>
    );
  }
}

export default Map;