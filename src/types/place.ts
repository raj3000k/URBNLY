export interface PlaceSuggestion {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
}

export interface SelectedPlace {
  placeId: string;
  label: string;
  displayName?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
