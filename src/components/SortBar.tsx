export type SortOption = "recommended" | "distance" | "price_low" | "price_high" | "rating";

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

const options: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "distance", label: "Distance" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function SortBar({ value, onChange }: Props) {
  return (
    <div className="rounded-[20px] border border-emeraldDark/10 bg-white/90 p-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fog">
            Sort listings
          </p>
          <p className="mt-1 text-sm text-inkSlate">
            Choose what matters most: commute, price, or rating.
          </p>
        </div>

        <select
          value={value}
          onChange={(event) => onChange(event.target.value as SortOption)}
          className="rounded-2xl border border-emeraldDark/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
