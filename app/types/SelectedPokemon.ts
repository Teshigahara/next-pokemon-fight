export type SelectedPokemon = {
  name: string;
  sprites: {
    front_default: string | null;
    back_default: string | null;
  };
};

export type PokemonType = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  sprites: {
    front_default: string | null;
    back_default: string | null;
  };
  stats: {
    hp: number;
    attack: number;
    special_attack: number;
    defense: number;
  };
};

export type _PokemonList = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  sprites: {
    front_default: string | null;
  };
};

export type PokemonList = {
  pokemon: _PokemonList[];
  totalCount: number;
};
