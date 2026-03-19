import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { PokemonType } from '../_types/SelectedPokemon';
import { number } from 'zod';
// PokeAPI の GraphQL エンドポイント
const POKEAPI_GRAPHQL_ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';

// 指定した名前のポケモンを取得するための GraphQL クエリ
const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    pokemon_v2_pokemon(where: { name: { _eq: $name } }, limit: 1) {
      id
      name
      height
      weight
      pokemon_v2_pokemonsprites(limit: 1) {
        sprites
      }
      pokemon_v2_pokemonstats {
        pokemon_v2_stat {
          name
        }
        base_stat
      }
      pokemon_v2_pokemontypes(order_by: { slot: asc }) {
        pokemon_v2_type {
          name
        }
      }
    }
  }
`;

export const getPokemon = async (name: string): Promise<PokemonType> => {
  // SSR 用の Apollo Client を毎回生成
  const client = new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: POKEAPI_GRAPHQL_ENDPOINT,
      // 毎回最新の情報を取得したいのでキャッシュしない
      fetchOptions: { cache: 'no-store' },
    }),
    cache: new InMemoryCache(),
  });

  // ポケモン名を小文字に正規化してクエリ実行
  const { data } = await client.query<{
    pokemon_v2_pokemon: Array<{
      id: number;
      name: string;
      height: number;
      weight: number;
      pokemon_v2_pokemonsprites: Array<{
        sprites: unknown;
      }>;
      pokemon_v2_pokemonstats: Array<{
        base_stat: number;
        pokemon_v2_stat: {
          name: string;
          __typename: string;
        };
      }>;
      pokemon_v2_pokemontypes: Array<{
        pokemon_v2_type: { name: string } | null;
      }>;
    }>;
  }>({
    query: GET_POKEMON,
    variables: { name: name.toLowerCase() },
  });

  const pokemon = data?.pokemon_v2_pokemon?.[0];
  console.log(pokemon);
  if (!pokemon) {
    throw new Error(`Pokemon not found: ${name}`);
  }

  // スプライトは JSON 文字列またはオブジェクトとして返ってくるので、パースして必要なキーだけ取り出す
  const rawSprites = pokemon.pokemon_v2_pokemonsprites?.[0]?.sprites;
  let front_default: string | null = null;
  let back_default: string | null = null;

  if (rawSprites != null) {
    try {
      // GraphQL の実体は JSON 文字列かプレーンオブジェクトのどちらかなので両方に対応
      const parsed =
        typeof rawSprites === 'string'
          ? (JSON.parse(rawSprites) as {
              front_default?: string;
              back_default?: string;
            })
          : (rawSprites as { front_default?: string; back_default?: string });

      front_default = parsed.front_default ?? null;
      back_default = parsed.back_default ?? null;
    } catch {
      // JSON 形式が想定外でもアプリ自体は落とさず、null のまま返す
    }
  }
  const rawStats = pokemon.pokemon_v2_pokemonstats;
  const stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
  };

  rawStats?.forEach((s) => {
    const name = s.pokemon_v2_stat.name;
    // オブジェクトのキーを動的に指定して代入
    if (name === 'hp') stats.hp = s.base_stat;
    if (name === 'attack') stats.attack = s.base_stat;
    if (name === 'special_atatack') stats.specialAttack = s.base_stat;
    if (name === 'defense') stats.defense = s.base_stat;
  });

  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    sprites: {
      front_default,
      back_default,
    },
    stats: {
      hp: stats.hp,
      attack: stats.attack,
      special_attack: stats.specialAttack,
      defense: stats.defense,
    },
    types: pokemon.pokemon_v2_pokemontypes
      .map((t) => t.pokemon_v2_type?.name)
      .filter((v): v is string => Boolean(v)),
  };
};
