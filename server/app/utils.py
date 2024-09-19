from googlesearch import search
import math


def google_search(query, num_results=10):
    results = []
    try:
        for result in search(query, num_results=num_results):
            results.append(result)
    except Exception as e:
        print(f"Error during Google search: {e}")
    return results


def get_fuel_cost_per_km():
    return 0.5  # assume 0.5 usd per kilometer rate of gas


def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def calculate_transport_cost(itinerary, cost_per_km=0.5):
    total_distance = 0

    for i in range(1, len(itinerary)):
        if (
            "lat" in itinerary[i - 1]
            and "lon" in itinerary[i - 1]
            and "lat" in itinerary[i]
            and "lon" in itinerary[i]
        ):
            lat1, lon1 = itinerary[i - 1]["lat"], itinerary[i - 1]["lon"]
            lat2, lon2 = itinerary[i]["lat"], itinerary[i]["lon"]
            total_distance += haversine(lat1, lon1, lat2, lon2)
        else:
            print("skipped empty entry")

    total_cost = total_distance * cost_per_km
    return total_cost
