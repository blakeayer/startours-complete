import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { login, logout } from '../../reducers/user';

const UserForm = (props) => {

    const dispatch = useDispatch();

    const nameRef = useRef();
    const speciesRef = useRef();

    const [species, setSpecies] = useState([]);

    useEffect(() => {

        let speciesList = [];

        const getSpecies = async () => {
            let response = await fetch('https://swapi.dev/api/species/');
            let data = await response.json();
            // console.log(data.results);

            for(let i = 0; i < data.results.length; i++) {
                speciesList.push(data.results[i].name);
            };
            // console.log(speciesList);

            while(data.next) {
                response = await fetch(data.next);
                data = await response.json();
                for(let i = 0; i < data.results.length; i++) {
                    speciesList.push(data.results[i].name);
                };
            }
            // console.log(speciesList);

            setSpecies(speciesList);
        };
        getSpecies()
            .catch(error => console.log("ERROR: ", error));
    }, []);

    const loginHandler = (event) => {
        event.preventDefault();
        dispatch(login({name: nameRef.current.value, species: speciesRef.current.value}));
    }

    const logoutHandler = (event) => {
        event.preventDefault();
        nameRef.current.value = "";
        speciesRef.current.value = "";
        dispatch(logout());
    }

    return (
        <form>
            <div>
                <label htmlFor="name">Name:</label>
                <input id="name" ref={nameRef}/>
            </div>
            
            <div>
                <label htmlFor="species">Species:</label>
                <select id="species" ref={speciesRef}>
                    <option ></option>
                    {species.map((species, index) => (
                        <option key={index} value={species}>{species}</option>
                    ))}
                </select>
            </div>

            <div>
                <button onClick={loginHandler}>Confirm</button>
                <button onClick={logoutHandler}>Reset</button>
            </div>
        </form>
    )
}

export default UserForm
