import React from 'react';
import { Link } from "react-router-dom";

const Results = props => {
  var content;
  let totalScore = 0;
  let overallRank = '';
  if (props.disasters) {
    totalScore +=props.disasters.score
    var disastersContent = (
      <>
        <div className='result-sub-info'>
          Disaster Risk:  
        </div> 
        <div className='result-sub-score'>
          {props.disasters.rank}
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
          <img src='loading.gif' className='result-loading' alt='Loading'/>
        </div>
      </>
    )
  }
  
  if (props.crime) {
    totalScore +=props.crime.score
    var crimeContent = (
      <>
        <div className='result-sub-info'>
          Security:  
        </div> 
        <div className='result-sub-score'>
          {props.crime.rank}
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
          <img src='loading.gif' className='result-loading' alt='Loading'/>
        </div>
      </>
    )
  }

  if (props.air) {
    totalScore +=props.air.score
    var airContent = (
      <>
        <div className='result-sub-info'>
          Air Quality:  
        </div> 
        <div className='result-sub-score'>
          {props.air.rank}
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
          <img src='loading.gif' className='result-loading' alt='Loading'/>
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

  if (!props.neighborhood) {
    content = (
      <>
        <div className='location-banner'>Getting Geo Info</div>
        <img src='loading.gif' className='result-loading' alt='Loading'/>
      </>
    )
  } else {
    content = (
      <>
        <p>Cheking {props.neighborhood} neghborhood of {props.address}</p>
        <h1>{overallRank}</h1>
        <Link to='/results/crime'>
          <div className='crime-div result-sub'>
              {crimeContent}
          </div>
        </Link>
        
        <Link to='/results/disasters'>
          <div className='disaster result-sub'>
            {disastersContent}
          </div>
        </Link>
        
        <Link to='/results/air'>
          <div className='air result-sub'>
              {airContent}
          </div>
        </Link>
      </>
    )

  } 


  return (
    <div className='result-div'>
      <Link to='/' onClick={props.handleRootLink}>
        <div className='back-tab'>
          <img src='back.png' className='back-img' alt='back'/>
        </div>
      </Link>
      {content}
    </div>
  );
}


export default Results;