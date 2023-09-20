import { 
    Card,
    CardHeader,
    CardContent,
    List,
    ListItem,
    Typography,
} from '@mui/material';

export default function ListCard({ title, list }) {
    return (
    <Card className='contentCard'>
        <CardHeader 
            title={title}
        />
        <CardContent sx={{ flex: '1 0 auto' }}>
            <List>
            {list.map(item => (<ListItem key={item.id}>
                <Typography component="div" variant="h5">{item.guessed ? item.value : item.value.replace(/\S/g, "*")}</Typography>
            </ListItem>))}
            </List>
        </CardContent>
    </Card>
    );
  };