'use client'

import { signOutUser } from '@/firebase'
import { useRouter } from 'next/navigation'

const Navbar = () => {
	const router = useRouter()
	const handleSignOut = async () => {
		try {
			await signOutUser()
			router.push('/')
		} catch (err) {
			console.error('Error signing out:', err)
		}
	}
	return (
		<nav className="navbar bg-base-100 flex justify-between">
			<a className="btn btn-ghost text-xl" href="/">
				WanderWise
			</a>
			<div className="gap-5">
				<button
					className="btn rounded-lg btn-accent"
					onClick={() => router.push('/dashboard')}
				>
					Dashboard
				</button>
				<button
					onClick={handleSignOut}
					className="btn btn-secondary rounded-lg"
				>
					Sign Out
				</button>
			</div>
		</nav>
	)
}

export default Navbar
