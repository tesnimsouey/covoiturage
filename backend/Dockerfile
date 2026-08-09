# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml first so Maven can cache dependencies as a separate layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy the source and build the jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Run stage ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Render sets $PORT at runtime; Spring Boot reads it via application.properties (server.port=${PORT:8080})
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
