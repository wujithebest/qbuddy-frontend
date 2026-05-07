import React, { useState, useEffect } from 'react';
import GraphView from './GraphView';
import AnalysisDetail from './AnalysisDetail';
import { GRAPH_DATA } from '../../data/mockData';
import './RightPanel.css';

export default function RightPanel({ role, cards, onQbuddyPhaseChange }) {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [highlightedLinks, setHighlightedLinks] = useState([]);

  // 监听卡片高亮事件
  useEffect(() => {
    const handleHighlight = (event) => {
      const { nodes, edges } = event.detail || {};
      if (nodes) {
        setHighlightedNodes(nodes);
      }
      if (edges) {
        setHighlightedLinks(edges);
      }
    };

    window.addEventListener('qbuddy:highlight', handleHighlight);
    return () => {
      window.removeEventListener('qbuddy:highlight', handleHighlight);
    };
  }, []);

  useEffect(() => {
    if (role && cards && cards.length > 0) {
      const scenario = cards[0];
      setCurrentScenario(scenario);
      
      // 提取高亮节点
      const nodes = scenario.highlight || [];
      setHighlightedNodes(prev => prev.length > 0 ? prev : nodes);
      
      // 高亮相关连接
      const links = nodes.map(node => node);
      setHighlightedLinks(prev => prev.length > 0 ? prev : links);
    }
  }, [role?.id, cards]);

  // 直接使用mockData中的图谱数据，不再监听SSE更新
  const finalGraphData = role ? GRAPH_DATA[role.id] : null;

  return (
    <div className="right-panel panel">
      <div className="panel-header">
        <span>📊 关系分析</span>
      </div>
      <div className="panel-content">
        <div className="graph-section">
          <h3 className="section-title">🕸️ 关系图谱</h3>
          <div className="graph-container">
            <GraphView 
              role={role}
              graphData={finalGraphData}
              highlightedNodes={highlightedNodes}
              highlightedLinks={highlightedLinks}
            />
            {/* 图例 - 移到graph-container外层，使用fixed相对于panel定位 */}
            <div className="graph-legend">
              <div className="legend-title">图例</div>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-dot user-gradient"></div>
                  <span>当前用户</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot unified-blue"></div>
                  <span>联系人/事件</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot highlighted"></div>
                  <span>触发节点</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="analysis-section">
          <h3 className="section-title">🔍 场景分析</h3>
          <AnalysisDetail 
            scenario={currentScenario}
            role={role}
          />
        </div>
      </div>
    </div>
  );
}
