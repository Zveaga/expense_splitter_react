import React, { useState } from 'react';
import { Expense, User, Transaction } from '../interfaces' 
import { Box, Button, Typography, List, ListItem, Divider, Modal, TextField } from "@mui/material";
import theme from '../Theme.ts';

// Sample users and expenses
export const user1: User = { id: 1, name: 'Alice', userName: 'alice@example.com', balance: 50, password: '1' };
export const user2: User = { id: 2, name: 'Bob', userName: 'bob@example.com', balance: -30, password: '1' };
const user3: User = { id: 3, name: 'Bam', userName: 'bam@example.com', balance: 2000, password: '1' };

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

export const expenses = [expense1, expense2];
// console.log('Expenses:\n' , expenses);

// Samle example of recent transactions
const sampleTransactions: Transaction[] = [
	{
	   id: 1,
	   expenseId: 1,
	   fromUser: user2,
	   toUser: user1,
	   amount: 25,
	   status: 'completed',
	   date: '2025-01-28',
	},
	// {
	// 	id: 2,
	// 	expenseId: 1,
	// 	fromUser: user3,
	// 	toUser: user1,
	// 	amount: 25,
	// 	status: 'completed',
	// 	date: '2025-01-28',
	//  }
];

const repeatedTransactions = Array.from({ length: 10 }, (_, index) => ({
	...sampleTransactions[index % sampleTransactions.length],
	id: index + 1,
}));

const Dashboard: React.FC = () => {
	const [expenses] = useState<Expense[]> ([expense1, expense2]);
	const [transactions] = useState<Transaction[]> (repeatedTransactions);
	const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
	const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

	// Handle transaction click
	const handleTransactionClick = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		setOpenTransactionModal(true);
	};

	// Handle closing transaction modal
	const handleCloseTransactionModal = (transaction: Transaction) => {
		setOpenTransactionModal(false);
		setSelectedTransaction(null);
	};

	// Dashboard summary
	const dashboardSummary = {
		totalOwed: user1.balance,
		totalPaid: user2.balance,
		balance: user1.balance - user2.balance,
		recentTransactions: transactions,
	};

	return (
		<Box sx={{ padding: 3 }}>
		  <Typography variant="h4" gutterBottom>
			Balance: {dashboardSummary.balance}
		  </Typography>
	
		  {/* Recent Transactions */}
		  <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
		  <List sx={{ maxHeight: 200, overflowY: "auto" }}>
			{transactions.map((transaction) => (
			  <div key={transaction.id}>
				<ListItem
					onClick={() => handleTransactionClick(transaction)}
					sx={{ cursor: 'pointer', '&:hover': {backgroundColor: theme.palette.primary.main }
				}}
				>
				  <Typography>
					{transaction.fromUser.name} owes {transaction.toUser.name} ${transaction.amount}
				  </Typography>
				</ListItem>
				<Divider />
			  </div>
			))}
		  </List>
	
		  {/* Transaction Detail Modal */}
		  <Modal
			open={openTransactionModal}
			onClose={handleCloseTransactionModal}
			sx={{
			  	display: "flex",
			  	justifyContent: "center",
			  	alignItems: "center",
			}}
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
			  {selectedTransaction && (
				<>
				  <Typography variant="h5" gutterBottom>
					Transaction Details
				  </Typography>
				  <Typography variant="body1">From: {selectedTransaction.fromUser.name}</Typography>
				  <Typography variant="body1">To: {selectedTransaction.toUser.name}</Typography>
				  <Typography variant="body1">Amount: ${selectedTransaction.amount}</Typography>
				  <Typography variant="body1">Date: {selectedTransaction.date}</Typography>
				  <Typography variant="body1">Status: {selectedTransaction.status}</Typography>
				  <Box sx={{ marginTop: 2, textAlign: "center" }}>
					<Button variant="contained" onClick={handleCloseTransactionModal}>Close</Button>
				  </Box>
				</>
			  )}
			</Box>
		  </Modal>
		</Box>
	  );
};

export default Dashboard;
