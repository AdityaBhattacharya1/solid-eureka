# **WayWise - Documentation**

## **1. Overview and Architecture**

The Itinerary Generator is a full-stack application designed to provide users with personalized travel itineraries based on their preferences, budget, and travel dates. The architecture consists of three primary components: the **frontend**, the **backend**, and Firebase services. These components interact with external APIs (like OpenTripMap) to fetch data and provide user-specific results, which are stored securely in Firestore for logged-in users. Here's a breakdown of the overall architecture:

-   **Frontend (Next.js + TypeScript + Firebase + Leaflet):**
    -   Handles user interaction, including login and itinerary generation.
    -   Presents a map-based interface where users can visualize their itinerary and destinations.
    -   Sends requests to the backend for itinerary generation and interacts with Firebase services to store/retrieve user data.
-   **Backend (Next.js API Routes):**

    -   Serves as the core logic for itinerary generation.
    -   Interacts with external APIs (OpenTripMap) to fetch data on destinations.
    -   Processes user inputs to create a detailed itinerary and stores it in Firestore for logged-in users.

-   **External APIs (OpenTripMap):**

    -   Used to gather information about destinations, attractions, and activities based on user preferences.
    -   Supports fetching of activities, transportation data, and calculating total travel distance.

-   **Firebase Services (Authentication + Firestore):**
    -   **Firebase Authentication** (Google OAuth) manages user login and authentication.
    -   **Firestore** stores user-specific itineraries, allowing users to retrieve and view previously generated itineraries.

---

## **2. Key Technologies and Decisions**

### **Frontend: Next.js + TypeScript + Firebase + Leaflet**

-   **Next.js (App Router):** Provides server-side rendering and API routes that allow for a scalable, modern web application. The new App Router structure simplifies routing and backend integration in a React framework.
-   **TypeScript:** Using TypeScript ensures type safety, especially when dealing with complex API responses, coordinates, and other dynamic data. It reduces runtime errors and improves maintainability.

-   **Firebase Client SDK (Authentication + Firestore):**
    -   Firebase Authentication is used to implement **Google OAuth** for easy user sign-in.
    -   Firestore stores user-generated itineraries, allowing users to persist and access their data across sessions.
-   **Leaflet (React-Leaflet):** Leaflet is an open-source library for map rendering. It integrates well with React through React-Leaflet, allowing dynamic rendering of maps and markers to display travel destinations.

### **Backend: Next.js API Routes**

-   **Next.js API Routes** handle requests for itinerary generation and interacting with third-party APIs like OpenTripMap. These server-side functions handle the processing logic before sending data back to the frontend or storing it in Firestore.

### **Key Justifications for These Technologies**

-   **Next.js + TypeScript** provides a strong framework for server-side rendering and building scalable web apps with typed safety. The App Router improves backend/frontend interaction.
-   **Firebase Authentication & Firestore** simplify user authentication and provide a secure, scalable, and easy-to-manage database for storing user itineraries.
-   **Leaflet** was selected for its lightweight nature and ability to seamlessly handle geographic data, providing an efficient way to display travel destinations.
-   **OpenTripMap** API provides detailed tourist information for destinations, enhancing itinerary generation.

---

## **3. Frontend Implementation**

### **React Components**

-   **MapComponent:**  
    The core map visualization logic is implemented using `react-leaflet`. It dynamically places markers for each destination based on latitude and longitude coordinates and uses the `fitBounds` function to auto-adjust the zoom to display all destinations within view.

-   **FormComponent:**  
    A form allows users to input their destination, travel dates, budget, and preferences. Upon submission, the form data is sent to the backend for itinerary generation.

-   **LoginPage (auth/login):**  
    Implements Firebase Google OAuth login with a button to allow users to sign in using their Google account.

-   **DashboardPage (/dashboard):**  
    After logging in, users are redirected to the dashboard, which displays their previously generated itineraries. The dashboard integrates with **Daisy UI** components for a clean, responsive interface.

-   **SignOutButton:**  
    Provides the ability to log out from Firebase. Users can sign out via a simple button on the dashboard page.

-   **Google OAuth Login:**  
    Using Firebase Authentication, users can sign in using their Google account, ensuring a seamless login experience.

-   **Firestore Integration:**  
    Once logged in, users' generated itineraries are saved to Firestore, allowing them to view previous itineraries upon returning to the app. Itineraries are saved under their unique user ID.

### **Challenges on the Frontend**

