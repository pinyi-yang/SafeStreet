import React from 'react';
import { Link } from "react-router-dom";

const Results = props => {
  var content;
  if (props.disasters) {
    var disastersContent = (
      <>
        <div className='result-sub-info'>
          Disaster Risk:  
        </div> 
        <div className='result-sub-score'>
          {props.disasters.score}
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
  if (!props.neighborhood) {
    content = (
      <>
        <p>Getting geo info for {props.address}</p>
        <img src='loading.gif' className='result-loading' alt='Loading'/>
      </>
    )
  } else {
    content = (
      <>
        <p>Cheking {props.neighborhood} neghborhood of {props.address}</p>
        Loading
        <div className='crime-div result-sub'>
          <div className='result-sub-info'>
            here is for crime
          </div>
          <div className='result-sub-score'></div>
        </div>
        
        <Link to='/results/disasters'>
          <div className='disaster result-sub'>
            {disastersContent}
          </div>
        </Link>
        
        <div className='air result-sub'>
          <div className='result-sub-info'>
            here is for air quality
          </div>
          <div className='result-sub-score'></div>
        </div>
      </>
    )

  } 


  return (
    <>
      <Link to='/' onClick={props.handleRootLink}>◀️ Back</Link> {' '}
      get to the results
      {content}
    </>
  );
}


export default Results;