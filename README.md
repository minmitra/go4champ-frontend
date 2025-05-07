# 📘 Developer Guide – Project Setup & Local Development

Welcome to this open-source project!  
This guide explains how to set up and run the application locally. It ensures that all contributors use a consistent environment to streamline development and collaboration.

---

## ✅ Prerequisites

To avoid compatibility issues, please use the following versions:

| Tool / Library           | Required Version |
|--------------------------|------------------|
| IntelliJ IDEA            | 2025.1           |
| Java JDK                 | 17 (24.0.1)      |
| Git                      | 2.49.0           |
| Node.js                  | 23.11.0          |
| npm                      | 10.9.2           |
| Spring Boot              | 3.4.4            |
| Maven                    | 3.9.9            |
| H2 Database              | 2024-08-11       |

---

## 🔁 Clone the Repository

Make sure Git is installed:  
👉 [Download Git](https://git-scm.com/downloads)

Then clone the project:

```bash
git clone https://gitlab.com/your-org/project-name.git
cd project-name
```

Replace the URL with the actual repository path.

---

## ⚙️ Backend Setup (Java + Spring Boot + Maven + H2)

### 1. Install Java 17

- **macOS**:
  ```bash
  brew install temurin
  ```

- **Linux**:
  ```bash
  sudo apt update
  sudo apt install openjdk-17-jdk
  ```

- **Windows**:  
  [Download Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)

**Check installation:**

```bash
java -version
```

---

### 2. Install Maven

- **macOS**:
  ```bash
  brew install maven
  ```

- **Linux**:
  ```bash
  sudo apt update
  sudo apt install maven
  ```

- **Windows**:  
  [Download Maven](https://maven.apache.org/download.cgi)

**Check installation:**

```bash
mvn -v
```

---

### 3. Start the Backend

From the root folder (where `pom.xml` is):

```bash
mvn spring-boot:run
```

When running:

- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- H2 Console: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

**H2 Login:**

- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: *(leave blank)*

---

## 💻 Frontend Setup (React + Node.js)

### 1. Install Node.js and npm

👉 [Download Node.js](https://nodejs.org/)

**Verify installation:**

```bash
node -v
npm -v
```

---

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 3. Start the React App

```bash
npm start
```

This will launch the app at:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧠 Notes & Conventions

- Backend port: `8080`  
- Frontend port: `3000`  
- API requests from the frontend should use `http://localhost:8080`



## 🧪 Testing

### Backend

```bash
mvn test
```

### Frontend

```bash
npm test
```



## 💡 Suggestions

To further improve the project setup:

- Add `.env` files for API URLs and secrets  
- Use ESLint and Prettier for consistent code formatting  
- Provide Git hooks (e.g., Husky) to check commits  
- Create a `CONTRIBUTING.md` with collaboration guidelines  

---

## 🚀 Quick Setup Summary

```bash
# Clone the project
git clone https://gitlab.com/your-org/project-name.git
cd project-name

# Run backend
mvn spring-boot:run

# Run frontend
cd frontend
npm install
npm start
```

---

## 🙌 Contribution

Feel free to fork, branch, and open merge requests!  
We welcome all contributions.
