/**
 * 指定した範囲内でランダムな整数を返す
 */
export const getRandomPokemonId = (): number => {
  const MAX_POKEMON_ID = 1010; // 安定してデータが取れる範囲（第9世代初期までなど）
  return Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
};
