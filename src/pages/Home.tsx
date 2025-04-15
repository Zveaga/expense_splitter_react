import React, { use, useEffect, useState, useMemo } from 'react'
import { Event, Expense, User, } from '../types/interfaces';
import { SelectChangeEvent, Paper, Modal, Container, Box, Stack, InputBase, Divider, Typography, useTheme, TextField, FormControl, Select, Button, InputLabel, MenuItem, } from '@mui/material';
import { getUserNameById, getIdByUserName } from '../utils/userUtils.ts';
import EventDetails from '../components/EventDetails.tsx';

const user1: User = {
	id: 1,
	name: 'Alice',
	userName: 'alice@example.com',
	balance: 50,
	password: '1',
};

const user2: User = {
	id: 2,
	name: 'Bob',
	userName: 'bob@example.com',
	balance: -30,
	password: '1',
};


const user3: User = {
	id: 3,
	name: 'Rar',
	userName: 'rrr@example.com',
	balance: 200,
	password: '1',
};

const users = [user1, user2, user3];

const expense1: Expense = {
   id: 1,
   description: 'Dinner',
   amount: 100,
   paidBy: [{ userId: user1.id, amount: 100 }],
   participants: [user1, user2],
   date: '2025-01-28',
};

const expense2: Expense = {
   id: 2,
   description: 'Uber ride',
   amount: 100,
   paidBy: [
		{ userId: user1.id, amount: 100 },
		// { userId: user1.id, amount: 10 },
		// { userId: user1.id, amount: 10 },
	],
   participants: [user1, user2, user3,],
   date: '2025-01-27',
};

export const expenses = [expense1, expense2,];

const sampleEvents: Event[] = [
	{
		id: 1,
		description: 'ski trip',
		expenses: expenses,
		users: [user1, user2],
		date: '21-01-2024',

	},
	{
		id: 2,
		description: 'greece',
		expenses: [],
		users: [user1, user2],
		date: '21-01-2024',

	},
	{
		id: 3,
		description: 'patagonia',
		expenses: [],
		users: [user1, user2],
		date: '21-01-2024',
	},
];


///////////////////////////////////////////////////////////////////////////
const Home: React.FC = () => {
	const theme = useTheme();
	const [selectedEventId, setSelectedEventId] = useState<number>(0);

	const [events, setEvents] = useState<Event[]>(sampleEvents)
	const [openNewEventModal, setOpenNewEventModal] = useState(false);
	const [eventName, setEventName] = useState('');
	const [participants, setParticipants] = useState([]);
	const [date, setDate] = useState('');

	// console.log('Events:\n', events);

	const selectedEvent = useMemo(() => {
		return events.find(event => event.id === selectedEventId);
	}, [events, selectedEventId]);

	//------------Event Handlers------------//
	const handleEventClick = (e: React.MouseEvent, eventId: number) => {
		// console.log(`Event (${event.description}) clicked!`);
		e.preventDefault();
		setSelectedEventId(eventId);
	};

	const handleNewEventClick = () => {
		setOpenNewEventModal(true);
	};

	const handleCloseNewEventModal = () => {
		setOpenNewEventModal(false);
	};

	const handleAddExpense = (newExpense: Expense) => {
		if (!selectedEvent) {
			return;
		}
		const updatedEvent = {
			...selectedEvent,
			expenses: [...selectedEvent.expenses, newExpense]
		};
		setSelectedEventId(updatedEvent.id);
		setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
	};

	const handleAddEvent = () => {
		const tempId =
			events.length > 0
			? Math.max(...events.map(event => event.id)) + 1
			: 1;

			const newEvent = {
			id: tempId,
			description: eventName,
			expenses: [],
			users: participants,
			date: date,
		};
		setEvents(prevEvents => [...prevEvents, newEvent]);
	};


	const handleAddUserToEvent = (e) => {
		setParticipants(e.target.value);
	};
	
	//------------UI child components of Home ------------//
	

	
	
	const EventLine: React.FC<{event: Event}> = ({event})  => {
		return (
			<Stack
				// width={'90%'}
				onClick={(e: React.MouseEvent) => handleEventClick(e, event.id)}
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
					//   borderRadius: '2em',
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
						height: '800px',
						overflow: 'auto',
						border: '2px solid #757575',
						borderRadius: '0.5em',
						mx: 'auto',
						
					}}
				>
					<Typography sx={{ textAlign: 'center'}} variant="h4" gutterBottom >
						Events
					</Typography>

					<Stack sx={{ '& > *': { minHeight: '30px' } }} gap={1}>
						{events.map((event, i) => (
							<EventLine key={i} event={event} />
						))}
					</Stack>

					<Divider sx={{ my: 2 }} />
						
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					  	<Button
					  	  	onClick={handleNewEventClick}
					  	  	variant='contained'
					  	  	color="primary"
					  	  	sx={{ textTransform: 'none' }}
							fullWidth

						>
					  	  New Event
					  	</Button>
					</Box>

					<Modal
						open={openNewEventModal}
						onClose={handleCloseNewEventModal}
						sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}
					>
						<Box
							sx={{
								backgroundColor: theme.palette.primary.main,
								padding: 3,
								borderRadius: 2,
								width: "80%",
								maxWidth: 400,
							}}
						>

							<Typography variant="h6">Add New Event:</Typography>
							<Stack spacing={2}>
							<TextField
								label="Name"
								value={eventName}
								onChange={(e) => setEventName(e.target.value)}
								fullWidth
							/>
							<TextField
								label="Date"
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								InputLabelProps={{
								shrink: true,
								}}
								fullWidth
							/>
							<FormControl fullWidth>
								<InputLabel id="participants-label">Participants</InputLabel>
								<Select
									labelId="participants-label"
									multiple
									value={participants}
									label="Paid By"
									// onChange={(e) => setPaidBy(e.target.value)}
									onChange={handleAddUserToEvent}
									renderValue={(selected) => selected.join(', ')}
								>
								{users.map((user) => (
									<MenuItem key={user.id} value={user.name}>
									{user.name}
									</MenuItem>
								))}
								</Select>
							</FormControl>
							<Button
									onClick={handleAddEvent}
									sx={{
										backgroundColor: theme.palette.primary.dark,
										// '&:hover': { backgroundColor: theme.palette.primary.main }
									}}
									variant="contained"
									color="primary"
								>
								Add Event
							</Button>
							</Stack>
						</Box>
					</Modal>


				</Box>
				{/*---Right column (event details)---*/}
				<Box
          			// flex={1}
          			padding="1em"
          			// bgcolor={theme.palette.primary.dark}
          		sx={{
          			height: '800px',
          			overflowY: 'auto',
					width: '800px',
          			border: '2px solid #757575',
          			borderRadius: '0.5em',
          		}}
        		>
					{selectedEvent ? (
						<EventDetails event={selectedEvent} onAddExpense={handleAddExpense} expenses={expenses} users={users} />
					) : (
						<Typography variant="h6" align="center">
              				Please select an event.
						</Typography> 
						
					)}
				</Box>
			</Stack>
		</Container>
	);
};

export default Home;
