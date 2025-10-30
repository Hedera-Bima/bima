import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ExternalLink,
  TrendingUp,
  DollarSign,
  Upload,
  Download,
  Zap,
  Eye
} from "lucide-react";

interface LandListing {
  id: string;
  location: string;
  area: string;
  price: string;
  ownerDID: string;
  verificationStatus: "verified" | "pending" | "in-progress";
  inspectors: number;
  imageGradient: string;
  lastUpdated: string;
  imageUrl?: string;
}

// Resolve available images from src/assets at build time (Vite)
const assetImages = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  as: "url",
}) as Record<string, string>;

const findImageByName = (name: string): string | undefined => {
  const lowerName = name.toLowerCase();
  const entries = Object.entries(assetImages);
  const match = entries.find(([path]) => path.toLowerCase().includes(`/${lowerName}.`));
  if (match) return match[1];
  // fallback: contains name anywhere in basename
  const loose = entries.find(([path]) => path.toLowerCase().includes(lowerName));
  return loose ? loose[1] : undefined;
};

// Bind exact images: moon, barn, valley, run
const allAssets = Object.values(assetImages);
const imgMoon = findImageByName("moon") || allAssets[0];
const imgBarn = findImageByName("barn") || allAssets[1] || allAssets[0];
const imgValley = findImageByName("valley") || allAssets[2] || allAssets[0];
const imgRun = findImageByName("run") || allAssets[3] || allAssets[0];

const buyListings: LandListing[] = [
  {
    id: "1",
    location: "Nairobi, Karen",
    area: "2.5 acres",
    price: "45,000,000",
    ownerDID: "did:hedera:testnet:z6Mk...",
    verificationStatus: "verified",
    inspectors: 3,
    imageGradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    lastUpdated: "2 hours ago",
    imageUrl: imgMoon,
  },
  {
    id: "2",
    location: "Kiambu, Limuru",
    area: "5.0 acres",
    price: "78,500,000",
    ownerDID: "did:hedera:testnet:z8Qr...",
    verificationStatus: "in-progress",
    inspectors: 2,
    imageGradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
    lastUpdated: "5 hours ago",
    imageUrl: imgBarn,
  },
  {
    id: "3",
    location: "Machakos, Konza",
    area: "10.0 acres",
    price: "120,000,000",
    ownerDID: "did:hedera:testnet:z3Hv...",
    verificationStatus: "verified",
    inspectors: 5,
    imageGradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    lastUpdated: "1 day ago",
    imageUrl: imgValley,
  },
  {
    id: "4",
    location: "Nakuru, Elementaita",
    area: "7.5 acres",
    price: "95,000,000",
    ownerDID: "did:hedera:testnet:z9Km...",
    verificationStatus: "pending",
    inspectors: 0,
    imageGradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
    lastUpdated: "3 days ago",
    imageUrl: imgRun,
  },
];

// Import SellerDashboard component content
const SellLandContent = () => {
  
  const sellerStats = {
    totalListings: 8,
    activeListings: 3,
    soldProperties: 2,
    totalRevenue: "78,500,000 KES",
    averageVerificationTime: "5.2 days",
    successRate: 95
  };

  return (
    <div className="w-full">
      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-muted-foreground">Total Listings</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{sellerStats.totalListings}</div>
        </div>

        <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-muted-foreground">Active Listings</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{sellerStats.activeListings}</div>
        </div>

        <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{sellerStats.totalRevenue}</div>
        </div>

        <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm text-muted-foreground">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{sellerStats.successRate}%</div>
        </div>
      </motion.div>

      {/* Create Listing Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        <h3 className="text-2xl font-bold">Create New Land Listing</h3>

        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Title</label>
                    <input 
                      type="text" 
                      placeholder="Enter property title"
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input 
                      type="text" 
                      placeholder="City, Area/Estate"
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area Size</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 2.5 acres"
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (KES)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 45,000,000"
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Documents Upload */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Required Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Title Deed', 'Survey Report', 'Tax Certificate'].map((doc) => (
                    <div key={doc} className="p-4 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">{doc}</p>
                        <p className="text-xs text-muted-foreground">Click to upload</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
                  <Download className="w-4 h-4" />
                  Save as Draft
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Shield className="w-4 h-4" />
                  Submit for Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


const statusConfig = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.4)]",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.4)]",
    bgGradient: "from-amber-500/10 to-orange-500/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    gradient: "from-slate-500 to-gray-500",
    glow: "shadow-[0_0_30px_rgba(148,163,184,0.3)]",
    bgGradient: "from-slate-500/10 to-gray-500/10",
  },
};

