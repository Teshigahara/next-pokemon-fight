import { hover } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

export const SideNavigation = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav
        style={{
          width: '240px',
          backgroundColor: '#7982a9',
          color: 'white',
          padding: '20px',
          position: 'fixed', // スクロールしても固定
          height: '100vh',
        }}
      >
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
          Next Pokemon App
        </h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={navItemStyle}>
            <Link href="/">🏠 ホーム</Link>
          </li>
          <li style={navItemStyle}>
            <Link href="/encyclopedia">📖 ポケモン図鑑</Link>
          </li>
          <li style={navItemStyle}>
            <Link href="/fight">⚔️ 対戦ツール</Link>
          </li>
          <li style={navItemStyle}>⚙️ 設定</li>
        </ul>
      </nav>
    </div>
  );
};

// 簡易的なスタイル変数
const navItemStyle = {
  padding: '12px 15px',
  cursor: 'pointer',
  borderRadius: '4px',
  marginBottom: '8px',
};
