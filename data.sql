-- ===========================
-- 高校体育馆管理系统 - 测试数据
-- ===========================

USE `gs_back`;

-- ----------------------------
-- 场地数据 (venues)
-- ----------------------------

-- 1. 篮球场
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('室内篮球馆A', 'basketball', '标准室内篮球场，配备专业木地板、电子计分牌、空调系统，适合正式比赛和训练', 200, 'available', '["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800","https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800"]', '请提前预约，按时到达场地\n请穿着运动服装和运动鞋\n请爱护场地设施\n请保持场地清洁'),
('室内篮球馆B', 'basketball', '标准室内篮球场，设施完善，灯光充足，适合日常训练和友谊赛', 200, 'available', '["https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800"]', '请提前预约，按时到达场地\n请穿着运动服装和运动鞋'),
('室外篮球场', 'basketball', '室外标准篮球场，塑胶地面，配备夜间照明设备，免费开放', 100, 'available', '["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800"]', '免费开放，先到先得');

-- 2. 足球场
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('标准足球场', 'football', '11人制标准足球场，天然草坪，配备更衣室和淋浴设施，适合正式比赛', 500, 'available', '["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"]', '请提前预约\n请穿足球鞋\n禁止吸烟'),
('五人制足球场A', 'football', '室内五人制足球场，人工草坪，全天候可用，配备空调', 50, 'available', '["https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800"]', '请提前预约\n请穿运动鞋'),
('五人制足球场B', 'football', '室外五人制足球场，人工草坪，夜间照明，性价比高', 50, 'available', '["https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800"]', '请提前预约');

-- 3. 羽毛球馆
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('羽毛球馆', 'badminton', '专业羽毛球馆，12片标准场地，塑胶地板，灯光符合比赛标准', 120, 'available', '["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"]', '请提前预约\n请穿运动鞋\n请自备球拍');

-- 4. 乒乓球馆
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('乒乓球馆', 'tabletennis', '室内乒乓球馆，20张标准球台，配备专业地胶，适合训练和比赛', 80, 'available', '["https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800"]', '请提前预约\n请自备球拍');

-- 5. 网球场
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('室外网球场', 'tennis', '4片标准网球场，硬地场地，配备夜间照明和休息区', 80, 'available', '["https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800"]', '请提前预约\n请穿网球鞋'),
('室内网球馆', 'tennis', '2片室内网球场，全天候可用，配备空调和观众席', 100, 'available', '["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"]', '请提前预约\n请穿网球鞋');

-- 6. 排球场
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('室内排球馆', 'volleyball', '标准室内排球场，木地板，配备专业网架和计分系统', 150, 'available', '["https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"]', '请提前预约\n请穿运动鞋'),
('沙滩排球场', 'volleyball', '室外沙滩排球场，标准沙池，适合休闲娱乐', 50, 'available', '["https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800"]', '请提前预约');

-- 7. 游泳馆
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('标准游泳馆', 'swimming', '50米标准泳池，8泳道，配备更衣室、淋浴间和救生设备', 300, 'available', '["https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800"]', '请提前预约\n请佩戴泳帽\n注意安全'),
('训练游泳池', 'swimming', '25米训练池，适合游泳教学和日常训练', 100, 'available', '["https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800"]', '请提前预约\n请佩戴泳帽');

-- 8. 健身房
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('综合健身房', 'fitness', '大型综合健身房，配备各类力量器械、有氧设备和自由重量区', 150, 'available', '["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"]', '请提前预约\n请穿运动服装'),
('瑜伽室', 'fitness', '专业瑜伽教室，配备瑜伽垫、镜墙和音响设备', 40, 'available', '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"]', '请提前预约\n请自备瑜伽垫'),
('动感单车室', 'fitness', '动感单车专用教室，30台单车，配备音响和灯光系统', 30, 'available', '["https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800"]', '请提前预约\n请穿运动服装');

-- 9. 田径场
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('标准田径场', 'running', '400米标准塑胶跑道，8道次，内设足球场，配备跳远、跳高等设施', 1000, 'available', '["https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800"]', '免费开放\n请穿运动鞋');

-- 10. 武术馆
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('武术训练馆', 'martialarts', '专业武术训练场地，配备地垫、沙袋、木人桩等设施', 80, 'available', '["https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800"]', '请提前预约\n请穿武术服装');

-- 11. 攀岩馆
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('室内攀岩馆', 'other', '室内攀岩墙，高度15米，多条难度线路，配备安全装备', 50, 'available', '["https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800"]', '请提前预约\n必须使用安全装备');

-- 12. 壁球馆
INSERT INTO `venues` (`name`, `category`, `description`, `capacity`, `status`, `images`, `notice`) VALUES
('壁球馆', 'other', '4间标准壁球室，配备专业地板和照明', 16, 'available', '["https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800"]', '请提前预约\n请自备球拍');

-- ----------------------------
-- 场地区域数据 (venue_areas)
-- ----------------------------

-- 室内篮球馆A的区域 (venue_id = 1)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(1, 'A区全场', 100, 0, 0),
(1, 'A区东半场', 50, 0, 0),
(1, 'A区西半场', 50, 0, 0);

