import React from 'react';
import { Link } from "react-router-dom";
import ReactMapGL from 'react-map-gl';
import Map from './Map'
const TOKEN = 'pk.eyJ1IjoidmluY2VudGRqaWUiLCJhIjoiY2p4ZXo1NTVzMHVkMTN5bnhobHZpamdueCJ9.SVkMVxpKo8jqJ4iAuAGBoQ'

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewpoint: {
        width: 375,
        heigth: 375,
        latitude: props.center[1],
        longitude: props.center[0],
        zoom: 8
      }
    }
  }

  render() {
    var content;
    let totalScore = 0;
    let overallRank = '';
    if (this.props.disasters) {
      totalScore +=this.props.disasters.score
      var disastersContent = (
        <>
          <div className='result-sub-info'>
            Disaster Risk:  
          </div> 
          <div className='result-sub-score'>
            {this.props.disasters.rank}
          </div>
        </>
      )
    } else {
      disastersContent = (
        <>
          <div className='result-sub-info'>
            Disaster Risk:  
          </div> 
          <div className='result-sub-score'>
            NA
          </div>
        </>
      )
    }
    
    if (this.props.crime) {
      totalScore +=this.props.crime.score
      var crimeContent = (
        <>
          <div className='result-sub-info'>
            Security:  
          </div> 
          <div className='result-sub-score'>
            {this.props.crime.rank}
          </div>
        </>
      )
    } else {
      crimeContent = (
        <>
          <div className='result-sub-info'>
            Security:  
          </div> 
          <div className='result-sub-score'>
            NA  
          </div>
        </>
      )
    }
  
    if (this.props.air) {
      totalScore +=this.props.air.score
      var airContent = (
        <>
          <div className='result-sub-info'>
            Air Quality:  
          </div> 
          <div className='result-sub-score'>
            {this.props.air.rank}
          </div>
        </>
      )
    } else {
      airContent = (
        <>
          <div className='result-sub-info'>
            Air Quality:   
          </div> 
          <div className='result-sub-score'>
            NA
          </div>
        </>
      )
    }
  
    switch(true) {
      case totalScore < 0.8:
        overallRank = 'Good';
        break;
      case totalScore < 1.6:
        overallRank = 'OK';
        break;
      case totalScore <= 2.4:
        overallRank = 'Bad';
        break;
      case totalScore > 2.4:
        overallRank = 'Move';
        break;
    }
    
    var banner;
    if (!this.props.neighborhood) {
      banner = 'Getting Geo Info';
      content = (
        <div className='result-loading'>
          <img src='loading.gif'  alt='Loading'/>
        </div>
      )
    } else {
      banner = this.props.neighborhood
      content = (
        <>
          <Map center={this.props.center} address={this.props.address}/>
          <div className='result-mainscore'>
            {overallRank}
            <div className='result-mainscore-subtitle'>
              Overall Rank
            </div>
          </div>
          
          <Link to='/results/crime' className='nondec-Link'>
            <div className='crime-div result-sub'>
                {crimeContent}
            </div>
          </Link>
          
          <Link to='/results/disasters' className='nondec-Link'>
            <div className='disaster result-sub'>
              {disastersContent}
            </div>
          </Link>
          
          <Link to='/results/air' className='nondec-Link'>
            <div className='air result-sub'>
                {airContent}
            </div>
          </Link>
        </>
      )
    } 
  
    return (
      <div className='result-div'>
        
        <Link to='/' onClick={this.props.handleRootLink}>
          <div className='back-tab'>
            <img src='back.png' className='back-img' alt='back'/>
          </div>
        </Link>
        <div className='location-banner'>{banner}</div>
        
        {content}
        
      </div>
    );
  }
}


export default Results;