-- 邻里圈测试数据脚本
-- 使用数据库: neighborhood_circle_dev
-- 执行方式: mysql -h rm-bp1lc5ao7288z3c2n5o.mysql.rds.aliyuncs.com -u backend -pMiga0818 neighborhood_circle_dev < scripts/seed_test_data.sql

USE neighborhood_circle_dev;

-- 清空现有数据（如果需要重新初始化）
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE applications;
TRUNCATE TABLE reviews;
TRUNCATE TABLE tasks;
TRUNCATE TABLE users;
TRUNCATE TABLE circles;
SET FOREIGN_KEY_CHECKS = 1;

-- 插入测试用户数据
INSERT INTO users (id, created_at, updated_at, open_id, nickname, avatar_url, bio, balance, frozen_balance, level, experience, credit_score, publish_count, claim_count, complete_count, collect_count, verified, tags, reputation) VALUES
(1, NOW(), NOW(), 'test_user_001', '热心的小张', 'https://i.pravatar.cc/150?img=1', '乐于助人，诚信为本', 268.50, 0, 5, 1250, 135, 15, 20, 18, 5, 1, '["靠谱","速度快","热心"]', 100),
(2, NOW(), NOW(), 'test_user_002', '邻家小李', 'https://i.pravatar.cc/150?img=2', '有爱心的好邻居', 150.00, 0, 3, 680, 110, 8, 12, 10, 3, 1, '["友好","细心"]', 100),
(3, NOW(), NOW(), 'test_user_003', '爱心妈妈', 'https://i.pravatar.cc/150?img=5', '喜欢宠物，有耐心', 320.00, 50, 4, 950, 125, 12, 15, 14, 8, 1, '["有爱心","耐心"]', 100),
(4, NOW(), NOW(), 'test_user_004', '修理工老王', 'https://i.pravatar.cc/150?img=12', '10年维修经验', 500.00, 0, 6, 1800, 145, 25, 30, 28, 2, 1, '["专业","经验丰富"]', 100),
(5, NOW(), NOW(), 'test_user_005', '大学生小陈', 'https://i.pravatar.cc/150?img=8', '勤快好学', 80.00, 0, 2, 350, 100, 5, 8, 7, 1, 0, '["勤快","便宜"]', 100),
(6, NOW(), NOW(), 'test_user_006', '上班族小刘', 'https://i.pravatar.cc/150?img=15', '每天往返国贸', 200.00, 0, 3, 600, 115, 6, 10, 9, 4, 1, '["准时","顺路"]', 100),
(7, NOW(), NOW(), 'test_user_007', '宠物达人', 'https://i.pravatar.cc/150?img=23', '家有三只猫两只狗', 380.00, 0, 5, 1100, 130, 18, 22, 20, 10, 1, '["爱宠物","专业"]', 100),
(8, NOW(), NOW(), 'test_user_008', '美食博主', 'https://i.pravatar.cc/150?img=29', '分享美食是快乐', 150.00, 0, 4, 850, 120, 10, 12, 11, 6, 1, '["手艺好","分享"]', 100);

-- 插入小区数据
INSERT INTO circles (id, created_at, updated_at, name, latitude, longitude, address) VALUES
(1, NOW(), NOW(), '阳光花园小区', 31.2304, 121.4737, '上海市浦东新区阳光路123号');

-- 插入任务数据

-- 代取快递任务
INSERT INTO tasks (created_at, updated_at, title, description, price, status, type, latitude, longitude, location, urgency, view_count, applicant_count, creator_id, circle_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW(), '帮忙取个菜鸟驿站的快递', '我今天加班，菜鸟驿站6点就关门了，麻烦帮我取一下快递，取货码：6688。驿站在小区东门，我住在3号楼。', 10.0, 'pending', 'express', 31.2310, 121.4740, '3号楼', 0, 12, 2, 1, 1),
(DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW(), '代收京东快递，明天送达', '明天有个京东快递送达，但是我要出差，麻烦帮我代收一下，回来给您送过去！', 15.0, 'pending', 'express', 31.2305, 121.4735, '5号楼', 1, 8, 1, 2, 1);

-- 宠物照顾任务
INSERT INTO tasks (created_at, updated_at, title, description, price, status, type, latitude, longitude, location, urgency, view_count, applicant_count, creator_id, circle_id) VALUES
(DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW(), '周末帮忙遛狗2小时', '家里的金毛很乖，需要有人周末帮忙遛狗，时间是下午3-5点。狗狗很温顺，不咬人，希望找个喜欢狗狗的朋友！', 50.0, 'pending', 'pet', 31.2315, 121.4745, '8号楼', 0, 25, 5, 3, 1),
(DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), '急需寄养小猫3天', '突然要出差3天，家里小猫需要人照顾，猫粮猫砂都准备好了。猫很乖，不用太操心，主要是喂食换水就行。', 100.0, 'claimed', 'pet', 31.2308, 121.4738, '2号楼', 1, 18, 3, 7, 1);

-- 顺风车任务
INSERT INTO tasks (created_at, updated_at, title, description, price, status, type, latitude, longitude, location, urgency, view_count, applicant_count, creator_id, circle_id) VALUES
(DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW(), '明早8点去望京上班求顺风', '明天早上8点从小区出发去望京SOHO上班，求顺风车！可以给油费和早餐钱～', 30.0, 'pending', 'carpool', 31.2312, 121.4742, '1号楼', 0, 15, 2, 6, 1),
(DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW(), '每天下午5点从中关村回小区', '长期拼车，每天下午5点左右从中关村回小区，可以固定拼车，AA油费。', 25.0, 'pending', 'carpool', 31.2318, 121.4748, '10号楼', 0, 32, 4, 6, 1);

