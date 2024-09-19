import requests
from bs4 import BeautifulSoup
from datetime import datetime
import math


def scrape_booking_hotels(
    location, check_in_date, check_out_date, budget, purpose="leisure"
):
    url = f"https://www.booking.com/searchresults.html?ss={location}&dest_type=city&checkin={check_in_date}&checkout={check_out_date}&sb_travel_purpose={purpose}&selected_currency=USD&soz=1&lang_changed=1&nflt=price%3DUSD-min-{budget}-1"

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
        "Accept-Language": "en-US, en;q=0.5",
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "lxml")
    hotels = soup.findAll("div", {"data-testid": "property-card"})

    hotels_data = []
    date_format = "%Y-%m-%d"

    for hotel in hotels:
        try:
            name_element = hotel.find("div", {"data-testid": "title"})
            name = name_element.text.strip()

            location_element = hotel.find("span", {"data-testid": "address"})
            location = location_element.text.strip()

            # price_element = hotel.find(
            #     "span", attrs={"data-testid": "price-and-discounted-price"}
            # )
            # print("pe", price_element)
            # price = price_element.text.strip()

            rating_element = hotel.find("span", {"class": "a3332d346a"})
            rating = (
                rating_element.text.strip() if rating_element else "No ratings found"
            )

            img_element = hotel.find("img", {"data-testid": "image"})
            img = img_element["src"]

            a = datetime.strptime(check_in_date, date_format)
            b = datetime.strptime(check_out_date, date_format)
            delta = b - a

            hotels_data.append(
                {
                    "name": name,
                    "location": location,
                    # "price": "USD " + str(math.ceil(int(price[3:]) / delta.days)),
                    "rating": rating,
                    "imgUrl": img,
                }
            )

        except Exception as e:
            print(f"Error extracting hotel details: {e}")

    return hotels_data
