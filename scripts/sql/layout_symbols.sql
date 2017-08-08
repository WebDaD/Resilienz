-- Update Script for Database from Master to layout_symbols
ALTER TABLE `resilienz`.`layouts` ADD COLUMN `symbol` VARCHAR(2) NOT NULL AFTER `name`;

UPDATE `resilienz`.`layouts` SET `symbol`='A' WHERE `id`='1';
UPDATE `resilienz`.`layouts` SET `symbol`='B' WHERE `id`='2';
UPDATE `resilienz`.`layouts` SET `symbol`='C' WHERE `id`='3';
UPDATE `resilienz`.`layouts` SET `symbol`='D' WHERE `id`='4';
UPDATE `resilienz`.`layouts` SET `symbol`='E' WHERE `id`='5';
UPDATE `resilienz`.`layouts` SET `symbol`='F' WHERE `id`='6';
UPDATE `resilienz`.`layouts` SET `symbol`='G' WHERE `id`='7';
UPDATE `resilienz`.`layouts` SET `symbol`='H' WHERE `id`='8';