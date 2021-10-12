import React, { useState } from 'react'

import TravelForm from './forms/TravelForm';
import Itinerary from './Itinerary';

const TravelProfile = () => {
    const [itinerary, setItinerary] = useState([]);

    const onUserSubmit = (childData) => {
        setItinerary(childData);
    };

    return (
        <>
        <div>
            <h3 className="mb-0">Travel Details</h3>
            <TravelForm passParent={onUserSubmit} />
        </div>
        <div>
            <h3 className="mb-0">Itinerary</h3>
            <Itinerary itinerary={itinerary} />
        </div>
        </>
    )
}

export default TravelProfile
