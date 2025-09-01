import { useCallback } from "react";
import { useSymbolContext } from "../context/SymbolContext";

type SymbolDropdownProps = {
  value: string;
  onChange: (symbol: string) => void;
  label?: string;
};

export default function SymbolDropdown(props: SymbolDropdownProps) {
  const { value, onChange, label } = props;
  const { symbols, initialActiveSymbol } = useSymbolContext();

  const onValueSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm">{label}</label>}
      <select className="p-1 border rounded-md" value={value || initialActiveSymbol} onChange={onValueSelect}>
        {symbols.map((symbol) => (
          <option key={symbol.symbol} value={symbol.symbol}>
            {symbol.symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
