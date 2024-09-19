'use client'

import { signInWithGoogle } from '@/firebase'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Login = () => {
	const { user, loading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (user) {
			router.push('/')
		}
	}, [user, router])

	const handleGoogleLogin = async () => {
		try {
			await signInWithGoogle()
			router.push('/')
		} catch (error) {
			console.error('Error during Google login:', error)
		}
	}

	if (loading) return <div>Loading...</div>

	return (
		<div
			className="hero h-screen bg-gray-100"
			style={{
				backgroundImage:
					'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)',
			}}
		>
			<div className="hero-overlay bg-zinc-900 bg-opacity-90"></div>

			<div className="card w-96 bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">Login</h2>
					<button
						className="btn btn-primary w-full text-white mt-4 rounded-lg"
						onClick={handleGoogleLogin}
					>
						Sign in with Google
					</button>
				</div>
			</div>
		</div>
	)
}

export default Login
