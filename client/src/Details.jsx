import React from 'react';
import {Link} from 'react-router-dom';

const Details = props => {
  let name = props.match.params.name
  let data = props[name]
  let detailsIndividuals = []
  for (let key in data.details) {
    detailsIndividuals.push(
      <div className='details-individual'>
        <div className="details-individual-title">
          {key}
        </div>
        <div className="details-individual-info">
          <div className="details-individual-num">
            {data.details[key]}
          </div>
          <div className="details-individual-unit">instances</div>
        </div>
      </div>
    )
  }
  return (
    <div className='result-div'>
      <Link to='/results'>
        <div className='back-tab'>
          <img src='../back.png' className='back-img' alt='back'/>
        </div>
      </Link>
      <div className='location-banner'>{props.neighborhood}</div>
      <div className='details-individual-container'>
        <div className='details-deco-div'></div>
        <div className='details-title'>Average of Last Year</div>
        <div className="details-individual-wrapper">
          {detailsIndividuals}
        </div>
      </div>
    </div>
  )
}

export default Details;

