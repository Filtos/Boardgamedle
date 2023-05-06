import { useState, useEffect } from 'react';
import axios from "axios";
import { Autocomplete, TextField, Container } from '@mui/material';
import './styles/Home.css';

export default function Home() {
    const [todaysGame, setTodaysGame] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [options, setOptions] = useState([{name: {value: 'Tokaido'}, yearpublished: {value: 2012}}])

    useEffect(() => {
        const fetchTodaysData = async () => {
            try {
                const response = await axios.get('/api/games/today', { params: { date: new Date()}});
                setTodaysGame(response.data);
            } catch (error) {
                console.error(error);
            }
            };
        fetchTodaysData();
    }, []);

    // const handleGuess = (value) => {
    //     console.log('HANDLE GUESS', value)
    //     if (value?.name?.value === todaysGame.name.value) alert('You got it!')
    // }

    useEffect(() => {
        const fetchSearchData = async () => {
            try {
                const response = await axios.get('/api/games/search', { params: { query: searchValue}});
                if (response?.data !== '') { 
                    setOptions(response.data)
                }
    
            } catch (error) {
                console.error(error);
            }
        };
        const timeOutId = setTimeout(() => fetchSearchData(), 500);
        return () => clearTimeout(timeOutId);
      }, [searchValue]);

    return (
        <Container component="main" maxWidth="xs">
            {!todaysGame ? <p>Loading...</p> : 
            <Container>
                <Autocomplete
                inputValue={searchValue}
                id="autocomplete-search"
                options={options}
                getOptionLabel={(option) => `${option?.name?.value} (${option?.yearpublished?.value})`}
                onInputChange={(event, value) => setSearchValue(value)}
                // onChange={(event, value) => handleGuess(value?.name?.value)}
                renderInput={(params) => <TextField {...params} label="Board Game Guess"/>}
                />
                Todays game: {todaysGame.name.value}
            </Container>}
        </Container>
    )
  }