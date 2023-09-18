import { useState, useEffect } from 'react';
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
    ListItemText,
    Typography,
} from '@mui/material';
import './styles/Home.css';

export default function Home() {
    const [todaysGame, setTodaysGame] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [options, setOptions] = useState([])

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

    const handleGuess = (value) => {
        console.log('OPTIONS', options)
        console.log('HANDLE GUESS', value)
        console.log('WHAT IS TODATYS GAME', todaysGame)
        setOptions([])
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
        const timeOutId = setTimeout(() => fetchSearchData(), 250);
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
                            inputValue={searchValue}
                            id="autocomplete-search"
                            options={options}
                            getOptionLabel={(option) => `${option?.name} (${option?.yearpublished})`}
                            onInputChange={(event, value) => setSearchValue(value)}
                            onChange={(event, value) => handleGuess(value)}
                            renderInput={(params) => <TextField {...params} label="Search" variant="outlined"/>}
                            />
                    </CardContent>
                </Card>

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