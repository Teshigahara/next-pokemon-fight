import { useState } from 'react';
import { PokemonType } from '../_types/SelectedPokemon';
import { AttackMotionHandle } from '../components/AttackMotion';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useBattle = (
  player: PokemonType | null,
  enemy: PokemonType | null,
  setEnemy: React.Dispatch<React.SetStateAction<PokemonType | null>>,
  playerRef: React.RefObject<AttackMotionHandle | null>,
  enemyRef: React.RefObject<AttackMotionHandle | null>,
  onVictory: () => void,
) => {
  const [isAttacking, setIsAttacking] = useState(false);

  const handleAttack = async () => {
    if (!player || !enemy || isAttacking) return;

    setIsAttacking(true); // 二重クリック防止

    // 1. 自分の攻撃アニメーション
    playerRef.current?.play();

    // 2. ダメージ計算
    const attackValue = Math.max(player.stats.attack - 10, 0);
    const newHp = Math.max(enemy.stats.hp - attackValue, 0);

    // 3. 敵のHPを更新（反映を待つ必要はないが、状態として保持）
    setEnemy((prev) => {
      if (!prev) return prev;
      return { ...prev, stats: { ...prev.stats, hp: newHp } };
    });

    // 4. 演出のタメ
    await sleep(600);

    // 5. 敵の被ダメージアニメーション
    enemyRef.current?.play();

    // 6. 勝利判定と演出
    if (newHp === 0) {
      await sleep(600);
      await enemyRef.current?.dead();
      alert('勝利！');
      onVictory();
    }

    setIsAttacking(false);
  };

  return { handleAttack, isAttacking };
};
