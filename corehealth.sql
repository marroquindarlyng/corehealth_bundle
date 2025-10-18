-- MySQL dump 10.13  Distrib 9.4.0, for Win64 (x86_64)
--
-- Host: localhost    Database: corehealth
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `corehealth`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `corehealth` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `corehealth`;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `medico_id` int NOT NULL,
  `especialidad_id` int NOT NULL,
  `consulta_id` int NOT NULL,
  `evento_id` int NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pendiente',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `medico_id` (`medico_id`),
  KEY `especialidad_id` (`especialidad_id`),
  KEY `consulta_id` (`consulta_id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`),
  CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`),
  CONSTRAINT `citas_ibfk_4` FOREIGN KEY (`consulta_id`) REFERENCES `consultas` (`id`),
  CONSTRAINT `citas_ibfk_5` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (1,1,1,1,1,1,'2025-10-01','09:00:00','Pendiente','2025-09-26 02:29:17'),(2,2,2,2,2,2,'2025-10-01','10:00:00','Pendiente','2025-09-26 02:29:17'),(3,3,3,3,3,3,'2025-10-02','11:00:00','Pendiente','2025-09-26 02:29:17'),(4,4,4,4,4,4,'2025-10-02','12:00:00','Pendiente','2025-09-26 02:29:17'),(5,5,5,5,5,5,'2025-10-03','13:00:00','Pendiente','2025-09-26 02:29:17'),(6,6,6,6,6,6,'2025-10-03','14:00:00','Pendiente','2025-09-26 02:29:17'),(7,7,7,7,7,7,'2025-10-04','15:00:00','Pendiente','2025-09-26 02:29:17'),(8,8,8,8,8,8,'2025-10-04','16:00:00','Pendiente','2025-09-26 02:29:17'),(9,9,9,9,9,9,'2025-10-05','09:30:00','Pendiente','2025-09-26 02:29:17'),(10,10,10,10,10,10,'2025-10-05','10:30:00','Pendiente','2025-09-26 02:29:17'),(11,11,11,11,11,11,'2025-10-06','11:30:00','Pendiente','2025-09-26 02:29:17'),(12,12,12,12,12,12,'2025-10-06','12:30:00','Pendiente','2025-09-26 02:29:17'),(13,13,13,13,13,13,'2025-10-07','13:30:00','Pendiente','2025-09-26 02:29:17'),(14,14,14,14,14,14,'2025-10-07','14:30:00','Pendiente','2025-09-26 02:29:17'),(15,15,15,15,15,15,'2025-10-08','15:30:00','Pendiente','2025-09-26 02:29:17');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultas`
--

