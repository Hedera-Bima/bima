import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Lock, Award, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";

interface InspectorData {
  name: string;
  role: string;
  badge: "Gold" | "Silver" | "Bronze";
  avatar: string;
  completedInspections: number;
  rating: number;
  specialty: string;
}

const inspectors: InspectorData[] = [
  {
    name: "James Mitchell",
    role: "Chief Inspector",
    badge: "Gold",
    avatar: "/placeholder.svg",
    completedInspections: 2847,
    rating: 9.8,
    specialty: "Commercial Properties",
  },
  {
    name: "Sarah Chen",
    role: "Senior Surveyor",
    badge: "Silver",
    avatar: "/placeholder.svg",
    completedInspections: 1923,
    rating: 9.2,
    specialty: "Residential Estates",
  },
  {
    name: "Marcus Rodriguez",
    role: "Land Officer",
    badge: "Bronze",
    avatar: "/placeholder.svg",
    completedInspections: 1245,
    rating: 8.7,
    specialty: "Agricultural Land",
  },
];

const badgeConfig = {
  Gold: {
    gradient: "from-yellow-300 via-yellow-500 to-amber-600",
    shimmer: "from-transparent via-yellow-200/60 to-transparent",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.6)]",
    ring: "ring-yellow-400/30",
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    icon: Award,
  },
  Silver: {
    gradient: "from-slate-200 via-slate-400 to-slate-600",
    shimmer: "from-transparent via-slate-300/60 to-transparent",
    glow: "shadow-[0_0_30px_rgba(148,163,184,0.5)]",
    ring: "ring-slate-400/30",
    text: "text-slate-400",
    bg: "bg-slate-400/10",
    icon: Sparkles,
  },
  Bronze: {
    gradient: "from-orange-300 via-orange-500 to-orange-700",
    shimmer: "from-transparent via-orange-300/60 to-transparent",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.5)]",
    ring: "ring-orange-500/30",
    text: "text-orange-500",
    bg: "bg-orange-500/10",
    icon: TrendingUp,
  },
};

export const TrustedInspectors = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ethereal Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10" />
      
      {/* Animated Orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[128px]"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div
          className="text-center mb-24 space-y-8"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Blockchain Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 backdrop-blur-sm"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Lock className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">
              Hedera Verified
            </span>
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>

          {/* Main Title with Gradient Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <motion.span
                className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{
                  backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Inspectors
              </motion.span>
              <br />
              <span className="text-foreground">You Can Trust</span>
            </h1>
          </motion.div>

          {/* Animated Tagline */}
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative">
              {/* Decorative Lines */}
              <motion.div
                className="absolute -left-16 sm:-left-20 top-1/2 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-primary"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
              />
              <motion.div
                className="absolute -right-16 sm:-right-20 top-1/2 w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-primary"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
              />

              <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium px-4">
                Verified by{" "}
                <motion.span
                  className="relative inline-block font-bold text-foreground"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="relative z-10">People</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-accent/40 to-accent/20 blur-lg"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.span>
                , Secured by{" "}
                <motion.span
                  className="relative inline-block font-bold text-foreground"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="relative z-10">Hedera</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20 blur-lg"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5,
                    }}
                  />
                </motion.span>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Inspector Cards Grid */}
        <div className="flex items-center justify-center mb-10">
          <Link to="/inspector-dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            Open Inspector Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {inspectors.map((inspector, index) => {
            const config = badgeConfig[inspector.badge];
            const BadgeIcon = config.icon;

            return (
              <motion.div
                key={inspector.name}
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  y: -16,
                  scale: 1.03,
                  transition: { duration: 0.3 },
                }}
                className="group relative"
              >
                {/* Card Container */}
                <div className="relative h-full bg-gradient-to-br from-card via-card to-card/80 rounded-3xl p-8 border border-border/50 overflow-hidden backdrop-blur-sm transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-2xl">
                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />

                  {/* Animated Background Orb */}
                  <motion.div
                    className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 90, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center space-y-6">
                    {/* Avatar with Verification Badge */}
                    <motion.div
                      className="relative group/avatar"
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Rotating Ring */}
                      <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} opacity-0 group-hover/avatar:opacity-100 blur-md transition-opacity`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />

                      {/* Avatar Border */}
                      <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} p-1`}>
                        <div className="w-full h-full rounded-full bg-secondary/90 flex items-center justify-center overflow-hidden ring-4 ring-background">
                          <img
                            src={inspector.avatar}
                            alt={inspector.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Verification Badge */}
                      <motion.div
                        className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center ${config.glow}`}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.15 + 0.5,
                          type: "spring",
                          stiffness: 200,
                        }}
                        whileHover={{ rotate: 360 }}
                      >
                        <Shield className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" />
                      </motion.div>
                    </motion.div>

                    {/* Name and Role */}
                    <div className="text-center space-y-2">
                      <motion.h3
                        className="text-2xl font-bold text-foreground"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.3 }}
                      >
                        {inspector.name}
                      </motion.h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
                        {inspector.role}
                      </p>
                      <p className={`text-xs ${config.text} font-semibold`}>
                        {inspector.specialty}
                      </p>
                    </div>

                    {/* NFT Badge with Shimmer */}
                    <motion.div
                      className="relative w-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className={`relative px-6 py-4 rounded-2xl bg-gradient-to-r ${config.gradient} ${config.glow} overflow-hidden`}>
                        {/* Shimmer Effect */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${config.shimmer}`}
                          animate={{
                            x: ["-200%", "200%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: "easeInOut",
                          }}
                        />

                        <div className="relative flex items-center justify-center gap-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <BadgeIcon className="w-6 h-6 text-white drop-shadow-lg" />
                          </motion.div>
                          <span className="font-black text-white text-lg uppercase tracking-wider drop-shadow-lg">
                            {inspector.badge} NFT
                          </span>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white/50 rounded-tl" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white/50 rounded-br" />
                      </div>

                      {/* Floating Particles */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`}
                          style={{
                            top: `${20 + i * 20}%`,
                            left: i % 2 === 0 ? "10%" : "90%",
                          }}
                          animate={{
                            y: [-10, -30, -10],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.4,
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Stats */}
                    <div className="w-full pt-6 border-t border-border/50 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Inspections</span>
                        <motion.span
                          className="font-bold text-foreground"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + 0.6 }}
                        >
                          {inspector.completedInspections.toLocaleString()}
                        </motion.span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + 0.7 }}
                        >
                          <span className={`font-bold text-lg ${config.text}`}>
                            {inspector.rating}
                          </span>
                          <span className="text-muted-foreground">/10</span>
                          <CheckCircle2 className={`w-4 h-4 ${config.text}`} />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Corner Decorations */}
                  <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-primary/10 rounded-tr-3xl transition-all duration-300 group-hover:border-primary/30" />
                  <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-primary/10 rounded-bl-3xl transition-all duration-300 group-hover:border-primary/30" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Trust Indicator */}
        <motion.div
          className="mt-24 flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="font-medium">All credentials verified on-chain</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-accent"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
            />
          </div>

          {/* Blockchain Animation */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-sm bg-primary/30 border border-primary/50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
