interface ItineraryProps {
	dayNum: number
	itinerary: string
	approxTotalCost: number
}

const Itinerary: React.FC<ItineraryProps> = ({
	dayNum,
	itinerary,
	approxTotalCost,
}) => (
	<div className="timeline-item">
		<div className="timeline-icon">
			<span>{dayNum}</span>
		</div>
		<div className="timeline-content">
			<h3>Day {dayNum}</h3>
			<p>{itinerary}</p>
			<p>Estimated Cost: ${approxTotalCost}</p>
		</div>
	</div>
)

export default Itinerary
