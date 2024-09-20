import requests
from datetime import datetime, timedelta
import math
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
import random
from .utils import calculate_transport_cost
import os


API_KEY = os.environ.get("OPENTRIPMAP_API_KEY")


def get_location_coordinates(location_name):
    url = f"https://api.opentripmap.com/0.1/en/places/geoname?name={location_name}&apikey={API_KEY}"
    response = requests.get(url)
    data = response.json()

    if "lat" not in data or "lon" not in data:
        raise ValueError(f"Unable to fetch coordinates for location: {location_name}")

    return {"lat": data["lat"], "lon": data["lon"]}


def get_activities_from_opentripmap(location, radius, preferences):
    category_mapping = {
        "historical": "historic,interesting_places,urban_environment",
        "museums": "museums,interesting_places",
        "restaurants": "foods,restaurants,cafes,fast_food,picnic_sites,bakeries",
        "parks": "natural",
        "shopping": "shops,urban_environment",
        "entertainment": "amusements,theatres_and_entertainments",
        "party": "amusements,bars,biergartens",
        "natural": "natural",
    }

    activities = []

    for preference in preferences:
        category = category_mapping.get(preference, "interesting_places")
        url = f"https://api.opentripmap.com/0.1/en/places/radius?radius={radius}&lon={location['lon']}&lat={location['lat']}&kinds={category}&apikey={API_KEY}"
        response = requests.get(url)
        data = response.json()

        for item in data.get("features", []):
            activities.append(
                {
                    "name": item["properties"]["name"],
                    "description": item["properties"].get(
                        "description", "No description available"
                    ),
                    "lat": item["geometry"]["coordinates"][1],
                    "lon": item["geometry"]["coordinates"][0],
                    "category": category,
                }
            )

    return activities


def create_prompt_template():
    prompt_template = """
    You are an itinerary planning bot. Your task is to generate a concise, fixed-format itinerary with multiple options, given the following data.

    I am planning a trip to {location} from {start_date} to {end_date}. My budget is {budget} USD, and it must not be exceeded. Limit your response to 200 words. The itinerary should include the following:

    Itinerary of Activities:

    List 2-3 activities per day from the provided activity list: {activities}.
    If a specific name is not provided, generate an accurate and plausible name for local restaurants, markets, or other landmarks based on the location.
    Only suggest non-prominent landmarks like restaurants and local famous eateries; do not include famous historical landmarks unless provided.
    Transport Options:

    Provide 2-3 alternatives for transport options between activities (e.g., walking, public transport, taxis).
    Local Cultural Activities:

    Suggest 2-3 cultural activities (e.g., street food, performances) that align with the preferences: {preferences}.
    Important Rules:

    Do not mention day numbers (avoid "Day 1", etc.).
    Avoid using any markdown formatting, titles, headers, or unnecessary text embellishments.
    Do not use placeholders such as "[Restaurant Name]". Always provide a plausible or real name where a specific name isn't provided.
    Do not mention accommodation.
    Stick to concise, bullet-pointed answers with no flowery language or extra notes.
    Provide alternatives where possible.
    """
    return PromptTemplate(
        input_variables=[
            "location",
            "start_date",
            "end_date",
            "budget",
            "preferences",
            "activities",
        ],
        template=prompt_template,
    )


def generate_itinerary_with_langchain_per_day(
    location,
    start_date,
    end_date,
    budget,
    preferences,
    transport_cost_per_km,
):
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    prompt = create_prompt_template()

    a = datetime.strptime(start_date, "%Y-%m-%d")
    b = datetime.strptime(end_date, "%Y-%m-%d")
    num_days = (b - a).days

    location_coords = get_location_coordinates(location)
    activities = get_activities_from_opentripmap(
        location_coords, 10 * 1000, preferences
    )  # radius in meters, so 10 Km radius

    daily_itinerary = []
    used_activities = set()
    master_destinations = []

    for day in range(num_days):
        current_day = (a + timedelta(days=day)).strftime("%Y-%m-%d")
        next_day = (a + timedelta(days=day + 1)).strftime("%Y-%m-%d")

        daily_activities = []

        for activity in activities:
            if activity["name"].strip() not in used_activities:
                daily_activities.append(activity)
                used_activities.add(activity["name"].strip())

                lat_lon_pair = (activity["lat"], activity["lon"])
                if lat_lon_pair not in master_destinations:
                    master_destinations.append(lat_lon_pair)

            if len(daily_activities) >= 3:
                break

        if not daily_activities:
            continue

        day_itinerary_prompt = prompt | llm | StrOutputParser()
        result = day_itinerary_prompt.invoke(
            {
                "location": location,
                "start_date": current_day,
                "end_date": next_day,
                "budget": budget,
                "preferences": ", ".join(preferences),
                "activities": "\n".join(
                    [
                        f"{activity['name']}: {activity['description']}"
                        for activity in daily_activities
                    ]
                ),
            }
        )

        # mocking accommodation cost, keeping it to 15-20% of budget.
        accommodation_cost = random.randint(
            math.ceil(0.15 * budget), math.ceil(0.2 * budget)
        )

        activity_cost = 50
        total_cost = accommodation_cost + activity_cost

        total_transport_cost = calculate_transport_cost(
            master_destinations, cost_per_km=transport_cost_per_km
        )

        daily_itinerary.append(
            {
                "day_num": day + 1,
                "itinerary": result.strip(),
                "approx_total_cost": math.ceil(total_cost / num_days),
            }
        )

    return daily_itinerary, master_destinations, total_transport_cost
