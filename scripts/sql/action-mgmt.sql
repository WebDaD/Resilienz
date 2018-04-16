INSERT INTO `strings` (`id`, `description`, `string_key`) VALUES (NULL, 'Navigation Title Manager', 'nav_manage'), (NULL, 'Title Manager', 'manage_title'), (NULL, 'Instructions for Manual', 'manage_text'),(NULL, 'Verwaltung :: Aktiv', 'manage_active'), (NULL, 'Verwaltung Kommentar zur Aktion', 'manage_comment'), (NULL, 'Verwaltung Letze Änderung der Aktion', 'manage_last_change'), (NULL, 'Verwaltung Button Erstelle Buch', 'manage_create_book'), (NULL, 'Verwaltung Information Buch wird erstellt', 'manage_creating'), (NULL, 'Verwaltung Buch downloaden', 'manage_download'), (NULL, 'Verwaltung Button Aktion wechseln', 'manage_switch_action'), (NULL, 'Verwaltung Button Aktion erstellen', 'manage_create_action'), NULL, 'Verwaltung Kein Kommentar angegeben', 'manage_no_comment');


INSERT INTO `translations` (`languages_id`, `strings_id`, `translation`) VALUES 
('1', '178', 'Verwaltung'), 
('1', '179', 'Verwaltung'), 
('1', '180', 'Hier können Sie die Aktionen wechseln, Bücher erstellen lassen oder diese Herunterladen.'), 
('2', '178', 'Management'), 
('2', '179', 'Management'), 
('2', '180', 'YOu can switch books, create PDFs or download them.'), 
('3', '178', 'administración'), 
('3', '179', 'administración'), 
('3', '180', 'Aquí puede cambiar acciones, tener libros creados o descargarlos.'), 
('4', '178', 'إدارة'), 
('4', '179', 'إدارة'), 
('4', '180', 'هنا يمكنك تغيير الإجراءات ، أو إنشاء كتب أو تنزيلها.'),
('1', '181', 'Aktiv'),
('1', '182', 'Kommentar'),
('1', '183', 'Letzte Änderung'),
('1', '184', 'Buch Erstellen'),
('1', '185', 'Buch wird erstellt...'),
('1', '186', 'Buch herunterladen'),
('1', '187', 'Wechsle zu Aktion'),
('1', '188', 'Neue Aktion'),
('2', '181', 'Active'),
('2', '182', 'Comment'),
('2', '183', 'Last Change'),
('2', '184', 'Create Book'),
('2', '185', 'Creating Book ...'),
('2', '186', 'Download Book'),
('2', '187', 'Switch to Action'),
('2', '188', 'New Action'),
('3', '181', 'activa'),
('3', '182', 'comentario'),
('3', '183', 'Último cambio'),
('3', '184', 'Crea libro'),
('3', '185', 'libro es creado...'),
('3', '186', 'Descargar el libro'),
('3', '187', 'Cambiar a acción'),
('3', '188', 'Nueva acción'),
('4', '181', 'بنشاط'),
('4', '182', 'تعليق'),
('4', '183', 'التغيير الأخير'),
('4', '184', 'قم بإنشاء كتاب'),
('4', '185', 'يتم إنشاء الكتاب ...'),
('4', '186', 'قم بتنزيل الكتاب'),
('4', '187', 'التحول إلى العمل'),
('4', '188', 'عمل جديد'),
('1', '189', 'Kein Kommentar vorhanden.'),
('2', '189', 'No comment available.'),
('3', '189', 'No hay comentarios disponibles'),
('4', '189', 'لا تعليق متاح.');

ALTER TABLE `actions` ADD `comment` TEXT NULL AFTER `book`, ADD `last_change` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `comment`, ADD `active` TINYINT NOT NULL DEFAULT '0' AFTER `last_change`;

UPDATE actions SET active = 1;

CREATE OR REPLACE VIEW actionList AS
select `a`.`id` AS `action_id`, `u`.`email` AS `email`,`u`.`id` AS `user_id`,`l`.`name` AS `language`,`a`.`location` AS `location`,`a`.`start_time` AS `start_time`,`a`.`end_time` AS `end_time`,`a`.`finalized` AS `finalized`,`a`.`book` AS `book`, a.comment AS comment, a.last_change AS last_change, a.active AS active from ((`resilienz`.`user` `u` join `resilienz`.`languages` `l`) join `resilienz`.`actions` `a`) where ((`u`.`id` = `a`.`user_id`) and (`u`.`languages_id` = `l`.`id`))