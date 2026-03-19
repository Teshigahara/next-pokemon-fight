'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getPokemon } from '../_lib/get-pokemon';
import { CheckPokemonModal } from './CheckPokemonModal';
import SelectPokemon from './SelectPokemon';
import { StatsModal } from './StatsModal';
import type { PokemonType } from '../_types/SelectedPokemon';
import { ActionCommandModal } from './ActionCommandModal';

export const Fight = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonType | null>(
    null,
  );
  // 選択したポケモンを確認ステータス
  const [checkPokemonFlag, setCheckPokemonFlag] = useState<boolean>(false);
  // 敵のポケモン
  const [enemyPokemon, setEnemyPokemon] = useState<PokemonType | null>(null);

  useEffect(() => {
    console.log(selectedPokemon);
    if (!checkPokemonFlag || !selectedPokemon || enemyPokemon) return;
    (async () => {
      const pokemon = await getPokemon('blastoise');
      setEnemyPokemon(pokemon);
    })();
  }, [checkPokemonFlag, enemyPokemon, selectedPokemon]);

  // useEffect(() => {
  //   enemyPokemon?.stats.hp === 0 && alert('勝利！');
  //   selectedPokemon?.stats.hp === 0 && alert('敗北！');
  // }, [enemyPokemon, selectedPokemon]);

  const handleAttack = () => {
    const attackValue = selectedPokemon ? selectedPokemon.stats.attack - 10 : 0;
    console.log('攻撃', attackValue);
    const newHp =
      enemyPokemon?.stats.hp !== undefined
        ? Math.max(enemyPokemon?.stats.hp - attackValue, 0)
        : 0;
    setEnemyPokemon((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          hp: newHp,
        },
      };
    });
    if (newHp === 0) {
      alert('勝利！');
      resetData();
    }
  };

  const resetData = () => {
    setSelectedPokemon(null);
    setCheckPokemonFlag(false);
    setEnemyPokemon(null);
  };

  // 選択したポケモンの確認
  if (selectedPokemon && !checkPokemonFlag) {
    return (
      <CheckPokemonModal
        selectedPokemon={selectedPokemon}
        setCheckPokemonFlag={setCheckPokemonFlag}
        setSelectedPokemon={setSelectedPokemon}
      />
    );
  }

  // 戦闘スタート
  if (checkPokemonFlag && selectedPokemon) {
    return (
      <>
        {/* 相手のポケモン */}
        {enemyPokemon?.sprites.front_default ? (
          <>
            <StatsModal stats={enemyPokemon.stats} />
            <Image
              src={enemyPokemon.sprites.front_default}
              alt={enemyPokemon.name}
              width={96}
              height={96}
            />
          </>
        ) : null}

        {/* 自分のポケモン */}
        {selectedPokemon.sprites.back_default ? (
          <>
            <Image
              src={selectedPokemon.sprites.back_default}
              alt={selectedPokemon.name}
              width={96}
              height={96}
            />
            <StatsModal stats={selectedPokemon.stats} />
            <ActionCommandModal handleAttack={handleAttack} />
          </>
        ) : null}
      </>
    );
  }

  return (
    <div>
      <h1>ポケモンを選択してください</h1>
      <SelectPokemon setSelectedPokemon={setSelectedPokemon} />
    </div>
  );
};
