# Этап 1: Сборка JAR
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Этап 2: Извлечение слоёв Spring Boot
FROM eclipse-temurin:17-jre-alpine AS layers
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --destination extracted

# Этап 3: Финальный образ с CDS и оптимизациями
FROM bellsoft/liberica-openjre-alpine:17.0.18-cds

# Минимальные переменные
ENV JAVA_TOOL_OPTIONS="-XX:SharedArchiveFile=app.jsa \
  -XX:+UseG1GC \
  -Xmx384m \
  -Xms384m \
  -Djava.security.egd=file:/dev/./urandom \
  -Dspring.profiles.active=prod"

# Настройка непривилегированного пользователя
RUN adduser -S spring -u 1001
USER spring

# Рабочая директория
WORKDIR /app

# Копируем слои приложения
COPY --from=layers /app/extracted/dependencies/ ./
COPY --from=layers /app/extracted/spring-boot-loader/ ./
COPY --from=layers /app/extracted/snapshot-dependencies/ ./
COPY --from=layers /app/extracted/application/ ./

# Генерация CDS-архива (Class Data Sharing)
# Приложение запустится и завершится — это нормально
RUN java -XX:ArchiveClassesAtExit=app.jsa -Dspring.context.exit=onRefresh -jar app.jar || true

# Открываем порт
EXPOSE 8080

# Точка входа
ENTRYPOINT ["java", "-jar", "app.jar"]