// API服务封装
const API_BASE = 'https://qbuddy-backend-production.up.railway.app/api';

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 通用请求方法
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('API请求失败，使用mock数据:', error.message);
    return null;
  }
}

// API接口
export const api = {
  // 初始化角色数据
  async initialize() {
    const result = await request('/initialize', { method: 'POST' });
    return result;
  },
  
  // 获取角色画像
  async getProfile(roleId) {
    const result = await request(`/profile/${roleId}`);
    return result;
  },
  
  // 触发场景检测
  async triggerScenario(params) {
    const result = await request('/qbuddy/trigger', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // 用户操作
  async submitAction(params) {
    const result = await request('/qbuddy/action', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // LLM提取群消息
  async extractMessages(messages) {
    const result = await request('/llm/extract', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
    return result;
  },
  
  // 生成祝福
  async generateBlessing(params) {
    const result = await request('/llm/blessing', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // 生成问候
  async generateGreeting(params) {
    const result = await request('/llm/greeting', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // 获取图谱数据
  async getGraphData(roleId) {
    const result = await request(`/graph/${roleId}`);
    return result;
  },
  
  // 自定义角色
  async customizeRole(params) {
    const result = await request('/customize', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // QBuddy聊天 - 发送消息获取回复
  async qbuddyChat(message, role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': password,
        },
        body: JSON.stringify({ message, role }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('聊天API调用失败:', error.message);
      return null;
    }
  },
  
  // 聊天回复 - 生成上下文感知的回复
  async chatReply(params) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/chat/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': password,
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('聊天回复API调用失败:', error.message);
      return null;
    }
  },

  // ============ QBuddy 新版 API（8个步骤） ============

  // 初始化 QBuddy 服务（步骤1-3）
  async qbuddyInit(role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': password,
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('QB初始化API调用失败:', error.message);
      return null;
    }
  },

  // 获取用户 skill.md（步骤2）
  async getUserSkill(role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/skill?role=${role}`, {
        headers: { 'X-Access-Password': password },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('获取skill API调用失败:', error.message);
      return null;
    }
  },

  // 启动后台服务（步骤4-5）
  async startBackgroundServices(role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/background/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': password,
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('启动后台服务API调用失败:', error.message);
      return null;
    }
  },

  // 停止后台服务
  async stopBackgroundServices() {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/background/stop`, {
        method: 'POST',
        headers: { 'X-Access-Password': password },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('停止后台服务API调用失败:', error.message);
      return null;
    }
  },

  // 获取待处理告警（步骤5：用于闪亮提醒）
  async getAlerts(role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/alerts?role=${role}`, {
        headers: { 'X-Access-Password': password },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('获取告警API调用失败:', error.message);
      return null;
    }
  },

  // 获取推送卡片（步骤6）
  async getPushCards(role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/push-cards?role=${role}`, {
        headers: { 'X-Access-Password': password },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('获取推送卡片API调用失败:', error.message);
      return null;
    }
  },

  // QBuddy 对话 v2（步骤7：Tool Calling）
  async qbuddyChatV2(message, role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/chat-v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': password,
        },
        body: JSON.stringify({ message, role }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('QB对话v2 API调用失败:', error.message);
      return null;
    }
  },

  // 记录用户反馈（步骤8：动态阈值调整）
  async recordFeedback(role, cardType, action, interacted) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': password,
        },
        body: JSON.stringify({ role, card_type: cardType, action, interacted }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('记录反馈API调用失败:', error.message);
      return null;
    }
  },

  // 获取阈值配置
  async getThresholds(role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/thresholds?role=${role}`, {
        headers: { 'X-Access-Password': password },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('获取阈值API调用失败:', error.message);
      return null;
    }
  },

  // 重置阈值
  async resetThresholds(role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/thresholds/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': password,
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('重置阈值API调用失败:', error.message);
      return null;
    }
  },
};

export default api;
