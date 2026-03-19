import React from 'react';

const statLabels: Record<string, string> = {
  hp: 'HP',
  attack: '攻撃',
  defense: '防御',
  special_attack: '特攻',
  special_defense: '特防',
  speed: '素早さ',
};

export const StatsModal = ({ stats }: { stats: Record<string, number> }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md max-w-[200px] max-h-[150px]">
      <ul className="space-y-2">
        {Object.entries(stats).map(([key, value]) => (
          <li key={key} className="flex justify-between">
            <span>{statLabels[key] || key}:</span>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
