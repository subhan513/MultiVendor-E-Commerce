import React from "react";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
const EventsPage = () => {
  const {events}  = useSelector((state)=>state.events);
  return (
    <>
        <div>
          <Header activeHeading={4} />
        {
          events.length  > 0 ?  (
           events.map((item)=>(
             <EventCard key={item._id} data={item}/>
           ))
          ): (
            <h1>No Events Found</h1>
          )}
        </div>
    </>
  );
};

export default EventsPage;