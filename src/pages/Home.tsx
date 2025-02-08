import React, { use, useState } from 'react'
import { Event } from '../interfaces';
import { user1, user2 } from './Dashboard.tsx'
import { Container, Box, Stack, InputBase, Divider, Typography, useTheme,  } from '@mui/material';

const sampleEvents: Event[] = [
	{
		id: 1,
		description: 'ski trip',
		users: [user1, user2],
		date: '21-01-2024',

	},
	{
		id: 2,
		description: 'greece',
		users: [user1, user2],
		date: '21-01-2024',

	},
	{
		id: 3,
		description: 'patagonia',
		users: [user1, user2],
		date: '21-01-2024',
	},


];



const Home: React.FC = () => {
	const theme = useTheme();
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [events, setEvents] = useState<Event[]>(sampleEvents);

	console.log(events);

	//----Event Handlers----//
	const handleEventClick = (e: React.MouseEvent, event: Event) => {
		console.log(`Event (${event.description}) clicked!`);
	};
	
	//----UI Components----//
	const EventLine: React.FC<{event: Event}> = ({event})  => {
		return (
			<Stack
				// width={'90%'}
				onClick={(e: React.MouseEvent) => handleEventClick(e, event)}
				direction={'row'}
				bgcolor={theme.palette.primary.main}
				paddingX={'0.5em'}
				justifyContent= {'center'}
				alignItems={'center'} 
				sx={{
					borderRadius: '5px',
					cursor: 'pointer',
					transition: 'padding-left ease-in-out 0.3s, padding-right ease-in-out 0.3s, border-radius ease-in-out 0.3s, background-color ease-in-out 0.3s',
					'&:hover': {
					  bgcolor: theme.palette.primary.dark,
					  borderRadius: '2em',
					  paddingLeft: '1em',
					  paddingRight: '0.02em',
					},
				}}
			>
				<Typography>
				{ event.description.charAt(0).toUpperCase() + event.description.slice(1) }
				</Typography>
			</Stack>
		);
	};


	return (
		<Container sx={{ padding: theme.spacing(3) }}>
			<Box
				sx={{
					padding: '1em',
					width: '50%',
					height: '600px',
					overflow: 'auto',
					border: '2px solid #757575',
					borderRadius: '1em',
					mx: 'auto',
				}}
			>
			<Typography sx={{ textAlign: 'center'}} variant="h4" gutterBottom >
				Events
			</Typography>
				<Stack sx={{ }} gap={1}>
					{events.map((event, i) => (
						<EventLine key={i} event={event} />
					))}
				</Stack>
			</Box>
		</Container>
	);
};

export default Home;