-   **Handling Invalid Coordinates:**  
    When the OpenTripMap API returns empty or invalid data, fallback logic was implemented to avoid rendering faulty markers on the map. This ensures a smooth user experience with valid data.

-   **Dynamic Map Zoom:**  
    Using Leaflet's `fitBounds` method to automatically adjust the zoom level to fit all destination markers on the map solved the challenge of users manually adjusting the zoom.

---

## **4. Backend Implementation**

### **Next.js API Routes**

The backend is implemented as server-side functions in Next.js using API routes. These routes handle interactions with OpenTripMap to fetch activities and generate itineraries.

1. **Itinerary Generation API:**  
   This endpoint takes the user's input (destination, dates, budget, preferences), interacts with OpenTripMap, and returns a detailed itinerary.

2. **Firestore Integration:**  
   When a user is logged in, the generated itinerary is saved to Firestore under their unique user ID.

### **Key Functions**

-   **`get_location_coordinates`:** Fetches latitude and longitude for a given location.
-   **`get_activities_from_opentripmap`:** Fetches activities based on user preferences (e.g., historical, museums, restaurants).
-   **`calculate_transport_cost`:** Uses the Haversine formula to compute distances between destinations and calculate transport costs.

### **Challenges on the Backend**

-   **Handling Empty API Responses:**  
    OpenTripMap occasionally returns no results or empty arrays. Logic was implemented to handle these cases by skipping invalid entries, ensuring the itinerary generation process continues smoothly.

-   **Firebase Data Storage:**  
    Storing and retrieving itineraries for specific users required efficient integration with Firebase Firestore, ensuring that only authenticated users could access their data.

---

## **5. Interesting Nuances and Challenges**

-   **Google OAuth Integration:**  
    Implementing Firebase Google OAuth was straightforward, but ensuring that the authentication state persisted correctly across all pages required global state management via context.

-   **Dynamic Map Rendering:**  
    Leaflet’s ability to handle dynamic zoom based on marker coordinates was leveraged to ensure the user could always see all destinations. This improved the overall user experience, especially on mobile devices.

-   **Efficient API Calls:**  
    Since itinerary generation relies on multiple API calls to OpenTripMap, rate-limiting and proper error handling were implemented to ensure API calls did not fail, even under load.

---

## **6. Potential Improvements**

1. **Improve Itinerary Customization:**  
   Allow users to have more control over itinerary preferences, such as duration of stay at each destination, types of restaurants, and more specific filters (e.g., nightlife, adventure activities).

2. **Caching API Responses:**  
   Implementing caching mechanisms would reduce the number of API calls made to OpenTripMap, improving performance and reducing load times for commonly requested locations.

3. **Multi-Provider Authentication:**  
   While Google OAuth is integrated, adding additional authentication providers (e.g., Facebook, GitHub) would give users more flexibility in how they log in.

4. **Progressive Web App (PWA):**  
   Converting the app into a PWA would allow users to access itineraries offline, enhancing usability while traveling in areas with limited connectivity.

---

## **7. How to Set Up the Project**

### **Prerequisites**

-   Node.js installed (v16+)
-   Firebase account with Firestore and Google OAuth enabled.
-   Next.js installed.

### **Installation**

1. Clone the repository:

```bash
git clone https://github.com/AdityaBhattacharya1/solid-eureka.git
cd solid-eureka
```

2. Install dependencies:

```bash
cd client
npm install

cd server
pip install -r requirements.txt
```

3. Set up the environment variables in the client and server folders using sample env as reference.

```bash
# client
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
```

```bash
# server
GOOGLE_API_KEY=gemini-api-key
OPENTRIPMAP_API_KEY=opentripmap-api-key
```

4. Run the development server:

```bash
cd client && npm run dev
cd server && python run.py
```

5. Open your browser and navigate to `http://localhost:3000`.

### **Usage**

-   Visit `/auth` to sign in with Google.
-   Generate a travel itinerary and see it displayed on the interactive map.
-   Visit `/dashboard` to see previously generated itineraries.

## **8. Conclusion**

The WayWise travel itinerary generator is a modern web application built with scalable and maintainable technologies like **Next.js**, **TypeScript**, and **Firebase**. It integrates a rich set of features, including map-based visualization of destinations and personalized itineraries stored in Firestore. The combination of **Google OAuth** login, **Firestore** storage, and an intuitive UI ensures that users can generate and access travel plans in a seamless and secure manner.

The project addresses several challenges, such as handling inconsistent API responses and dynamically rendering map data. Future enhancements could include additional customization options, caching mechanisms, and expanded authentication methods, further improving the user experience.