DROP TABLE IF EXISTS `consultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `con_codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `con_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `con_modalidad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `con_duracion` int NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `con_codigo` (`con_codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultas`
--

LOCK TABLES `consultas` WRITE;
/*!40000 ALTER TABLE `consultas` DISABLE KEYS */;
INSERT INTO `consultas` VALUES (1,'CON-001','Consulta general','Presencial',30,'2025-09-26 02:09:27'),(2,'CON-002','Consulta pediátrica','Presencial',30,'2025-09-26 02:09:27'),(3,'CON-003','Consulta de seguimiento','Presencial',20,'2025-09-26 02:09:27'),(4,'CON-004','Teleconsulta','Virtual',20,'2025-09-26 02:09:27'),(5,'CON-005','Chequeo preventivo','Presencial',40,'2025-09-26 02:09:27'),(6,'CON-006','Urgencia médica','Presencial',0,'2025-09-26 02:09:27'),(7,'CON-007','Consulta ginecológica','Presencial',30,'2025-09-26 02:09:27'),(8,'CON-008','Consulta dermatológica','Presencial',25,'2025-09-26 02:09:27'),(9,'CON-009','Consulta cardiológica','Presencial',40,'2025-09-26 02:09:27'),(10,'CON-010','Consulta odontológica','Presencial',30,'2025-09-26 02:09:27'),(11,'CON-011','Consulta psicológica','Presencial',50,'2025-09-26 02:09:27'),(12,'CON-012','Teleconsulta de seguimiento','Virtual',15,'2025-09-26 02:09:27'),(13,'CON-013','Consulta nutricional','Presencial',45,'2025-09-26 02:09:27'),(14,'CON-014','Consulta oftalmológica','Presencial',30,'2025-09-26 02:09:27'),(15,'CON-015','Consulta neurológica','Presencial',40,'2025-09-26 02:09:27');
/*!40000 ALTER TABLE `consultas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnosticos`
--

DROP TABLE IF EXISTS `diagnosticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnosticos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dia_codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cie10_codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gravedad` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dia_codigo` (`dia_codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnosticos`
--

LOCK TABLES `diagnosticos` WRITE;
/*!40000 ALTER TABLE `diagnosticos` DISABLE KEYS */;
INSERT INTO `diagnosticos` VALUES (1,'DIA-001','J06.9','Infección aguda de vías respiratorias superiores','Leve','2025-09-26 02:13:06'),(2,'DIA-002','A09','Gastroenteritis y colitis infecciosas','Leve','2025-09-26 02:13:06'),(3,'DIA-003','I10','Hipertensión esencial (primaria)','Moderada','2025-09-26 02:13:06'),(4,'DIA-004','E11','Diabetes mellitus tipo 2','Moderada','2025-09-26 02:13:06'),(5,'DIA-005','J45','Asma','Moderada','2025-09-26 02:13:06'),(6,'DIA-006','N39.0','Infección urinaria','Leve','2025-09-26 02:13:06'),(7,'DIA-007','K21','Enfermedad por reflujo gastroesofágico','Leve','2025-09-26 02:13:06'),(8,'DIA-008','M54.5','Lumbalgia baja','Leve','2025-09-26 02:13:06'),(9,'DIA-009','F32','Episodio depresivo','Moderada','2025-09-26 02:13:06'),(10,'DIA-010','C34','Neoplasia maligna de bronquios y pulmón','Grave','2025-09-26 02:13:06'),(11,'DIA-011','I21','Infarto agudo de miocardio','Grave','2025-09-26 02:13:06'),(12,'DIA-012','G40','Epilepsia','Moderada','2025-09-26 02:13:06'),(13,'DIA-013','H52','Trastornos de la refracción','Leve','2025-09-26 02:13:06'),(14,'DIA-014','L20','Dermatitis atópica','Leve','2025-09-26 02:13:06'),(15,'DIA-015','O80','Parto único espontáneo','Leve','2025-09-26 02:13:06');
/*!40000 ALTER TABLE `diagnosticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `esp_codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `esp_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `esp_nivel` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `esp_codigo` (`esp_codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidades`
--

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
INSERT INTO `especialidades` VALUES (1,'ESP-001','Medicina General','Primaria','Consulta general y seguimiento','2025-09-26 02:08:01'),(2,'ESP-002','Pediatría','Primaria','Atención a menores','2025-09-26 02:08:01'),(3,'ESP-003','Ginecología y Obstetricia','Primaria','Control prenatal y salud femenina','2025-09-26 02:08:01'),(4,'ESP-004','Medicina Interna','Secundaria','Patologías crónicas','2025-09-26 02:08:01'),(5,'ESP-005','Psicología Clínica','Primaria','Evaluación y terapia','2025-09-26 02:08:01'),(6,'ESP-006','Odontología','Primaria','Atención dental básica','2025-09-26 02:08:01'),(7,'ESP-007','Urgencias Médicas','Primaria','Atención inmediata','2025-09-26 02:08:01'),(8,'ESP-008','Telemedicina','Transversal','Consulta remota','2025-09-26 02:08:01'),(9,'ESP-009','Cardiología','Secundaria','Patología cardiovascular','2025-09-26 02:08:01'),(10,'ESP-010','Dermatología','Secundaria','Piel y anexos','2025-09-26 02:08:01'),(11,'ESP-011','Neurología','Secundaria','Sistema nervioso','2025-09-26 02:08:01'),(12,'ESP-012','Oftalmología','Secundaria','Salud ocular','2025-09-26 02:08:01'),(13,'ESP-013','Otorrinolaringología','Secundaria','Oído, nariz y garganta','2025-09-26 02:08:01'),(14,'ESP-014','Traumatología','Secundaria','Lesiones músculo-esqueléticas','2025-09-26 02:08:01'),(15,'ESP-015','Nutrición','Transversal','Soporte dietético clínico','2025-09-26 02:08:01');
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eve_codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eve_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requiere_autorizacion` tinyint(1) NOT NULL DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `eve_codigo` (`eve_codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (1,'EVE-001','Cita médica general','Cita',0,'2025-09-26 02:17:49'),(2,'EVE-002','Cita pediátrica','Cita',0,'2025-09-26 02:17:49'),(3,'EVE-003','Cita ginecológica','Cita',0,'2025-09-26 02:17:49'),(4,'EVE-004','Urgencia médica leve','Urgencia',0,'2025-09-26 02:17:49'),(5,'EVE-005','Urgencia médica grave','Urgencia',1,'2025-09-26 02:17:49'),(6,'EVE-006','Hospitalización corta estancia','Hospitalización',1,'2025-09-26 02:17:49'),(7,'EVE-007','Hospitalización prolongada','Hospitalización',1,'2025-09-26 02:17:49'),(8,'EVE-008','Procedimiento ambulatorio','Procedimiento',1,'2025-09-26 02:17:49'),(9,'EVE-009','Cirugía menor','Procedimiento',1,'2025-09-26 02:17:49'),(10,'EVE-010','Cirugía mayor','Procedimiento',1,'2025-09-26 02:17:49'),(11,'EVE-011','Teleconsulta general','Cita',0,'2025-09-26 02:17:49'),(12,'EVE-012','Teleconsulta de seguimiento','Cita',0,'2025-09-26 02:17:49'),(13,'EVE-013','Atención psicológica','Cita',0,'2025-09-26 02:17:49'),(14,'EVE-014','Atención odontológica','Cita',0,'2025-09-26 02:17:49'),(15,'EVE-015','Atención nutricional','Cita',0,'2025-09-26 02:17:49');
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicamentos`
--

DROP TABLE IF EXISTS `medicamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `med_codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `med_nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `presentacion` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dosis_estandar` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `med_codigo` (`med_codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamentos`
--

LOCK TABLES `medicamentos` WRITE;
/*!40000 ALTER TABLE `medicamentos` DISABLE KEYS */;
INSERT INTO `medicamentos` VALUES (1,'MED-001','Paracetamol','Tableta','500mg','2025-09-26 02:14:53'),(2,'MED-002','Ibuprofeno','Tableta','400mg','2025-09-26 02:14:53'),(3,'MED-003','Amoxicilina','Cápsula','500mg','2025-09-26 02:14:53'),(4,'MED-004','Metformina','Tableta','850mg','2025-09-26 02:14:53'),(5,'MED-005','Losartán','Tableta','50mg','2025-09-26 02:14:53'),(6,'MED-006','Salbutamol','Inhalador','100mcg','2025-09-26 02:14:53'),(7,'MED-007','Omeprazol','Cápsula','20mg','2025-09-26 02:14:53'),(8,'MED-008','Ácido fólico','Tableta','5mg','2025-09-26 02:14:53'),(9,'MED-009','Hierro polimaltosado','Jarabe','5ml','2025-09-26 02:14:53'),(10,'MED-010','Clorfenamina','Tableta','4mg','2025-09-26 02:14:53'),(11,'MED-011','Prednisona','Tableta','5mg','2025-09-26 02:14:53'),(12,'MED-012','Insulina NPH','Inyección','10UI','2025-09-26 02:14:53'),(13,'MED-013','Diclofenaco','Tableta','50mg','2025-09-26 02:14:53'),(14,'MED-014','Azitromicina','Tableta','500mg','2025-09-26 02:14:53'),(15,'MED-015','Vitamina C','Tableta','500mg','2025-09-26 02:14:53');
/*!40000 ALTER TABLE `medicamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicos`
--

DROP TABLE IF EXISTS `medicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especialidad_id` int NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `especialidad_id` (`especialidad_id`),
  CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicos`
--

LOCK TABLES `medicos` WRITE;
/*!40000 ALTER TABLE `medicos` DISABLE KEYS */;
INSERT INTO `medicos` VALUES (1,'medico01','med01@mail.com','1234','Dr. Juan Pérez','5024001001',1,1,'2025-09-26 02:24:30'),(2,'medico02','med02@mail.com','1234','Dra. Laura Gómez','5024001002',2,1,'2025-09-26 02:24:30'),(3,'medico03','med03@mail.com','1234','Dr. Pedro Ramírez','5024001003',3,1,'2025-09-26 02:24:30'),(4,'medico04','med04@mail.com','1234','Dra. Carmen López','5024001004',4,1,'2025-09-26 02:24:30'),(5,'medico05','med05@mail.com','1234','Dr. Jorge Hernández','5024001005',5,1,'2025-09-26 02:24:30'),(6,'medico06','med06@mail.com','1234','Dra. Silvia Torres','5024001006',6,1,'2025-09-26 02:24:30'),(7,'medico07','med07@mail.com','1234','Dr. Mario Castillo','5024001007',7,1,'2025-09-26 02:24:30'),(8,'medico08','med08@mail.com','1234','Dra. Andrea Díaz','5024001008',8,1,'2025-09-26 02:24:30'),(9,'medico09','med09@mail.com','1234','Dr. Luis Herrera','5024001009',9,1,'2025-09-26 02:24:30'),(10,'medico10','med10@mail.com','1234','Dra. Patricia Ruiz','5024001010',10,1,'2025-09-26 02:24:30'),(11,'medico11','med11@mail.com','1234','Dr. Fernando Morales','5024001011',11,1,'2025-09-26 02:24:30'),(12,'medico12','med12@mail.com','1234','Dra. Gabriela Sánchez','5024001012',12,1,'2025-09-26 02:24:30'),(13,'medico13','med13@mail.com','1234','Dr. Ricardo Jiménez','5024001013',13,1,'2025-09-26 02:24:30'),(14,'medico14','med14@mail.com','1234','Dra. Valeria Ramírez','5024001014',14,1,'2025-09-26 02:24:30'),(15,'medico15','med15@mail.com','1234','Dr. Alejandro López','5024001015',15,1,'2025-09-26 02:24:30');
/*!40000 ALTER TABLE `medicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,'paciente01','pac01@mail.com','1234','Ana López','50245678901','Zona 1, Ciudad','1990-01-01',1,'2025-09-26 02:23:36'),(2,'paciente02','pac02@mail.com','1234','Carlos Pérez','50245678902','Zona 2, Ciudad','1985-02-02',1,'2025-09-26 02:23:36'),(3,'paciente03','pac03@mail.com','1234','María Gómez','50245678903','Zona 3, Ciudad','1992-03-03',1,'2025-09-26 02:23:36'),(4,'paciente04','pac04@mail.com','1234','Luis Ramírez','50245678904','Zona 4, Ciudad','1988-04-04',1,'2025-09-26 02:23:36'),(5,'paciente05','pac05@mail.com','1234','Sofía Hernández','50245678905','Zona 5, Ciudad','1995-05-05',1,'2025-09-26 02:23:36'),(6,'paciente06','pac06@mail.com','1234','José Martínez','50245678906','Zona 6, Ciudad','1980-06-06',1,'2025-09-26 02:23:36'),(7,'paciente07','pac07@mail.com','1234','Lucía Torres','50245678907','Zona 7, Ciudad','1993-07-07',1,'2025-09-26 02:23:36'),(8,'paciente08','pac08@mail.com','1234','Diego Morales','50245678908','Zona 8, Ciudad','1991-08-08',1,'2025-09-26 02:23:36'),(9,'paciente09','pac09@mail.com','1234','Elena Castillo','50245678909','Zona 9, Ciudad','1987-09-09',1,'2025-09-26 02:23:36'),(10,'paciente10','pac10@mail.com','1234','Fernando Díaz','50245678910','Zona 10, Ciudad','1994-10-10',1,'2025-09-26 02:23:36'),(11,'paciente11','pac11@mail.com','1234','Gabriela Ruiz','50245678911','Zona 11, Ciudad','1996-11-11',1,'2025-09-26 02:23:36'),(12,'paciente12','pac12@mail.com','1234','Ricardo López','50245678912','Zona 12, Ciudad','1989-12-12',1,'2025-09-26 02:23:36'),(13,'paciente13','pac13@mail.com','1234','Patricia Sánchez','50245678913','Zona 13, Ciudad','1997-01-13',1,'2025-09-26 02:23:36'),(14,'paciente14','pac14@mail.com','1234','Andrés Herrera','50245678914','Zona 14, Ciudad','1992-02-14',1,'2025-09-26 02:23:36'),(15,'paciente15','pac15@mail.com','1234','Valeria Jiménez','50245678915','Zona 15, Ciudad','1990-03-15',1,'2025-09-26 02:23:36'),(16,'paciente16','pac16@mail.com','03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4','Nuevo Paciente','50212345678','Zona 4, Ciudad','1994-06-15',1,'2025-10-07 03:15:40'),(17,'Darlyng','marrodaryas@gmail.com','b3a8e0e1f9ab1bfe3a36f231f676f78bb30a519d2b21e6c530c0eee8ebb4a5d0','Darlyng','46281412','Guatemala','1996-10-03',1,'2025-10-07 03:24:31'),(18,'ALEXANDER','ALEXANDER@GMAIL.COM','23357875eeef29aaef1011b0914102f2fdc5465cc2c12a179230d75947870336','ANGEL ARIAS','555555555','VILLA NUVAC','1896-10-03',1,'2025-10-07 03:37:37');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receta_detalle`
--

DROP TABLE IF EXISTS `receta_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta_detalle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receta_id` int NOT NULL,
  `medicamento_id` int NOT NULL,
  `indicaciones` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duracion_dias` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `receta_id` (`receta_id`),
  KEY `medicamento_id` (`medicamento_id`),
  CONSTRAINT `receta_detalle_ibfk_1` FOREIGN KEY (`receta_id`) REFERENCES `recetas` (`id`),
  CONSTRAINT `receta_detalle_ibfk_2` FOREIGN KEY (`medicamento_id`) REFERENCES `medicamentos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta_detalle`
--

LOCK TABLES `receta_detalle` WRITE;
/*!40000 ALTER TABLE `receta_detalle` DISABLE KEYS */;
INSERT INTO `receta_detalle` VALUES (1,1,1,'Tomar 1 tableta cada 8h',5),(2,2,2,'Tomar 1 tableta cada 12h',3),(3,3,5,'Tomar 1 tableta diaria',30),(4,4,4,'Tomar 1 tableta con desayuno',30),(5,5,6,'Inhalar 2 puff cada 6h',7),(6,6,3,'Tomar 1 cápsula cada 8h',7),(7,7,7,'Tomar 1 cápsula diaria',14),(8,8,13,'Tomar 1 tableta cada 12h',10),(9,9,11,'Tomar 1 tableta cada 24h',15),(10,10,14,'Tomar 1 tableta diaria',5),(11,11,12,'Aplicar insulina según esquema',30),(12,12,9,'Tomar 5ml cada 12h',10),(13,13,15,'Tomar 1 tableta diaria',20),(14,14,10,'Tomar 1 tableta cada 8h',7),(15,15,8,'Tomar 1 tableta diaria',60);
/*!40000 ALTER TABLE `receta_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas`
--

DROP TABLE IF EXISTS `recetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cita_id` int NOT NULL,
  `diagnostico_id` int NOT NULL,
  `observaciones` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cita_id` (`cita_id`),
  KEY `diagnostico_id` (`diagnostico_id`),
  CONSTRAINT `recetas_ibfk_1` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`),
  CONSTRAINT `recetas_ibfk_2` FOREIGN KEY (`diagnostico_id`) REFERENCES `diagnosticos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas`
--

LOCK TABLES `recetas` WRITE;
/*!40000 ALTER TABLE `recetas` DISABLE KEYS */;
INSERT INTO `recetas` VALUES (1,1,1,'Reposo e hidratación','2025-09-26 02:31:05'),(2,2,2,'Dieta blanda','2025-09-26 02:31:05'),(3,3,3,'Control de presión arterial','2025-09-26 02:31:05'),(4,4,4,'Control de glucosa','2025-09-26 02:31:05'),(5,5,5,'Uso de inhalador','2025-09-26 02:31:05'),(6,6,6,'Antibiótico por 7 días','2025-09-26 02:31:05'),(7,7,7,'Evitar comidas irritantes','2025-09-26 02:31:05'),(8,8,8,'Ejercicios de estiramiento','2025-09-26 02:31:05'),(9,9,9,'Terapia psicológica','2025-09-26 02:31:05'),(10,10,10,'Referir a oncología','2025-09-26 02:31:05'),(11,11,11,'Ingreso a UCI','2025-09-26 02:31:05'),(12,12,12,'Control neurológico','2025-09-26 02:31:05'),(13,13,13,'Uso de lentes correctivos','2025-09-26 02:31:05'),(14,14,14,'Crema tópica','2025-09-26 02:31:05'),(15,15,15,'Seguimiento postparto','2025-09-26 02:31:05');
/*!40000 ALTER TABLE `recetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tareas_indicadores`
--

DROP TABLE IF EXISTS `tareas_indicadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareas_indicadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tar_codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tar_nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `frecuencia` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tar_codigo` (`tar_codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareas_indicadores`
--

LOCK TABLES `tareas_indicadores` WRITE;
/*!40000 ALTER TABLE `tareas_indicadores` DISABLE KEYS */;
INSERT INTO `tareas_indicadores` VALUES (1,'TAR-001','Control de presión arterial','Indicador','Mensual','2025-09-26 02:19:33'),(2,'TAR-002','Control de glucosa capilar','Indicador','Diario','2025-09-26 02:19:33'),(3,'TAR-003','Adherencia a tratamiento','Indicador','Mensual','2025-09-26 02:19:33'),(4,'TAR-004','Aplicación de vacuna','Tarea','Evento','2025-09-26 02:19:33'),(5,'TAR-005','Entrega de medicamento','Tarea','Evento','2025-09-26 02:19:33'),(6,'TAR-006','Control de peso y talla','Indicador','Mensual','2025-09-26 02:19:33'),(7,'TAR-007','Evaluación psicológica','Tarea','Evento','2025-09-26 02:19:33'),(8,'TAR-008','Control de embarazo','Indicador','Mensual','2025-09-26 02:19:33'),(9,'TAR-009','Examen de laboratorio','Tarea','Evento','2025-09-26 02:19:33'),(10,'TAR-010','Examen de imagenología','Tarea','Evento','2025-09-26 02:19:33'),(11,'TAR-011','Control de dieta','Indicador','Semanal','2025-09-26 02:19:33'),(12,'TAR-012','Control de actividad física','Indicador','Semanal','2025-09-26 02:19:33'),(13,'TAR-013','Seguimiento post-quirúrgico','Tarea','Evento','2025-09-26 02:19:33'),(14,'TAR-014','Control de salud ocular','Indicador','Anual','2025-09-26 02:19:33'),(15,'TAR-015','Control odontológico','Indicador','Anual','2025-09-26 02:19:33');
/*!40000 ALTER TABLE `tareas_indicadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'corehealth'
--

--
-- Dumping routines for database 'corehealth'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-08 23:56:23
