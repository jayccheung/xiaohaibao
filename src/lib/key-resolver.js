// API Key 解析器 - 双轨制核心
// 调用任何 AI 服务前，通过此函数决定用谁的 Key

/**
 * 解析 AI 调用使用的 Key 来源
 * @param {string} provider - 'deepseek' | 'image2'
 * @param {object} user - 当前用户对象
 * @param {object|null} agent - 代理用户对象（如果有）
 * @returns {{ key: string, source: 'self'|'agent'|'platform', cost: number }}
 */
export function resolveKey(provider, user, agent) {
  // 优先级 1：用户自己的 Key
  const ownKey = provider === 'deepseek' ? user.deepseekKey : user.image2Key
  if (ownKey) {
    return { key: ownKey, source: 'self', cost: 0 }
  }

  // 优先级 2：代理的 Key（用户被代理邀请 && 代理允许共享）
  const agentKey = provider === 'deepseek'
    ? agent?.agentDeepseekKey
    : agent?.agentImage2Key
  const canUseAgent = user.agentId && agent && agent.agentKeyShare && agentKey
  if (canUseAgent) {
    return { key: agentKey, source: 'agent', cost: 0 }
  }

  // 优先级 3：平台 Key（用户有积分）
  const platformKey = provider === 'deepseek'
    ? process.env.PLATFORM_DEEPSEEK_KEY
    : process.env.PLATFORM_IMAGE2_KEY
  if (user.creditBalance > 0 && platformKey) {
    const cost = provider === 'deepseek' ? 1 : 10  // 策划 1 积分，生图 10 积分
    return { key: platformKey, source: 'platform', cost }
  }

  // 无可用 Key
  return { key: null, source: null, cost: 0 }
}

/**
 * 检查用户是否有可用的 AI 调用方式
 * @returns {{ canUse: boolean, reason: string }}
 */
export function checkAvailability(user, agent) {
  const deepseek = resolveKey('deepseek', user, agent)
  const image2 = resolveKey('image2', user, agent)

  if (!deepseek.key) return { canUse: false, reason: '请配置 DeepSeek API Key 或购买积分' }
  if (!image2.key) return { canUse: false, reason: '请配置 Image2 API Key 或购买积分' }

  return { canUse: true, reason: '' }
}
