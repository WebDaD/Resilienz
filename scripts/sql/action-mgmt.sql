INSERT INTO `strings` (`id`, `description`, `string_key`) VALUES (NULL, 'Navigation Title Manager', 'nav_manage'), (NULL, 'Title Manager', 'manage_title'), (NULL, 'Instructions for Manual', 'manage_text');

INSERT INTO `translations` (`languages_id`, `strings_id`, `translation`) VALUES ('1', '178', 'Verwaltung'), ('1', '179', 'Verwaltung'), ('1', '180', 'Hier können Sie die Aktionen wechseln, Bücher erstellen lassen oder diese Herunterladen.'), ('2', '178', 'Management'), ('2', '179', 'Management'), ('2', '180', 'YOu can switch books, create PDFs or download them.'), ('3', '178', 'administración'), ('3', '179', 'administración'), ('3', '180', 'Aquí puede cambiar acciones, tener libros creados o descargarlos.'), ('4', '178', 'إدارة'), ('4', '179', 'إدارة'), ('4', '180', 'هنا يمكنك تغيير الإجراءات ، أو إنشاء كتب أو تنزيلها.');

ALTER TABLE `actions` ADD `comment` TEXT NULL AFTER `book`, ADD `last_change` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `comment`, ADD `active` TINYINT NOT NULL DEFAULT '0' AFTER `last_change`;

UPDATE actions SET active = 1;

CREATE OR REPLACE VIEW actionList AS
select `u`.`email` AS `email`,`u`.`id` AS `user_id`,`l`.`name` AS `language`,`a`.`location` AS `location`,`a`.`start_time` AS `start_time`,`a`.`end_time` AS `end_time`,`a`.`finalized` AS `finalized`,`a`.`book` AS `book`, a.comment AS comment, a.last_change AS last_change, a.active AS active from ((`resilienz-test`.`user` `u` join `resilienz-test`.`languages` `l`) join `resilienz-test`.`actions` `a`) where ((`u`.`id` = `a`.`user_id`) and (`u`.`languages_id` = `l`.`id`))