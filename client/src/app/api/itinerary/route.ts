import { NextResponse } from 'next/server'

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000'

export async function POST(request: Request) {
	try {
		const body = await request.json()

		const res = await fetch(`${FLASK_API_URL}/generate-itinerary`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (!res.ok) {
			throw new Error(`Failed to fetch itinerary: ${res.statusText}`)
		}

		const itineraryData = await res.json()
		return NextResponse.json(itineraryData)
	} catch (error: any) {
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
