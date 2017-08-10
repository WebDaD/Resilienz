ALTER TABLE `resilienz`.`images_on_positions` 
    CHANGE COLUMN `image` `value` VARCHAR(255) NOT NULL COMMENT 'Name of image' ,
    ADD COLUMN `type` VARCHAR(10) NOT NULL DEFAULT 'image' AFTER `value`, RENAME TO  `resilienz`.`objects_on_positions` ;

ALTER TABLE `resilienz`.`positions` 
ADD COLUMN `possible_type` VARCHAR(10) NOT NULL DEFAULT 'image' AFTER `layouts_id`;

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