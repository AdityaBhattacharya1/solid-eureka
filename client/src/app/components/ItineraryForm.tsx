import React from 'react'
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker'
import Select from 'react-tailwindcss-select'
import { SelectValue } from 'react-tailwindcss-select/dist/components/type'

type ItineraryFormProps = {
	handleSubmit: (event: React.FormEvent) => Promise<void>
	location: string
	setLocation: React.Dispatch<React.SetStateAction<string>>
	dates: DateValueType
	setDates: React.Dispatch<React.SetStateAction<DateValueType>>
	budget: number
	setBudget: React.Dispatch<React.SetStateAction<number>>
	preferences: SelectValue | null
	setPreferences: React.Dispatch<React.SetStateAction<SelectValue>>
	loading: boolean
}

const ItineraryForm = ({
	handleSubmit,
	location,
	setLocation,
	dates,
	setDates,
	budget,
	setBudget,
	preferences,
	setPreferences,
	loading,
}: ItineraryFormProps) => {
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
	return (
		<form onSubmit={handleSubmit} className="card-body">
			<div className="form-control">
				<label className="label">
					<span className="label-text">Location</span>
				</label>
				<input
					type="text"
					placeholder="Location"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					className="input input-bordered text-black"
					required
				/>
			</div>
			<div className="form-control">
				<label className="label">
					<span className="label-text">Trip Dates</span>
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
					<span className="label-text">Budget (USD)</span>
				</label>
				<input
					type="number"
					placeholder="Budget"
					value={budget}
					onChange={(e) => setBudget(parseInt(e.target.value))}
					className="input input-bordered text-black"
					required
				/>
			</div>

			<div className="form-control">
				<label className="label">
					<span className="label-text">Preferences</span>
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
				className="btn btn-sky-950 rounded-lg btn-outline my-4"
				disabled={loading}
			>
				Generate Itinerary!
			</button>
		</form>
	)
}

export default ItineraryForm
