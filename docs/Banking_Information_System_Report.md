# Banking Information System
**MCA Project Report**

---

## 1. Abstract
The Banking Information System is a comprehensive web-based application designed to simulate the core functionalities of a modern bank. It provides a secure, user-friendly interface for customers to manage their accounts, perform transactions such as deposits, withdrawals, and transfers, and view their account statements. 

## 2. Introduction
In the digital era, online banking has become an essential service. This project aims to develop a robust Banking Information System using modern full-stack web technologies. 

## 3. Problem Statement
Traditional banking systems often lack user-centric design, struggle with real-time transaction processing, and pose security vulnerabilities. There is a need for a modernized, secure, and intuitive banking application.

## 4. Objectives
- To provide a secure registration and authentication mechanism.
- To enable seamless fund transfers between accounts.
- To maintain accurate transaction histories and account balances.
- To develop a responsive user interface for better accessibility.

## 5. Technology Stack
- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Java 21, Spring Boot 3.x
- **Database:** MySQL 8.x
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **Testing:** JUnit 5, Mockito

## 6. System Architecture
The application follows a monolithic, layered architecture consisting of:
- **Presentation Layer:** React components handling UI.
- **Controller Layer:** Spring Boot REST APIs.
- **Service Layer:** Business logic and transaction management.
- **Data Access Layer:** Spring Data JPA repositories.
- **Database Layer:** Relational MySQL database.

## 7. Database Design
### Entities:
- **User:** Stores customer details (id, name, email, password, etc.)
- **Account:** Stores account details (id, account_number, balance, user_id)
- **Transaction:** Stores transaction history (id, type, amount, date, account_id)

## 8. Implementation Details
- **Security:** Passwords are encrypted using BCrypt. JWTs are used for stateless API authentication.
- **Transactions:** The `@Transactional` annotation ensures ACID properties during fund transfers.
- **Frontend:** State is managed using React Context API. API requests are handled using Axios with interceptors.

## 9. Conclusion
The Banking Information System successfully demonstrates the capabilities of Java and React in building secure, scalable, and responsive financial applications. It fulfills all the core requirements of a modern banking platform.

## 10. GitHub Repository Link
[Link to your GitHub Repository here]
