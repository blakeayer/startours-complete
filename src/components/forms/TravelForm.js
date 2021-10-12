import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';

import TravelRestriction from './subforms/TravelRestriction';

import { planetImages } from '../../assets/data';

const TravelForm = ({passParent}) => {

    const user = useSelector((state) => state.user.value);

    const [planets, setPlanets] = useState([])
    const [flightType, setFlightType] = useState("round-trip");
    const [multiPlanetItinerary, setMultiPlanetItinerary] = useState([]);
    const [originImage, setOriginImage] = useState("");
    const [destinationImage, setDestinationImage] = useState("");
    const [starship, setStarship] = useState();
    const [starships, setStarships] = useState([]);
    const [filteredStarships, setFilteredStarships] = useState([]);
    const [seats, setSeats] = useState([]);

    const originRef = useRef();
    const destinationRef = useRef();
    const departingRef = useRef();
    const returningRef = useRef();
    const starshipRef = useRef();
    const seatRef = useRef();

    useEffect(() => {
        let planetsList = [];

        const getPlanets = async () => {
            let response = await fetch('https://swapi.dev/api/planets/');
            let data = await response.json();
            // console.log("data.results: ", data.results);

            for(let i = 0; i < data.results.length; i++) {
                planetsList.push({
                    name: data.results[i].name,
                    residents: data.results[i].residents,
                });
            };
            // console.log("planetsList: ", planetsList);

            while(data.next) {
                response = await fetch(data.next);
                data = await response.json();
                for(let i = 0; i < data.results.length; i++) {
                    planetsList.push({
                        name: data.results[i].name,
                        residents: data.results[i].residents,
                    });
                };
            }
            // console.log("planetsList: ", planetsList);

            setPlanets(planetsList);
        };
        getPlanets()
            .catch(error => console.log("ERROR: ", error));
    }, []);

    useEffect( () => {

        let starshipsList = [];

        const getStarships = async () => {
            let response = await fetch('https://swapi.dev/api/starships/');
            let data = await response.json();
            // console.log(data.results);

            for(let i = 0; i < data.results.length; i++) {
                starshipsList.push({
                    name: data.results[i].name,
                    starship_class: data.results[i].starship_class,
                    passengers: data.results[i].passengers,
                });
            };
            // console.log(starshipsList);

            while(data.next) {
                response = await fetch(data.next);
                data = await response.json();
                for(let i = 0; i < data.results.length; i++) {
                    starshipsList.push({
                        name: data.results[i].name,
                        starship_class: data.results[i].starship_class,
                        passengers: data.results[i].passengers,
                    });
                };
            }
            // console.log(starshipsList);
            setStarships(starshipsList);
            
            const filteredStarships = starshipsList.filter(function(starship) {
                return (
                    starship.starship_class !== 'Starfighter' &&
                    starship.starship_class !== 'starfighter' &&
                    starship.starship_class !== 'assault ship' &&
                    starship.starship_class !== 'Star Destroyer' &&
                    starship.starship_class !== 'star destroyer' &&
                    starship.starship_class !== 'Patrol craft' &&
                    starship.starship_class !== 'Armed government transport' &&
                    starship.starship_class !== 'Assault Starfighter' &&
                    starship.starship_class !== 'assault starfighter' &&
                    starship.starship_class !== 'Deep Space Mobile Battlestation' &&
                    starship.starship_class !== 'Star dreadnought'
                );
            })

            setFilteredStarships(filteredStarships);

        }
        getStarships()
            .catch(error => console.log("ERROR: ", error));

    }, []);

    useEffect(() => {

        let seatsList = [];

        for(let i = 0; i < starships.length; i++) {
            if(starship === starships[i].name) {
                // console.log(starships[i].passengers)
                seatsList.push("General")
                if(starships[i].passengers > 100) {seatsList.push("First Class")}
                if(starships[i].passengers > 1000) {seatsList.push("VIP")}
                if(starships[i].passengers > 10000) {seatsList.push("Presidential")}
            }
            setSeats(seatsList);
        }
    }, [starships, starship]);


// EVENT HANDLERS
    const getOriginImage = (event) => {        
        const findPlanet = planetImages.find((planet) => {
            return planet.name === event.target.value
        })
        if (findPlanet) {
            // console.log(findPlanet.url)
            setOriginImage(findPlanet.url);
        }    
    }

    const getDestinationImage = (event) => {
        const findPlanet = planetImages.find((planet) => {
            return planet.name === event.target.value
        })
        if (findPlanet) {
            // console.log(findPlanet.url)
            setDestinationImage(findPlanet.url);
        }
    }

    const setFlightTypeHandler = (event) => {
        event.preventDefault();
        setFlightType(event.target.id)
    };

    const addStopHandler = (event) => {
        event.preventDefault();
        setMultiPlanetItinerary([
            ...multiPlanetItinerary, 
            {
                origin: originRef.current.value,
                destination: destinationRef.current.value,
                departing: departingRef.current.value,
                returning: "",
                starship: starshipRef.current.value,
                seat: seatRef.current.value,
                originImage,
                destinationImage,
            },
        ])
    };

    const starshipChangeHandler = (event) => {
        event.preventDefault()
        setStarship(event.target.value)
    }

    const clickHandler = (event) => { 
        if(flightType === "one-way") {
            return [{
                origin: originRef.current.value,
                destination: destinationRef.current.value,
                departing: departingRef.current.value,
                returning: "",
                starship: starshipRef.current.value,
                seat: seatRef.current.value,
                originImage,
                destinationImage,
            }]
        } else if (flightType === "multi-planet") {
            return multiPlanetItinerary;
        }
        return [{
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            departing: departingRef.current.value,
            returning: returningRef.current.value,
            starship: starshipRef.current.value,
            seat: seatRef.current.value,
            originImage,
            destinationImage,
        }]
    };

    const clearHandler = (event) => {
        event.preventDefault()
        if (flightType === "round-trip") {
            originRef.current.value = ""
            destinationRef.current.value = ""
            departingRef.current.value = ""
            returningRef.current.value = ""
            starshipRef.current.value = ""
            seatRef.current.value = ""
            setFlightType("round-trip")
            setDestinationImage()
            setOriginImage()
        } 
        originRef.current.value = ""
        destinationRef.current.value = ""
        departingRef.current.value = ""
        starshipRef.current.value = ""
        seatRef.current.value = ""
        setFlightType("round-trip")
        setDestinationImage()
        setOriginImage()
        setMultiPlanetItinerary([]);
        passParent([]);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        passParent(clickHandler())

    };
    
// JSX
    return (
        <form onSubmit={submitHandler}>
            
            <div>
                <button id="round-trip" onClick={setFlightTypeHandler}>Round Trip</button>
                <button id="one-way" onClick={setFlightTypeHandler}>One Way</button>
                <button id="multi-planet" onClick={setFlightTypeHandler}>Multi Planet</button>
            </div>
            {multiPlanetItinerary.map((itineraryItem, index) => (
                <div key={index} className="squish m-5 bgc-lg">
                    <p>Detail {`${index + 1}`}</p>
                    <p>Point of Origin:{itineraryItem.origin}</p>
                    <p>Destination:{itineraryItem.destination}</p>
                    <p>Departing:{itineraryItem.departing}</p>
                </div>
            ))}
            <div>
                <label htmlFor="origin">Point of Origin:</label>
                <select id="origin" ref={originRef} onChange={getOriginImage}>
                    <option defaultValue ></option>
                    {planets.map((planet, index) => (
                        <option key={index} value={planet.name}>{planet.name}</option>
                    ))}
                </select>
            </div>
            
            <div>
                <label htmlFor="destination">Destination:</label>
                <select id="destination" ref={destinationRef} onChange={getDestinationImage}>
                    <option defaultValue ></option>
                    {planets.map((planet, index) => (
                        <option key={index} value={planet.name}>{planet.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="departing">Departing:</label>
                <input 
                    id="departing" 
                    type="date" 
                    ref={departingRef}
                />
            </div>

            {
                flightType === "round-trip" && (
                    <div>
                        <label htmlFor="returning">Returning:</label>
                        <input 
                            id="returning" 
                            type="date" 
                            ref={returningRef}
                        />
                    </div>
                )
            }

            <div>
                <label htmlFor="starship">Available Transport:</label>
                <select id="starship" ref={starshipRef} onChange={starshipChangeHandler} >
                    <option defaultValue ></option>
                    {filteredStarships.map((starship, index) => (
                        <option key={index} value={starship.name}>{starship.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="seat">Select Seat:</label>
                <select id="seat" ref={seatRef}>
                    <option defaultValue ></option>
                    {seats.map((seat, index) => (
                        <option key={index} value={seat}>{seat}</option>
                    ))}
                </select>
            </div>
            
            {
                destinationImage &&
                user.species && 
                <TravelRestriction destination={destinationRef.current.value} planets={planets}/>}
            {
                flightType === "multi-planet" && (
                    <div>
                        <button onClick={addStopHandler}>Add Stop</button>
                    </div>
                )
            }

            <div>
                <button type="submit" onClick={clickHandler} >Submit</button>
                <button onClick={clearHandler} >Clear</button>
            </div>
        </form>
    )
}

export default TravelForm
