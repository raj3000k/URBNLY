import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import type { Visit } from "../types/visit";

const statusClassMap: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emeraldSoft text-emeraldDark",
  completed: "bg-sky-100 text-sky-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVisits = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/visits/my");
        setVisits(response.data.data || []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Unable to load your visits");
        } else {
          setError("Unable to load your visits");
        }
      } finally {
        setLoading(false);
      }
    };

    loadVisits();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mintMist via-white to-sandstone/50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-float backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emeraldAccent">
                My visits
              </p>
              <h1 className="mt-2 font-display text-3xl text-emeraldDark">
                Track your scheduled property visits
              </h1>
              <p className="mt-2 text-sm text-fog">
                Keep an eye on confirmations, upcoming tours, and places you want to see in person.
              </p>
            </div>

            <Link
              to="/interested"
              className="rounded-2xl bg-emeraldDark px-4 py-3 text-sm font-semibold text-white transition hover:bg-emeraldAccent"
            >
              Back to workspace
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 text-sm text-fog shadow-float">
            Loading your visits...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-white/90 p-6 text-sm text-red-600 shadow-float">
            {error}
          </div>
        ) : visits.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-emeraldDark/15 bg-white/90 p-6 text-sm text-fog shadow-float">
            You have not scheduled any visits yet. Open a property and tap `Schedule a visit`.
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-float"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    {visit.property?.image && (
                      <img
                        src={visit.property.image}
                        alt={visit.property.title}
                        className="hidden h-24 w-24 rounded-2xl object-cover sm:block"
                      />
                    )}

                    <div>
                      <p className="font-display text-2xl text-emeraldDark">
                        {visit.property?.title || "Property visit"}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-fog">
                        <MapPin size={15} />
                        <span>{visit.property?.location || "Location unavailable"}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-fog">
                        <CalendarDays size={15} />
                        <span>{new Date(visit.scheduledFor).toLocaleString()}</span>
                      </div>
                      {visit.notes && (
                        <p className="mt-3 rounded-2xl bg-mintMist px-4 py-3 text-sm text-inkSlate">
                          {visit.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 md:text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClassMap[visit.status] || "bg-sandstone text-inkSlate"}`}
                    >
                      {visit.status}
                    </span>
                    <p className="text-sm text-fog">{visit.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
