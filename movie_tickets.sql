/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50723
 Source Host           : localhost:3306
 Source Schema         : movie_tickets

 Target Server Type    : MySQL
 Target Server Version : 50723
 File Encoding         : 65001

 Date: 28/04/2019 12:02:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for actors
-- ----------------------------
DROP TABLE IF EXISTS `actors`;
CREATE TABLE `actors` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `movie_id` smallint(10) DEFAULT NULL COMMENT '电影id',
  `name` varchar(255) DEFAULT NULL COMMENT '名字',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `role` varchar(255) DEFAULT NULL COMMENT '角色',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of actors
-- ----------------------------
BEGIN;
INSERT INTO `actors` VALUES (1, 1, '乔·罗素', 'https://p0.meituan.net/moviemachine/92f533b48482a20b1dc7131363b0d888183832.jpg@128w_170h_1e_1c', '导演');
INSERT INTO `actors` VALUES (2, 1, '安东尼·罗素', 'https://p1.meituan.net/movie/e9caad7b525f59fcd974be52324aa80c65666.jpg@128w_170h_1e_1c', '导演');
INSERT INTO `actors` VALUES (3, 1, '小罗伯特·唐尼', 'https://p1.meituan.net/moviemachine/b014d18273419de881376d3509ced1a7184848.jpg@128w_170h_1e_1c', '钢铁侠 Tony');
INSERT INTO `actors` VALUES (4, 1, '克里斯·埃文斯', 'https://p0.meituan.net/moviemachine/358989d45d38fb6620aff5ee17cdf1a840966.jpg@128w_170h_1e_1c', '美国队长 Steve Rogers');
INSERT INTO `actors` VALUES (5, 1, '马克·鲁法洛', 'https://p1.meituan.net/movie/1926696ef0b5c45714e13dafb7bfba1557113.jpg@128w_170h_1e_1c', '浩克 Bruce Banner');
INSERT INTO `actors` VALUES (6, 1, '克里斯·海姆斯沃斯', 'https://p0.meituan.net/movie/8e1c78ea168f403280c2ea4023fd8d0292893.jpg@128w_170h_1e_1c', '雷神 Thor');
INSERT INTO `actors` VALUES (7, 1, '斯嘉丽·约翰逊', 'https://p1.meituan.net/movie/b0318792962ba330bf62618ea9b8cc7e154235.jpg@128w_170h_1e_1c', '黑寡妇 Natasha Romanoff');
INSERT INTO `actors` VALUES (9, 1, '杰瑞米·雷纳', 'https://img.91tc.xyz/FlxuuzHeqoGeJ01UqEpyQ3CtCowt', '鹰眼');
COMMIT;

-- ----------------------------
-- Table structure for administrators
-- ----------------------------
DROP TABLE IF EXISTS `administrators`;
CREATE TABLE `administrators` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL COMMENT '登录名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `role` varchar(2) DEFAULT NULL COMMENT '角色。1.超级管理员;2.普通管理员',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否删除。0否，1是',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='管理员';

-- ----------------------------
-- Records of administrators
-- ----------------------------
BEGIN;
INSERT INTO `administrators` VALUES (1, 'admin', 'admin', '1', '1547735288302', '1548769645672', 0);
INSERT INTO `administrators` VALUES (8, 'twy', 'admin', '2', '1548768396356', '1548768396356', 0);
COMMIT;

-- ----------------------------
-- Table structure for banners
-- ----------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT COMMENT '轮播ID',
  `sort` smallint(6) DEFAULT '0',
  `title` varchar(255) DEFAULT NULL COMMENT '轮播标题',
  `url` varchar(255) DEFAULT NULL COMMENT '轮播跳转链接',
  `image` varchar(255) NOT NULL COMMENT '轮播图片链接',
  `updated_at` varchar(133) DEFAULT NULL COMMENT '更新时间',
  `created_at` varchar(133) DEFAULT NULL COMMENT '创建时间',
  `created_by` varchar(255) DEFAULT NULL COMMENT '创建者',
  `updated_by` varchar(255) DEFAULT NULL COMMENT '更新者',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否；1是',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COMMENT='图片轮播';

