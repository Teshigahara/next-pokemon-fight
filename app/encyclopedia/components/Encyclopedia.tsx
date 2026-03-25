'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getPokemonList } from '@/app/lib/get-pokemon-list';
import type { PokemonList, _PokemonList } from '../../types/SelectedPokemon';

/**
 * 初期表示　全検索
 * 属性検索
 * ランダム検索　　（　10件）
 *
 */

export const Encyclopedia = () => {
  const [pokemonList, setPokemonList] = useState<PokemonList | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 30; // 1ページあたりの表示件数

  useEffect(() => {
    const handlePokemonAll = async () => {
      // 全ポケモンを取得するロジック
      const pokemon = await getPokemonList();
      await console.log(pokemon);
      return setPokemonList(pokemon);
    };

    if (pokemonList === null) {
      handlePokemonAll();
    }
  }, [pokemonList]);

  const handlePageChange = async (type: 'next' | 'prev') => {
    const newPage = type === 'next' ? currentPage + 1 : currentPage - 1;
    const offset = (newPage - 1) * limit;
    const pokemon = await getPokemonList(offset);
    setPokemonList(pokemon);
    setCurrentPage(newPage);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ポケモン図鑑</h1>

      {/* 1. グリッドレイアウトで並べる */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
        }}
      >
        {pokemonList?.pokemon?.map((pokemon: _PokemonList) => (
          <div
            key={pokemon.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            {/* IDと画像 */}
            <p style={{ fontSize: '12px', color: '#666' }}>No.{pokemon.id}</p>
            <Image
              src={pokemon.sprites.front_default || '/no-image.png'}
              alt={pokemon.name}
              width={100}
              height={100}
            />
            {/* 名前 */}
            <h3 style={{ margin: '5px 0', textTransform: 'capitalize' }}>
              {pokemon.name}
            </h3>
            {/* タイプ */}
            <div>
              {pokemon.types.map((type: string) => (
                <span
                  key={type}
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    margin: '2px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    border: '1px solid #ccc',
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 2. ページネーション操作 */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange('prev')}
        >
          前へ
        </button>
        <span style={{ margin: '0 15px' }}>
          {currentPage} / {Math.ceil((pokemonList?.totalCount || 0) / limit)}{' '}
          ページ
        </span>
        <button
          disabled={currentPage * limit >= (pokemonList?.totalCount || 0)}
          onClick={() => handlePageChange('next')}
        >
          次へ
        </button>
      </div>
    </div>
  );
};
