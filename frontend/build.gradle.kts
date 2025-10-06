import com.github.gradle.node.npm.task.NpmTask

// build.gradle.kts
plugins {
  java
  id("com.github.node-gradle.node") version "3.2.0"
}

group = "de.dasshorty"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_21

repositories {
  mavenCentral()
}

val angularDistDir = "dist"

val cleanAngular = tasks.register<Delete>("cleanAngular") {
    delete(angularDistDir)
}

val buildAngularTask = tasks.register<NpmTask>("buildAngular") {
    dependsOn(tasks.npmInstall)
    dependsOn(cleanAngular)
    npmCommand.set(listOf("run", "build"))
    inputs.dir("src")
    outputs.dir(angularDistDir)
}
