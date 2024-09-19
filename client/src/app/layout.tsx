import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import Navbar from './components/Navbar'

export const metadata: Metadata = {
	title: 'WanderWise - Your Personalized Journey, Day by Day!',
	description:
		"This smart travel app takes the hassle out of trip planning by generating a detailed, day-by-day itinerary tailored to your preferences and budget. Whether it's hotel bookings, local activities, or transportation costs, we've got it all covered. Enjoy a seamless travel experience with multiple options and clear cost breakdowns, ensuring every day of your journey is perfectly planned!",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<Navbar />
				{children}
			</body>
		</html>
	)
}
