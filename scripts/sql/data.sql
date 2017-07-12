-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: resilienz
-- ------------------------------------------------------
-- Server version	5.7.17-0ubuntu0.16.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `actions`
--

LOCK TABLES `actions` WRITE;
/*!40000 ALTER TABLE `actions` DISABLE KEYS */;
/*!40000 ALTER TABLE `actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `actions_has_layouts`
--

LOCK TABLES `actions_has_layouts` WRITE;
/*!40000 ALTER TABLE `actions_has_layouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `actions_has_layouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (1,'Deckblatt',1,1,'kat_deckblatt',1);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (2,'Das sind wir',2,2,'kat_wir',4);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (3,'was ich kann',2,3,'kat_kann',6);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (4,'anderen helfen',4,4,'kat_helfen',8);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (5,'Stärke',2,5,'kat_staerke',12);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (6,'etwas lernen',6,6,'kat_kernen',14);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (7,'meine Angst',6,7,'kat_angst',20);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (8,'Tipps Angst',2,8,'kat_tipps_angst',26);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (9,'Problem lösen',4,9,'kat_problem',28);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (10,'Gefahr clever',4,10,'kat_gefahr',32);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (11,'Tipps Gefahr',2,11,'kat_tipps_gefahr',36);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (12,'stark wurde',4,12,'kat_stark',38);
INSERT INTO `categories` (`id`,`name`,`pages`,`ordering`,`lang_string_key`,`start_page`) VALUES (13,'So war',3,13,'kat_storytelling',42);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categories_has_layouts`
--

LOCK TABLES `categories_has_layouts` WRITE;
/*!40000 ALTER TABLE `categories_has_layouts` DISABLE KEYS */;
INSERT INTO `categories_has_layouts` VALUES (1,1),(2,2),(3,3),(5,3),(6,3),(4,4),(4,5),(6,6),(7,6),(9,6),(10,6),(12,6),(6,7),(7,7),(9,7),(10,7),(12,7),(8,8),(11,8),(12,8),(13,8);
/*!40000 ALTER TABLE `categories_has_layouts` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `layout_backgrounds`
--
LOCK TABLES `layout_backgrounds` WRITE;
/*!40000 ALTER TABLE `categories_has_layouts` DISABLE KEYS */;
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (1,1,'01_deckblatt.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (2,2,'02_inhalt.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (3,3,'02_inhalt.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (4,4,'03_wir.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (5,5,'03_wir.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (6,6,'04_kann.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (7,7,'04_kann.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (8,8,'05_helfen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (9,9,'05_helfen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (10,10,'05_helfen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (11,11,'05_helfen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (12,12,'06_staerke.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (13,13,'06_staerke.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (14,14,'07_lernen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (15,15,'07_lernen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (16,16,'07_lernen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (17,17,'07_lernen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (18,18,'07_lernen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (19,19,'07_lernen.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (20,20,'08_angst.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (21,21,'08_angst.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (22,22,'08_angst.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (23,23,'08_angst.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (24,24,'08_angst.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (25,25,'08_angst.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (26,26,'10_angst_tipps.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (27,27,'10_angst_tipps.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (28,28,'11_problem.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (29,29,'11_problem.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (30,30,'11_problem.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (31,31,'11_problem.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (32,32,'12_gefahr.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (33,33,'12_gefahr.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (34,34,'12_gefahr.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (35,35,'12_gefahr.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (36,36,'13_gefahr_tipps.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (37,37,'13_gefahr_tipps.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (38,38,'14_stark.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (39,39,'14_stark.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (40,40,'14_stark.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (41,41,'14_stark.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (42,42,'15_storytelling.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (43,43,'15_storytelling.png');
INSERT INTO `layout_backgrounds` (`id`,`page`,`background`) VALUES (44,44,'16_ruecken.png');
/*!40000 ALTER TABLE `categories_has_layouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `images_on_positions`
--

LOCK TABLES `images_on_positions` WRITE;
/*!40000 ALTER TABLE `images_on_positions` DISABLE KEYS */;
/*!40000 ALTER TABLE `images_on_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'Deutsch','de'), (2,'English','en');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `layouts`
--

LOCK TABLES `layouts` WRITE;
/*!40000 ALTER TABLE `layouts` DISABLE KEYS */;
INSERT INTO `layouts` VALUES (1,'A'),(2,'B'),(3,'C'),(4,'D'),(5,'E'),(6,'F'),(7,'G'),(8,'H');
/*!40000 ALTER TABLE `layouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,'TextOben',133,512,476,62,0,1),(2,'Bild',199,611,322,400,0,1),(3,'Left-TopCenter',249,172,212,202,0,2),(4,'Left-TopRight',461,230,212,202,0,2),(5,'Left-MiddleRight',500,430,212,202,0,2),(6,'Left_middleCenter',290,472,212,202,0,2),(7,'Left-middleleft',78,500,212,202,0,2),(8,'Left-bottomLeft',59,702,212,202,0,2),(9,'Left-BottomMiddle',270,751,212,202,0,2),(10,'Left-BottomRight',480,772,212,202,0,2),(11,'Right-TopCenter',1012,118,212,202,0,2),(12,'Right-TopLeft',799,220,212,202,0,2),(13,'Right-MiddleLeft',741,421,212,202,0,2),(14,'Right-MiddleCenter',950,482,212,202,0,2),(15,'Right-MiddleRight',1162,503,212,202,0,2),(16,'Right-BottomRight',1153,706,212,202,0,2),(17,'Right-BottomCenter',942,780,212,202,0,2),(18,'Right-BottomLeft',732,759,212,202,0,2),(19,'Left_top',142,110,286,280,14,3),(20,'Left Center',438,330,280,265,22,3),(21,'Left Bottom',188,664,286,280,6,3),(22,'Right Top',1049,182,180,286,-8,3),(23,'Right Center',760,436,280,289,-18,3),(24,'Right Bottom',996,694,287,280,-6,3),(25,'Left Left',59,238,292,396,0,4),(26,'Left Right',367,491,292,396,0,4),(27,'Right Left',778,466,292,396,0,4),(28,'Right Right',1095,238,292,396,0,4),(29,'Left Top Left',99,179,255,341,0,5),(30,'Left Top Right',357,179,255,341,0,5),(31,'Left bottom Left',99,520,255,341,0,5),(32,'Left Bottom Right',357,520,255,341,0,5),(33,'Right Top Left',817,179,255,341,0,5),(34,'Right Top Right',1076,179,255,341,0,5),(35,'Right Bottom left',817,520,255,341,0,5),(36,'Richt Bottom Right',1076,520,255,341,0,5),(37,'Left Top',156,166,476,220,0,6),(38,'Left Bottom',156,406,476,529,0,6),(39,'Right Top',817,166,476,220,0,6),(40,'Right Bottom',817,406,476,529,0,6),(41,'Left',87,219,578,636,0,7),(42,'Right',785,202,498,731,0,7),(43,'Left Top Left',108,155,283,236,3,8),(44,'Left Top Right',391,304,283,236,-7,8),(45,'Left Center Left',79,457,283,236,-5,8),(46,'Left Bottom Right',420,594,283,236,6,8),(47,'Left Bottom Left',96,723,283,236,0,8),(48,'Right Top Left',760,183,283,236,-3,8),(49,'Right Top Right',1071,232,283,236,-3,8),(50,'Right Center Left',776,436,283,236,4,8),(51,'Right Bottom Left',731,733,283,236,-5,8),(52,'Right Bottom Right',1073,692,283,236,-3,8);
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `strings`
--

LOCK TABLES `strings` WRITE;
/*!40000 ALTER TABLE `strings` DISABLE KEYS */;
INSERT INTO `strings` VALUES (1,'Navigationsmenü anzeigen','toogle_navigation'),(2,'Willkommen - Titel','welcome_title'),(3,'Willkommen - Text','welcome_text'),(4,'Willkommen - PDF-Datei','welcome_pdf'),(5,'Willkommen - PDF-Datei (Link-Text)','welcome_pdf_link'),(6,'Navigation - Layouter','nav_layout'),(7,'Finalize - Titel','finish_title'),(8,'Finalize - Anleitung','finish_text'),(9,'Finalize - Erledigt','finish_completed'),(10,'Finalize - Link zum Buch (Link-Text)','finish_pdf_link'),(11,'Finalize - Button Finalisierien','finish_done'),(12,'Login - Sprachauswahl','login_language'),(13,'Login - E-Mail','login_email'),(14,'Login - Vorname','login_vorname'),(15,'Login - Nachname','login_nachname'),(16,'Login - Passwort','login_password'),(17,'Login - Passwort Wiederholung','login_passwortrepeat'),(18,'Login - Ortsangabe','login_location'),(19,'Login - Startzeitpunkt','login_start'),(20,'Login - Stopzeitpunkt','login_stop'),(21,'Login - Button Register','login_register'),(22,'Login - Button Login','login_login'),(23,'Kategorie - Deckblatt','kat_deckblatt'),(24,'Kategorie - Das sind wir und darauf sind wir stolz','kat_wir'),(25,'Kategorie - Der Tag an dem ich merkte was ich kann','kat_kann'),(26,'Kategorie - Der Tag an dem ich anderen helfen konnte!','kat_helfen'),(27,'Kategorie - Der Tag an dem andere meine Stärke sahen!','kat_staerke'),(28,'Kategorie - Der Tag an dem ich etwas lernen konnte!','kat_kernen'),(29,'Kategorie - Der Tag an dem ich meine Angst überwand!','kat_angst'),(30,'Kategorie - Tipps zum Überwinden von Angst','kat_tipps_angst'),(31,'Kategorie - Der Tag an dem ich ein Problem lösen konnte!','kat_problem'),(32,'Kategorie - Der Tag an dem ich bei Gefahr clever war! ','kat_gefahr'),(33,'Kategorie - Tipps bei Gefahr','kat_tipps_gefahr'),(34,'Kategorie - Der Tag an dem ich stark wurde! ','kat_stark'),(35,'Kategorie - So war der Storytelling Club','kat_storytelling'),(36,'Gesamttitel','title'),(37,'Text der Startseite','index_text'),(38,'Linkt(text) für die App','link_app'),(39,'Navigation - Willkommensseite','nav_welcome'),(40,'Navigation - Abschlusseite','nav_finish'),(41,'Link(text) Impressum','link_impressum'),(42,'Link(text) Datenschutzerklärung','link_datenschutz'),(43,'Link(text) Logout','nav_logout'),(44,'Text Eingeloggt als','nav_logged_in_as'),(45,'Login - Reset-Email Feldbezeichnung','reset_email'),(46,'Login - Hilfetext für Reset','reset_help'),(47,'Login - Button Reset','reset_reset'),(48,'E-Mail Text für Passwort Reset','reset_mail_text'),(49,'Login - Neues Passwort','set_password'),(50,'Login - Passwort wiederholen','set_passwordrepeat'),(51,'Login - Button passwort setzen','set_send'),(52,'Linktext Passwort zurücksetzen','link_reset'),(53,'Linktext Registrieren','link_register')
,(54,'Login - Erfolgreicher Reset','reset_ok')
,(55,'Layout - Upload','layout_upload')
,(56,'Layout - Bearbeiten','layout_edit')
,(57,'Editor - Titelleiste','editor_title')
,(58,'Editor - Schließen','editor_close')
,(59,'Layout - Bild Löschen','layout_delete')
,(60,'Intro - Text','intro_text')
,(61,'Intro - Link Login','intro_login')
,(62,'Intro - Link Registrieren','intro_register')
,(63,'Intro - Link Manual','intro_manual')
,(64,'Intro - Link Nutzungsbedingungen','intro_usage')
,(65,'Welcome - Link Powerpoint','welcome_powerpoint')
,(66,'Intro - Link Materials','welcome_materials')
;

/*!40000 ALTER TABLE `strings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `translations`
--

LOCK TABLES `translations` WRITE;
/*!40000 ALTER TABLE `translations` DISABLE KEYS */;
INSERT INTO `translations` VALUES
(1,1,'Navigation Umschalten'),
(1,2,'Willkommen'),
(1,3,'Dies ist die Startseite der App.'),
(1,4,'manual_german.pdf'),
(1,5,'Anleitung als PDF'),
(1,6,'Layout'),
(1,7,'Finalisieren'),
(1,8,'Anleitung'),
(1,9,'Abgeschlossen'),
(1,10,'Link zu Ihrem Buch'),
(1,11,'Abschließen'),
(1,12,'Sprache'),
(1,13,'E-Mail'),
(1,14,'Vorname'),
(1,15,'Nachname'),
(1,16,'Passwort'),
(1,17,'Passwort wiederholen'),
(1,18,'Ort'),
(1,19,'Von'),
(1,20,'Bis'),
(1,21,'Registrieren'),
(1,22,'Anmelden'),
(1,23,'Deckblatt'),
(1,24,'Das sind wir und darauf sind wir stolz'),
(1,25,'Der Tag, an dem ich merkte was ich kann'),
(1,26,'Der Tag, an dem ich anderen helfen konnte!'),
(1,27,'Der Tag, an dem andere meine Stärke sahen!'),
(1,28,'Der Tag, an dem ich etwas lernen konnte!'),
(1,29,'Der Tag, an dem ich meine Angst überwand!'),
(1,30,'Tipps zum Überwinden von Angst'),
(1,31,'Der Tag, an dem ich ein Problem lösen konnte!'),
(1,32,'Der Tag, an dem ich bei Gefahr clever war! '),
(1,33,'Tipps bei Gefahr'),
(1,34,'Der Tag, an dem ich stark wurde! '),
(1,35,'So war der Storytelling Club'),
(1,36,'Resilienz'),
(1,37,'Willkommen zur Resilienz-App!'),
(1,38,'zur App'),
(1,39,'Willkommen'),
(1,40,'Finalisieren'),
(1,41,'Impressum'),
(1,42,'Datenschutzerklärung'),
(1,43,'Abmelden'),
(1,44,'Angemeldet als'),
(1,45,'E-Mail'),
(1,46,'Geben Sie ihre E-Mail an, ein neues Passwort wird Ihnen zugesendet'),
(1,47,'Passwort zurücksetzen'),
(1,48,'Sie haben ihr Passwort vergessen. Bitte klicken Sie auf den folgenden Link, um ihr Passwort zurückzusetzen.'),
(1,49,'Neues Passwort'),
(1,50,'Passwort wiederholen'),
(1,51,'Speichern'),
(1,52,'Passwort zurücksetzen'),
(1,53,'Registrieren'),
(1,54,'Passwort erfolgreich zurückgesetzt'),
(1,55,'Hochladen'),
(1,56,'Bearbeiten'),
(1,57,'Bildeditor'),
(1,58,'Schließen'),
(1,59,'Löschen'),
(1,60,'Haben wir Ihr Interesse an dem Storytelling Club geweckt und möchten Sie das Projekt vielleicht auch selbst durchführen? Damit Sie das gesamte Material des Storytelling Clubs herunterladen können, registrieren Sie sich bitte hier'),
(1,61,'Login'),
(1,62,'Registrieren'),
(1,63,'Anleitung'),
(1,64,'Nutzungsbedingungen'),
(1,65,'Powerpoint-Vorlage für Buch'),
(1,66,'Einzelne Bausteine zur Durchführung des Stoytelling-Club'),
(2,1,'Switch Navigation'),
(2,2,'Welcome'),
(2,3,'This is the start of the app'),
(2,4,'manual_english.pdf'),
(2,5,'Instructions as PDF'),
(2,6,'Layout'),
(2,7,'Finalize'),
(2,8,'Instructions'),
(2,9,'Done'),
(2,10,'Link to your Book'),
(2,11,'Finalize'),
(2,12,'Language'),
(2,13,'E-Mail'),
(2,14,'Name'),
(2,15,'Surname'),
(2,16,'Password'),
(2,17,'Repeat Password'),
(2,18,'Location'),
(2,19,'From'),
(2,20,'To'),
(2,21,'Register'),
(2,22,'Login'),
(2,23,'Cover'),
(2,24,'This is us and we are proud of this!'),
(2,25,'The day when I realized what I am able to do!'),
(2,26,'The day when I was able to help others!'),
(2,27,'The day when others saw my strength!'),
(2,28,'The day when I could learn something!'),
(2,29,'The day when I was able to overcome my fear!'),
(2,30,'Tips for dealing with fear'),
(2,31,'The day when I was able to solve a problem! '),
(2,32,'The day when I was clever in a dangerous situation! '),
(2,33,'Tips to deal with danger'),
(2,34,'The day I realised that I am strong! '),
(2,35,'That was the Storytelling Club '),
(2,36,'Resiliency'),
(2,37,'Welcome to the Resiliency-App'),
(2,38,'to the App'),
(2,39,'Welcome'),
(2,40,'Finalize'),
(2,41,'Imprint'),
(2,42,'Privacy Policy'),
(2,43,'Logout'),
(2,44,'Logged in As'),
(2,45,'E-Mail'),
(2,46,'Enter your e-mail, a new password will be sent to you'),
(2,47,'Reset Password'),
(2,48,'You have forgotten your password. Please click on the following link to reset your password.'),
(2,49,'New Password'),
(2,50,'Repeat Password'),
(2,51,'Save'),
(2,52,'Reset Password'),
(2,53,'Register'),
(2,54,'Password successfully reseted'),
(2,55,'Upload'),
(2,56,'Edit'),
(2,57,'Image Editor'),
(2,58,'Close'),
(2,59,'Delete'),
(2,60,'If we have aroused your interest and would you like to find out more or to organise this projekt by yourself? Please register here to get the whole material of the Storytelling Club.'),
(2,61,'Login'),
(2,62,'Register'),
(2,63,'Manual'),
(2,64,'Terms of Usage'),
(2,65,'powerpoint-template for book'),
(2,66,'Single building blocks for carrying out the storytelling club')
;
/*!40000 ALTER TABLE `translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'resilienz'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-29 14:47:30
