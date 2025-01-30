import React, { use, useState } from 'react'
import { Event } from '../interfaces';
import { user1, user2 } from './Dashboard.tsx'


const sampleEvents: Event[] = [
	{
		id: 1,
		name: 'restaurant',
		users: [user1, user2],
		date: '21-01-2024',

	},
	{
		id: 2,
		name: 'boat',
		users: [user1, user2],
		date: '21-01-2024',

	},
	{
		id: 3,
		name: 'jeep ride',
		users: [user1, user2],
		date: '21-01-2024',
	},


];

const Home: React.FC = () => {
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [events, setEvents] = useState<Event[]>(sampleEvents);



	return <div>Welcome!</div>;
};

export default Home;
