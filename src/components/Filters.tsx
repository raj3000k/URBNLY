const filters = ["Budget", "AC", "Food", "Distance", "Gender"];

export default function Filters() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((f) => (
        <button
          key={f}
          className="px-4 py-2 border border-gray-300 rounded-full text-sm whitespace-nowrap"
        >
          {f}
        </button>
      ))}
    </div>
  );
}
