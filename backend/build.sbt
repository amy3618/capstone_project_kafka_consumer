name := """ConsumerServer"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

//scalaVersion := "2.11.6"
// NOTE: scala version changed as some topics were made with 2.10
scalaVersion := "2.10.4"

libraryDependencies ++= Seq(
  jdbc,
  filters,
  cache,
  ws,
  specs2 % Test,
  "org.apache.kafka" % "kafka_2.10" % "0.8.1"
    exclude("javax.jms", "jms")
    exclude("com.sun.jdmk", "jmxtools")
    exclude("com.sun.jmx", "jmxri"),
  "com.typesafe" % "config" % "1.2.1",
  "com.typesafe.play" % "play-json_2.10" % "2.4.0-M2",
  "org.twitter4j" % "twitter4j-core" % "4.0.2",
  "org.twitter4j" % "twitter4j-stream" % "4.0.2"
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator
