// 配置常量

export const CONFIG = {
  // 积分消耗标准
  CREDIT_COST: {
    DEEPSEEK_PLAN: 1,     // DeepSeek 策划一次 = 1 积分
    IMAGE2_GENERATE: 10,  // Image2 生图一次 = 10 积分
  },

  // 积分套餐（预定义，后续对接支付时用）
  CREDIT_PACKAGES: [
    { amount: 100,  price: 9.9,  label: '100 积分' },
    { amount: 500,  price: 39.9, label: '500 积分（推荐）' },
    { amount: 1200, price: 79.9, label: '1200 积分' },
  ],

  // 平台名称
  APP_NAME: '小海豹',
  APP_URL: 'https://xiaohaibao.pages.dev',
}
