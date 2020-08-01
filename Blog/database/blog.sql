
--
-- Database: `statusly`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
    `email` varchar(30) NOT NULL,
    `username` varchar(50) NOT NULL,
    `avatar` varchar(255),
    `type` tinyint(1) NOT NULL DEFAULT '2' COMMENT '1-admin,2-normal',
    `status_code` tinyint(1) DEFAULT '0' COMMENT '0-normal,1-deleted',
    PRIMARY KEY(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `users_whitelist`
--

CREATE TABLE `users_whitelist` (
    `email` varchar(30) PRIMARY KEY NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `team_relationship`
--
CREATE TABLE `team_relationships` (
    `user_email` VARCHAR(30) NOT NULL,
    `team_id` INT(8) UNSIGNED NOT NULL,
    `status_code` tinyint(1) DEFAULT '0',
    PRIMARY KEY(`user_email`,`team_id`),
    KEY `team_id` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `teams`
--
CREATE TABLE `teams` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `team_name` varchar(30) NOT NULL,
  `team_email` varchar(30) NOT NULL,
  `team_desc` varchar(255) NOT NULL,
  `lead_email` varchar(30) NOT NULL,
  `cc_list` varchar(255),
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status_code` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `lead_email` (`lead_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `templates`
--
CREATE TABLE `templates` (
    `id` INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `team_id` INT(8) unsigned NOT NULL,
    `report_type` VARCHAR(30) NOT NULL,
    `theme` VARCHAR(30) NOT NULL,
    `content` TEXT NOT NULL,
    `creator_email` VARCHAR(30) NOT NULL,
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `status_code` TINYINT(1) NOT NULL DEFAULT '0',
    KEY `team_id` (`team_id`),
    KEY `update_time` (`update_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
    `id` INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `from_email` VARCHAR(30) NOT NULL,
    `to_email` VARCHAR(30) NOT NULL,
    `team_id` INT(8) UNSIGNED NOT NULL,
    `sprint` INT NOT NULL,
    `report_type` VARCHAR(30) NOT NULL,
    `theme` VARCHAR(30) NOT NULL,
    `content` TEXT NOT NULL,
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `status_code` TINYINT(1) NOT NULL DEFAULT '0',
    KEY `from_email` (`from_email`),
    KEY `to_email` (`to_email`),
    KEY `update_time` (`update_time`),
    KEY `team` (`team_id`,`sprint`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `photos` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `path` VARCHAR(300) NOT NULL,
    `email` VARCHAR(30) NOT NULL,
    `team_id` INT(8) UNSIGNED NOT NULL,
    KEY `path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `team_sprint`
--
CREATE TABLE `team_sprint` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `team_id` INT(8) unsigned NOT NULL,
  `type` varchar(30) NOT NULL,
  `sprint` INT unsigned NOT NULL,
  `begin_time` date NOT NULL,
  `end_time` date NOT NULL,
  `status_code` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  unique KEY `team` (`team_id`,`sprint`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `messages` (
    `id` INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `operation` VARCHAR(30) NOT NULL,
    `from_email` VARCHAR(30) NOT NULL,
    `from_name` VARCHAR(30) NOT NULL,
    `to_email` VARCHAR(30) NOT NULL,
    `content` VARCHAR(300) NOT NULL,
    `data` VARCHAR(300) NOT NULL,
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status_code` TINYINT(1) NOT NULL DEFAULT '0',
    KEY `from_email` (`from_email`),
    KEY `to_email` (`to_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
