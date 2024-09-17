from flask import request, jsonify
from .hotel_scraper import scrape_booking_hotels
from .itinerary_generator import generate_itinerary_with_langchain_per_day
from .utils import google_search, get_fuel_cost_per_km, calculate_transport_cost


def register_routes(app):
    @app.route("/generate-itinerary", methods=["POST"])
    def generate_itinerary_endpoint():
        data = request.json
        budget = data.get("budget")
        start_date = data.get("start")
        end_date = data.get("end")
        location = data.get("location")
        preferences = data.get("preferences", [])
        start_location = data.get("start_location", "New York")

        hotels_data = scrape_booking_hotels(location, start_date, end_date, budget)
        fuel_cost_per_km = get_fuel_cost_per_km(location)
        transport_cost = calculate_transport_cost(
            start_location, location, fuel_cost_per_km
        )

        itinerary_array = generate_itinerary_with_langchain_per_day(
            location,
            start_date,
            end_date,
            budget,
            preferences,
            hotels_data,
            transport_cost,
        )

        activity_query = f"things to do in {location}"
        activities = google_search(activity_query)

        response = {
            "itinerary": itinerary_array,
            "activities": activities,
            "hotels": hotels_data[:5],
            "transport_cost": transport_cost,
        }

        return jsonify(response)
