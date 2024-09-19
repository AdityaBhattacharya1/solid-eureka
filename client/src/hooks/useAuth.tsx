'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { auth } from '@/firebase'
import { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'

interface AuthContextProps {
	user: User | null
	loading: boolean
}

const AuthContext = createContext<AuthContextProps>({
	user: null,
	loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user)
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	return (
		<AuthContext.Provider value={{ user, loading }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
