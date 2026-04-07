import React from "react";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
const EventsPage = () => {
  const {allevents}  = useSelector((state)=>state.events);
  return (
    <>
        <div>
          <Header activeHeading={4} />
        {
          allevents.length  > 0 ?  (
           allevents.map((item)=>(
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