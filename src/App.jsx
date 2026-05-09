import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import LoginScreen from './components/LoginScreen/LoginScreen';
import LeftPanel from './components/LeftPanel/LeftPanel';
import QQSimulation from './components/QQSimulation/QQSimulation';
import RightPanel from './components/RightPanel/RightPanel';
import PipelineView from './components/PipelineView/PipelineView';
import { ROLES, QBUGDY_CARDS } from './data/mockData';
import { api } from './services/api';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  // QBuddy扫描阶段状态，用于传递给LeftPanel
  const [qbuddyPhase, setQbuddyPhase] = useState('idle');
  // 顶部视图模式：'product' = 产品体验, 'pipeline' = 技术架构
  const [topViewMode, setTopViewMode] = useState('product');
  // 告警状态 - 用于QBuddy按钮闪亮
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const alertCheckIntervalRef = useRef(null);

  // 定时检查告警
  useEffect(() => {
    const checkAlerts = async () => {
      if (!selectedRole) return;
      
      try {
        const result = await api.getAlerts(selectedRole.id);
        if (result?.data?.has_new_alerts) {
          setHasNewAlerts(true);
          setAlertCount(result.data.alerts?.length || 0);
        }
      } catch (e) {
        // 忽略错误，静默处理
      }
    };
    
    // 登录后开始定时检查
    if (isLoggedIn && selectedRole) {
      // 首次检查
      checkAlerts();
      // 每30秒检查一次
      alertCheckIntervalRef.current = setInterval(checkAlerts, 30000);
    }
    
    return () => {
      if (alertCheckIntervalRef.current) {
        clearInterval(alertCheckIntervalRef.current);
      }
    };
  }, [isLoggedIn, selectedRole]);

  // 清除告警（用户点击QBuddy时）
  const clearAlerts = () => {
    setHasNewAlerts(false);
    setAlertCount(0);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setQbuddyPhase('idle');
    // 切换角色时清除告警
    setHasNewAlerts(false);
    setAlertCount(0);
  };

  const roleCards = selectedRole ? QBUGDY_CARDS[selectedRole.id] || [] : [];

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Analytics />
      </>
    );
  }

  return (
    <div className="app-wrapper">
      {/* 顶部切换栏 */}
      <div className="top-switch-bar">
        <div className="switch-tabs">
          <button 
            className={`switch-tab ${topViewMode === 'product' ? 'active' : ''}`}
            onClick={() => setTopViewMode('product')}
          >
            📱 产品体验
          </button>
          <button 
            className={`switch-tab ${topViewMode === 'pipeline' ? 'active' : ''}`}
            onClick={() => setTopViewMode('pipeline')}
          >
            ⚙️ 技术架构
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      {topViewMode === 'pipeline' ? (
        <PipelineView role={selectedRole} />
      ) : (
        <div className="app-container">
          {/* 左面板 - 直接使用LeftPanel作为面板 */}
          <LeftPanel 
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
            roleId={selectedRole?.id}
            qbuddyPhase={qbuddyPhase}
            hasNewAlerts={hasNewAlerts}
            alertCount={alertCount}
          />

          {/* 中间面板 - QQ仿真 */}
          <div className="center-panel">
            <QQSimulation 
              role={selectedRole}
              onQbuddyPhaseChange={setQbuddyPhase}
              onQbuddyClick={clearAlerts}
            />
          </div>

          {/* 右面板 */}
          <div className="right-panel-wrapper">
            <RightPanel 
              role={selectedRole}
              cards={roleCards}
              onQbuddyPhaseChange={setQbuddyPhase}
            />
          </div>
        </div>
      )}
      <Analytics />
    </div>
  );
}
