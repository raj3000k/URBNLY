import SearchBar from "../components/SearchBar";
import RecommendationBanner from "../components/RecommendationBanner";
import Filters from "../components/Filters";
import PropertyCard from "../components/PropertyCard";

const mockData = [
  {
    id: "1",
    title: "Green Residency PG",
    location: "Whitefield",
    price: 12000,
    image: "https://via.placeholder.com/300",
    available: true,
    verified: true,
    distance: "2.5 km",
  },
  {
    id: "2",
    title: "Urban Stay PG",
    location: "Marathahalli",
    price: 10000,
    image: "https://via.placeholder.com/300",
    available: true,
    verified: false,
    distance: "3.8 km",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-4 space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-emeraldDark">Urbanly</h1>

      {/* Search */}
      <SearchBar />

      {/* Recommendation */}
      <RecommendationBanner />

      {/* Filters */}
      <Filters />

      {/* Listings */}
      <div className="space-y-4">
        {mockData.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
