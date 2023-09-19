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
    // ListItemText,
    Typography,
    CircularProgress,
} from '@mui/material';
import './styles/Home.css';

export default function Home() {
    const [todaysGame, setTodaysGame] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [options, setOptions] = useState([]);
    const [guesses, setGuesses] = useState([]);
    const [open, setOpen] = React.useState(false);
    const loading = open && searchValue && options.length === 0;


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

    const handleGuess = (value) => {
        console.log('RUNNING HANDLE GUESS', value)
        setGuesses([...guesses, value])
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
        <Container component="main" maxWidth="xs">
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

                <Card className='contentCard'>
                    <CardHeader 
                    title="Designer:"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <List>
                        {todaysGame?.designers.map(designer => (<ListItem key={designer.id}>
                            <Typography component="div" variant="h5">{designer.guessed ? designer.value : designer.value.replace(/\S/g, "*")}</Typography>
                        </ListItem>))}
                        </List>
                    </CardContent>
                </Card>

                <Card className='contentCard'>
                    <CardHeader 
                    title="Publisher:"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <List>
                        {todaysGame?.publishers.map(publisher => (<ListItem key={publisher.id}>
                            <Typography component="div" variant="h5">{publisher.guessed ? publisher.value : publisher.value.replace(/\S/g, "*")}</Typography>
                        </ListItem>))}
                        </List>
                    </CardContent>
                </Card>
                Todays game: {todaysGame?.name?.value}
            </Container>}
        </Container>
    )
  }