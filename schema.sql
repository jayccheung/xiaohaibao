-- 小海豹 D1 数据库结构
-- 在 Cloudflare Dashboard > D1 > xiaohaibao > Console 执行

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user',          -- 'user' | 'agent' | 'admin'
  deepseek_key TEXT,                          -- 加密存储
  image2_key TEXT,                            -- 加密存储
  credit_balance INTEGER NOT NULL DEFAULT 0,  -- 积分余额
  agent_id TEXT,                              -- 邀请人 user id
  agent_key_share INTEGER NOT NULL DEFAULT 0, -- 0/1 是否允许被邀请人使用代理 Key
  agent_deepseek_key TEXT,                    -- 代理自己的 DeepSeek Key
  agent_image2_key TEXT,                      -- 代理自己的 Image2 Key
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 作品表
CREATE TABLE IF NOT EXISTS works (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '生活',
  ratio TEXT NOT NULL DEFAULT '3:4',
  content TEXT NOT NULL DEFAULT '',
  plan_data TEXT,                             -- JSON: DeepSeek 策划结果
  result_url TEXT,                            -- R2 中生成海报的 URL
  status TEXT NOT NULL DEFAULT 'pending',     -- 'pending'|'generating'|'completed'|'failed'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- AI 调用日志
CREATE TABLE IF NOT EXISTS ai_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,                     -- 'deepseek' | 'image2'
  key_source TEXT NOT NULL,                   -- 'self' | 'agent' | 'platform'
  key_owner_id TEXT,
  credit_cost INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',     -- 'pending'|'success'|'failed'
  error_msg TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 积分充值记录
CREATE TABLE IF NOT EXISTS credit_top_ups (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',      -- 'manual'|'wechat'|'alipay'|'agent_reward'
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 邀请码表
CREATE TABLE IF NOT EXISTS invite_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  created_by TEXT NOT NULL,                   -- 管理员 user id
  max_uses INTEGER NOT NULL DEFAULT 1,        -- 最大使用次数
  used_count INTEGER NOT NULL DEFAULT 0,      -- 已使用次数
  active INTEGER NOT NULL DEFAULT 1,          -- 是否有效
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 邀请码使用记录
CREATE TABLE IF NOT EXISTS invite_code_uses (
  id TEXT PRIMARY KEY,
  code_id TEXT NOT NULL,
  used_by TEXT NOT NULL,
  used_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (code_id) REFERENCES invite_codes(id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_works_user ON works(user_id);
CREATE INDEX IF NOT EXISTS idx_works_status ON works(status);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user ON ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON ai_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_users_agent ON users(agent_id);
