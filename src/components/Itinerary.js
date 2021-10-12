import React from 'react'

const Itinerary = ({itinerary}) => {
    return (
        <div className="flex">
           {itinerary.map((itineraryItem, index) => (
               <div key={index} className="squish">
                   <p>Point of Origin: {itineraryItem.origin}</p>
                   <p>Destination: {itineraryItem.destination}</p>
                   <p>Departing: {itineraryItem.departing}</p>
                   {itineraryItem.returning && <p>Returning: {itineraryItem.returning}</p>}
                   <p>Transport: {itineraryItem.starship}</p>
                   <p>Seating: {itineraryItem.seat}</p>
                   <img className="m-5" src={itineraryItem.originImage} alt={itineraryItem.origin} />
                   <img className="m-5" src={itineraryItem.destinationImage} alt={itineraryItem.destination} />
               </div>

           ))} 
        </div>
    )
}

export default Itinerary
