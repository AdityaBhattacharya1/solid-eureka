interface HotelCardProps {
	name: string
	location: string
	price: string
	rating: string
	imgUrl: string
}

const HotelCard: React.FC<HotelCardProps> = ({
	name,
	location,
	price,
	rating,
	imgUrl,
}) => (
	<div className="card lg:card-side bg-base-100 shadow-xl m-4 w-[30rem]">
		<figure className="w-[50%]">
			<img src={imgUrl} alt={name} className="h-full" />
		</figure>
		<div className="card-body w-[60%]">
			<h2 className="card-title capitalize">{name}</h2>
			<p>Location: {location}</p>
			<p>Price per night: {price}</p>
			<p>{rating}</p>
		</div>
	</div>
)

export default HotelCard
