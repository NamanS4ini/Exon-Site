# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /workspace

# Copy Gradle wrapper + build files first (layer-cache friendly)
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .

# Download dependencies (cached unless build files change)
RUN ./gradlew dependencies --no-daemon -q

# Copy source and build the fat JAR
COPY src/ src/
RUN ./gradlew bootJar --no-daemon -q

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runtime

WORKDIR /app

# Copy the fat JAR from the build stage
COPY --from=build /workspace/build/libs/*.jar app.jar

# Non-root user for security
RUN addgroup -S exon && adduser -S exon -G exon
USER exon

# JVM flags: limit heap to 256MB (free-tier friendly), enable G1GC
ENV JAVA_OPTS="-Xmx256m -Xms64m -XX:+UseG1GC"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
