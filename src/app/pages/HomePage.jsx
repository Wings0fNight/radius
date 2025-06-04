import React from 'react';
import UserProfile from '../components/home/UserProfileCard'
import UserAccess from '../components/home/UserAccessCards'

export function Home () {
	return (
		<div className='h-screen bg-background max-w-[100%] p-5'>
			<UserProfile />
			<UserAccess />
		</div>
	);
};