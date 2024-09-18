from datetime import datetime, timedelta
import math
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser


def create_prompt_template():
    prompt_template = """
    You are an itinerary planning bot whose only job is to generate a very short and concise list of activities given the following data.
    I am planning a trip to {location} from {start_date} to {end_date}. My budget is {budget} USD, stick to the budget at all costs!
    Don't mention the day number! (NO DAY 1: OR ANYTHING LIKE THAT). Also don't use any markdown format specifiers. Don't mention anything about accommodation.
    My preferences are {preferences}. Please suggest:
    - A detailed itinerary including multiple activities. Be as concise and brief as possible, include brief essential information about each location.
    - Recommendations for transport options
    - Always give options, at each and every step. Never suggest a single plan of action. Give minimum 2-3 suitable alternatives for each day of the trip duration.
    DON'T USE ANY FORMATTING OR FLOWERY STUFF, STICK TO JUST PROVIDING INFORMATION. DON'T WRITE ANY NOTES EITHER. Do not repeat the prompt anywhere in the response.
    """
    return PromptTemplate(
        input_variables=["location", "start_date", "end_date", "budget", "preferences"],
        template=prompt_template,
    )


def generate_itinerary_with_langchain_per_day(
    location, start_date, end_date, budget, preferences, hotels_data, transport_cost
):
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    prompt = create_prompt_template()

    a = datetime.strptime(start_date, "%Y-%m-%d")
    b = datetime.strptime(end_date, "%Y-%m-%d")
    num_days = (b - a).days

    daily_itinerary = []

    for day in range(num_days):
        current_day = (a + timedelta(days=day)).strftime("%Y-%m-%d")
        next_day = (a + timedelta(days=day + 1)).strftime("%Y-%m-%d")

        day_itinerary_prompt = prompt | llm | StrOutputParser()
        result = day_itinerary_prompt.invoke(
            {
                "location": location,
                "start_date": current_day,
                "end_date": next_day,
                "budget": budget,
                "preferences": ", ".join(preferences),
            }
        )

        accommodation_cost = 0
        if hotels_data and day < len(hotels_data):
            accommodation_cost = int(hotels_data[day]["price"].replace("USD ", ""))

        activity_cost = 50
        total_cost = accommodation_cost + activity_cost + (transport_cost / num_days)

        daily_itinerary.append(
            {
                "day_num": day + 1,
                "itinerary": result.strip(),
                "approx_total_cost": math.ceil(total_cost),
            }
        )

    return daily_itinerary
