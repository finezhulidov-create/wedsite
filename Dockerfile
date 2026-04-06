# Этап 1: Сборка с Maven и явным указанием JDK 17
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /application
COPY . .

# Сборка JAR без тестов, с явной версией Java 17
RUN mvn clean package -DskipTests

# Этап 2: Извлечение слоёв Spring Boot (для быстрой доставки)
FROM bellsoft/liberica-openjre-alpine:17-cds AS layers
WORKDIR /application
COPY --from=builder /application/target/*.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --destination extracted

# Этап 3: Финальный образ для запуска
FROM bellsoft/liberica-openjre-alpine:17.0.18-cds

VOLUME /tmp

# Создаём непривилегированного пользователя
RUN adduser -S spring-user
USER spring-user

WORKDIR /application

# Копируем слои приложения
COPY --from=layers /application/extracted/dependencies/ ./
COPY --from=layers /application/extracted/spring-boot-loader/ ./
COPY --from=layers /application/extracted/snapshot-dependencies/ ./
COPY --from=layers /application/extracted/application/ ./

# Генерация CDS-архива (Class Data Sharing)
# Приложение запустится и сразу завершится — это нормально
RUN java -XX:ArchiveClassesAtExit=app.jsa -Dspring.context.exit=onRefresh -jar app.jar || true

# Устанавливаем общие JVM-опции через JAVA_TOOL_OPTIONS (автоматически применяются)
ENV JAVA_TOOL_OPTIONS="-XX:SharedArchiveFile=app.jsa \
  -Xlog:class+load:file=/tmp/classload.log \
  -XX:ErrorFile=/tmp/java_error.log \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/tmp \
  -XX:+CrashOnOutOfMemoryError \
  -XX:NativeMemoryTracking=summary \
  -XX:+UnlockDiagnosticVMOptions \
  -XX:+PrintNMTStatistics \
  -Xlog:gc*,safepoint:/tmp/gc.log::filecount=10,filesize=100M \
  -XX:StartFlightRecording=disk=true,dumponexit=true,filename=/tmp/jfr.jar,maxsize=10g,maxage=24h"

# Открываем порт (Render ожидает приложение на $PORT или 8080)
EXPOSE 8080

# Точка входа — запуск JAR
ENTRYPOINT ["java", "-jar", "app.jar"]