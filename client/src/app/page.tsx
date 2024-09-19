'use client'

import React, { useState } from 'react'
import HotelCard from './components/HotelCard'
import Itinerary from './components/Itinerary'
import ActivityList from './components/ActivityList'
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker'
import Select from 'react-tailwindcss-select'
import { SelectValue } from 'react-tailwindcss-select/dist/components/type'
import MapComponent from './components/Map'

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

	const MIN_DATE = new Date()
	const options = [
		{ value: 'historical', label: 'Historical' },
		{ value: 'museums', label: 'Museums' },
		{ value: 'restaurants', label: 'Restaurants' },
		{ value: 'natural', label: 'Parks' },
		{ value: 'shops', label: 'Shopping' },
		{ value: 'entertainment', label: 'Entertainment' },
		{ value: 'party', label: 'Party' },
		{ value: 'natural', label: 'Nature' },
	]

	const scrollToElement = (elemId: string): void => {
		const element = document.getElementById(elemId)

		if (element) {
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
									onChange={(e) =>
										setBudget(parseInt(e.target.value))
									}
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

								<Select
									primaryColor="white"
									value={preferences}
									onChange={(value) => setPreferences(value)}
									options={options}
									isClearable
									isMultiple
									isSearchable
								/>
							</div>

							<button
								type="submit"
								className="btn btn-primary btn-outline my-4"
								disabled={loading}
							>
								Generate Itinerary!
							</button>
						</form>
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
			</main>
		</div>
	)
}
