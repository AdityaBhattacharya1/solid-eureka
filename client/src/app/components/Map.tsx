import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

const customMarkerIcon = new L.Icon({
	iconUrl:
		'https://img.icons8.com/?size=100&id=13800&format=png&color=000000',
	iconSize: [41, 41],
	iconAnchor: [12, 41],
})

interface MapProps {
	destinations: [number, number][]
}

const FitBoundsComponent = ({ bounds }: { bounds: [number, number][] }) => {
	const map = useMap()

	useEffect(() => {
		if (bounds.length > 0) {
			map.fitBounds(bounds)
		}
	}, [map, bounds])

	return null
}

const MapComponent: React.FC<MapProps> = ({ destinations }) => {
	const validDestinations = destinations.filter(
		(coords) =>
			coords.length === 2 &&
			typeof coords[0] === 'number' &&
			typeof coords[1] === 'number'
	)

	if (validDestinations.length === 0) {
		return <div>No valid destinations available.</div>
	}

	return (
		<MapContainer
			center={validDestinations[0]}
			zoom={10}
			style={{ height: '25rem', width: '100%', textAlign: 'center' }}
			className="rounded-xl mt-2"
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>

			{validDestinations.map((position, idx) => (
				<Marker key={idx} position={position} icon={customMarkerIcon} />
			))}
			<FitBoundsComponent bounds={validDestinations} />
		</MapContainer>
	)
}

export default MapComponent
