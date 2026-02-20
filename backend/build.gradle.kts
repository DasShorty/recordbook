plugins {
    java
    id("org.springframework.boot") version "4.0.3"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.asciidoctor.jvm.convert") version "4.0.5"
}

group = "de.dasshorty"
version = "0.0.1-SNAPSHOT"
description = "recordbook"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

extra["snippetsDir"] = file("build/generated-snippets")

dependencies {
    implementation("com.google.code.gson:gson:2.13.2")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.springframework.boot:spring-boot-starter-cache")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
    implementation("io.jsonwebtoken:jjwt-api:0.13.0")
    implementation("io.jsonwebtoken:jjwt-impl:0.13.0")
    implementation("io.jsonwebtoken:jjwt-jackson:0.13.0")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
    systemProperty("spring.profiles.active", "test")
}

tasks.asciidoctor {
    inputs.dir(project.extra["snippetsDir"]!!)
    dependsOn(tasks.test)
}

//fun exitValueFromCommand(vararg command: String): Boolean {
//
//    return try {
//
//        val process = ProcessBuilder(*command)
//            .redirectErrorStream(true)
//            .start()
//
//        process.waitFor() == 0
//    } catch (e: Exception) {
//        false
//    }
//}
//
//val containerCmd = providers.provider {
//    when {
//        exitValueFromCommand("podman", "--version") -> "podman"
//        exitValueFromCommand("docker", "--version") -> "docker"
//        else -> throw GradleException("Neither podman nor docker is installed.")
//    }
//}
//
//tasks.register<Exec>("startPostgres") {
//    commandLine(containerCmd.get(), "compose", "-f", "./test-compose.yml", "up", "-d")
//}
//
//tasks.register<Exec>("stopPostgres") {
//    commandLine(containerCmd.get(), "compose", "-f", "./test-compose.yml", "down", "--volumes")
//}
//
//tasks.test {
//    outputs.dir(project.extra["snippetsDir"]!!)
//    dependsOn(tasks.named("startPostgres"))
//    finalizedBy(tasks.named("stopPostgres"))
//}
