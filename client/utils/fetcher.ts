export const fetcher = async (url: string, options = {}) => {
	const res = await fetch(url, options)
	return await res.json()
}
