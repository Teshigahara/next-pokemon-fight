'use client';

import React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getPokemonDetail } from '../../lib/get-pokemon-detail';
import type { PokemonType } from '../../types/SelectedPokemon';

const schema = z.object({
  name: z.string().min(1, 'ポケモンの名前は必須です'),
});

type FormValues = z.infer<typeof schema>;

export default function SerectPokemon({
  setSelectedPokemon,
}: {
  setSelectedPokemon: (pokemon: PokemonType) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.name) {
      const pokemon = await getPokemonDetail('name', data.name);
      console.log(pokemon);
      setSelectedPokemon(pokemon);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select defaultValue="" {...register('name')}>
        <option value="" disabled>
          ポケモンを選択
        </option>
        <option value="bulbasaur">bulbasaur</option>
        <option value="charmander">charmander</option>
        <option value="blastoise">blastoise</option>
      </select>
      {errors.name && <span style={errorStyle}>{errors.name.message}</span>}
      <button type="submit">選択</button>
    </form>
  );
}

const errorStyle = {
  color: 'red',
};
