import { ChangeEvent, useState } from "react";
import Select from "react-select";

interface Product {
  id: string;
  product: string;
}

interface Props {
  onSearch: (product: Product) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<Product[]>([]);

  const handleInputChange = async (value: string) => {
    setValue(value);
    if (value.trim() === "") {
      setOptions([]);
    } else {
      const res = await fetch(`/api/search?q=${value}`);
      const products = await res.json();
      setOptions(products);
    }
  };

  const handleSelectChange = (selectedOption: any) => {
    onSearch(selectedOption);
    setValue("");
  };

  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      flex: 1,
      width: "auto",
    }),
  };

  return (
    <Select
      options={options}
      inputValue={value}
      onInputChange={handleInputChange}
      onChange={handleSelectChange}
      getOptionLabel={(option: Product) => option.product}
      getOptionValue={(option: Product) => option.id}
      styles={customStyles}
      placeholder="Search for products..."
      noOptionsMessage={() =>
        options.length > 0 ? "No results found" : undefined
      }
    />
  );
}
