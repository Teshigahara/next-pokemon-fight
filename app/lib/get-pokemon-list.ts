import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { PokemonList, SearchFilter } from '../types/SelectedPokemon';

const POKEAPI_GRAPHQL_ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';

// 図鑑用のGQL
const GET_POKEMON = gql`
  query GetPokemonList(
    $offset: Int!
    $where: pokemon_v2_pokemon_bool_exp
    $orderBy: [pokemon_v2_pokemon_order_by!]!
  ) {
    pokemon_v2_pokemon(
      limit: 30
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      id
      name
      height
      weight
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      # 必要な場合のみ最小限のスプライト情報を入れる
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
    pokemon_v2_pokemon_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const getPokemonList = async (
  offset: number = 0,
  filter: SearchFilter = {},
): Promise<PokemonList> => {
  const client = new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: POKEAPI_GRAPHQL_ENDPOINT,
      fetchOptions: { cache: 'no-store' },
    }),
    cache: new InMemoryCache(),
  });

  const where: any = { _and: [] };

  if (filter.name) {
    where._and.push({ name: { _ilike: `%${filter.name}%` } });
  }

  if (filter.type) {
    where._and.push({
      pokemon_v2_pokemontypes: {
        pokemon_v2_type: { name: { _eq: filter.type } },
      },
    });
  }

  const finalWhere = where._and.length > 0 ? where : {};
  const orderBy =
    filter.sort === 'id'
      ? [{ id: 'asc' }]
      : filter.sort === 'height'
        ? [{ height: 'desc' }]
        : filter.sort === 'weight'
          ? [{ weight: 'desc' }]
          : [{ id: 'asc' }]; // デフォルトはID順

  const { data } = await client.query({
    query: GET_POKEMON,
    variables: { offset, where: finalWhere, orderBy },
  });

  const pokemonArray = data?.pokemon_v2_pokemon || [];

  // if (!pokemon) {
  //   throw new Error('Pokemon not found');
  // }

  const formattedList = pokemonArray.map((pokemon: any) => {
    // スプライトのパース処理
    const spritesJson = pokemon.pokemon_v2_pokemonsprites?.[0]?.sprites;
    let front_default: string | null = null;
    if (spritesJson) {
      const parsed =
        typeof spritesJson === 'string' ? JSON.parse(spritesJson) : spritesJson;
      front_default =
        parsed.other?.['official-artwork']?.front_default ??
        parsed.front_default;
    }

    return {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      sprites: { front_default },
      types: pokemon.pokemon_v2_pokemontypes.map(
        (t: any) => t.pokemon_v2_type.name,
      ),
    };
  });

  return {
    pokemon: formattedList, // 30体の配列を返す
    totalCount: data?.pokemon_v2_pokemon_aggregate.aggregate.count,
  };
};
