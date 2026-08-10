// API 路由清单 - 预埋架构

export const API = {
  // 认证
  auth: {
    signIn:  'POST   /api/auth/sign-in/email',
    signUp:  'POST   /api/auth/sign-up/email',
    signOut: 'POST   /api/auth/sign-out',
  },

  // 设置（用户自填 Key / 代理填 Key）
  settings: {
    get:      'GET    /api/settings',
    deepseek: 'POST   /api/settings/deepseek',    // { deepseekKey }
    image2:   'POST   /api/settings/image2',       // { image2Key }
    // 代理专属
    agentKey: 'POST   /api/settings/agent-key',    // { provider, key, shareEnabled }
  },

  // AI 调用（通过 key-resolver 决定用谁的 Key）
  ai: {
    plan:       'POST /api/ai/plan',         // DeepSeek 策划
    generate:   'POST /api/image/generations', // Image2 生图
    taskStatus: 'GET  /api/image/tasks/:id',
  },

  // 作品
  works: {
    list:   'GET    /api/works',
    detail: 'GET    /api/works/:id',
    delete: 'DELETE /api/works/:id',
  },

  // 积分（预埋）
  credits: {
    balance:  'GET    /api/credits/balance',
    topUp:    'POST   /api/credits/top-up',
    history:  'GET    /api/credits/history',
  },

  // 参考图
  assets: {
    upload:    'POST   /api/assets/upload',
    list:      'GET    /api/assets/references',
    delete:    'DELETE /api/assets/references/:id',
  },

  // 代理专用
  agent: {
    inviteLink: 'GET    /api/agent/invite-link',    // 获取邀请链接
    invitees:   'GET    /api/agent/invitees',        // 被邀请人列表
    stats:      'GET    /api/agent/stats',            // 用量统计
  },
}
