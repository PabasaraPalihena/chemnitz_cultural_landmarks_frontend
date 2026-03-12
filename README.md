# Explore Chemnitz – Cultural Landmarks Web Application

A **MERN-stack web application** for exploring cultural landmarks in Chemnitz.  
The platform allows users to view landmarks on an interactive map, search and filter locations, and leave reviews.

---

## Technologies Used

### Frontend
- React.js

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- MongoDB Compass (for database management)

### Dataset
- Chemnitz Cultural Landmark Dataset (provided in the assignment)

---
# Explore Chemnitz – Feature List

## 1. Interactive Cultural Map
- Displays cultural landmarks in Chemnitz using **React Leaflet** and **OpenStreetMap**.
- Landmarks are represented using **color-coded icons based on category**:
  - 🔴 Restaurants
  - 🟡 Artworks
  - 🟣 Theaters
  - 🔵 Museums
  - 🟢 Galleries
- Hovering over a marker shows a **popup with the landmark name and type**.
- Clicking a marker opens the **detailed landmark information page**.

## 2. Dynamic Landmark Discovery
- Landmarks displayed in the list correspond to the **current visible map area**.
- Results automatically update when the user:
  - zooms the map
  - pans to another location.
- Ensures that users always see **location-relevant results**.

## 3. Advanced Search and Filtering
- Users can **filter landmarks by category/type**.
- **Keyword search** allows searching by name or related terms.
- Combines **map bounding box filtering** with search queries for more accurate results.

## 4. User Authentication System
The platform supports two types of users:

### Guest Users
- Browse landmarks
- Explore the interactive map
- View landmark information

### Authenticated Users
- Save favorite landmarks
- Submit reviews
- Manage their profile

## 5. User Registration and Email Verification
- Users register by providing:
  - First name
  - Last name
  - Email
  - Password
- Form validation ensures correct input.
- A **verification email** is sent after registration.
- Accounts are **activated only after email verification**.

## 6. Login and Password Reset
- Registered users can log in using **email and password**.
- A **Forgot Password** feature allows users to request a reset link via email.
- Users can securely **set a new password** through the reset page.

## 7. Favorite Places (Saved Places)
- Authenticated users can **save landmarks as favorites**.
- A **heart icon** allows users to add or remove places from favorites.
- A **Saved tab** displays all favorited landmarks.

## 8. Landmark Detail Page
Each landmark includes a **dedicated detail page** displaying:

- Name
- Type
- Address
- Average rating
- Phone number
- Opening hours
- Embedded map with the exact location

Additional actions for logged-in users:
- Add or remove favorites
- Share the place link
- Submit reviews

## 9. Review and Rating System
Authenticated users can:

- Submit **ratings and comments**
- View existing reviews
- Edit their own reviews
- Delete their reviews

## 10. Nearby Places Recommendation
- Displays landmarks located **within a 500-meter radius** of the selected place.
- Helps users discover **nearby cultural attractions**.

## 11. User Profile and Account Management
Users can manage their account through the profile menu:

- Update personal information
- Change password
- View all submitted reviews
- Edit or delete reviews
- Logout securely

## 12. Security and Backend Features
The system includes several security and infrastructure features:

- **JWT authentication** for secure user sessions
- **bcrypt password hashing**
- **CORS support** for cross-origin communication
- **Environment variable management using `.env`**
- **Email services via Nodemailer**
  
---

## Author - Pabasara Palihena

Project developed as part of a university assignment.
