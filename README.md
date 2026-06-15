# Banking Information System

A full-stack banking application built with Spring Boot 3, Java 21, React (Vite), and MySQL.

## Features
- **User Registration:** Users can sign up with initial deposits.
- **Authentication:** JWT-based secure authentication.
- **Dashboard:** Overview of account balance and recent transactions.
- **Transactions:** Deposit, Withdraw, and Transfer funds.
- **Account Statement:** Detailed view of transaction history.
- **Profile Management:** Update contact information.

## Technology Stack
- **Backend:** Java 21, Spring Boot 3.x, Spring Security (JWT), Spring Data JPA, Hibernate, MySQL.
- **Frontend:** React.js (Vite), Tailwind CSS, Material UI Icons, Axios.
- **Testing:** JUnit 5, Mockito.
- **API Documentation:** Swagger/OpenAPI.

## Installation Steps

### Prerequisites
- Java 21
- Node.js & npm
- Maven
- Docker (for MySQL)

### 1. Database Setup
Start the MySQL database using Docker:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the `backend` directory and run the application:
```bash
cd backend
mvn spring-boot:run
```
The backend API will be running on `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup
Navigate to the `frontend` directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be running on `http://localhost:5173`.

## Default Test Credentials
After running the app, register a new user from the frontend UI to create an account. You can then use those credentials to log in.

## Project Report and Screenshots
- Screenshots are located in the `/screenshots` folder.
- Project reports are generated in the `/docs` folder (if script was run).
