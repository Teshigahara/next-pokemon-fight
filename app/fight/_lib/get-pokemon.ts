import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { PokemonType } from '../_types/SelectedPokemon';

const POKEAPI_GRAPHQL_ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';

const GET_POKEMON = gql`
  query GetPokemon($where: pokemon_v2_pokemon_bool_exp!) {
    pokemon_v2_pokemon(where: $where, limit: 1) {
      id
      name
      height
      weight
      pokemon_v2_pokemonsprites(limit: 1) {
        sprites
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemontypes(order_by: { slot: asc }) {
        pokemon_v2_type {
          name
        }
      }
    }
  }
`;

export const getPokemon = async (
  type: 'id' | 'name',
  value: string | number,
): Promise<PokemonType> => {
  const client = new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: POKEAPI_GRAPHQL_ENDPOINT,
      fetchOptions: { cache: 'no-store' },
    }),
    cache: new InMemoryCache(),
  });

  // 引数の type に応じて where 句のオブジェクトを動的に生成
  const whereCondition =
    type === 'id'
      ? { id: { _eq: Number(value) } }
      : { name: { _eq: String(value).toLowerCase() } };

  const { data } = await client.query({
    query: GET_POKEMON,
    variables: { where: whereCondition },
  });

  const pokemon = data?.pokemon_v2_pokemon?.[0];
  if (!pokemon) {
    throw new Error(`Pokemon not found with ${type}: ${value}`);
  }

  // スプライトのパース処理
  const rawSprites = pokemon.pokemon_v2_pokemonsprites?.[0]?.sprites;
  let front_default: string | null = null;
  let back_default: string | null = null;

  if (rawSprites != null) {
    const parsed =
      typeof rawSprites === 'string' ? JSON.parse(rawSprites) : rawSprites;
    front_default = parsed.front_default ?? null;
    back_default = parsed.back_default ?? null;
  }

  // ステータスのバース処理
  const stats = { hp: 0, attack: 0, defense: 0, specialAttack: 0 };
  pokemon.pokemon_v2_pokemonstats?.forEach((s: any) => {
    const statName = s.pokemon_v2_stat.name;
    if (statName === 'hp') stats.hp = s.base_stat;
    if (statName === 'attack') stats.attack = s.base_stat;
    if (statName === 'defense') stats.defense = s.base_stat;
    if (statName === 'special-attack') stats.specialAttack = s.base_stat; // PokeAPI側はハイフン
  });

  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    sprites: { front_default, back_default },
    stats: {
      hp: stats.hp,
      attack: stats.attack,
      special_attack: stats.specialAttack,
      defense: stats.defense,
    },
    types: pokemon.pokemon_v2_pokemontypes
      .map((t: any) => t.pokemon_v2_type?.name)
      .filter((v: any): v is string => Boolean(v)),
  };
};
