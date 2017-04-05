-- -----------------------------------------------------
-- Schema resilienz
-- -----------------------------------------------------
USE `resilienz` ;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'Deutsch','de');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `strings`
--
LOCK TABLES `strings` WRITE;
/*!40000 ALTER TABLE `strings` DISABLE KEYS */;
INSERT INTO `strings` VALUES (1,'Navigationsmenü anzeigen','toogle_navigation'),(2,'Willkommen - Titel','welcome_title'),(3,'Willkommen - Text','welcome_text'),(4,'Willkommen - PDF-Datei','welcome_pdf'),(5,'Willkommen - PDF-Datei (Link-Text)','welcome_pdf_link'),(6,'Navigation - Layouter','nav_layout'),(7,'Finalize - Titel','finish_title'),(8,'Finalize - Anleitung','finish_text'),(9,'Finalize - Erledigt','finish_completed'),(10,'Finalize - Link zum Buch (Link-Text)','finish_pdf_link'),(11,'Finalize - Button Finalisierien','finish_done');
/*!40000 ALTER TABLE `strings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `translations`
--

LOCK TABLES `translations` WRITE;
/*!40000 ALTER TABLE `translations` DISABLE KEYS */;
INSERT INTO `translations` VALUES (1,1,'Navigation Umschalten');
/*!40000 ALTER TABLE `translations` ENABLE KEYS */;
UNLOCK TABLES;