-- 二手买卖任务
INSERT INTO tasks (created_at, updated_at, title, description, price, status, type, latitude, longitude, location, urgency, view_count, applicant_count, creator_id, circle_id) VALUES
(DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), '转让九成新宜家书架', '搬家了，转让宜家书架一个，九成新，原价299元，现在100元转让。需要自提，我可以帮忙搬到楼下。', 100.0, 'pending', 'secondhand', 31.2320, 121.4750, '12号楼', 0, 45, 8, 4, 1),
(DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), '儿童自行车转让，适合3-6岁', '孩子大了不骑了，八成新的儿童自行车转让，品牌是迪卡侬，质量很好。原价388，现价150。', 150.0, 'pending', 'secondhand', 31.2306, 121.4736, '4号楼', 0, 28, 3, 3, 1);

-- 维修服务任务
INSERT INTO tasks (created_at, updated_at, title, description, price, status, type, latitude, longitude, location, urgency, view_count, applicant_count, creator_id, circle_id) VALUES
(DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW(), '厨房水龙头漏水需要修理', '厨房水龙头漏水很严重，需要专业师傅来修理一下。最好今天或明天能来，谢谢！', 80.0, 'pending', 'repair', 31.2314, 121.4744, '7号楼', 1, 20, 2, 5, 1),
(DATE_SUB(NOW(), INTERVAL 3 DAY), NOW(), '电脑系统重装和软件安装', '电脑很卡，想重装系统和安装一些办公软件，求懂电脑的朋友帮忙。可以上门或者我送到您家里。', 100.0, 'completed', 'repair', 31.2311, 121.4741, '6号楼', 0, 16, 1, 8, 1);

-- 保洁服务任务
INSERT INTO tasks (created_at, updated_at, title, description, price, status, type, latitude, longitude, location, urgency, view_count, applicant_count, creator_id, circle_id) VALUES
(DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW(), '周末大扫除需要帮手', '家里太久没打扫了，周末想做个大扫除，需要一个帮手一起，预计3-4小时。主要是擦窗户、拖地等。', 120.0, 'pending', 'cleaning', 31.2309, 121.4739, '5号楼', 0, 22, 4, 1, 1);

-- 美食分享任务
INSERT INTO tasks (created_at, updated_at, title, description, price, status, type, latitude, longitude, location, urgency, view_count, applicant_count, creator_id, circle_id) VALUES
(DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW(), '自制蛋糕分享，免费送', '做了太多蛋糕，吃不完想分享给邻居，有红丝绒和提拉米苏，免费送！先到先得～', 0.0, 'pending', 'food', 31.2316, 121.4746, '9号楼', 0, 88, 15, 8, 1),
(DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW(), '小区拼团买水果，还差2人', '在生鲜平台拼团买水果，现在还差2人成团，价格超实惠！有兴趣的邻居快来～', 0.0, 'pending', 'food', 31.2307, 121.4737, '3号楼', 1, 35, 6, 2, 1);

-- 其他帮助任务
INSERT INTO tasks (created_at, updated_at, title, description, price, status, type, latitude, longitude, location, urgency, view_count, applicant_count, creator_id, circle_id) VALUES
(DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW(), '借梯子用一下，半小时归还', '需要换灯泡，想借个梯子用一下，半小时内归还。就在同一栋楼，非常近！', 0.0, 'pending', 'other', 31.2313, 121.4743, '7号楼', 0, 8, 2, 5, 1),
(DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW(), '帮忙教小朋友作业，数学', '孩子五年级，数学题不会做，求数学好的朋友帮忙辅导一下，大概1小时。可以线上或者上门。', 80.0, 'pending', 'other', 31.2319, 121.4749, '11号楼', 0, 19, 3, 3, 1);

-- 插入评价数据（针对已完成的任务）
INSERT INTO reviews (created_at, updated_at, task_id, reviewer_id, reviewee_id, rating, content, type) VALUES
(DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), 10, 4, 8, 5, '服务很好，很专业，电脑速度快多了！强烈推荐！', 'executor');

-- 插入申请数据
INSERT INTO applications (created_at, updated_at, task_id, user_id, message, status) VALUES
(DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW(), 1, 5, '我就在小区，可以帮您取快递！', 'pending'),
(DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW(), 1, 2, '我下班顺路，可以帮忙！', 'pending'),
(DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW(), 3, 7, '我很喜欢狗狗，经常遛自己家的金毛，可以帮忙！', 'pending'),
(DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), 4, 7, '我家里有猫，很有经验，可以帮忙照顾！', 'accepted');

-- 显示插入结果
SELECT '✅ 测试数据插入完成！' AS status;
SELECT CONCAT('用户数量: ', COUNT(*)) AS info FROM users;
SELECT CONCAT('任务数量: ', COUNT(*)) AS info FROM tasks;
SELECT CONCAT('评价数量: ', COUNT(*)) AS info FROM reviews;
SELECT CONCAT('申请数量: ', COUNT(*)) AS info FROM applications;
