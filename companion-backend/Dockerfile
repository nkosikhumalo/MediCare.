FROM eclipse-temurin:21-jdk AS build

WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src/ src/

RUN chmod +x mvnw && ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

RUN mkdir -p /data && chown 10001:10001 /data
COPY --from=build --chown=10001:10001 /workspace/target/companion-backend-0.1.0.jar /app/app.jar

ENV SERVER_PORT=8080 \
    RAG_DB_PATH=/data/policy_rag.db

VOLUME ["/data"]
EXPOSE 8080
USER 10001:10001

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
