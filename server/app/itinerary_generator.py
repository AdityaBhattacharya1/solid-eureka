import requests
from datetime import datetime, timedelta
import math
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from dotenv import dotenv_values
import random
from .utils import calculate_transport_cost

config = dotenv_values(".env")

API_KEY = config["OPENTRIPMAP_API_KEY"]


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
    You are an itinerary planning bot whose only job is to generate a very short and concise list of activities given the following data.
    I am planning a trip to {location} from {start_date} to {end_date}. My budget is {budget} USD, stick to the budget at all costs!
    Don't mention the day number! (NO DAY 1: OR ANYTHING LIKE THAT). Also don't use any markdown format specifiers. Don't mention anything about accommodation.
    My preferences are {preferences}. Please suggest:
    - A semi-detailed itinerary strictly from the given list of activities: {activities}. Apart from the given list, give suggestions only for non-prominent landmarks such as restaurants and local famous eateries. Never suggest popular historical landmarks on your own!
      Be as concise and brief as possible, include brief essential information about each location.
    - Recommendations for transport options
    - Do suggest some local cultural activities such as unique street plays, street food, etc. briefly.  
    - Always give options, at each and every step. Never suggest a single plan of action. Give minimum 2-3 suitable alternatives for each day of the trip duration.
    DON'T USE ANY FORMATTING OR FLOWERY STUFF, STICK TO JUST PROVIDING INFORMATION. DON'T WRITE ANY NOTES EITHER. Do not repeat the prompt anywhere in the response.
    If description is not provided for any activity, generate a very brief and accurate description on your own.
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
    location, start_date, end_date, budget, preferences, transport_cost
):
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    prompt = create_prompt_template()

    a = datetime.strptime(start_date, "%Y-%m-%d")
    b = datetime.strptime(end_date, "%Y-%m-%d")
    num_days = (b - a).days

    location_coords = get_location_coordinates(location)
    activities = get_activities_from_opentripmap(location_coords, 10000, preferences)

    daily_itinerary = []
    used_activities = set()

    for day in range(num_days):
        current_day = (a + timedelta(days=day)).strftime("%Y-%m-%d")
        next_day = (a + timedelta(days=day + 1)).strftime("%Y-%m-%d")

        daily_activities = []
        for activity in activities:
            if activity["name"].strip() not in used_activities:
                daily_activities.append(activity)
                used_activities.add(activity["name"].strip())
            if len(daily_activities) >= 3:
                break

            if not daily_activities:
                daily_activities = [
                    {
                        "name": "No activities available",
                        "description": "Explore the city freely!",
                        "lat": 0,
                        "lon": 0,
                    }
                ]

        day_itinerary_prompt = prompt | llm | StrOutputParser()
        result = day_itinerary_prompt.invoke(
            {
                "location": location,
                "start_date": current_day,
                "end_date": next_day,
                "budget": budget,
                "preferences": ", ".join(preferences),
                "activities": daily_activities,
            }
        )

        # mocking accomodation cost, keeping it to 15-25% of budget.
        accommodation_cost = random.randint(
            math.ceil(0.15 * budget), math.ceil(0.25 * budget)
        )

        daily_itinerary.append(
            {
                "day_num": day + 1,
                "itinerary": result.strip(),
                "lat": daily_activities[0]["lat"] if len(daily_activities) != 0 else [],
                "lon": daily_activities[0]["lon"] if len(daily_activities) != 0 else [],
                "approx_total_cost": accommodation_cost,
            }
        )

        transport_cost = calculate_transport_cost(itinerary=daily_itinerary)
        # coordinates_list = [
        #     (day["lat"], day["lon"])
        #     for day in daily_itinerary
        #     if "lat" in day and "lon" in day
        # ]

        for day in daily_itinerary:
            day["approx_total_cost"] += math.floor(transport_cost / num_days)

    return daily_itinerary, [
        (day["lat"], day["lon"])
        for day in daily_itinerary
        if "lat" in day and "lon" in day
    ]
