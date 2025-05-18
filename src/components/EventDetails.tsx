import React, { useState, useMemo, useEffect } from 'react';
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { User, Expense, Event } from '../types/interfaces';
import { getUserNameById } from '../utils/userUtils.ts';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTotalSpent } from '../utils/eventUtils.ts';
import { createExpense, getExpenses } from '../services/expenseService.ts';

interface EventDetailsProps {
	event: Event;
	onAddExpense: (expense: Expense) => void;
	onDeleteEvent: (eventId: number) => void;
	setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
	setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
	users: User[];
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onAddExpense, onDeleteEvent, setSelectedEvent, users }) => {
	const theme = useTheme();
	const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
	const [openNewExpenseModal, setOpenNewExpenseModal] = useState(false);
	const [openExpenseModal, setOpenExpenseModal] = useState(false);
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState('');
	const [date, setDate] = useState('');
	const [paidBy, setPaidBy] = useState<{ userId: number, amount: number }[]>([]);


	// useEffect(() => {
	// 	const fetchExpenses = async () => {
	// 		try {
	// 			const data = await getExpenses();
	// 			console.log(data);
	// 			setSelectedEvent((prevEvent) => {
	// 				if (!prevEvent) return null;
	// 				return {
	// 					...prevEvent,
	// 					expenses: [...prevEvent.expenses, ...data],}
	// 			  });
	// 			} catch (error) {
	// 			console.log('Error fetching expenses:', error);
	// 		}

	// 	}

	// 	fetchExpenses();
	// }, []);

	const handleAddExpense = async () => {
		if (!paidBy || !description || !amount) {
			return;
		}

		const tempId =
			event.expenses.length > 0
				? Math.max(...event.expenses.map(expense => expense.id)) + 1
				: 1;

		const newExpense = {
			// id: tempId,
			description: description,
			amount: parseFloat(amount),
			paidBy: paidBy,
			participants: event.users, //!!!
			// date: new Date(),
			eventId: event.id,
		};


		try {
			const createdExpense = await createExpense(newExpense);
			console.log('createdExpense:', createdExpense);
	
			onAddExpense(createdExpense);
			setDescription('');
			setAmount('');
			setDate('');
			setPaidBy([]);
		} catch (error) {
			console.error('Error creating expense:', error);
		}




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

	const handleAddUserToExpense = (event: SelectChangeEvent<number[]>) => {
		const selectedIds = event.target.value as number[];

		const updated = selectedIds.map(id => {
			const existing = paidBy.find(usr => usr.userId === id);
			return existing || { userId: id, amount: 0 };
		});

		setPaidBy(updated);
	};

	const handleDeleteExpense = (expenseId: number) => {
		if (!event) return;
		const updatedExpenses = event.expenses.filter(expense => expense.id !== expenseId);
		setSelectedEvent({ ...event, expenses: updatedExpenses });
		// setSelectedEvent((prevState) => {
		// 	if (!prevState) return null;
		// 	return {
		// 		...prevState,
		// 		expenses: updatedExpenses,
		// 	};
		// });
	};

	type Transaction = {
		from: number;
		to: number;
		amount: number;
	};

	const getSettlements = (users: User[], expenses: Expense[]): Transaction[] => {
		const balances: Record<number, number> = {};

		users.forEach(user => balances[user.id] = 0);

		expenses.forEach(exp => {
			const share = exp.amount / exp.participants.length;
			exp.participants.forEach(user => balances[user.id] -= share);
			exp.paidBy.forEach(p => balances[p.userId] += p.amount);
		});

		const debtors: { userId: number; amount: number }[] = [];
		const creditors: { userId: number; amount: number }[] = [];

		Object.entries(balances).forEach(([userId, amount]) => {
			if (amount < -0.01) {
				debtors.push({ userId: Number(userId), amount: -amount });
			} else if (amount > 0.01) {
				creditors.push({ userId: Number(userId), amount });
			}
		});

		const transactions: Transaction[] = [];

		for (const debtor of debtors) {
			let toPay = debtor.amount;
			for (const creditor of creditors) {
				if (toPay <= 0) break;
				const payAmount = Math.min(toPay, creditor.amount);
				if (payAmount > 0) {
					transactions.push({
						from: debtor.userId,
						to: creditor.userId,
						amount: parseFloat(payAmount.toFixed(2)),
					});
					creditor.amount -= payAmount;
					toPay -= payAmount;
				}
			}
		}

		return transactions;
	}

	type SettlementDisplayProps = {
		users: User[];
		expenses: Expense[];
		theme: any;
	};

	const SettlementDisplay: React.FC<SettlementDisplayProps> = ({ users, expenses, theme }) => {
		const transactions = useMemo(() => getSettlements(users, expenses), [users, expenses]);

		return (
			<Box
				sx={{
					backgroundColor: theme.palette.background.paper,
					padding: 2,
					borderRadius: 2,
					border: `1px solid ${theme.palette.divider}`,
				}}
			>
				<Typography variant="h6">Balances:</Typography>
				<Stack spacing={1} mt={1}>
					{transactions.length === 0 ? (
						<Typography variant="body2">All settled up!</Typography>
					) : (
						transactions.map((tx, idx) => (
							<Typography variant="body2" key={idx}>
								{getUserNameById(users, tx.from)} owes {getUserNameById(users, tx.to)} €{tx.amount.toFixed(2)}
							</Typography>
						))
					)}
				</Stack>
			</Box>
		);
	};

	return (
		<Stack spacing={2}>
			<Typography variant="h5" align="center">
				{event.description.charAt(0).toUpperCase() + event.description.slice(1)}
			</Typography>
			{/* <Typography align="center" color="textSecondary">
				Date: {event.date}
			  </Typography> */}
			<Divider />

			{/*------------RENDER EXPENSES------------*/}

			<Typography variant='h6' align='center'>Current Expenses</Typography>
			{event.expenses.length ? (
				event.expenses.map(expense => (
					<Box
						key={expense.id}
						onClick={() => handleExpenseClick(expense)}
						padding={1}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
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
						<Typography variant="subtitle1" align='center' sx={{ flexGrow: 1, textAlign: 'center' }}>
							{expense.description.charAt(0).toUpperCase() + expense.description.slice(1)}
						</Typography>
						{/* <Typography variant="caption">
							Paid by: {expense.paidBy} on {expense.date}
						</Typography> */}
						<Button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteExpense(expense.id);
							}}
							sx={{ minWidth: 'auto', padding: 1 }}
						>
							<DeleteIcon />
						</Button>
					</Box>
				))
			) : (
				<Typography>No Expenses yet.</Typography>
			)}
			<Divider />

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
							<Typography variant="body1">Amount: €{selectedExpense.amount}</Typography>
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

			<Stack spacing={2} mt={4} display={'flex'}>
				<Typography variant='h5' align='center'>Trip Summary</Typography>

				{/*----Total spent----*/}
				<Box
					sx={{
						backgroundColor: theme.palette.background.paper,
						padding: 2,
						borderRadius: 2,
						border: `1px solid ${theme.palette.divider}`,
					}}
				>
					<Typography>
						Total Spent: <strong>{getTotalSpent(event.expenses)}</strong>
					</Typography>

					{/* <Box display="flex" alignItems="center" gap={5}>
						<Typography variant="h6">Total Spent:</Typography>
						<Typography variant="h6"> <strong>10000</strong></Typography>
					</Box> */}
				</Box>

				{/*----Settlements----*/}
				<SettlementDisplay users={users} expenses={event.expenses} theme={theme} />
			</Stack>
			<Divider />
			<Button
				onClick={() => onDeleteEvent(event.id)}

				variant="contained"
				color="primary"
				sx={{
					color: '#fc4c4c', // Text color
					// fontSize: '16px', // Font size
					// fontWeight: 'bold', // Font weight
					textTransform: 'uppercase', // Transform text to uppercase
					// fontFamily: 'Arial, sans-serif', // Font family
				}}
			// style={{ marginTop: '19.5em' }}
			>
				Delete Event
			</Button>

		</Stack>
	);

};

export default EventDetails;