import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';

const TravelRestriction = ({planets, destination}) => {
    
    const user = useSelector((state) => state.user.value);

    const [listResidentsSpeciesURL, setListResidentsSpeciesURL] = useState([]);
    const [authorizedSpecies, setAuthorizedSpecies] = useState();
    const [isAuthorized, setIsAuthorized] = useState();


    useEffect(() => {

        let residentsURL = [];
        const getResidentsURL = async () => {
            for (let i = 0; i < planets.length; i++) {
                if (destination === planets[i].name) {
                    residentsURL = planets[i].residents
                }
            }
            // console.log("residentsURL: ", residentsURL);
        }
        getResidentsURL();
        
        let residentsSpecies = [];
        const getResidentsSpecies = async() => {
            for (let i = 0; i < residentsURL.length; i++) {
                let response = await fetch(`${residentsURL[i]}`);
                let data = await response.json();
                // console.log(data.species[0])
                if(data.species[0]) {
                    residentsSpecies.push(data.species[0]);
                }
            }
            // console.log("residentsSpecies: ", residentsSpecies);
            setListResidentsSpeciesURL(residentsSpecies);
        }
        getResidentsSpecies();
    }, [destination, planets])

    useEffect(() => {
        let unrestrictedSpecies = [];
        const getUnrestrictedSpecies = async() => {
            for (let i = 0; i < listResidentsSpeciesURL.length; i++) {
                let response = await fetch(`${listResidentsSpeciesURL[i]}`);
                let data = await response.json();
                unrestrictedSpecies.push(data.name);
            }
            // console.log("unrestrictedSpecies: ", unrestrictedSpecies);
            setAuthorizedSpecies(unrestrictedSpecies)
        }
        getUnrestrictedSpecies(); 
    }, [listResidentsSpeciesURL])

    useEffect(() => {
        if(authorizedSpecies) {
            const includesSpecies = authorizedSpecies.includes(user.species);
            setIsAuthorized(includesSpecies)
        }
    }, [authorizedSpecies, user.species])

    return (
        <div>
            {isAuthorized && <p className="success">Your species is permitted to travel to {destination}.</p>}
            {!isAuthorized && <p className="alert">Your species is not permitted to travel to {destination}.</p>}
        </div>
    )
}

export default TravelRestriction;
