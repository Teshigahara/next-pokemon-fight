'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { getPokemon } from '../_lib/get-pokemon';
import { CheckPokemonModal } from './CheckPokemonModal';
import SelectPokemon from './SelectPokemon';
import { StatsModal } from './StatsModal';
import type { PokemonType } from '../_types/SelectedPokemon';
import { ActionCommandModal } from './ActionCommandModal';
import { getRandomPokemonId } from '../_lib/get-randam-pokemon-id';
import AttackMotion, { AttackMotionHandle } from './AttackMotion';
import { set } from 'zod';
import { useBattle } from '../_hooks/useBattle';

export const Fight = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonType | null>(
    null,
  );
  // 選択したポケモンを確認ステータス
  const [checkPokemonFlag, setCheckPokemonFlag] = useState<boolean>(false);
  // 敵のポケモン
  const [enemyPokemon, setEnemyPokemon] = useState<PokemonType | null>(null);
  const playerMotionRef = useRef<AttackMotionHandle>(null);
  const enemyMotionRef = useRef<AttackMotionHandle>(null);

  const resetData = () => {
    setSelectedPokemon(null);
    setCheckPokemonFlag(false);
    setEnemyPokemon(null);
  };
  // 戦闘を制御するフック
  const { handleAttack, isAttacking } = useBattle(
    selectedPokemon,
    enemyPokemon,
    setEnemyPokemon,
    playerMotionRef,
    enemyMotionRef,
    resetData,
  );
  useEffect(() => {
    console.log(selectedPokemon);
    if (!checkPokemonFlag || !selectedPokemon || enemyPokemon) return;
    (async () => {
      const pokemon = await getPokemon('id', getRandomPokemonId());
      setEnemyPokemon(pokemon);
    })();
  }, [checkPokemonFlag, enemyPokemon, selectedPokemon]);

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
            <AttackMotion ref={enemyMotionRef} direction="right">
              <Image
                src={enemyPokemon.sprites.front_default}
                alt={enemyPokemon.name}
                width={96}
                height={96}
                className="ml-[150px]"
              />
            </AttackMotion>
          </>
        ) : null}

        {/* 自分のポケモン */}
        {selectedPokemon.sprites.back_default ? (
          <>
            <AttackMotion ref={playerMotionRef} direction="right">
              <Image
                src={selectedPokemon.sprites.back_default}
                alt={selectedPokemon.name}
                width={96}
                height={96}
              />
            </AttackMotion>
            <StatsModal stats={selectedPokemon.stats} />
            <ActionCommandModal
              handleAttack={handleAttack}
              isDisabled={isAttacking}
            />
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
