'use client'

import React, { useState } from 'react'
import HotelCard from './components/HotelCard'
import Itinerary from './components/Itinerary'
import ActivityList from './components/ActivityList'
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker'
import Select from 'react-tailwindcss-select'
import { SelectValue } from 'react-tailwindcss-select/dist/components/type'
const MapComponent = dynamic(() => import('./components/Map'), { ssr: false })
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MdErrorOutline } from 'react-icons/md'
import ItineraryForm from './components/ItineraryForm'

export default function HomePage() {
	const [location, setLocation] = useState('')
	const [budget, setBudget] = useState(0)
	const [preferences, setPreferences] = useState<SelectValue | null>(null)
	const [itineraryData, setItineraryData] = useState<any>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [dates, setDates] = useState<DateValueType>({
		startDate: null,
		endDate: null,
	})
	const { user } = useAuth()
	const router = useRouter()

	if (!user) {
		router.push('/auth') // Redirect to login if not authenticated
		return null
	}

	const scrollToElement = (elemId: string): void => {
		if (typeof window !== undefined) {
			const element = document.getElementById(elemId)
			if (element)
				window.scrollTo({
					top: element.offsetTop - 60,
					behavior: 'smooth',
				})
		}
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		setLoading(true)
		setTimeout(() => {
			scrollToElement('itinerary-section')
		}, 100)
		setError(null)

		const payload = {
			location,
			budget,
			start: new Date(dates?.startDate as Date)
				.toISOString()
				.split('T')[0],
			end: new Date(dates?.endDate as Date).toISOString().split('T')[0],
			preferences: (preferences as any[]).map((pref) => pref['value']),
		}

		try {
			const res = await fetch('/api/itinerary', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})

			const data = await res.json()
			setItineraryData(data)
			if (user) {
				try {
					const docRef = await addDoc(collection(db, 'itineraries'), {
						userId: user.uid,
						itinerary: data['itinerary'],
						place: location,
						budget: budget,
						preferences: (preferences as any[]).map(
							(pref) => pref['value']
						),
						createdAt: new Date(),
					})
					console.log('Itinerary saved with ID: ', docRef.id)
				} catch (err) {
					console.error('Error saving itinerary: ', err)
				}
			} else {
				console.error('User is not authenticated')
			}
		} catch (err) {
			setError('Error fetching itinerary')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="p-4">
			<div
				className="hero bg-base-200 min-h-screen"
				style={{
					backgroundImage:
						'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
				}}
			>
				<div className="hero-overlay bg-zinc-900 bg-opacity-90"></div>

				<div className="hero-content text-white flex-col gap-10 lg:flex-row-reverse">
					<div className="text-center lg:text-left">
						<h1 className="text-5xl font-bold">WanderWise</h1>
						<h3 className="text-2xl font-semibold pt-4">
							Your Personalized Journey, Day by Day!
						</h3>
						<p className="py-6">
							This smart travel app takes the hassle out of trip
							planning by generating a detailed, day-by-day
							itinerary tailored to your preferences and budget.
							Whether it's hotel bookings, local activities, or
							transportation costs, we've got it all covered.
							Enjoy a seamless travel experience with multiple
							options and clear cost breakdowns, ensuring every
							day of your journey is perfectly planned!
						</p>
					</div>
					<div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
						<ItineraryForm
							budget={budget}
							setBudget={setBudget}
							dates={dates}
							setDates={setDates}
							handleSubmit={handleSubmit}
							loading={loading}
							location={location}
							setLocation={setLocation}
							preferences={preferences}
							setPreferences={setPreferences}
						/>
					</div>
				</div>
			</div>
			<main id="itinerary-section">
				{error && (
					<p className="text-4xl text-red font-bold">
						{error} Error generating itinerary!
					</p>
				)}

				{loading ? (
					<div className="text-center py-10 w-full">
						<span className="block text-2xl font-semibold">
							Loading your next adventure...
						</span>
						<span className="mt-6 loading loading-spinner loading-lg"></span>
					</div>
				) : (
					<section>
						{itineraryData && (
							<div>
								<MapComponent
									destinations={itineraryData['coordinates']}
								/>
								<h2 className="text-5xl font-bold py-10 text-center">
									Generated Itinerary
								</h2>

								<ul className="timeline timeline-vertical">
									{itineraryData.itinerary?.map(
										(item: any, idx: number) => (
											<Itinerary
												dayNum={item['day_num']}
												idx={idx}
												itinerary={item.itinerary}
												key={idx}
												approxCost={
													item['approx_total_cost']
												}
											/>
										)
									)}
								</ul>

								<h2 className="text-4xl font-bold text-center py-10">
									Recommended Hotels
								</h2>
								{itineraryData?.hotels ? (
									<div className="text-center font-semibold flex items-center flex-col gap-5">
										<MdErrorOutline size={32} />
										Could not fetch hotels, error scraping
										Booking.com
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
										{itineraryData?.hotels?.map(
											(hotel: any, index: number) => (
												<HotelCard
													key={index}
													name={hotel.name}
													location={hotel.location}
													price={hotel.price}
													rating={hotel.rating}
													imgUrl={hotel.imgUrl}
												/>
											)
										)}
									</div>
								)}
								<h3 className="text-4xl font-bold py-10 text-center">
									Suggested Activities
								</h3>
								{itineraryData.activities ? (
									<div className="text-center font-semibold flex items-center flex-col gap-5">
										<MdErrorOutline size={32} />
										Could not fetch activities, error
										scraping google.
									</div>
								) : (
									itineraryData.activities && (
										<ActivityList
											activities={
												itineraryData.activities
											}
										/>
									)
								)}
							</div>
						)}
					</section>
				)}
			</main>
		</div>
	)
}
