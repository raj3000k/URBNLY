type Props = {
  selected: number | null;
  onBudgetChange: (val: number | null) => void;
};

export default function Filters({ selected, onBudgetChange }: Props) {
  const getClass = (val: number | null) =>
    `px-4 py-2 rounded-full text-sm whitespace-nowrap ${
      selected === val
        ? "bg-emeraldAccent text-white"
        : "border border-gray-300 text-gray-700"
    }`;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button onClick={() => onBudgetChange(null)} className={getClass(null)}>
        All
      </button>

      <button onClick={() => onBudgetChange(10000)} className={getClass(10000)}>
        Under ₹10k
      </button>

      <button onClick={() => onBudgetChange(15000)} className={getClass(15000)}>
        Under ₹15k
      </button>
    </div>
  );
}
