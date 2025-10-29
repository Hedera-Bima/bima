import { motion } from "framer-motion";
import { MapPin, DollarSign, Shield, CheckCircle2, TrendingUp, Sparkles, Eye, Heart, Clock, User, Zap, Star, Globe, Lock } from "lucide-react";
import { useState } from "react";

interface LandListing {
  id: string;
  title: string;
  location: string;
  price: number;
  area: string;
  ownerDID: string;
  ownerName: string;
  verificationLevel: "Premium" | "Verified" | "Standard";
  image: string;
  views: number;
  likes: number;
  listedTime: string;
  features: string[];
}

const listings: LandListing[] = [
  {
    id: "1",
    title: "Prime Waterfront Estate",
    location: "Malibu, California",
    price: 4500000,
    area: "5.2 acres",
    ownerDID: "did:eth:0x1a2b...9f3e",
    ownerName: "Sarah Martinez",
    verificationLevel: "Premium",
    image: "/placeholder.svg",
    views: 1247,
    likes: 89,
    listedTime: "2 hours ago",
    features: ["Ocean View", "Private Beach", "Utilities Ready"]
  },
  {
    id: "2",
    title: "Mountain Valley Ranch",
    location: "Aspen, Colorado",
    price: 3200000,
    area: "12.8 acres",
    ownerDID: "did:eth:0x7c8d...4b2a",
    ownerName: "Michael Chen",
    verificationLevel: "Verified",
    image: "/placeholder.svg",
    views: 892,
    likes: 67,
    listedTime: "5 hours ago",
    features: ["Mountain View", "River Access", "Forest Area"]
  },
  {
    id: "3",
    title: "Urban Development Plot",
    location: "Austin, Texas",
    price: 1800000,
    area: "3.4 acres",
    ownerDID: "did:eth:0x9e4f...7d1c",
    ownerName: "Jennifer Park",
    verificationLevel: "Standard",
    image: "/placeholder.svg",
    views: 634,
    likes: 45,
    listedTime: "1 day ago",
    features: ["City Center", "Zoned Commercial", "High Traffic"]
  },
  {
    id: "4",
    title: "Luxury Vineyard Estate",
    location: "Napa Valley, California",
    price: 6200000,
    area: "25.6 acres",
    ownerDID: "did:eth:0x3f2e...8c9b",
    ownerName: "Robert Williams",
    verificationLevel: "Premium",
    image: "/placeholder.svg",
    views: 1589,
    likes: 124,
    listedTime: "3 hours ago",
    features: ["Vineyard", "Wine Cellar", "Luxury Estate"]
  },
  {
    id: "5",
    title: "Coastal Development Land",
    location: "Miami, Florida",
    price: 2900000,
    area: "8.3 acres",
    ownerDID: "did:eth:0x6b7a...5e4d",
    ownerName: "Amanda Foster",
    verificationLevel: "Verified",
    image: "/placeholder.svg",
    views: 967,
    likes: 73,
    listedTime: "6 hours ago",
    features: ["Beach Access", "Development Ready", "Prime Location"]
  },
  {
    id: "6",
    title: "Agricultural Farmland",
    location: "Iowa Countryside",
    price: 950000,
    area: "45.7 acres",
    ownerDID: "did:eth:0x2d3c...1f8e",
    ownerName: "David Thompson",
    verificationLevel: "Standard",
    image: "/placeholder.svg",
    views: 512,
    likes: 38,
    listedTime: "2 days ago",
    features: ["Fertile Soil", "Irrigation System", "Equipment Included"]
  }
];

const verificationConfig = {
  Premium: {
    gradient: "from-purple-400 via-pink-500 to-purple-600",
    shimmer: "from-transparent via-purple-300/60 to-transparent",
    glow: "shadow-[0_0_50px_rgba(168,85,247,0.8)]",
    text: "text-purple-400",
    icon: Sparkles,
    particles: "bg-purple-400"
  },
  Verified: {
    gradient: "from-blue-400 via-cyan-500 to-blue-600",
    shimmer: "from-transparent via-cyan-300/60 to-transparent",
    glow: "shadow-[0_0_50px_rgba(59,130,246,0.7)]",
    text: "text-blue-400",
    icon: CheckCircle2,
    particles: "bg-cyan-400"
  },
  Standard: {
    gradient: "from-emerald-400 via-teal-500 to-emerald-600",
    shimmer: "from-transparent via-emerald-300/60 to-transparent",
    glow: "shadow-[0_0_50px_rgba(16,185,129,0.7)]",
    text: "text-emerald-400",
    icon: Shield,
    particles: "bg-emerald-400"
  },
};

