import React from 'react';
import {Link} from 'react-router-dom';

const Details = props => {
  let name = props.match.params.name
  let data = props[name]
  let detailsIndividuals = []
  for (let key in data.details) {
    detailsIndividuals.push(
      <div className='details-individual'>
        {key}: {data.details[key]}
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
      <div className='details-score'>
        <h2>
          {data.rank}
        </h2>
      </div>
      <div className='details-individual-container'>
        {detailsIndividuals}
      </div>
    </div>
  )
}

export default Details;

