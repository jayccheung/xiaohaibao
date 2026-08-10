// 数据库表结构 - 预埋双轨制 + 代理体系
// 当前 MVP 只用到 user + work，其余字段空着不报错即可

// === 用户表 ===
export const userSchema = {
  id: 'text',                    // UUID
  email: 'text',                // 邮箱
  name: 'text',                 // 昵称
  role: 'text',                 // 'user' | 'agent' | 'admin'

  // 双轨制：用户可选的 AI 调用方式
  deepseekKey: 'text',          // 用户自填 Key（加密存储），null 表示未填
  image2Key: 'text',            // 用户自填 Key（加密存储）
  creditBalance: 'integer',     // 积分余额，0 表示无积分

  // 代理体系
  agentId: 'text',              // 邀请人的 user id，null 表示自然注册
  agentKeyShare: 'boolean',     // 是否允许被邀请人使用代理的 Key

  // 代理自己的 Key（当 role=agent 时）
  agentDeepseekKey: 'text',     // 代理提供的 DeepSeek Key
  agentImage2Key: 'text',       // 代理提供的 Image2 Key

  createdAt: 'text',
  updatedAt: 'text',
}

// === AI 调用记录 ===
export const aiLogSchema = {
  id: 'text',
  userId: 'text',
  provider: 'text',             // 'deepseek' | 'image2'
  keySource: 'text',            // 'self' | 'agent' | 'platform' ← 双轨制的核心
  keyOwnerId: 'text',           // 实际 Key 所属用户 ID
  creditCost: 'integer',        // 本次消耗积分（0 = 用自备 Key）
  status: 'text',               // 'pending' | 'success' | 'failed'
  createdAt: 'text',
}

// === 积分充值记录 ===
export const creditTopUpSchema = {
  id: 'text',
  userId: 'text',
  amount: 'integer',            // 充值积分数量
  source: 'text',               // 'wechat' | 'alipay' | 'agent_reward'
  status: 'text',               // 'pending' | 'completed'
  createdAt: 'text',
}

// === 作品表 ===
export const workSchema = {
  id: 'text',
  userId: 'text',
  title: 'text',
  category: 'text',
  ratio: 'text',
  content: 'text',              // 输入原文案
  planData: 'text',             // JSON: DeepSeek 策划结果
  resultUrl: 'text',            // 生成的海报 URL
  status: 'text',               // 'pending' | 'generating' | 'completed' | 'failed'
  createdAt: 'text',
}