export default function MarketplacePreview() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ultra Dynamic Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"
          animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Mega Floating Orbs */}
      <motion.div
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[180px]"
        animate={{
          x: [0, 150, -50, 0],
          y: [0, -150, 100, 0],
          scale: [1, 1.4, 1.1, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-pink-500/15 rounded-full blur-[180px]"
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -80, 0],
          scale: [1, 1.3, 1.2, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[180px]"
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 80, -100, 0],
          scale: [1, 1.35, 1.15, 1],
        }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Enhanced Floating Particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1 + "px",
            height: Math.random() * 4 + 1 + "px",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? "rgba(168, 85, 247, 0.6)" : i % 3 === 1 ? "rgba(236, 72, 153, 0.6)" : "rgba(34, 211, 238, 0.6)",
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting Stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
          }}
          animate={{
            x: [0, 300],
            y: [0, 150],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 7,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Epic Header Section */}
        <motion.div
          className="text-center mb-24 space-y-10"
          initial={{ opacity: 0, y: -80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, type: "spring" }}
        >
          {/* Floating Badges */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border border-purple-500/40 backdrop-blur-xl"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1.2, delay: 0.2, y: { type: "tween", duration: 3, repeat: Infinity, ease: "easeInOut" } }}
              whileHover={{ scale: 1.08, rotate: 2 }}
              animate={{ y: [0, -8, 0] }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </motion.div>
              <span className="text-sm font-bold text-purple-400 tracking-wider uppercase">Live Marketplace</span>
              <motion.div
                className="w-2 h-2 rounded-full bg-purple-400"
                animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 border border-cyan-500/40 backdrop-blur-xl"
              initial={{ scale: 0, rotate: 180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1.2, delay: 0.4, y: { type: "tween", duration: 3, repeat: Infinity, ease: "easeInOut" } }}
              whileHover={{ scale: 1.08, rotate: -2 }}
              animate={{ y: [0, -10, 0] }}
            >
              <Lock className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-400 tracking-wider uppercase">Blockchain Secured</span>
              <motion.div animate={{ rotate: [0, 180, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                <Shield className="w-4 h-4 text-cyan-400" />
              </motion.div>
            </motion.div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
              <motion.span
                className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                Premium
              </motion.span>
              <br />
              <motion.span
                className="inline-block bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                Land
              </motion.span>
              {" "}
              <span className="text-white">Marketplace</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            className="relative inline-block max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="relative px-8 py-4">
              <p className="text-2xl sm:text-3xl md:text-4xl text-slate-300 font-medium">
                Discover{" "}
                <motion.span className="relative inline-block font-black" whileHover={{ scale: 1.08 }}>
                  <span className="relative z-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">verified properties</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-pink-500/40 blur-2xl"
                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.span>
                {" "}secured by{" "}
                <motion.span className="relative inline-block font-black" whileHover={{ scale: 1.08 }}>
                  <span className="relative z-10 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">blockchain</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 blur-2xl"
                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </motion.span>
              </p>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            className="flex items-center justify-center gap-8 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            {[
              { icon: Globe, value: "50K+", label: "Active Listings" },
              { icon: Zap, value: "99.9%", label: "Verified" },
              { icon: Star, value: "4.9/5", label: "Rating" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl"
                whileHover={{ scale: 1.05, y: -5 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ y: { type: "tween", duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" } }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.5 }}>
                  <stat.icon className="w-6 h-6 text-purple-400" />
                </motion.div>
                <div className="text-left">
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {listings.map((listing, index) => {
            const config = verificationConfig[listing.verificationLevel];
            const VerificationIcon = config.icon;
            const isHovered = hoveredCard === listing.id;
            const isLiked = likedCards.has(listing.id);

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 120, scale: 0.7 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.9,
                  delay: index * 0.12,
                  type: "spring",
                  stiffness: 80,
                }}
                whileHover={{
                  y: -25,
                  scale: 1.03,
                  transition: { duration: 0.4, type: "spring", stiffness: 300 },
                }}
                onHoverStart={() => setHoveredCard(listing.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group relative cursor-pointer"
              >
                <motion.div
                  className={`absolute -inset-2 rounded-3xl bg-gradient-to-r ${config.gradient} opacity-0 blur-2xl group-hover:opacity-60 transition-opacity duration-500`}
                  animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                />

                <div className="relative h-full bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-800/95 rounded-3xl overflow-hidden backdrop-blur-2xl border-2 border-slate-700/50 transition-all duration-500 group-hover:border-purple-500/70">
                  <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/95 z-10" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-pink-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={isHovered ? { opacity: [0, 0.3, 0] } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    <motion.div
                      className="w-full h-full relative"
                      animate={{ scale: isHovered ? 1.15 : 1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                      <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                      
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                      />
                    </motion.div>

                    <motion.div
                      className="absolute top-5 right-5 z-20"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.12 + 0.4, type: "spring", stiffness: 250 }}
                      whileHover={{ scale: 1.15, rotate: 360 }}
                    >
                      <div className={`relative px-5 py-2.5 rounded-full bg-gradient-to-r ${config.gradient} ${config.glow} backdrop-blur-xl flex items-center gap-2 overflow-hidden`}>
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${config.shimmer} rounded-full`}
                          animate={{ x: ["-200%", "200%"] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="relative z-10"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <VerificationIcon className="w-4 h-4 text-white" />
                        </motion.div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider relative z-10">{listing.verificationLevel}</span>
                      </div>
                    </motion.div>

                    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                      <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.12 + 0.4 }}
                      >
                        <motion.div
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span className="text-xs font-medium text-white">{listing.views}</span>
                        </motion.div>
                        <motion.button
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleLike(listing.id)}
                        >
                          <motion.div animate={isLiked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                            <Heart className={`w-3 h-3 ${isLiked ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
                          </motion.div>
                          <span className="text-xs font-medium text-white">{isLiked ? listing.likes + 1 : listing.likes}</span>
                        </motion.button>
                      </motion.div>
                    </div>

                    {isHovered && [...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full ${config.particles} z-20`}
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ y: [-20, -80], opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                      />
                    ))}
                  </div>

                  <div className="relative p-6 space-y-4">
                    <motion.div
                      className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${config.gradient} opacity-20 rounded-full blur-3xl`}
                      animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <div className="relative space-y-2">
                      <h3 className="text-xl font-bold text-white line-clamp-1">{listing.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium line-clamp-1">{listing.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-5 h-5 text-emerald-400" />
                          <span className="text-2xl font-black text-white">${(listing.price / 1000000).toFixed(1)}M</span>
                        </div>
                        <p className="text-xs text-slate-500">USD</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{listing.area}</p>
                        <p className="text-xs text-slate-500">Total Area</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {listing.features.map((feature, i) => (
                        <motion.span
                          key={i}
                          className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs font-medium text-slate-300"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.12 + 0.6 + i * 0.1 }}
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                        >
                          {feature}
                        </motion.span>
                      ))}
                    </div>

                    <motion.div
                      className="relative px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-slate-900/80 border-2 border-slate-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400">Owner</p>
                          <p className="text-sm font-bold text-white">{listing.ownerName}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-1">Blockchain Identity</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-slate-300 bg-slate-900/50 px-2 py-1 rounded flex-1">
                            {listing.ownerDID}
                          </code>
                          <motion.div
                            className="w-2 h-2 rounded-full bg-emerald-400"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [1, 0.6, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    <div className="flex items-center gap-2 text-slate-500 text-xs pt-2">
                      <Clock className="w-3 h-3" />
                      <span>Listed {listing.listedTime}</span>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-purple-500/20 rounded-tl-2xl transition-all duration-300 group-hover:border-purple-400/60" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-purple-500/20 rounded-br-2xl transition-all duration-300 group-hover:border-purple-400/60" />
                </div>

                {isHovered && (
                  <motion.div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 z-30"
                    initial={{ opacity: 0, y: 20, scale: 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0 }}
                  >
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} ${config.glow} backdrop-blur-xl`}>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        View Details
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            className="relative px-10 py-5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold text-lg overflow-hidden group shadow-2xl shadow-purple-500/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Explore All Listings
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </span>
          </motion.button>

          <div className="flex items-center justify-center gap-3 text-sm text-slate-400">
            <motion.div
              className="w-2 h-2 rounded-full bg-purple-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="font-medium">All listings verified on-chain</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-pink-400"
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

          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-sm bg-purple-500/30 border border-purple-500/50"
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
}