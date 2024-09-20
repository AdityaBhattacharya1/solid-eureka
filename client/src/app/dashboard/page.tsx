// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db, signOutUser } from '@/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import removeMd from 'remove-markdown'

const Dashboard = () => {
	const { user, loading } = useAuth()
	const [itineraries, setItineraries] = useState<any[]>([])
	const [error, setError] = useState<string>('')
	const router = useRouter()

	useEffect(() => {
		const fetchItineraries = async () => {
			if (!user) {
				setError('You must be logged in to view your itineraries')
				return
			}

			try {
				const q = query(
					collection(db, 'itineraries'),
					where('userId', '==', user.uid)
				)
				const querySnapshot = await getDocs(q)
				const fetchedItineraries = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
				setItineraries(fetchedItineraries)
			} catch (err) {
				setError('Error fetching itineraries')
				console.error(err)
			}
		}

		if (user) {
			fetchItineraries()
		}
	}, [user])

	if (loading) return <div>Loading...</div>

	if (error) return <div>{error}</div>

	console.log(itineraries)

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold mb-4">
					Your Saved Itineraries
				</h1>
			</div>

			{itineraries.length === 0 ? (
				<div className="m-16">No itineraries found. Generate some!</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{itineraries.length !== 0 &&
						itineraries.map((itinerary, index) => (
							<div
								key={itinerary.id}
								className="card bg-base-100 shadow-lg"
							>
								<div className="card-body">
									<h2 className="card-title">
										Itinerary {index + 1}
									</h2>

									<div>Budget: {itinerary['budget']}</div>
									<div>
										Location:{' '}
										{itinerary['place']?.toString()}
									</div>
									<div>
										Location:{' '}
										{itinerary['preferences']?.toString()}
									</div>
									<div>
										Itinerary:{' '}
										{itinerary &&
											removeMd(
												itinerary[
													'itinerary'
												][0].itinerary
													.substring(0, 300)
													.replace(/\*/g, '')
											)}
										...
									</div>
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	)
}

export default Dashboard
