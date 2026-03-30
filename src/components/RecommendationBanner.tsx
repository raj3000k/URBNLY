import type { PlaceSuggestion } from "../types/place";

type Props = {
  officeQuery: string;
  selectedOfficeLabel: string;
  suggestions: PlaceSuggestion[];
  loading?: boolean;
  locationLoading?: boolean;
  message?: string;
  onOfficeQueryChange: (value: string) => void;
  onSuggestionSelect: (suggestion: PlaceSuggestion) => void;
  onClearOffice: () => void;
  onDetectLocation: () => void;
};

export default function RecommendationBanner({
  officeQuery,
  selectedOfficeLabel,
  suggestions,
  loading = false,
  locationLoading = false,
  message = "",
  onOfficeQueryChange,
  onSuggestionSelect,
  onClearOffice,
  onDetectLocation,
}: Props) {
  const showSuggestions = officeQuery.trim().length >= 3 && suggestions.length > 0;

  return (
    <div className="rounded-[24px] border border-emeraldAccent/10 bg-white/90 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraldAccent">
            Commute-based recommendations
          </p>

          <h3 className="mt-2 font-display text-2xl text-emeraldDark">
            Find stays closer to your office
          </h3>

          <p className="mt-2 text-sm text-fog">
            Search your office with Google Places autocomplete or detect your current
            location. We&apos;ll estimate commute time for each property.
          </p>
        </div>

        <button
          onClick={onDetectLocation}
          disabled={locationLoading}
          className="rounded-2xl border border-emeraldDark/10 px-4 py-3 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locationLoading ? "Detecting..." : "Detect my location"}
        </button>
      </div>

      <div className="relative mt-4">
        <input
          type="text"
          value={officeQuery}
          onChange={(event) => onOfficeQueryChange(event.target.value)}
          placeholder="Search office: Infosys, Whitefield, Bengaluru"
          className="w-full rounded-2xl border border-emeraldDark/10 px-4 py-3 text-sm outline-none transition focus:border-emeraldAccent focus:ring-4 focus:ring-emeraldAccent/10"
        />

        {showSuggestions && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-emeraldDark/10 bg-white shadow-float">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.placeId}
                onClick={() => onSuggestionSelect(suggestion)}
                className="block w-full border-b border-emeraldDark/5 px-4 py-3 text-left transition last:border-b-0 hover:bg-mintMist"
              >
                <div className="text-sm font-semibold text-inkSlate">
                  {suggestion.mainText}
                </div>
                {suggestion.secondaryText && (
                  <div className="mt-1 text-xs text-fog">{suggestion.secondaryText}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-fog">
        <span>
          {selectedOfficeLabel
            ? `Selected office: ${selectedOfficeLabel}`
            : "Select an office from the dropdown or use your current location."}
        </span>
        <div className="flex items-center gap-3">
          {loading && <span>Refreshing commute data...</span>}
          {selectedOfficeLabel && (
            <button
              onClick={onClearOffice}
              className="rounded-full border border-emeraldDark/10 px-3 py-1 font-semibold text-emeraldDark transition hover:bg-mintMist"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className="mt-3 rounded-2xl bg-mintMist px-4 py-3 text-xs text-emeraldDark">
          {message}
        </p>
      )}
    </div>
  );
}
