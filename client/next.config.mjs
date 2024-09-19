/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		FLASK_API_URL:
			process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000',
	},
}

export default nextConfig
