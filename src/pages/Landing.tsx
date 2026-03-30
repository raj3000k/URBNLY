import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Compass,
  Heart,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const springEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay,
      ease: springEase,
    },
  }),
};

const features = [
  {
    icon: MapPinned,
    title: "Commute-first search",
    text: "Pick an office or detect your current location and compare stays by actual travel time.",
  },
  {
    icon: Heart,
    title: "Save smart shortlists",
    text: "Bookmark the PGs that feel promising and come back to them when you are ready to decide.",
  },
  {
    icon: Building2,
    title: "Owner dashboards",
    text: "Property owners can add listings, manage rooms, and keep availability fresh in real time.",
  },
];

const proof = [
  { label: "Avg. commute improvement", value: "28%" },
  { label: "Verified, high-intent stays", value: "100+" },
  { label: "Founders and working pros", value: "4.8/5" },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_28%),linear-gradient(135deg,#f6fbf7_0%,#eef7f2_48%,#f7efe3_100%)]">
      <div className="absolute inset-0 bg-hero-grid bg-hero-grid opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/75 px-5 py-4 shadow-float backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emeraldAccent">
              Urbanly
            </p>
            <h1 className="mt-1 font-display text-2xl text-emeraldDark">
              City living, chosen with intent
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={user ? "/home" : "/login"}
              className="rounded-2xl border border-emeraldDark/10 px-4 py-3 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
            >
              {user ? "Open app" : "Login"}
            </Link>
            <Link
              to={user ? "/home" : "/register"}
              className="rounded-2xl bg-emeraldDark px-4 py-3 text-sm font-semibold text-white transition hover:bg-emeraldAccent"
            >
              {user ? "Go to home" : "Get started"}
            </Link>
          </div>
        </motion.header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <motion.div initial="hidden" animate="visible" custom={0.05} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emeraldAccent/15 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emeraldDark backdrop-blur">
                <Sparkles size={14} />
                Built for working professionals
              </div>
            </motion.div>

            <motion.h2
              initial="hidden"
              animate="visible"
              custom={0.12}
              variants={fadeUp}
              className="mt-5 max-w-3xl font-display text-5xl leading-[0.95] text-emeraldDark sm:text-6xl"
            >
              Discover PGs by commute, confidence, and fit.
            </motion.h2>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.2}
              variants={fadeUp}
              className="mt-6 max-w-2xl text-base leading-8 text-fog sm:text-lg"
            >
              Urbanly helps you move beyond random scrolling. Start with a polished
              shortlist, compare commute times, save favorites, and book with more
              clarity from the first tap.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.28}
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to={user ? "/home" : "/register"}
                className="inline-flex items-center gap-2 rounded-2xl bg-emeraldDark px-5 py-4 font-semibold text-white transition hover:bg-emeraldAccent"
              >
                {user ? "Enter the app" : "Create account"}
                <ArrowRight size={18} />
              </Link>
              <Link
                to={user ? "/home" : "/login"}
                className="rounded-2xl border border-emeraldDark/10 bg-white/80 px-5 py-4 font-semibold text-emeraldDark transition hover:bg-mintMist"
              >
                {user ? "Browse listings" : "Sign in"}
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.36}
              variants={fadeUp}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              {proof.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur"
                >
                  <p className="text-3xl font-bold text-emeraldDark">{item.value}</p>
                  <p className="mt-2 text-sm text-fog">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, ease: springEase, delay: 0.12 }}
            className="relative"
          >
            <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-emeraldAccent/15 blur-3xl" />
            <div className="absolute -bottom-10 right-8 h-28 w-28 rounded-full bg-sandstone blur-3xl" />

            <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/85 p-5 shadow-float backdrop-blur">
              <div className="rounded-[28px] bg-emeraldDark p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emeraldSoft">
                      Commute lens
                    </p>
                    <h3 className="mt-2 font-display text-3xl">Whitefield, tuned to your day</h3>
                  </div>
                  <Compass className="text-emeraldSoft" size={26} />
                </div>
                <p className="mt-4 text-sm leading-6 text-emeraldSoft/90">
                  The app layers commute, confidence, and price so your shortlist
                  feels more like a decision tool than a generic property board.
                </p>
              </div>

              <div className="mt-4 grid gap-4">
                <div className="rounded-[24px] border border-emeraldDark/10 bg-mintMist p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-fog">
                        Fastest option
                      </p>
                      <p className="mt-2 text-lg font-semibold text-inkSlate">
                        12 mins to office
                      </p>
                    </div>
                    <ShieldCheck size={20} className="text-emeraldDark" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-emeraldDark/10 bg-white p-4">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Star size={16} className="fill-amber-400" />
                      <span className="text-sm font-semibold text-inkSlate">Top rated stays</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-fog">
                      Smart ranking surfaces reliable, well-reviewed options before
                      you spend time comparing them.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-emeraldDark/10 bg-sandstone/70 p-4">
                    <div className="flex items-center gap-2 text-emeraldDark">
                      <Heart size={16} />
                      <span className="text-sm font-semibold text-inkSlate">Saved & ready</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-fog">
                      Build a shortlist, revisit it later, and move into booking only
                      when the fit feels right.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraldAccent">
              Why it feels better
            </p>
            <h3 className="mt-3 font-display text-4xl text-emeraldDark">
              A calmer home-finding flow, from first browse to shortlist.
            </h3>
          </motion.div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                custom={index * 0.08}
                variants={fadeUp}
                className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <feature.icon className="text-emeraldDark" size={22} />
                <h4 className="mt-4 font-display text-2xl text-emeraldDark">
                  {feature.title}
                </h4>
                <p className="mt-3 text-sm leading-7 text-fog">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
