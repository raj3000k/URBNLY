import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import type { Property } from "../types/property";

type WishlistContextType = {
  savedIds: string[];
  savedProperties: Property[];
  loading: boolean;
  toggleWishlist: (property: Property) => Promise<void>;
  isSaved: (propertyId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!user) {
      setSavedIds([]);
      setSavedProperties([]);
      return;
    }

    setLoading(true);

    try {
      const response = await api.get("/wishlist");
      const properties = response.data.data as Property[];
      setSavedProperties(properties);
      setSavedIds(properties.map((property) => property.id));
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error("Failed to load wishlist", error);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const toggleWishlist = useCallback(
    async (property: Property) => {
      if (!user) {
        throw new Error("Please log in to save properties.");
      }

      const currentlySaved = savedIds.includes(property.id);

      if (currentlySaved) {
        await api.delete(`/wishlist/${property.id}`);
        setSavedIds((current) => current.filter((id) => id !== property.id));
        setSavedProperties((current) =>
          current.filter((item) => item.id !== property.id)
        );
        return;
      }

      await api.post(`/wishlist/${property.id}`);
      setSavedIds((current) => [...current, property.id]);
      setSavedProperties((current) =>
        current.some((item) => item.id === property.id)
          ? current
          : [property, ...current]
      );
    },
    [savedIds, user]
  );

  const value = useMemo(
    () => ({
      savedIds,
      savedProperties,
      loading,
      toggleWishlist,
      isSaved: (propertyId: string) => savedIds.includes(propertyId),
    }),
    [loading, savedIds, savedProperties, toggleWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
};
