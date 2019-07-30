import React from 'react';
import { withRouter } from "react-router-dom";

const Results = props => {
  var content;
  if (!props.neighborhood) {
    content = (
      <>
        <p>Getting geo info for {props.address}</p>
        <img scr='./loading.gif' className='result-loading'/>
      </>
    )
  } else {
    if (!props.disaster) {
      content = (
        <>
          <p>Cheking {props.neighborhood} neghborhood of {props.address}</p>
          <img scr='./loading.gif' className='result-loading'/>
        </>
      )
    } else {
      content = (
      <>
        <p>checking for {props.neighborhood} at {props.city}</p>
        <div className='crime-div result-sub'>
          <div className='result-sub-info'>
            here is for crime
          </div>
          <div className='result-sub-score'></div>
        </div>
        <div className='disaster result-sub'>
          <div className='result-sub-info'>
            here is for disaster  
          </div> 
          <div className='result-sub-score'></div>
          {/* {disastersRender}                 */}
        </div>
        
        <div className='air result-sub'>
          <div className='result-sub-info'>
            here is for air quality
          </div>
          <div className='result-sub-score'></div>
        </div>
      </>
      )
    }
  } 


  return (
    <>
      get to the results
      {content}
    </>
  );
}


export default withRouter(Results);