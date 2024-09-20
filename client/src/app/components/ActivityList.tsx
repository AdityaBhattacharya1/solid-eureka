import Link from 'next/link'
import { HiArrowTopRightOnSquare } from 'react-icons/hi2'

interface ActivityListProps {
	activities: string[]
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => (
	<div>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{activities.map((activity, index) => (
				<ListItem key={index} url={activity} />
			))}
		</div>
	</div>
)

import { useEffect, useState } from 'react'
import axios from 'axios'

const ListItem = ({ url }: { url: string }) => {
	const [previewData, setPreviewData] = useState<any>(null)

	useEffect(() => {
		async function fetchPreview() {
			try {
				const response = await axios.get(
					`https://api.microlink.io?url=${encodeURIComponent(url)}`
				)
				setPreviewData(response.data.data)
			} catch (error) {
				console.error('Error fetching preview data:', error)
			}
		}
		fetchPreview()
	}, [url])

	if (!previewData) {
		return <p>Loading preview...</p>
	}

	return (
		<div className="card lg:card-side bg-base-100 shadow-xl m-4 w-[30rem]">
			<div className="card-body">
				<h2 className="card-title capitalize">{previewData.title}</h2>
				<p>{previewData.description}</p>
				<Link href={url}>
					<button className="btn btn-outline rounded-full mt-4">
						<HiArrowTopRightOnSquare />
						Visit Website
					</button>
				</Link>
			</div>
		</div>
	)
}

export default ActivityList