export const MarketplacePreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        {/* Grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "50px 50px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Background visuals reduced for clarity */}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/20 border border-border/50 mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-foreground/90">
              Live Marketplace
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="text-foreground/95">
              {activeTab === 'buy' ? 'Featured Land Listings' : 'Sell Your Land'}
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-foreground/85 max-w-2xl mx-auto"
          >
            {activeTab === 'buy' 
              ? 'Browse verified properties with transparent ownership records secured on Hedera blockchain'
              : 'Transform your property into a digital asset with blockchain-verified ownership and reach global buyers through our secure marketplace'
            }
          </motion.p>

          {/* Buy/Sell Toggle Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 mb-8"
          >
            <motion.button
              onClick={() => setActiveTab('buy')}
              className={`group relative px-8 py-4 font-bold rounded-lg overflow-hidden flex items-center gap-3 text-lg transition-all duration-300 ${
                activeTab === 'buy'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_40px_rgba(59,130,246,1)] border-2 border-white/30 backdrop-blur-sm'
                  : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === 'buy' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className="relative z-10">Buy Land</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('sell')}
              className={`group relative px-8 py-4 font-bold rounded-lg overflow-hidden flex items-center gap-3 text-lg transition-all duration-300 ${
                activeTab === 'sell'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_40px_rgba(59,130,246,1)] border-2 border-white/30 backdrop-blur-sm'
                  : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === 'sell' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className="relative z-10">Sell Land</span>
            </motion.button>
          </motion.div>

          {/* Decorative lines */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]"
            />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
          </motion.div>
        </motion.div>

        {/* Listings Grid */}
        {activeTab === 'buy' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyListings.map((listing: LandListing, index: number) => {
            const status = statusConfig[listing.verificationStatus];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -25 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateY: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -15,
                  scale: 1.03,
                  rotateY: 5,
                  rotateX: -5,
                  transition: { 
                    duration: 0.4,
                    ease: "easeOut"
                  },
                }}
                onHoverStart={() => setHoveredCard(listing.id)}
                onHoverEnd={() => setHoveredCard(null)}
                style={{ perspective: 1000 }}
                className="group relative"
              >
                {/* Animated border gradient */}
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-2xl opacity-0"
                  animate={{
                    opacity: hoveredCard === listing.id ? 1 : 0,
                    rotate: hoveredCard === listing.id ? 360 : 0,
                  }}
                  transition={{ 
                    opacity: { duration: 0.3 },
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                  }}
                />

                {/* Card */}
                <div className="relative h-full bg-card rounded-2xl border border-border/70 overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                  {/* Animated shine effect */}
                  
                  {/* Animated gradient background on hover */}
                  

                  {/* Top glow effect */}
                  <motion.div 
                    className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{
                      opacity: hoveredCard === listing.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Corner accents */}
                  {[
                    { top: 0, left: 0, rotate: 0 },
                    { top: 0, right: 0, rotate: 90 },
                    { bottom: 0, right: 0, rotate: 180 },
                    { bottom: 0, left: 0, rotate: 270 },
                  ].map((position, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4"
                      style={{ ...position }}
                      initial={{ scale: 0, rotate: position.rotate }}
                      animate={
                        hoveredCard === listing.id
                          ? { scale: 1, rotate: position.rotate + 180 }
                          : { scale: 0, rotate: position.rotate }
                      }
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <div className="w-full h-full border-t-2 border-l-2 border-primary rounded-tl-lg" />
                    </motion.div>
                  ))}

                  {/* Content */}
                  <div className="relative p-6 space-y-4">
                    {/* Image area: show provided image if available, else neutral background */}
                    <motion.div 
                      className={`relative h-40 -mx-6 -mt-6 mb-4 bg-muted overflow-hidden`}
                      animate={{
                        scale: hoveredCard === listing.id ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {listing.imageUrl && (
                        <img
                          src={listing.imageUrl}
                          alt={`${listing.location} land`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      {/* Animated grid overlay */}
                      <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                        animate={{
                          backgroundPosition: hoveredCard === listing.id 
                            ? ["0px 0px", "40px 40px"]
                            : ["0px 0px", "20px 20px"],
                        }}
                        transition={{
                          duration: hoveredCard === listing.id ? 5 : 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      {/* Scan line effect */}
                      

                      {/* Verification badge overlay */}
                      <div className="absolute top-3 right-3">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={isInView ? { scale: 1, rotate: 0 } : {}}
                          whileHover={{ 
                            scale: 1.15, 
                            rotate: [0, -5, 5, -5, 0],
                            transition: { duration: 0.5 }
                          }}
                          transition={{ delay: index * 0.2 + 0.5, duration: 0.6, type: "spring" }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-md border-2 ${
                            hoveredCard === listing.id ? 'border-primary' : 'border-border'
                          } cursor-pointer transition-all duration-300`}
                        >
                          <StatusIcon className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-semibold text-foreground/90">
                            {status.label}
                          </span>
                        </motion.div>
                      </div>

                      {/* Floating elements */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full bg-white/20 blur-xl"
                          style={{
                            width: `${40 + i * 20}px`,
                            height: `${40 + i * 20}px`,
                            top: `${20 + i * 15}%`,
                            left: `${10 + i * 20}%`,
                          }}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.5, 0.2],
                            x: [0, 20, 0],
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                          }}
                        />
                      ))}

                      {/* Lightning effect on hover */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        animate={{
                          scale: hoveredCard === listing.id ? [0, 1.5, 0] : 0,
                          opacity: hoveredCard === listing.id ? [0, 1, 0] : 0,
                        }}
                        transition={{
                          duration: 0.6,
                        }}
                      >
                        <Zap className="w-12 h-12 text-yellow-400" />
                      </motion.div>
                    </motion.div>

                    {/* Location */}
                    <motion.div 
                      className="flex items-start gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{
                          y: hoveredCard === listing.id ? [0, -3, 0] : 0,
                        }}
                        transition={{
                          duration: 1,
                          repeat: hoveredCard === listing.id ? Infinity : 0,
                        }}
                      >
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      </motion.div>
                      <div>
                        <motion.h3 
                          className="font-bold text-lg group-hover:text-primary transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          {listing.location}
                        </motion.h3>
                        <p className="text-sm text-muted-foreground">{listing.area}</p>
                      </div>
                    </motion.div>

                    {/* Price */}
                    <motion.div
                      className="relative pt-2 pb-3 border-y border-border/50 overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Price highlight animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                        animate={{
                          x: hoveredCard === listing.id ? ["-100%", "200%"] : "-100%",
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: hoveredCard === listing.id ? Infinity : 0,
                          ease: "easeInOut",
                        }}
                      />
                      <p className="text-xs text-foreground/80 mb-1 relative z-10">Price</p>
                      <motion.p 
                        className="text-2xl font-bold text-foreground relative z-10"
                        animate={{
                          scale: hoveredCard === listing.id ? [1, 1.05, 1] : 1,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                      >
                        KES {listing.price}
                      </motion.p>
                    </motion.div>

                    {/* Owner DID */}
                    <motion.div 
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/60 group-hover:bg-muted/70 transition-colors duration-300 relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0"
                        animate={{
                          x: hoveredCard === listing.id ? ["-100%", "100%"] : "-100%",
                        }}
                        transition={{
                          duration: 1,
                          repeat: hoveredCard === listing.id ? Infinity : 0,
                        }}
                      />
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                      </motion.div>
                      <div className="flex-1 min-w-0 relative z-10">
                        <p className="text-xs text-muted-foreground mb-0.5">Owner DID</p>
                        <p className="text-xs font-mono truncate text-foreground/80">
                          {listing.ownerDID}
                        </p>
                      </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div 
                      className="flex items-center justify-between text-xs text-foreground pt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.2 + 0.6 }}
                    >
                      <motion.div 
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </motion.div>
                        <span>{listing.inspectors} inspectors</span>
                      </motion.div>
                      <motion.span
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        {listing.lastUpdated}
                      </motion.span>
                    </motion.div>

                    {/* View Details Button */}
                    <Link to={`/land/${listing.id}`}>
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          y: -2,
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="relative w-full mt-4 py-3 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 hover:bg-primary/90"
                      >
                        <span className="relative z-10">View Details</span>
                        <motion.div
                          animate={{
                            x: hoveredCard === listing.id ? [0, 5, 0] : 0,
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: hoveredCard === listing.id ? Infinity : 0,
                          }}
                          className="relative z-10"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.div>
                      </motion.button>
                    </Link>
                  </div>

                  {/* Bottom glow effect */}
                  <motion.div 
                    className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{
                      opacity: hoveredCard === listing.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Floating particles on hover */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`card-particle-${i}`}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      left: `${15 + i * 15}%`,
                      top: i % 2 === 0 ? "20%" : "80%",
                      background: `hsl(${260 + i * 20}, 80%, 60%)`,
                    }}
                    animate={{
                      y: hoveredCard === listing.id ? [0, -40, -80] : 0,
                      opacity: hoveredCard === listing.id ? [0, 1, 0] : 0,
                      scale: hoveredCard === listing.id ? [0, 1.5, 0] : 0,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: hoveredCard === listing.id ? Infinity : 0,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}

                {/* Orbital particles */}
                {hoveredCard === listing.id && [...Array(4)].map((_, i) => (
                  <motion.div
                    key={`orbital-${i}`}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                    }}
                    animate={{
                      x: [
                        0,
                        Math.cos((i * Math.PI) / 2) * 100,
                        Math.cos((i * Math.PI) / 2 + Math.PI) * 100,
                        0,
                      ],
                      y: [
                        0,
                        Math.sin((i * Math.PI) / 2) * 100,
                        Math.sin((i * Math.PI) / 2 + Math.PI) * 100,
                        0,
                      ],
                      opacity: [0, 0.8, 0.8, 0],
                      scale: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            );
          })}
          </div>
        ) : (
          <SellLandContent />
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-primary via-purple-500 to-secondary text-primary-foreground font-bold text-lg transition-all duration-300 group"
          >
            <span className="flex items-center gap-3">
              View All Listings
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ExternalLink className="w-5 h-5" />
              </motion.div>
            </span>
          </motion.button>

          {/* Blockchain verification indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 1 }}
            className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
            <span>All listings verified on Hedera blockchain</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketplacePreview;