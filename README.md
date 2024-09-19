# **WayWise - Documentation**

## **1. Overview and Architecture**

The Itinerary Generator is a full-stack application designed to provide users with personalized travel itineraries based on their preferences, budget, and dates of travel. The architecture consists of two primary components: the **frontend** and the **backend**, which interact with external APIs (such as OpenTripMap) to fetch data and provide user-specific results. Here's a breakdown of the overall architecture:

-   **Frontend (React + TypeScript + Leaflet):**
    -   Handles user interaction.
    -   Presents an intuitive map-based interface where users can visualize their itinerary and destinations.
    -   Sends requests to the backend for itinerary generation.
-   **Backend (Python + Flask):**
    -   Interacts with third-party APIs (OpenTripMap) to fetch data on destinations.
    -   Processes user inputs to create a detailed itinerary.
    -   Provides endpoints for fetching and sending itinerary data to the frontend.
-   **External APIs (OpenTripMap):**
    -   Used to gather information about destinations, attractions, and activities based on user preferences.
    -   Supports fetching of activities, transportation data, and calculating total travel distance.

## **2. Key Technologies and Decisions**

### **Frontend: React + TypeScript + Leaflet**

-   **React:** React was chosen for its component-based architecture, which allows us to build reusable and modular pieces of UI. Given the need for dynamic updates (e.g., rendering new destinations on the map), React efficiently manages state and DOM rendering.
-   **TypeScript:** Using TypeScript provides static type-checking, ensuring better developer experience and fewer runtime errors. This is especially crucial when dealing with complex objects such as coordinates and API responses.
-   **Leaflet (React-Leaflet):** Leaflet is a lightweight, open-source JavaScript library for maps. Combined with the React-Leaflet integration, it enables a highly interactive map that can display markers, lines, and dynamic zoom features. The integration with Leaflet allows for real-time rendering of destinations and a smooth user experience.

### **Backend: Python + Flask**

-   **Flask:** Flask is a micro web framework that offers simplicity and flexibility. Given the lightweight nature of the application and the fact that it primarily interacts with external APIs, Flask was an optimal choice. Flask allows for quick setup and development of RESTful APIs, which the frontend can consume.

-   **External APIs (OpenTripMap):** OpenTripMap was chosen for fetching geospatial data about activities, landmarks, and points of interest. It offers detailed categorization and precise location information that was essential for the application's itinerary generation logic.

### **Key Justifications for These Technologies**

-   **React + TypeScript** ensures maintainability and robustness on the frontend. In an application where data from multiple APIs needs to be processed and displayed on a map, TypeScript reduces potential runtime errors, and React ensures efficient rendering.
-   **Flask** is lightweight and sufficient for handling the backend logic in this specific context. Given that the bulk of the computation happens via API calls, Flask is a good fit.
-   **Leaflet** was preferred over more heavyweight alternatives like Google Maps API due to its lightweight nature and ease of customization.
-   **OpenTripMap** was chosen because of its extensive database of tourist attractions, including historical sites, restaurants, parks, and entertainment venues. The API provides geolocation data, which is essential for mapping destinations.

## **3. Frontend Implementation**

### **React Components**

-   **MapComponent:**

    -   The core map visualization logic is implemented in the `MapComponent`, which uses the `react-leaflet` library to render a map with dynamic zoom, markers for destinations, and lines to represent travel routes.
    -   Markers are placed based on destination coordinates, and the map dynamically adjusts its zoom using the `fitBounds` function to fit all destinations.

-   **FormComponent:**

    -   A form allows users to input their destination, travel dates, budget, and preferences. This form then sends the data to the backend to fetch a personalized itinerary.

-   **Dynamic Zoom & Marker Placement:**
    -   Leaflet’s `fitBounds` method is used to automatically adjust the zoom level to fit all the provided markers on the map, ensuring that users can see all destinations without manually adjusting the view.

### **Challenges on the Frontend**

-   **Coordinate Management:**
    -   One challenge faced was ensuring the correct handling of coordinates from the API response, especially with inconsistent or missing values. Filtering logic was added to handle empty or malformed responses from OpenTripMap, preventing incorrect markers from being displayed on the map.
-   **Handling Invalid API Responses:**
    -   At times, OpenTripMap returned invalid data or empty arrays for certain preferences. To solve this, fallback logic was introduced to skip empty activities and continue generating itineraries based on available data.

## **4. Backend Implementation**

### **Endpoints**

1. **Itinerary Generation Endpoint:**

    - This endpoint takes the user’s preferences, budget, and travel dates, interacts with the OpenTripMap API, and generates a personalized itinerary. The response includes activities, their coordinates, and calculated travel distances.

2. **Transport Cost Calculation:**
    - A critical aspect of the application is calculating the transportation cost between destinations. This is done by using the Haversine formula to compute distances between latitudes and longitudes of all destinations in the itinerary. The total cost is calculated based on the total distance traveled.

### **Key Functions**

-   **`get_location_coordinates`:** Fetches latitude and longitude for a given location.
-   **`get_activities_from_opentripmap`:** Fetches activities for the given location based on preferences (historical, museums, etc.).
-   **`calculate_transport_cost`:** Calculates the total distance traveled between all destinations using the Haversine formula and determines the associated transport cost.

### **Challenges on the Backend**

-   **Handling Empty API Responses:**

    -   OpenTripMap API occasionally returns no results for certain locations or preferences. Logic was added to skip empty responses, ensuring that the itinerary generation continues without errors.

-   **Haversine Formula Implementation:**
    -   The backend needed to correctly calculate the distance between all selected destinations to provide accurate transportation costs. The Haversine formula was used to calculate great-circle distances between two latitude/longitude points.

### **Data Flow**

1. **User Input:**

    - The user provides the location, check-in/check-out dates, budget, and preferences via the frontend form.

2. **Backend API Call:**

    - The frontend sends a request to the Flask backend, which calls OpenTripMap to fetch destinations based on preferences.

3. **Itinerary Generation:**
    - The backend processes the data, selects activities, calculates transportation costs, and sends the itinerary and relevant details back to the frontend.

## **5. Interesting Nuances and Challenges**

-   **Dynamic Map Zoom:**
    -   Handling the zoom level dynamically based on the number and location of destinations was an interesting challenge. Using Leaflet's `fitBounds` allowed for an elegant solution to ensure all destinations were visible without requiring the user to zoom manually.
-   **OpenTripMap Data Inconsistency:**

    -   OpenTripMap occasionally returned incomplete or empty data. To avoid breaking the itinerary generation, fallback mechanisms and validation checks were implemented to handle these cases.

-   **Cross-Platform Integration:**
    -   Integrating a Python-based backend with a TypeScript-based frontend required careful coordination, especially when dealing with asynchronous requests, API rate limits, and real-time data rendering on the map.

## **6. Potential Improvements**

1. **Cache API Responses:**

    - Implementing caching mechanisms to store API responses for common destinations could significantly improve performance and reduce API call frequency.

2. **Enhanced Filtering of Activities:**

    - The filtering logic can be improved to provide better recommendations by considering user reviews, proximity to hotels, and opening hours for attractions.

3. **Additional APIs for Accommodation:**

    - Integrating other APIs (e.g., Booking.com or Airbnb) to fetch hotel data based on check-in/check-out dates would add more detailed accommodation information.

4. **Offline Access and PWA:**
    - Transforming the app into a Progressive Web App (PWA) would allow offline access to itineraries, improving the user experience while traveling.

## **Conclusion**

This project combines modern frontend and backend technologies to deliver a powerful travel itinerary generator. The decision to use React, TypeScript, Leaflet, Flask, and OpenTripMap ensures a scalable, maintainable, and robust solution. Challenges such as handling empty API responses and calculating travel costs were effectively managed, and future improvements can further enhance the functionality and user experience of the application.