-- ----------------------------
-- Records of banners
-- ----------------------------
BEGIN;
INSERT INTO `banners` VALUES (9, 0, '复仇者联盟', './detail/detail?title=复仇者联盟:终局之战&id=1', 'https://img.91tc.xyz/FtnssLNQ0d58tWeGZN2yyD7H3z2Q', NULL, '1556349707522', 'admin', NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `user_id` smallint(10) NOT NULL COMMENT '用户ID',
  `movie_id` smallint(10) NOT NULL COMMENT '电影ID',
  `rating` smallint(10) DEFAULT NULL COMMENT '评分',
  `content` text COMMENT '影评内容',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='评论';

-- ----------------------------
-- Records of comments
-- ----------------------------
BEGIN;
INSERT INTO `comments` VALUES (2, 1, 1, 2, '我觉得一般', '1556330737317', NULL);
INSERT INTO `comments` VALUES (3, 1, 1, 3, '挺好看的', '1556330765894', NULL);
COMMIT;

-- ----------------------------
-- Table structure for favorites
-- ----------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `movie_id` smallint(10) NOT NULL COMMENT '电影ID',
  `user_id` smallint(10) NOT NULL COMMENT '用户ID',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COMMENT='收藏';

-- ----------------------------
-- Records of favorites
-- ----------------------------
BEGIN;
INSERT INTO `favorites` VALUES (15, 2, 1, '1556345729289', NULL);
INSERT INTO `favorites` VALUES (16, 1, 1, '1556418691998', NULL);
COMMIT;

-- ----------------------------
-- Table structure for movies
-- ----------------------------
DROP TABLE IF EXISTS `movies`;
CREATE TABLE `movies` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `sort` smallint(2) DEFAULT '0' COMMENT '排序值',
  `name` varchar(255) DEFAULT NULL COMMENT '电影标题',
  `en_name` varchar(255) DEFAULT NULL COMMENT '英文名',
  `types` varchar(255) DEFAULT NULL COMMENT '类型',
  `rating` smallint(2) DEFAULT '0' COMMENT '评分',
  `cover` varchar(255) DEFAULT NULL COMMENT '封面',
  `summary` varchar(255) DEFAULT NULL COMMENT '摘要',
  `description` text COMMENT '简介',
  `onsale` smallint(2) DEFAULT '1' COMMENT '是否上映。1是；0否',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `duration` smallint(10) DEFAULT NULL COMMENT '持续时间，单位是分钟',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。1是；0否',
  `actors` varchar(255) DEFAULT NULL COMMENT '主演',
  `likes` smallint(10) DEFAULT '0' COMMENT '想看',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='电影';

-- ----------------------------
-- Records of movies
-- ----------------------------
BEGIN;
INSERT INTO `movies` VALUES (1, 0, '复仇者联盟:终局之战', 'Avengers: Endgame', '科幻', 8, 'https://p0.meituan.net/moviemachine/f7d2ad70eb79d6d9b8a197713db9b8c41711752.jpg@464w_644h_1e_1c', 'Avengers: Endgame', '改编自漫威漫画，也是漫威电影宇宙第22部影片。复仇者联盟的一众超级英雄，必须抱着牺牲一切的信念，与史上最强大反派灭霸殊死一搏，阻止其摧毁宇宙的邪恶计划。', 0, '1556026459850', '1556026459850', 180, 0, '1,2,3', 123);
INSERT INTO `movies` VALUES (2, 0, '反贪风暴', 'P Storm', '犯罪', 7, 'https://p1.meituan.net/movie/c63849c7a9de360a7b192bc322792a111705236.jpg@464w_644h_1e_1c', 'P Storm', '廉政公署收到报案人廖雨萍（周秀娜 饰）的实名举报，举报正在坐牢的富二代曹元元（林峯 饰）涉嫌行贿监狱里的监督沈济全（谭耀文 饰）以及惩教员，首席调查主任陆志廉（古天乐 饰）决定深入虎穴，卧底狱中。在监狱里，被陆志廉送入监狱的前警司黄文彬（林家栋 饰）以及曹元元两大帮派势成水火，陆志廉趁机接近曹元元取得信任。同时监狱外的廉政公署总调查主任程德明（郑嘉颖 饰）、国内反贪局行动处处长洪亮（丁海峰 饰）也陆港联手，通力合作，最终成功破获贪腐行贿大案。', 1, '1556026459850', '1556352216336', 98, 0, '主演: 古天乐,郑嘉颖,林峯', 110);
INSERT INTO `movies` VALUES (3, 0, '何以为家', 'كفرناحوم', '剧情', 8, 'https://img.91tc.xyz/Fic_YQHGewjVzd5fm0hNii3bxsZT', '黎巴嫩,法国,美国', '法庭上，十二岁的男孩赞恩（赞恩·阿尔·拉菲亚 饰）向法官状告他的亲生父母，原因是，他们给了他生命。是什么样的经历让一个孩子做出如此不可思议的举动？故事中，赞恩的父母在无力抚养和教育的状况下依然不停生育，作为家中的长子赞恩，弱小的肩膀承担了无数生活的重压。当妹妹被强行卖给商贩为妻时，赞恩愤怒离家，之后遇到一对没有合法身份的母子，相互扶持勉强生活。然而生活并没有眷顾赞恩，重重磨难迫使他做出了令人震惊的举动……', 1, '1556351097865', '1556351097865', 116, 0, '主演：赞恩·阿尔·拉菲亚', 0);
COMMIT;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `theater_id` smallint(10) NOT NULL COMMENT '影院ID',
  `theater_name` varchar(255) DEFAULT NULL COMMENT '影院名称',
  `movie_id` smallint(10) DEFAULT NULL COMMENT '电影ID',
  `movie_name` varchar(255) DEFAULT NULL COMMENT '电影名称',
  `user_id` smallint(10) DEFAULT NULL COMMENT '用户ID',
  `price` smallint(10) DEFAULT NULL COMMENT '票价',
  `date` varchar(255) DEFAULT NULL COMMENT '日期',
  `start_time` varchar(255) DEFAULT NULL COMMENT '影片开始时间',
  `room` varchar(255) DEFAULT NULL COMMENT '影厅',
  `seats` varchar(255) DEFAULT NULL COMMENT '座位',
  `status` smallint(2) DEFAULT NULL COMMENT '订单状态。1待付款；2已付款',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COMMENT='订单';

-- ----------------------------
-- Records of orders
-- ----------------------------
BEGIN;
INSERT INTO `orders` VALUES (8, 1, '万达影城', 1, '复仇者联盟:终局之战', 1, 80, '2019-04-27T03:03:53.952Z', '12:30', '001', '03排11座,03排13座', 2, '1556334286605', '1556335411635');
INSERT INTO `orders` VALUES (9, 1, '万达影城', 1, '复仇者联盟:终局之战', 1, 40, '2019-04-27T05:34:21.173Z', '12:30', '001', '03排10座', 2, '1556343279829', '1556343556013');
INSERT INTO `orders` VALUES (10, 1, '万达影城', 1, '复仇者联盟:终局之战', 1, 40, '2019-04-27T05:39:38.151Z', '12:30', '001', '04排10座', 2, '1556343603051', '1556343755476');
INSERT INTO `orders` VALUES (11, 1, '万达影城', 1, '复仇者联盟:终局之战', 1, 40, '2019-04-27T05:42:28.498Z', '12:30', '001', '04排8座', 2, '1556343768595', '1556343772271');
INSERT INTO `orders` VALUES (12, 1, '万达影城', 1, '反贪风暴', 1, 20, '2019-04-27T06:04:07.304Z', '10:30', '001', '07排10座,07排11座', 2, '1556345059991', '1556345073826');
INSERT INTO `orders` VALUES (14, 1, '万达影城', 1, '复仇者联盟:终局之战', 1, 120, '2019-04-27T07:46:09.389Z', '11:30', '001', '05排9座,05排10座', 2, '1556418714669', '1556418717643');
COMMIT;

-- ----------------------------
-- Table structure for stills
-- ----------------------------
DROP TABLE IF EXISTS `stills`;
CREATE TABLE `stills` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `movie_id` smallint(10) NOT NULL COMMENT '电影id',
  `image` varchar(255) DEFAULT NULL COMMENT '图片',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COMMENT='剧照';

-- ----------------------------
-- Records of stills
-- ----------------------------
BEGIN;
INSERT INTO `stills` VALUES (1, 1, 'https://p0.meituan.net/mmdb/c51f1a38223e5f5c6dfd4003cb6d2162707679.jpg');
INSERT INTO `stills` VALUES (2, 1, 'https://p0.meituan.net/mmdb/52fe9cc1720ba7d9baf7d903f5a875c3726416.jpg');
INSERT INTO `stills` VALUES (3, 1, 'https://p1.meituan.net/mmdb/657358a233901b10a6ce9a99274ad1e3627308.jpg');
INSERT INTO `stills` VALUES (4, 1, 'https://p0.meituan.net/mmdb/091cce1c7b09d0fa6b5430172f98a3bb695656.jpg');
INSERT INTO `stills` VALUES (5, 1, 'https://p0.meituan.net/mmdb/0caabaa470948c953670ae0b8473349a722733.jpg');
INSERT INTO `stills` VALUES (6, 1, 'https://p0.meituan.net/mmdb/0ee5d79b189892d76508a15ace99b558679625.jpg');
INSERT INTO `stills` VALUES (7, 3, 'https://img.91tc.xyz/Fl9uMqFFU1lpQvuygYrDFp2hGOLq');
INSERT INTO `stills` VALUES (11, 3, 'https://img.91tc.xyz/FiSpd15U6HZtB-e181sCN0ynpsgP');
COMMIT;

-- ----------------------------
-- Table structure for system
-- ----------------------------
DROP TABLE IF EXISTS `system`;
CREATE TABLE `system` (
  `id` smallint(2) NOT NULL AUTO_INCREMENT,
  `program_name` varchar(255) DEFAULT NULL COMMENT '项目名',
  `is_review` smallint(2) DEFAULT '0' COMMENT '是否提审。1是；0否',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='系统配置';

-- ----------------------------
-- Records of system
-- ----------------------------
BEGIN;
INSERT INTO `system` VALUES (1, '影票多多', 0);
COMMIT;

-- ----------------------------
-- Table structure for theaters
-- ----------------------------
DROP TABLE IF EXISTS `theaters`;
CREATE TABLE `theaters` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `sort` smallint(2) DEFAULT '0' COMMENT '排序值',
  `name` varchar(255) DEFAULT NULL COMMENT '电影院名称',
  `city` varchar(255) DEFAULT NULL COMMENT '城市',
  `location` varchar(255) DEFAULT NULL COMMENT '地址',
  `labels` varchar(255) DEFAULT NULL COMMENT '标签',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。1是；0否',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `min_price` decimal(10,0) DEFAULT NULL COMMENT '最低票价',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='影院';

-- ----------------------------
-- Records of theaters
-- ----------------------------
BEGIN;
INSERT INTO `theaters` VALUES (1, 0, '万达影城', '广州', '广州市天河区万科广场', '改签,小吃,IMAX厅', 0, '1556030254733', '1556030254733', 39);
INSERT INTO `theaters` VALUES (2, 0, '烽禾影城', '广州', '黄埔区科学城科学大道193号高德汇购物中心5层', '可停车,儿童优惠', 1, NULL, '1556352307975', 30);
INSERT INTO `theaters` VALUES (3, 0, '烽禾影城', '广州', '黄埔区科学城科学大道193号高德汇购物中心5层', '可停车,儿童优惠', 0, '1556352337077', NULL, 30);
COMMIT;

-- ----------------------------
-- Table structure for timetable
-- ----------------------------
DROP TABLE IF EXISTS `timetable`;
CREATE TABLE `timetable` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `movie_id` smallint(10) NOT NULL COMMENT '电影id',
  `theater_id` smallint(10) DEFAULT NULL COMMENT '影院id',
  `play_date` varchar(255) DEFAULT NULL COMMENT '播放日期',
  `times` json DEFAULT NULL COMMENT '排期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='排期';

-- ----------------------------
-- Records of timetable
-- ----------------------------
BEGIN;
INSERT INTO `timetable` VALUES (1, 1, 1, '2019-04-28T13:51:28.254Z', '[{\"room\": \"001\", \"price\": \"60\", \"effects\": \"英语3D\", \"end_time\": \"13:30\", \"start_time\": \"11:30\"}, {\"room\": \"001\", \"price\": \"60\", \"effects\": \"英语3D\", \"end_time\": \"15:30\", \"start_time\": \"13:30\"}]');
INSERT INTO `timetable` VALUES (2, 1, 1, '2019-04-29T13:51:28.254Z', '[{\"room\": \"001\", \"price\": \"40\", \"effects\": \"英语3D\", \"end_time\": \"14:30\", \"start_time\": \"12:30\"}, {\"room\": \"001\", \"price\": \"50\", \"effects\": \"英语3D\", \"end_time\": \"15:30\", \"start_time\": \"13:30\"}]');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `openid` varchar(100) NOT NULL COMMENT '微信openid',
  `unionid` varchar(100) DEFAULT NULL COMMENT '微信unionid',
  `nick_name` varchar(255) NOT NULL COMMENT '昵称',
  `gender` smallint(2) DEFAULT NULL COMMENT '性别',
  `country` varchar(100) DEFAULT NULL COMMENT '国家',
  `province` varchar(100) DEFAULT NULL COMMENT '省份',
  `city` varchar(100) DEFAULT NULL COMMENT '城市',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除',
  `status` smallint(2) DEFAULT '1' COMMENT '用户状态。1.正常;2.冻结',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='用户';

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1, 'o9rvm5etbIGEu87oI2BXM9Ktu2z4', NULL, '雍', 1, 'China', 'Guangdong', 'Guangzhou', 'https://wx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLA44r4Z1ptibrqgVbZOYQjclH2DAEU6dsUsFhqdFRiaBb1qgVT0oNdKecZ2CpZj7QuTJibte3Cz2Icibg/132', '1556186178500', '1556186178500', 0, 1);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