-- 室内篮球馆B的区域 (venue_id = 2)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(2, 'B区全场', 100, 0, 0),
(2, 'B区东半场', 50, 0, 0),
(2, 'B区西半场', 50, 0, 0);

-- 室外篮球场的区域 (venue_id = 3)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(3, '1号场地', 25, 0, 0),
(3, '2号场地', 25, 0, 0),
(3, '3号场地', 25, 0, 0),
(3, '4号场地', 25, 0, 0);

-- 标准足球场的区域 (venue_id = 4)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(4, '全场', 500, 0, 0);

-- 五人制足球场A的区域 (venue_id = 5)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(5, '1号场', 50, 0, 0);

-- 五人制足球场B的区域 (venue_id = 6)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(6, '1号场', 25, 0, 0),
(6, '2号场', 25, 0, 0);

-- 羽毛球馆的区域 (venue_id = 7)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(7, '1号场地', 10, 0, 0),
(7, '2号场地', 10, 0, 0),
(7, '3号场地', 10, 0, 0),
(7, '4号场地', 10, 0, 0),
(7, '5号场地', 10, 0, 0),
(7, '6号场地', 10, 0, 0),
(7, '7号场地', 10, 0, 0),
(7, '8号场地', 10, 0, 0),
(7, '9号场地', 10, 0, 0),
(7, '10号场地', 10, 0, 0),
(7, '11号场地', 10, 0, 0),
(7, '12号场地', 10, 0, 0);

-- 乒乓球馆的区域 (venue_id = 8)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(8, '1号台', 4, 0, 0),
(8, '2号台', 4, 0, 0),
(8, '3号台', 4, 0, 0),
(8, '4号台', 4, 0, 0),
(8, '5号台', 4, 0, 0),
(8, '6号台', 4, 0, 0),
(8, '7号台', 4, 0, 0),
(8, '8号台', 4, 0, 0),
(8, '9号台', 4, 0, 0),
(8, '10号台', 4, 0, 0),
(8, '11号台', 4, 0, 0),
(8, '12号台', 4, 0, 0),
(8, '13号台', 4, 0, 0),
(8, '14号台', 4, 0, 0),
(8, '15号台', 4, 0, 0),
(8, '16号台', 4, 0, 0),
(8, '17号台', 4, 0, 0),
(8, '18号台', 4, 0, 0),
(8, '19号台', 4, 0, 0),
(8, '20号台', 4, 0, 0);

-- 室外网球场的区域 (venue_id = 9)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(9, '1号场地', 20, 0, 0),
(9, '2号场地', 20, 0, 0),
(9, '3号场地', 20, 0, 0),
(9, '4号场地', 20, 0, 0);

-- 室内网球馆的区域 (venue_id = 10)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(10, '1号场地', 50, 0, 0),
(10, '2号场地', 50, 0, 0);

-- 室内排球馆的区域 (venue_id = 11)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(11, '全场', 150, 0, 0);

-- 沙滩排球场的区域 (venue_id = 12)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(12, '1号场地', 25, 0, 0),
(12, '2号场地', 25, 0, 0);

-- 标准游泳馆的区域 (venue_id = 13)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(13, '1-2泳道', 75, 0, 0),
(13, '3-4泳道', 75, 0, 0),
(13, '5-6泳道', 75, 0, 0),
(13, '7-8泳道', 75, 0, 0);

-- 训练游泳池的区域 (venue_id = 14)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(14, '浅水区', 50, 0, 0),
(14, '深水区', 50, 0, 0);

-- 综合健身房的区域 (venue_id = 15)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(15, '力量训练区', 50, 0, 0),
(15, '有氧训练区', 50, 0, 0),
(15, '自由重量区', 50, 0, 0);

-- 瑜伽室的区域 (venue_id = 16)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(16, '瑜伽教室', 40, 0, 0);

-- 动感单车室的区域 (venue_id = 17)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(17, '单车教室', 30, 0, 0);

-- 标准田径场的区域 (venue_id = 18)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(18, '跑道1-2道', 200, 0, 0),
(18, '跑道3-4道', 200, 0, 0),
(18, '跑道5-6道', 200, 0, 0),
(18, '跑道7-8道', 200, 0, 0),
(18, '内场足球区', 200, 0, 0);

-- 武术训练馆的区域 (venue_id = 19)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(19, '训练区A', 40, 0, 0),
(19, '训练区B', 40, 0, 0);

-- 室内攀岩馆的区域 (venue_id = 20)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(20, '初级线路区', 20, 0, 0),
(20, '中级线路区', 15, 0, 0),
(20, '高级线路区', 15, 0, 0);

-- 壁球馆的区域 (venue_id = 21)
INSERT INTO `venue_areas` (`venue_id`, `name`, `capacity`, `in_use`, `maintenance`) VALUES
(21, '1号室', 4, 0, 0),
(21, '2号室', 4, 0, 0),
(21, '3号室', 4, 0, 0),
(21, '4号室', 4, 0, 0);
