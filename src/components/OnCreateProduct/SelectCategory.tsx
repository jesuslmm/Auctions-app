import React, { useState } from "react";

const options = [
  "Gaming",
  "Electronic",
  "Art",
  "Antiques",
  "Jewerly",
  "Sports",
  "Clothes",
  "Toys",
  "Books",
];

const MySelect = ({
  selectedOption,
  handleChangeCategory,
}: {
  selectedOption: string | undefined;
  handleChangeCategory: (option: string) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleChangeCategory(event.target.value);
  };

  return (
    <div>
      <label className="font-medium" htmlFor="select">
        Category:
      </label>
      <select
        className="ml-2 py-2 rounded-lg border-blue-200 border-2"
        id="select"
        value={selectedOption}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option className="p-2 text-lg" key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MySelect;
