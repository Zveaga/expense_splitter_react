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
		e.preventDefault();
		setSelectedEvent(event);


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
		<Container maxWidth={false} sx={{padding: theme.spacing(3) }}>
			<Stack direction={'row'} spacing={1}>
				{/*---Left column (event list)---*/}
				<Box
					sx={{
						padding: '1em',
						width: '300px',
						height: '600px',
						overflow: 'auto',
						border: '2px solid #757575',
						borderRadius: '0.5em',
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
				{/*---Right column (event details)---*/}
				<Box
          			flex={1}
          			padding="1em"
          			// bgcolor={theme.palette.primary.dark}
          		sx={{
          			height: '600px',
          			overflowY: 'auto',
          			border: '2px solid #757575',
          			borderRadius: '0.5em',
          		}}
        		>
					{selectedEvent ? (
						// <EventDetails event={selectedEvent} />
						<Typography variant="h6" align="center">
              				{`${selectedEvent.description} selected.`}
						</Typography> 
					) : (
						<Typography variant="h6" align="center">
              				Please select an event.
						</Typography> 
						
					)}
				</Box>
			</Stack>
		</Container>
);
	
// return (
//     <Container
//       maxWidth={false}
//       sx={{ padding: 1, margin: 2, width: '100%', height: '100vh' }}
//     >
//       <Box sx={{ display: 'flex', height: '100%' }}>
//         {/* Left Section */}
//         <Box
//           sx={{
//             padding: '1em',
//             width: '30%',          
//             height: '100%',
//             overflowY: 'auto',
//             border: '2px solid #757575',
//             borderRadius: '1em',
//           }}
//         >
//           <Typography sx={{ textAlign: 'center' }} variant="h4" gutterBottom>
//             Events
//           </Typography>
//           <Stack gap={1}>
//             {events.map((event, i) => (
//               <div key={i}>{}</div>
//             ))}
//           </Stack>
//         </Box>

//         {/* Right Section */}
//         <Box
//           sx={{
//             flex: 1,
//             padding: '1em',
//             height: '100%',
//             overflowY: 'auto',
//             border: '2px solid #757575',
//             borderRadius: '1em',
//           }}
//         >
//           <Typography variant="h6" align="center">
//             Please select an event.
//           </Typography>
//         </Box>
//       </Box>
//     </Container>
//   );
};

export default Home;
