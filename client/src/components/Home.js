import { useState, useEffect } from 'react';
import axios from "axios";
import { Autocomplete, TextField, Container } from '@mui/material';

export default function Home() {
    const [todaysGame, setTodaysGame] = useState(null);
    const primaryName = todaysGame?.name?.find(name => name.type === 'primary')
    const options = ['Tokaido', 'Spirit Island'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/games/today', { params: { date: new Date()}});
                await setTodaysGame(response.data);
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
                // sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Board Game" />}
                />
                Todays game: {primaryName.value}
            </div>}
        </Container>
    )
  }