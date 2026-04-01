import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Clock3,
  Heart,
  KeyRound,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Star,
  Users2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const springEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: springEase,
    },
  }),
};

const featureCards = [
  {
    icon: MapPinned,
    title: "Commute-first discovery",
    text: "Search from your office or current location and shortlist places that actually fit your workday rhythm.",
    hoverClass:
      "hover:-translate-y-1 hover:border-emeraldAccent/30 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white hover:shadow-[0_20px_60px_rgba(16,185,129,0.18)]",
    iconClass: "bg-emerald-100 text-emeraldDark group-hover:bg-emeraldDark group-hover:text-white",
  },
  {
    icon: ShieldCheck,
    title: "Only Premium PGs / Stays",
    text: "URBNLY is designed to surface polished, reliable stays instead of making you scroll through noisy low-intent listings.",
    hoverClass:
      "hover:-translate-y-1 hover:border-amber-300/60 hover:bg-gradient-to-br hover:from-amber-50 hover:to-white hover:shadow-[0_20px_60px_rgba(245,158,11,0.18)]",
    iconClass: "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white",
  },
  {
    icon: Heart,
    title: "Shortlist with confidence",
    text: "Save stays, compare roommate fit, and revisit premium options when you are ready to decide.",
    hoverClass:
      "hover:-translate-y-1 hover:border-rose-300/60 hover:bg-gradient-to-br hover:from-rose-50 hover:to-white hover:shadow-[0_20px_60px_rgba(244,63,94,0.18)]",
    iconClass: "bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
  },
  {
    icon: Users2,
    title: "Privacy-first roommate matching",
    text: "Discover compatible flatmates through first-name-only matching, lifestyle fit, and clear opt-in intent.",
    hoverClass:
      "hover:-translate-y-1 hover:border-sky-300/60 hover:bg-gradient-to-br hover:from-sky-50 hover:to-white hover:shadow-[0_20px_60px_rgba(14,165,233,0.18)]",
    iconClass: "bg-sky-100 text-sky-700 group-hover:bg-sky-500 group-hover:text-white",
  },
];

