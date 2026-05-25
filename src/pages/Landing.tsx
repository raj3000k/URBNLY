import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
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
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, delay, ease: easeOut },
  }),
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const cardIn = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: easeOut },
  },
};

const features = [
  {
    icon: MapPinned,
    title: "Commute-first discovery",
    text: "Rank stays by how they fit your workday, not just by locality or price.",
  },
  {
    icon: BadgeCheck,
    title: "Curated premium supply",
    text: "A cleaner inventory experience for professionals who do not want classifieds noise.",
  },
  {
    icon: Users2,
    title: "Roommate fit",
    text: "Opt-in matching with lifestyle signals and privacy-first profile handling.",
  },
  {
    icon: CalendarCheck2,
    title: "Visit-ready workflow",
    text: "Shortlist, save, schedule visits, and keep decisions organized in one place.",
  },
];

const ownerHighlights = [
  "Dedicated owner login",
  "Listing inventory controls",
  "Visit request management",
];

const stats = [
  { value: "3", label: "Curated launch neighborhoods" },
  { value: "2", label: "Role-based portals" },
  { value: "0", label: "Mixed owner/customer flows" },
];

const heroImage =
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85";

export default function Landing() {
  const { user } = useAuth();
  const customerEntry = user ? (user.role === "owner" ? "/dashboard" : "/interested") : "/login";
  const ownerEntry = user ? (user.role === "owner" ? "/dashboard" : "/interested") : "/owner/login";

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-inkSlate">
      <section className="relative min-h-[92svh] overflow-hidden bg-[#0f5c4a] text-white">
        <motion.img
          src={heroImage}
          alt="Premium furnished city stay interior"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: easeOut }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,92,74,0.9)_0%,rgba(15,92,74,0.68)_43%,rgba(16,185,129,0.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f7f8f5] to-transparent" />

        <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easeOut }}
            className="flex items-center justify-between py-5"
          >
            <Link to="/" className="flex items-center gap-3">
              <BrandLogo tone="light" subtitle="Premium city stays" />
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-semibold text-white/78 md:flex">
              <a href="#why" className="transition hover:text-white">
                Why URBNLY
              </a>
              <a href="#owners" className="transition hover:text-white">
                For owners
              </a>
              <a href="#contact" className="transition hover:text-white">
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to={customerEntry}
                className="hidden rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-emeraldDark sm:inline-flex"
              >
                {user ? "Open app" : "Login"}
              </Link>
              <Link
                to={user ? customerEntry : "/register"}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-emeraldDark shadow-lg shadow-emerald-950/10 transition hover:-translate-y-0.5 hover:bg-emeraldSoft"
              >
                {user ? "Go to workspace" : "Start"}
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.header>

          <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(320px,0.38fr)]">
            <div className="max-w-4xl">
              <motion.div initial="hidden" animate="visible" custom={0.08} variants={fadeUp}>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emeraldSoft backdrop-blur">
                  <Sparkles size={14} />
                  Bengaluru launch experience
                </div>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                custom={0.16}
                variants={fadeUp}
                className="mt-6 font-display text-6xl font-extrabold leading-[0.92] tracking-normal sm:text-7xl lg:text-8xl"
              >
                URBNLY
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={0.24}
                variants={fadeUp}
                className="mt-6 max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-3xl"
              >
                Premium stays near work for professionals who want a calmer move.
              </motion.p>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={0.32}
                variants={fadeUp}
                className="mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg"
              >
                Discover curated PGs and managed stays, compare commute quality,
                save shortlists, schedule visits, and move with more confidence.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={0.4}
                variants={fadeUp}
                className="mt-9 flex flex-wrap gap-3"
              >
                <Link
                  to={user ? customerEntry : "/register"}
                  className="inline-flex items-center gap-2 rounded-lg bg-emeraldAccent px-5 py-3.5 font-semibold text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#0ea673]"
                >
                  {user ? "Open seeker workspace" : "Find your stay"}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to={user ? ownerEntry : "/owner/register"}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 py-3.5 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-emeraldDark"
                >
                  <KeyRound size={18} />
                  {user?.role === "owner" ? "Manage listings" : "List your property"}
                </Link>
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 28, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.76, delay: 0.42, ease: easeOut }}
              className="hidden rounded-lg border border-white/18 bg-emerald-950/20 p-4 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl lg:block"
            >
              <div className="rounded-md bg-white p-4 text-inkSlate">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fog">
                      Featured stay
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold text-emeraldDark">
                      Whitefield premium PG
                    </h2>
                  </div>
                  <BadgeCheck className="text-emeraldAccent" size={24} />
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-md bg-mintMist px-3 py-3">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Clock3 size={16} className="text-emeraldDark" />
                      Commute estimate
                    </span>
                    <span className="text-sm font-bold text-emeraldDark">18 min</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-sandstone px-3 py-3">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Star size={16} className="fill-amber-400 text-amber-500" />
                      Quality signal
                    </span>
                    <span className="text-sm font-bold text-emeraldDark">Verified</span>
                  </div>
                  <div className="rounded-md border border-gray-100 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fog">
                      Next best action
                    </p>
                    <p className="mt-2 text-sm leading-6 text-inkSlate">
                      Save the property, compare roommate fit, or schedule a visit from your workspace.
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={stagger}
          className="grid overflow-hidden rounded-lg border border-emeraldDark/10 bg-white shadow-float md:grid-cols-3"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardIn}
              className="border-b border-emeraldDark/10 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <p className="font-display text-4xl font-extrabold text-emeraldDark">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-fog">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="why" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          className="max-w-3xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emeraldAccent">
            Why URBNLY
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-emeraldDark sm:text-5xl">
            A sharper housing workflow for people moving with purpose.
          </h2>
          <p className="mt-5 text-base leading-8 text-fog">
            The product separates discovery, decisions, visits, and owner operations
            so the experience feels focused from the first click.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
          className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={cardIn}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group rounded-lg border border-emeraldDark/10 bg-white p-6 shadow-sm transition hover:border-emeraldAccent/40 hover:shadow-float"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emeraldSoft text-emeraldDark transition group-hover:bg-emeraldDark group-hover:text-white">
                <feature.icon size={22} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-emeraldDark">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-fog">{feature.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="owners" className="bg-[#0f5c4a] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.28 }}
            variants={fadeUp}
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emeraldSoft">
              For property owners
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
              A dedicated host side, built for cleaner operations.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/72">
              Owners get their own login and dashboard instead of being squeezed
              into the customer journey. That keeps inventory, availability, and
              visit requests easier to manage.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={user ? ownerEntry : "/owner/register"}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3.5 font-semibold text-emeraldDark transition hover:-translate-y-0.5 hover:bg-emeraldSoft"
              >
                {user?.role === "owner" ? "Open owner portal" : "Create owner account"}
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid gap-4 sm:grid-cols-3"
          >
            {ownerHighlights.map((item, index) => {
              const Icon = [KeyRound, Building2, BriefcaseBusiness][index];

              return (
                <motion.div
                  key={item}
                  variants={cardIn}
                  className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-emeraldDark">
                    <Icon size={20} />
                  </div>
                  <p className="mt-5 text-base font-semibold leading-7">{item}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className="rounded-lg border border-emeraldDark/10 bg-white p-7 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emeraldSoft text-emeraldDark">
              <ShieldCheck size={22} />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold text-emeraldDark">
              Premium by default
            </h2>
            <p className="mt-4 text-sm leading-7 text-fog">
              The brand should feel selective, calm, and trustworthy. The landing
              page now leads with the product promise, then supports it with focused
              customer and owner paths.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className="rounded-lg border border-emeraldDark/10 bg-[#f2eee5] p-7 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-emeraldDark">
              <Heart size={22} />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold text-emeraldDark">
              Decisions without clutter
            </h2>
            <p className="mt-4 text-sm leading-7 text-fog">
              Searchers can move from intent to shortlist to visit without feeling
              buried in low-quality options or mixed portal actions.
            </p>
          </motion.div>
        </div>
      </section>

      <footer id="contact" className="border-t border-emeraldDark/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
          <div>
            <BrandLogo subtitle="Premium city stays" />
            <p className="mt-3 max-w-lg text-sm leading-7 text-fog">
              Premium stays for professionals building their next chapter in the city.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emeraldDark">
              Product
            </p>
            <div className="mt-4 space-y-3 text-sm text-fog">
              <p>Premium PGs and stays</p>
              <p>Commute-aware discovery</p>
              <p>Roommate matching</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emeraldDark">
              Contact
            </p>
            <div className="mt-4 space-y-3 text-sm text-fog">
              <p>hello@urbnly.in</p>
              <p>Bengaluru, India</p>
              <a
                href="https://www.linkedin.com/in/raj-motwani-978143204/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-emeraldDark transition hover:text-emeraldAccent"
              >
                Raj Motwani
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-emeraldDark/10 px-4 py-4 text-sm text-fog sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>Copyright rights @Urbn living private ltd</p>
            <p>Designed and built by Raj Motwani</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
