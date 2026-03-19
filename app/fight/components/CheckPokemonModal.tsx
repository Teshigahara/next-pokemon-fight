import React from 'react';
import Image from 'next/image';
import type { PokemonType } from '../_types/SelectedPokemon';

type CheckPokemonModalProps = {
  selectedPokemon: PokemonType;
  setCheckPokemonFlag: (value: boolean) => void;
  setSelectedPokemon: (value: PokemonType | null) => void;
};

export const CheckPokemonModal: React.FC<CheckPokemonModalProps> = ({
  selectedPokemon,
  setCheckPokemonFlag,
  setSelectedPokemon,
}) => {
  const handleClick = (value: boolean) => () => {
    if (value) {
      setCheckPokemonFlag(true);
      return;
    }
    setSelectedPokemon(null);
    setCheckPokemonFlag(false);
  };
  return (
    <div>
      <h1>選択されたポケモン{selectedPokemon.name}です</h1>
      {selectedPokemon.sprites.front_default ? (
        <Image
          src={selectedPokemon.sprites.front_default}
          alt={selectedPokemon.name}
          width={96}
          height={96}
        />
      ) : null}
      <button onClick={handleClick(true)} className="pr-5">
        yes
      </button>
      <button onClick={handleClick(false)}>no</button>
    </div>
  );
};