const premiumSignals = [
  "Verified hosts and curated properties",
  "Commute-aware ranking for working professionals",
  "Roommate fit, shortlist flow, and owner confidence",
];

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    alt: "Premium stay interior",
    className: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    alt: "Professionals in office",
    className: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    alt: "Comfortable bedroom",
    className: "col-span-1 row-span-1",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const customerEntry = user ? (user.role === "owner" ? "/dashboard" : "/interested") : "/login";
  const ownerEntry = user ? (user.role === "owner" ? "/dashboard" : "/interested") : "/owner/login";

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(15,92,74,0.12),transparent_26%),linear-gradient(135deg,#f5fbf7_0%,#edf8f2_48%,#f8f0e5_100%)]">
      <div className="absolute inset-0 bg-hero-grid bg-hero-grid opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial="hidden"
          animate="visible"
            variants={fadeUp}
            className="flex flex-col gap-4 rounded-[30px] border border-white/70 bg-white/75 px-5 py-4 shadow-float backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emeraldAccent">
              URBNLY
            </p>
            <h1 className="mt-1 font-display text-2xl text-emeraldDark">
              Premium city living for modern working professionals
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={customerEntry}
              className="rounded-2xl border border-emeraldDark/10 px-4 py-3 text-sm font-semibold text-emeraldDark transition hover:bg-mintMist"
            >
              {user ? "Open app" : "Customer login"}
            </Link>
            <Link
              to={user ? customerEntry : "/register"}
              className="rounded-2xl bg-emeraldDark px-4 py-3 text-sm font-semibold text-white transition hover:bg-emeraldAccent"
            >
              {user ? "Go to workspace" : "Create account"}
            </Link>
            <Link
              to={ownerEntry}
              className="rounded-2xl border border-emeraldDark/10 bg-white/80 px-4 py-3 text-sm font-semibold text-emeraldDark transition hover:bg-sandstone/70"
            >
              {user?.role === "owner" ? "Owner portal" : "Owner login"}
            </Link>
          </div>
        </motion.header>

        <section className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <motion.div initial="hidden" animate="visible" custom={0.04} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emeraldAccent/15 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emeraldDark backdrop-blur">
                <Sparkles size={14} />
                Curated for your work-life move
              </div>
            </motion.div>

            <motion.h2
              initial="hidden"
              animate="visible"
              custom={0.1}
              variants={fadeUp}
              className="mt-6 max-w-4xl font-display text-5xl leading-[0.92] text-emeraldDark sm:text-6xl"
            >
              Find a premium home away from home, close to work and designed for the life you want to build.
            </motion.h2>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.18}
              variants={fadeUp}
              className="mt-6 max-w-2xl text-base leading-8 text-fog sm:text-lg"
            >
              URBNLY helps ambitious professionals move smarter. Discover only premium
              PGs and stays, compare real commute quality, understand roommate fit,
              and step into a place that feels calm, polished, and ready for your next chapter.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.26}
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to={user ? customerEntry : "/register"}
                className="inline-flex items-center gap-2 rounded-2xl bg-emeraldDark px-5 py-4 font-semibold text-white transition hover:bg-emeraldAccent"
              >
                {user ? "Open seeker workspace" : "Start your search"}
                <ArrowRight size={18} />
              </Link>
              <Link
                to={user ? ownerEntry : "/owner/login"}
                className="rounded-2xl border border-emeraldDark/10 bg-white/80 px-5 py-4 font-semibold text-emeraldDark transition hover:bg-mintMist"
              >
                {user?.role === "owner" ? "Manage listings" : "List your property"}
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.3}
              variants={fadeUp}
              className="mt-8 grid gap-4 md:grid-cols-2"
            >
              <div className="rounded-[28px] border border-emeraldDark/10 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 text-emeraldDark">
                  <Sparkles size={18} />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">For customers</p>
                </div>
                <h3 className="mt-4 font-display text-2xl text-emeraldDark">
                  Search, shortlist, visit, decide
                </h3>
                <p className="mt-3 text-sm leading-7 text-fog">
                  A modern seeker flow inspired by the best property platforms: interested workspace, saved stays, visits, and commute-led discovery.
                </p>
              </div>
              <div className="rounded-[28px] border border-emeraldDark/10 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 text-emeraldDark">
                  <KeyRound size={18} />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">For owners</p>
                </div>
                <h3 className="mt-4 font-display text-2xl text-emeraldDark">
                  Separate owner portal, cleaner operations
                </h3>
                <p className="mt-3 text-sm leading-7 text-fog">
                  Keep inventory live, manage visit requests, and work from a dedicated owner dashboard instead of mixing host tools into the customer journey.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.34}
              variants={fadeUp}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              <div className="rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                <p className="text-3xl font-bold text-emeraldDark">Only premium</p>
                <p className="mt-2 text-sm text-fog">Curated PGs and stays, not noisy classifieds.</p>
              </div>
              <div className="rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                <p className="text-3xl font-bold text-emeraldDark">Commute-led</p>
                <p className="mt-2 text-sm text-fog">Choose the place that supports your office routine.</p>
              </div>
              <div className="rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                <p className="text-3xl font-bold text-emeraldDark">Privacy-first</p>
                <p className="mt-2 text-sm text-fog">Roommate discovery with confidence and discretion.</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: springEase, delay: 0.12 }}
            className="relative"
          >
            <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-emeraldAccent/15 blur-3xl" />
            <div className="absolute -bottom-8 right-0 h-40 w-40 rounded-full bg-sandstone blur-3xl" />

            <div className="relative overflow-hidden rounded-[36px] border border-white/75 bg-white/85 p-5 shadow-float backdrop-blur">
              <div className="grid grid-cols-3 gap-3">
                {heroImages.map((image) => (
                  <div
                    key={image.alt}
                    className={`${image.className} overflow-hidden rounded-[26px]`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] bg-emeraldDark p-5 text-white">
                  <div className="flex items-center gap-2 text-emeraldSoft">
                    <BriefcaseBusiness size={17} />
                    <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                      Built around your workday
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-3xl">
                    Move closer to office, without compromising your lifestyle
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-emeraldSoft/90">
                    URBNLY brings together premium living, commute comfort, and
                    better decision-making in one refined search experience.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[24px] border border-emeraldDark/10 bg-mintMist p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-fog">
                          Featured promise
                        </p>
                        <p className="mt-2 text-lg font-semibold text-inkSlate">
                          Only Premium PGs / Stays
                        </p>
                      </div>
                      <BadgeCheck size={22} className="text-emeraldDark" />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-emeraldDark/10 bg-white p-4">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Star size={16} className="fill-amber-400" />
                      <span className="text-sm font-semibold text-inkSlate">Reliable quality</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-fog">
                      Verified owners, polished interiors, and a more intentional stay-selection flow.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-emeraldDark/10 bg-sandstone/70 p-4">
                    <div className="flex items-center gap-2 text-emeraldDark">
                      <Clock3 size={16} />
                      <span className="text-sm font-semibold text-inkSlate">A calmer move</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-fog">
                      Spend less time sifting through noise and more time choosing the right place.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-16 rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-float backdrop-blur md:p-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emeraldAccent">
              Why URBNLY
            </p>
            <h3 className="mt-3 font-display text-4xl text-emeraldDark">
              A premium search experience for professionals who want more than just a room.
            </h3>
            <p className="mt-4 text-base leading-8 text-fog">
              We’re building a better way to discover quality stays near work, make
              cleaner decisions, and feel good about where you land next.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index * 0.08}
                variants={fadeUp}
                className={`group rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-sm backdrop-blur transition duration-300 ${feature.hoverClass}`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition duration-300 ${feature.iconClass}`}
                >
                  <feature.icon size={22} />
                </div>
                <h4 className="mt-5 font-display text-2xl text-emeraldDark">{feature.title}</h4>
                <p className="mt-3 text-sm leading-7 text-fog">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className="rounded-[34px] border border-emeraldDark/10 bg-emeraldDark p-7 text-white shadow-float"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emeraldSoft">
              Brand promise
            </p>
            <h3 className="mt-3 font-display text-4xl">
              Find a home away from home, without lowering your standards.
            </h3>
            <p className="mt-4 text-sm leading-7 text-emeraldSoft/90">
              URBNLY is for people moving with purpose: joining a new company,
              stepping into a new city chapter, and wanting a stay that feels dignified,
              premium, and close to the life they are building.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className="grid gap-4 md:grid-cols-3"
          >
            {premiumSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sandstone text-emeraldDark">
                  <Building2 size={20} />
                </div>
                <p className="mt-5 text-base font-semibold leading-7 text-inkSlate">
                  {signal}
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        <footer className="mt-16 overflow-hidden rounded-[36px] border border-white/70 bg-[#0f3e34] text-white shadow-float">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.4fr_0.8fr_1fr] md:px-8 lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emeraldSoft">
                URBNLY
              </p>
              <h3 className="mt-3 max-w-lg font-display text-3xl leading-tight">
                Premium stays for professionals building their next chapter.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-emeraldSoft/85">
                Discover commute-smart, well-managed PGs and stays that feel calm,
                elevated, and genuinely worth coming home to.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emeraldSoft">
                About
              </p>
              <div className="mt-4 space-y-3 text-sm text-emeraldSoft/90">
                <p>Only Premium PGs / Stays</p>
                <p>Commute-first discovery</p>
                <p>Privacy-first roommate matching</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emeraldSoft">
                Contact Us
              </p>
              <div className="mt-4 space-y-3 text-sm text-emeraldSoft/90">
                <p>hello@urbnly.in</p>
                <p>Bengaluru, India</p>
                <a
                  href="https://www.linkedin.com/in/raj-motwani-978143204/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-white transition hover:text-sandstone"
                >
                  Raj Motwani
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-4 text-sm text-emeraldSoft/80 md:flex md:items-center md:justify-between md:px-8 lg:px-10">
            <p>Copyright rights @Urbn living private ltd</p>
            <p>Designed and built by Raj Motwani</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
