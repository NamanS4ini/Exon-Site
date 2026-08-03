# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /workspace

# Install Gradle inside the Alpine build container
RUN apk add --no-cache gradle

# Copy Gradle build configuration files
COPY build.gradle.kts .
COPY settings.gradle .

# Copy source code
COPY src/ src/

# Build the Spring Boot executable fat JAR
RUN gradle bootJar --no-daemon

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Copy the fat JAR from the build stage
COPY --from=build /workspace/build/libs/*.jar app.jar

# Non-root user for security
RUN addgroup -S exon && adduser -S exon -G exon
USER exon

# JVM flags: limit heap to 256MB (free-tier friendly), enable G1GC
ENV JAVA_OPTS="-Xmx256m -Xms64m -XX:+UseG1GC"

EXPOSE 8080 10000

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
