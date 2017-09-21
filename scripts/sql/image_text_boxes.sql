ALTER TABLE `resilienz`.`images_on_positions` 
    CHANGE COLUMN `image` `value` VARCHAR(255) NOT NULL COMMENT 'Name of image' ,
    ADD COLUMN `type` VARCHAR(10) NOT NULL DEFAULT 'image' AFTER `value`, RENAME TO  `resilienz`.`objects_on_positions` ;

ALTER TABLE `resilienz`.`positions` 
ADD COLUMN `possible_type` VARCHAR(10) NOT NULL DEFAULT 'image' AFTER `layouts_id`;

UPDATE `resilienz`.`positions` SET `possible_type`='both' WHERE `id`='1';
UPDATE `resilienz`.`positions` SET `possible_type`='both' WHERE `id`='38';
UPDATE `resilienz`.`positions` SET `possible_type`='both' WHERE `id`='40';


CREATE OR REPLACE VIEW `positions_on_actions` AS
    SELECT
        `p`.`id` AS `position_id`,
        `p`.`name` AS `position_name`,
        `p`.`x` AS `x`,
        `p`.`y` AS `y`,
        `p`.`width` AS `width`,
        `p`.`height` AS `height`,
        `p`.`spin` AS `spin`,
        `p`.`possible_type` AS `possible_type`,
        `ahl`.`id` AS `action_has_layouts_id`,
        `ahl`.`layouts_id` AS `layouts_id`,
        `ahl`.`page` AS `page`,
        `ahl`.`actions_id` AS `actions_id`
    FROM
        (`positions` `p`
        JOIN `actions_has_layouts` `ahl`)
    WHERE
        (`p`.`layouts_id` = `ahl`.`layouts_id`);

INSERT INTO `strings` (`id`, `description`, `string_key`) VALUES (NULL, 'Layouter :: zu Bild wechseln', 'layout_make_image'), (NULL, 'layout :: zu Text wechseln', 'layout_make_text'), (NULL, 'Layout :: Text speichern', 'layout_save_text');

INSERT INTO `translations` (`languages_id`, `strings_id`, `translation`) VALUES ('1', '175', 'Bild hochladen'), ('1', '176', 'Text schreiben'), ('1', '177', 'Text speichern');

INSERT INTO `translations` (`languages_id`, `strings_id`, `translation`) VALUES
(2, 156, 'Um auch die Erziehungsberechtigten der Kinder, mit denen Sie das Projekt durchführen und ggf. die Institutionen, an denen das Projekt durchgeführt wird, angemessen informieren zu können, haben Sie hier die Möglichkeit, entsprechende Vorlagen herunterzuladen. '),
(2, 157, 'Anschreiben für Erziehungsberechtigte'),
(2, 158, 'Anschreiben für Institutionen\r\n'),
(2, 159, 'Instructions'),
(2, 160, 'Hier können Sie die Geschichten und die Bilder der Kinder Ihres Storytelling Clubs ganz einfach als Buch zusammenstellen.'),
(2, 161, 'Hier können Sie sich ein Beispiel ansehen.'),
(2, 162, 'Sie können die jeweiligen Kapitel einzeln auswählen und die dazugehörigen Bilder und Geschichten hochladen.'),
(2, 163, 'Um Bilder oder Texte einzufügen, klicken Sie auf die Felder mit dem Text „Zum Hochladen hier klicken" oder ziehen Sie ein Bild per Drag & Drop auf die Felder. '),
(2, 164, 'Das Layout der Kapitel kann ausgewählt werden. Nutzen Sie dafür das Auswahlfeld oben.'),
(2, 165, 'Ihr Fortschritt wird automatisch bei jeder Änderung gespeichert. Sie können die Gestaltung Ihres Storytelling-Club-Buchs jederzeit unterbrechen und später fortfahren.'),
(2, 166, 'Wenn Sie mit der Gestaltung Ihres Storytelling-Club-Buchs fertig sind, klicken Sie auf "Finalisieren" und laden Sie sich Ihr Storytelling-Club-Buch als PDF-Datei herunter.'),
(2, 167, 'Instructions'),
(2, 168, 'This is an automated E-Mail. Please do not reply.'),
(2, 169, 'Your Data:'),
(2, 171, 'The Creation of your Book can take some time. You can close this page, you will receive an E-Mail with a Link to your Book'),
(2, 172, 'Your Book is ready!'),
(2, 173, 'You Can Download your Book here:'),
(2, 174, 'Download'),
(2, 175, 'Use Image'),
(2, 176, 'Use Text'),
(2, 177, 'Save Text');