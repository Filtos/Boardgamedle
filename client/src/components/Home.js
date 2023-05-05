import { useState, useEffect, useMemo } from 'react';
import axios from "axios";
import { Autocomplete, TextField, Container } from '@mui/material';
import './styles/Home.css';

export default function Home() {
    const [todaysGame, setTodaysGame] = useState(null);

    const options = ['Tokaido', 'Spirit Island'];

    const handleGuess = (gameName) => {
        if (gameName === todaysGame.name.value) alert('You got it!')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/games/today', { params: { date: new Date()}});
                setTodaysGame(response.data);
            } catch (error) {
                console.error(error);
            }
            };
        fetchData();
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            {!todaysGame ? <p>Loading...</p> : 
            <div>
                <Autocomplete
                id="combo-box"
                options={options}
                onInputChange={(event, value) => handleGuess(value)}
                renderInput={(params) => <TextField {...params} label="Board Game Guess"/>}
                />
                Todays game: {todaysGame.name.value}
            </div>}
        </Container>
    )
  }