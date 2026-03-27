import React from 'react';
import {
  type SubmitHandler,
  useForm,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  sort: z.enum(['id', 'height', 'weight']).optional(),
});

type InputFieldProps = {
  label: string;
  placeholder: string;
} & UseFormRegisterReturn;

const InputField = ({ label, placeholder, ...rest }: InputFieldProps) => (
  <div className="flex w-full gap-4">
    <label className="text-lg font-semibold">{label}</label>
    <input
      {...rest}
      placeholder={placeholder}
      className="border border-gray-300 rounded-md p-2 w-[400px]"
    />
  </div>
);

const RadioField = ({
  label,
  options,
  ...rest
}: {
  label: string;
  options: { value: string; label: string }[];
} & UseFormRegisterReturn) => (
  <div className="flex w-full gap-4">
    <span className="text-lg font-semibold">{label}</span>
    <div className="flex gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2">
          <input type="radio" value={option.value} {...rest} />
          {option.label}
        </label>
      ))}
    </div>
  </div>
);

export const SearchFormModal = ({
  handleSearch,
}: {
  handleSearch: (filter: { name?: string; type?: string }) => void;
}) => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    console.log(data);
    handleSearch(data);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center space-y-4"
      >
        <InputField
          label="NAME"
          placeholder="ポケモンの名前"
          {...register('name')}
        />
        <InputField
          label="TYPE"
          placeholder="ポケモンのタイプ"
          {...register('type')}
        />
        <RadioField
          label="SORT BY"
          options={[
            { value: 'id', label: 'ID' },
            { value: 'height', label: 'HEIGHT' },
            { value: 'weight', label: 'WEIGHT' },
          ]}
          {...register('sort')}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Search
        </button>
      </form>
    </div>
  );
};
