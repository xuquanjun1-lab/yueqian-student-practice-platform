-- Optional demonstration data for TencentDB for MySQL.
-- Run schema.sql before this file.

INSERT INTO skills (name) VALUES
  ('运营'), ('拍摄'), ('剪辑'), ('设计'), ('活动执行'), ('运动健身')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO employers (name, verification_status) VALUES
  ('元气咖啡实验室', 'verified'),
  ('野生植物社', 'verified'),
  ('城市跑团', 'verified')
ON DUPLICATE KEY UPDATE verification_status = VALUES(verification_status);

INSERT INTO jobs (
  employer_id, title, description, requirements, risk_notice, location, work_time,
  settlement_terms, compensation_cents, headcount, status, application_deadline
)
SELECT id, '咖啡体验短视频拍摄',
  '到店拍摄咖啡制作、顾客体验和空间氛围，交付 6 条可剪辑短视频素材。',
  '会基础手机拍摄；自带可用设备；可提前 15 分钟到店沟通。',
  '不收取任何押金或设备租金；确认前请只在平台内沟通。',
  '上海 · 静安', '10 月 4 日 10:00-18:00', '次日结算', 26000, 1, 'published', '2026-10-03 18:00:00'
FROM employers WHERE name = '元气咖啡实验室'
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO jobs (
  employer_id, title, description, requirements, risk_notice, location, work_time,
  settlement_terms, compensation_cents, headcount, status, application_deadline
)
SELECT id, '品牌账号内容运营',
  '协助整理选题、撰写发布文案，并完成一周内容排期的基础协作。',
  '有公众号、小红书或视频号运营经验；能提交过往作品或案例。',
  '商家已通过平台审核；确认范围、交付时间和修改次数后再接单。',
  '杭州 · 可远程', '10 月 9 日前完成', '验收后 3 个工作日结算', 18000, 2, 'published', '2026-10-08 18:00:00'
FROM employers WHERE name = '野生植物社'
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO jobs (
  employer_id, title, description, requirements, risk_notice, location, work_time,
  settlement_terms, compensation_cents, headcount, status, application_deadline
)
SELECT id, '运动社群活动协作',
  '协助签到、补给、路线引导与活动现场记录，服务约 80 位参与者。',
  '能早起到场；熟悉基础活动执行；有运动社群经验优先。',
  '活动为公开路线；请自行评估身体状况，并按现场安全指引执行。',
  '深圳 · 南山', '10 月 12 日 07:00-12:00', '活动结束当日结算', 19000, 3, 'published', '2026-10-11 18:00:00'
FROM employers WHERE name = '城市跑团'
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO job_skills (job_id, skill_id)
SELECT jobs.id, skills.id
FROM jobs CROSS JOIN skills
WHERE (jobs.title = '咖啡体验短视频拍摄' AND skills.name = '拍摄')
   OR (jobs.title = '品牌账号内容运营' AND skills.name = '运营')
   OR (jobs.title = '运动社群活动协作' AND skills.name = '活动执行')
ON DUPLICATE KEY UPDATE job_id = VALUES(job_id);
