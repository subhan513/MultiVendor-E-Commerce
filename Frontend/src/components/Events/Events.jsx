import React from 'react';
import styles from '../../styles/styles'
import EventCard from "./EventCard.jsx";
import { useSelector } from 'react-redux';

const Events = () => {
  const {allevents,eventloading} = useSelector((state)=>state.events);
  console.log(allevents);
  
  return (
    <div>
      {!eventloading   && 

        <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>

      <div className="w-full grid">
            <EventCard   data={allevents && allevents[0]}/>
      </div>
    </div>
}
 </div>
  )
}

export default Events