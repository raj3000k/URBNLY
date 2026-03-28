export default function SearchBar() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
      <input
        type="text"
        placeholder="Search by area, office, PG..."
        className="w-full outline-none text-sm placeholder-gray-400"
      />
    </div>
  );
}
