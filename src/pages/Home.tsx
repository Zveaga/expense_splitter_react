import React, { use, useEffect, useState } from 'react'
import { Event, Expense, User, } from '../types/interfaces';
import { SelectChangeEvent, Paper, Modal, Container, Box, Stack, InputBase, Divider, Typography, useTheme, TextField, FormControl, Select, Button, InputLabel, MenuItem, } from '@mui/material';
import { getUserNameById, getIdByUserName } from '../utils/userUtils.ts';
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

const users = [user1, user2];

const expense1: Expense = {
   id: 1,
   description: 'Dinner',
   amount: 50,
   paidBy: [{ userId: user1.id, amount: 50 }],
   participants: [user1, user2],
   date: '2025-01-28',
};

const expense2: Expense = {
   id: 2,
   description: 'Uber ride',
   amount: 20,
   paidBy: [
		{ userId:user2.id, amount: 10 },
		{ userId:user1.id, amount: 10 },
	],
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


///////////////////////////////////////////////////////////////////////////
const Home: React.FC = () => {
	const theme = useTheme();
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [events, setEvents] = useState<Event[]>(sampleEvents)
	const [openNewEventModal, setOpenNewEventModal] = useState(false);
	const [eventName, setEventName] = useState('');
	const [participants, setParticipants] = useState([]);
	const [date, setDate] = useState('');

	// console.log('Events:\n', events);

	//------------Event Handlers------------//
	const handleEventClick = (e: React.MouseEvent, event: Event) => {
		// console.log(`Event (${event.description}) clicked!`);
		e.preventDefault();
		setSelectedEvent(event);
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
		setSelectedEvent(updatedEvent);
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
	
	interface EventDetailsProps {
		event: Event;
		onAddExpense: (expense: Expense) => void;
	}

	const EventDetails: React.FC<EventDetailsProps> = ({ event, onAddExpense }) => {
		const theme = useTheme();
		const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
		const [openNewExpenseModal, setOpenNewExpenseModal] = useState(false);
		const [openExpenseModal, setOpenExpenseModal] = useState(false);
		const [description, setDescription] = useState('');
		const [amount, setAmount] = useState('');
		const [date, setDate] = useState('');
		const [paidBy, setPaidBy] = useState<{ userId: number, amount: number }[]>([]);

		const handleAddExpense = () => {
			if (!paidBy || !description || !amount) {
				return;
			}

			const tempId =
				event.expenses.length > 0
				? Math.max(...event.expenses.map(expense => expense.id)) + 1
				: 1;
			
			const newExpense = {
				id: tempId,
   				description: description,
   				amount: parseFloat(amount),
    			paidBy: paidBy,
   				participants: event.users, //!!!
   				date: date,
			};

			console.log(newExpense);

			onAddExpense(newExpense);
			setDescription('');
			setAmount('');
			setDate('');
			setPaidBy([]);

		};

		const handleExpenseClick = (expense: Expense) => {
			setSelectedExpense(expense);
			setOpenExpenseModal(true);
		};

		const handleCloseExpenseModal = () => {
			setSelectedExpense(null);
			setOpenExpenseModal(false);
		};

		const handleAddNewExpense = () => {
			setOpenNewExpenseModal(true);
		};

		const handleCloseNewExpenseModal = () => {
			setOpenNewExpenseModal(false);
		};

		// const handleAddUserToExpense = (e) => {
		// 	setPaidBy(e.target.value);
		// };

		const handleAddUserToExpense = (event: SelectChangeEvent<number[]>) => {
			const selectedIds = event.target.value as number[];
		  
			const updated = selectedIds.map(id => {
			  	const existing = paidBy.find(usr => usr.userId === id);
			  	return existing || { userId: id, amount: 0 };
			});
		  
			setPaidBy(updated);
		};
		  



		return (
			<Stack spacing={2}>
				<Typography variant="h5" align="center">
        			{event.description.charAt(0).toUpperCase() + event.description.slice(1)}
      			</Typography>
				{/* <Typography align="center" color="textSecondary">
        			Date: {event.date}
      			</Typography> */}
				<Divider/>

				{/*------------RENDER EXPENSES------------*/}
				
				<Typography variant='h6' align='center'>Current Expenses</Typography>
				{event.expenses.length ? (
					event.expenses.map(expense => (
						<Box
							key={expense.id}
							onClick={() => handleExpenseClick(expense)}
							padding={1}
							sx={{
								border: '1px solid #ccc',
								borderRadius: '4px',
								backgroundColor: theme.palette.background.paper,
								cursor: 'pointer',
								transition: 'padding-left ease-in-out 0.3s, padding-right ease-in-out 0.3s, border-radius ease-in-out 0.3s, background-color ease-in-out 0.3s',
								'&:hover': {
								  bgcolor: theme.palette.primary.dark,
 								  paddingLeft: '1em',
								  paddingRight: '0.02em',
								},
							}}
						>
							<Typography variant="subtitle1" align='center'>
            					{expense.description.charAt(0).toUpperCase() + expense.description.slice(1)}
            				</Typography>
            				{/* <Typography variant="caption">
            					Paid by: {expense.paidBy} on {expense.date}
            				</Typography> */}
						</Box>
					))
				) : (
					<Typography>No Expenses yet.</Typography>
				)}
				<Divider/>
				
				{/*------------EXPENSE DETAILS MODAL------------*/}

				<Modal
					open={openExpenseModal}
					onClose={handleCloseExpenseModal}
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
					  {selectedExpense && (
						<>
						  	<Typography variant="h5" gutterBottom>
								Expense Details
						  	</Typography>
						  	<Typography variant="body1">Amount: ${selectedExpense.amount}</Typography>
						  	{/* <Typography variant="body1">Paid by: {selectedExpense.paidBy.join(', ')}</Typography> */}
						  	<Typography variant="body1">
								Paid by: {selectedExpense.paidBy.map(usr => getUserNameById(users, usr.userId)).join(', ')}
							</Typography>
						  	{/* <Typography variant="body1">Date: {selectedExpense.date}</Typography> */}
						  	<Box sx={{ marginTop: 2, textAlign: "center" }}>
								<Button variant="contained" onClick={handleCloseExpenseModal}>Close</Button>
						  	</Box>
						</>
					  )}
					</Box>
				</Modal>

				{/*------------ADD NEW EXPENSE------------*/}

				<Button
					onClick={handleAddNewExpense}
					variant='contained'
					color="primary"
					// fullWidth
					// sx={{ textTransform: 'none' }}
				>
					New Expense
				</Button>



				<Modal
					open={openNewExpenseModal}
					onClose={handleCloseNewExpenseModal}
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

						<Typography variant="h6">Add New Expense:</Typography>
      					<Stack spacing={2}>
      					  <TextField
      					    label="Description"
      					    value={description}
      					    onChange={(e) => setDescription(e.target.value)}
      					    fullWidth
      					  />
      					  <TextField
      					    label="Amount"
      					    type="number"
      					    value={amount}
      					    onChange={(e) => setAmount(e.target.value)}
      					    fullWidth
      					  />
      					  {/* <TextField
      					    label="Date"
      					    type="date"
      					    value={date}
      					    onChange={(e) => setDate(e.target.value)}
      					    InputLabelProps={{
      					      shrink: true,
      					    }}
      					    fullWidth
      					  /> */}

      					  <FormControl fullWidth>
      					    <InputLabel id="paid-by-label">Paid By</InputLabel>
      					    <Select
								labelId="paid-by-label"
								multiple
								value={paidBy.map(usr => usr.userId)}
								label="Paid By"
      					      	// onChange={(e) => setPaidBy(e.target.value)}
      					      	onChange={handleAddUserToExpense}
								renderValue={(selected) =>
									selected
										.map(id => event.users.find(usr => usr.id === id)?.name)
										.join(', ')}
							>
      					      {event.users.map((user) => (
      					        <MenuItem key={user.id} value={user.id}>
      					          {user.name}
      					        </MenuItem>
      					      ))}
      					    </Select>
      					  </FormControl>

						  {/* After selecting users, we show the amount input for each user */}

						  {paidBy.map((payer) => {
							const user = event.users.find(usr => usr.id === payer.userId);
							return (
								<TextField
									key={payer.userId}
									label={`Amount paid by ${user?.name}`}
									// type="number"
									fullWidth
									margin="dense"
									value={payer.amount || ''}
									onChange={(e) => {
										const updated = paidBy.map(p =>
										p.userId === payer.userId
											? { ...p, amount: Number(e.target.value) }
											: p
										);
										setPaidBy(updated);
									}}
								/>
							);
						  })}


      					  <Button
								onClick={handleAddExpense}
						  		sx={{
									backgroundColor: theme.palette.primary.dark,
									// '&:hover': { backgroundColor: theme.palette.primary.main }
								}}
								variant="contained"
								color="primary"
							>
      					    Add Expense
      					  </Button>
      					</Stack>
					</Box>
				</Modal>

      			<Divider />

				{/*-------------TRIP SUMMARY-------------*/}
				<Stack spacing={2} mt={4}>
					<Typography variant='h5' align='center'>Trip Summary</Typography>

					{/*----Total spent----*/}
					{/* <Paper elevation={2} sx={{ padding: 2 }}>
						<Typography variant="subtitle1">Total Spent: 1000</Typography>
						<Typography variant="h6">1000</Typography>
					</Paper> */}
					<Box
						sx={{
						backgroundColor: theme.palette.background.paper,
						padding: 2,
						borderRadius: 2,
						border: `1px solid ${theme.palette.divider}`,
						}}
					>
						<Typography variant="h7">
							Total Spent: <strong>10000</strong>
						</Typography>

						{/* <Box display="flex" alignItems="center" gap={5}>
							<Typography variant="h6">Total Spent:</Typography>
							<Typography variant="h6"> <strong>10000</strong></Typography>
						</Box> */}
					</Box>

  					{/*----Individual Totals----*/}
					<Box
						sx={{
						backgroundColor: theme.palette.background.paper,
						padding: 2,
						borderRadius: 2,
						border: `1px solid ${theme.palette.divider}`,
						}}
					>
						<Typography variant="h7"> Individual Totals:</Typography>
						<Stack spacing={1} mt={1}>

						</Stack>

						{/* <Box display="flex" alignItems="center" gap={5}>
							<Typography variant="h6">Total Spent:</Typography>
							<Typography variant="h6"> <strong>10000</strong></Typography>
						</Box> */}
					</Box>
  					{/*----Who Owes Whom----*/}
				
					  <Box
						sx={{
						backgroundColor: theme.palette.background.paper,
						padding: 2,
						borderRadius: 2,
						border: `1px solid ${theme.palette.divider}`,
						}}
					>
						<Typography variant="h7"> Balances:</Typography>
						<Stack spacing={1} mt={1}>
							
						</Stack>
					</Box>
				
				
				
				</Stack>

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
