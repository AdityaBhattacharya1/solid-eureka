'use client'

import React, { useState } from 'react'
import HotelCard from './components/HotelCard'
import Itinerary from './components/Itinerary'
import ActivityList from './components/ActivityList'
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker'

export default function HomePage() {
	const [location, setLocation] = useState('')
	const [budget, setBudget] = useState('')
	// const [start, setStart] = useState('')
	// const [end, setEnd] = useState('')
	const [preferences, setPreferences] = useState('')
	const [itineraryData, setItineraryData] = useState<any>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [dates, setDates] = useState<DateValueType>({
		startDate: null,
		endDate: null,
	})

	const MIN_DATE = new Date()
	MIN_DATE.setDate(MIN_DATE.getDate() + 1)

	const scrollToHash = function (elemId: string) {
		const element = document.getElementById(elemId)
		element?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest',
		})
	}

	const handleSubmit = async (event: React.FormEvent) => {
		setLoading(true)
		event.preventDefault()
		setError(null)

		const payload = {
			location,
			budget,
			start: new Date(dates?.startDate as Date)
				.toISOString()
				.split('T')[0],
			end: new Date(dates?.endDate as Date).toISOString().split('T')[0],
			preferences: preferences.split(',').map((item) => item.trim()),
		}

		try {
			const res = await fetch('/api/itinerary', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})

			const data = await res.json()
			setItineraryData(data)
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
						'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)',
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
						<form onSubmit={handleSubmit} className="card-body">
							<div className="form-control">
								<label className="label">
									<span className="label-text">Location</span>
								</label>
								<input
									type="text"
									placeholder="Location"
									value={location}
									onChange={(e) =>
										setLocation(e.target.value)
									}
									className="input input-bordered text-black"
									required
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">
										Trip Dates
									</span>
								</label>
								<Datepicker
									value={dates}
									onChange={(newValue) => setDates(newValue)}
									showShortcuts={false}
									separator="to"
									minDate={MIN_DATE}
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">
										Budget (USD)
									</span>
								</label>
								<input
									type="number"
									placeholder="Budget"
									value={budget}
									onChange={(e) => setBudget(e.target.value)}
									className="input input-bordered text-black"
									required
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">
										Preferences
									</span>
								</label>
								<input
									type="text"
									placeholder="Preferences (comma separated)"
									value={preferences}
									onChange={(e) =>
										setPreferences(e.target.value)
									}
									className="input input-bordered text-black"
									required
								/>
							</div>

							<button
								type="submit"
								className="btn btn-primary btn-outline my-4"
								disabled={loading}
								onClick={() =>
									scrollToHash('#itinerary-section')
								}
							>
								Generate Itinerary!
							</button>
						</form>
					</div>
				</div>
			</div>

			{error && <p className="">{error}</p>}

			{loading ? (
				<div className="text-center py-10 w-full">
					<span className="block text-2xl font-semibold">
						Loading your next adventure...
					</span>
					<span className="mt-6 loading loading-spinner loading-lg"></span>
				</div>
			) : (
				<section id="itinerary-section">
					{itineraryData && (
						<div>
							<h2 className="text-5xl font-bold py-10 text-center">
								Generated Itinerary
							</h2>

							<ul className="timeline timeline-vertical">
								{itineraryData.itinerary?.map(
									(item: any, idx: number) => (
										<li key={item['day_num']}>
											<hr />
											<div
												className={
													idx % 2 === 0
														? 'timeline-end'
														: 'timeline-start'
												}
											>
												Day {item['day_num']}
											</div>
											<div className="timeline-middle">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="currentColor"
													className="h-5 w-5"
												>
													<path
														fillRule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
											<div
												className={
													'timeline-box ' +
													(idx % 2 === 0
														? 'timeline-start'
														: 'timeline-end')
												}
											>
												{item.itinerary}
											</div>
											<hr />
										</li>
									)
								)}
							</ul>

							<h2 className="text-4xl font-bold text-center py-10">
								Recommended Hotels
							</h2>
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

							{itineraryData.activities && (
								<ActivityList
									activities={itineraryData.activities}
								/>
							)}
						</div>
					)}
				</section>
			)}
		</div>
	)
}
