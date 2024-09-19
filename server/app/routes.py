from flask import request, jsonify
from .hotel_scraper import scrape_booking_hotels
from .itinerary_generator import generate_itinerary_with_langchain_per_day
from .utils import google_search
import random


def register_routes(app):
    @app.route("/generate-itinerary", methods=["POST"])
    def generate_itinerary_endpoint():
        data = request.json
        budget = data.get("budget")
        start_date = data.get("start")
        end_date = data.get("end")
        location = data.get("location")
        preferences = data.get("preferences", [])

        hotels_data = scrape_booking_hotels(location, start_date, end_date, budget)

        itinerary_array, coordinates_list, total_transport_cost = (
            generate_itinerary_with_langchain_per_day(
                location,
                start_date,
                end_date,
                budget,
                preferences,
                random.uniform(0.01, 0.5),
            )
        )

        activity_query = f"things to do in {location}"
        activities = google_search(activity_query)

        response = {
            "itinerary": itinerary_array,
            "activities": activities,
            "hotels": hotels_data[:5],
            "coordinates": coordinates_list,
        }

        return jsonify(response)
