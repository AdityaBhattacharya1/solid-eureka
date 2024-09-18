from googlesearch import search


def google_search(query, num_results=10):
    results = []
    try:
        for result in search(query, num_results=num_results):
            results.append(result)
    except Exception as e:
        print(f"Error during Google search: {e}")
    return results


def get_fuel_cost_per_km(location):
    return 0.5  # assume 0.5 usd per kilometer rate of gas


def calculate_transport_cost(start, destination, fuel_cost_per_km):
    distance = 1000
    return distance * fuel_cost_per_km
