FROM amazoncorretto:21-alpine

WORKDIR /app

COPY --from=builder ./build/backend.jar /app/backend.jar

ENTRYPOINT ["java", "-jar", "backend.jar"]
