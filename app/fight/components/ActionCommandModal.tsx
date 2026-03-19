import React from 'react';

export const ActionCommandModal = ({
  handleAttack,
  isDisabled,
}: {
  handleAttack: () => void;
  isDisabled: boolean;
}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md max-w-[200px] max-h-[150px]">
      <ul className="space-y-2">
        <li key="attack" className="flex justify-between">
          <button onClick={handleAttack} disabled={isDisabled}>
            攻撃
          </button>
        </li>
        <li key="defense" className="flex justify-between">
          <button onClick={() => console.log('防御')} disabled={isDisabled}>
            防御
          </button>
        </li>
      </ul>
    </div>
  );
};
