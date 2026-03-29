type Props = {
  value: string
  onChange: (value:string)=>void

}

export default function SearchBar({ value, onChange}:Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
      <input
        type="text"
        placeholder="Search by area, office, PG..."
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full outline-none text-sm placeholder-gray-400"
      />
    </div>
  );
}
