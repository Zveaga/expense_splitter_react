import React, { use, useEffect, useState } from 'react'
import { Event, Expense, User, } from '../interfaces';
import { Container, Box, Stack, InputBase, Divider, Typography, useTheme,  } from '@mui/material';
// import { user1, user2 } from './Dashboard.tsx'
// import { expenses } from './Dashboard.tsx';

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

const expense1: Expense = {
   id: 1,
   description: 'Dinner with friends',
   amount: 50,
   paidBy: user1,
   participants: [user1, user2],
   date: '2025-01-28',
};

const expense2: Expense = {
   id: 2,
   description: 'Uber ride',
   amount: 20,
   paidBy: user2,
   participants: [user1, user2],
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

const Home: React.FC = () => {
	const theme = useTheme();
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [events, setEvents] = useState<Event[]>(sampleEvents);

	console.log('Events:\n', events);

	//----Event Handlers----//
	const handleEventClick = (e: React.MouseEvent, event: Event) => {
		console.log(`Event (${event.description}) clicked!`);
		e.preventDefault();
		setSelectedEvent(event);
	};

	const handleAddExpense = (newExpense: Expense) => {
		if (!selectedEvent) {
			return;
		}
		const updatedEvent = {
			...selectedEvent,
			expenses: [...selectedEvent.expenses, newExpense]
		};
		setSelectedEvent(updatedEvent);
		setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
	};
	
	//----UI Components----//
	
	interface EventDetailsProps {
		event: Event;
		onAddExpense: (expense: Expense) => void;
	}

	const EventDetails: React.FC<EventDetailsProps> = ({ event, onAddExpense }) => {
		const theme = useTheme();



		return (
			<Stack spacing={2}>
				<Typography variant="h5" align="center">
        			{event.description.charAt(0).toUpperCase() + event.description.slice(1)}
      			</Typography>
				<Typography align="center" color="textSecondary">
        			Date: {event.date}
      			</Typography>
				<Divider/>
				{/*------RENDER EXPENSES------*/}
				<Typography variant='h6'>Current Expenses:</Typography>
				{event.expenses.length ? (
					event.expenses.map(expense => (
						<Box
							key={expense.id}
							padding={1}
							sx={{
								border: '1px solid #ccc',
								borderRadius: '4px',
								backgroundColor: theme.palette.background.paper,
							}}
						>
							<Typography variant="subtitle1">
            					{expense.description} - ${expense.amount}
            				</Typography>
            				<Typography variant="caption">
            					Paid by: {expense.paidBy.name} on {expense.date}
            				</Typography>
						</Box>
					))
				) : (
					<Typography>No Expenses yet.</Typography>
				)}
				<Divider/>
				{/*------ADD NEW EXPENSE------*/}

				

			
			
			</Stack>
		);

	}
	
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
          			// flex={1}
          			padding="1em"
          			// bgcolor={theme.palette.primary.dark}
          		sx={{
          			height: '600px',
          			overflowY: 'auto',
					width: '600px',
          			border: '2px solid #757575',
          			borderRadius: '0.5em',
          		}}
        		>
					{selectedEvent ? (
						<EventDetails event={selectedEvent} onAddExpense={handleAddExpense} />
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
