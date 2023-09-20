import React, { useState, useEffect } from 'react';
import axios from "axios";
import { 
    Autocomplete,
    TextField,
    Container,
    Card,
    CardHeader,
    CardContent,
    List,
    ListItem,
    Typography,
    CircularProgress,
} from '@mui/material';
import './styles/Home.css';
import ListCard from './ListCard';
import Confetti from 'react-confetti'

export default function Home() {
    const [todaysGame, setTodaysGame] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [options, setOptions] = useState([]);
    const [guesses, setGuesses] = useState([]);
    const [open, setOpen] = useState(false);
    const loading = open && searchValue && options.length === 0;
    const [guessedCorrectly, setGuessedCorrectly] = useState(false);

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

    const onChange = (value) => {
        setOptions([])
        setSearchValue('')
        if (value) {
            handleGuess(value)
        }
    }

    const setGuessedArrayFields = (answerArray, guessArray) => {
        answerArray.forEach(aField => {
            if (!aField.guessed && guessArray.find(gField => gField.id === aField.id)) aField.guessed = true;
        })
    }

    const handleGuess = async (newGuess) => {
        if (newGuess.id === todaysGame.id) {
            setGuessedCorrectly(true);
            return;
        }
        // If duplicate guessed game
        if (guesses.find(g => g.id === newGuess.id)) return;

        let cloneGame = { ...todaysGame };
        const { data } = await axios.get(`/api/games/${cloneGame.id}`);
        setGuessedArrayFields(cloneGame.designers, data.designers)
        setGuessedArrayFields(cloneGame.publishers, data.publishers)
        setGuessedArrayFields(cloneGame.categories, data.categories)
        setGuessedArrayFields(cloneGame.artists, data.artists)
        setGuesses([...guesses, newGuess])
        setTodaysGame(cloneGame)
        setSearchValue('')
    }

    useEffect(() => {
        const fetchSearchData = async () => {
            try {
                if (searchValue) {
                    const response = await axios.get('/api/games/search', { params: { query: searchValue}});
                    if (response?.data !== '' && response?.data?.[0]) { 
                        setOptions(response.data)
                    }
                }
    
            } catch (error) {
                console.error(error);
            }
        };
        // Set timeout on how long to wait until the search call is made
        const timeOutId = setTimeout(() => fetchSearchData(), 300);
        return () => clearTimeout(timeOutId);
      }, [searchValue]);

    return (
        <Container component="main">
            {guessedCorrectly ? <Confetti /> : null}
            {!todaysGame ? <p>Loading...</p> : 
            <Container>
                <Card className='contentCard'>
                    <CardHeader 
                    title="Try to guess todays boardgame!"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Autocomplete
                            id="autocomplete-search"
                            inputValue={searchValue}
                            freeSolo
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            open={open}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            onInputChange={(event, newSearchValue) => setSearchValue(newSearchValue)}
                            options={options}
                            getOptionLabel={(option) => `${option?.name} (${option?.yearpublished})`}
                            filterOptions={(x) => x}
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    label="Search"
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                          </React.Fragment>
                                        ),
                                      }}/>
                            )}
                            onChange={(event, value) => onChange(value)}
                            />
                    </CardContent>
                </Card>
                Todays game: {todaysGame?.name?.value}
                {guesses.length ? 
                <Card className='contentCard'>
                <CardHeader 
                title="Previous guesses:"
                />
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <List>
                    {guesses.map((game, index) => (<ListItem key={game.id}>
                        <Typography component="div" variant="h5">{index + 1}. {game.name} ({game.yearpublished})</Typography>
                    </ListItem>))}
                    </List>
                </CardContent>
                </Card> : null}

                <ListCard title="Categories:" list={todaysGame?.categories} />
                <ListCard title="Mechanics:" list={todaysGame?.mechanics} />
                <ListCard title="Designer/s:" list={todaysGame?.designers} />
                <ListCard title="Publisher/s:" list={todaysGame?.publishers} />
                <ListCard title="Artsit/s:" list={todaysGame?.artists} />
            </Container>}
        </Container>
    )
  }