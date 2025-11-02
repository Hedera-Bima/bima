import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Shield, 
  Zap, CheckCircle,
  MapPin, Award, TrendingUp, ChevronLeft, ChevronRight as ChevronRightIcon
} from "lucide-react";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Image carousel data
  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
      title: "Premium Land Plots",
      description: "Discover prime agricultural and development land"
    },
    {
      url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80",
      title: "Verified Ownership",
      description: "Hedera-secured land titles and documentation"
    },
    {
      url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Smart Contracts",
      description: "Automated and secure land transactions"
    },
    {
      url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      title: "Global Marketplace",
      description: "Connect with land buyers worldwide"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev: number) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev: number) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const solutions = [
    {
      icon: Shield,
      title: "Tokenized Land Titles",
      description: "NFTs on Hedera represent immutable ownership proof",
      benefit: "Eliminates fraud"
    },
    {
      icon: Award,
      title: "Multi-Sig Verification",
      description: "Trusted inspectors validate through blockchain consensus",
      benefit: "Community trust"
    },
    {
      icon: Zap,
      title: "Smart Escrow",
      description: "Automated payments upon verified title transfer",
      benefit: "Instant settlement"
    },
  ];


  return (
    <div id="home" className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 text-foreground overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
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
        <motion.div
          className="absolute top-1/3 right-1/3 w-[420px] h-[420px] bg-fuchsia-500/15 rounded-full blur-[140px]"
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${(i * 40) % 360} 100% 70% / 0.5)`,
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
      </div>


      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        
        {/* Full Width Background Carousel */}
        <div className="absolute inset-0 w-full h-full">
          {carouselImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.1
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          ))}
          
          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto text-center">
            
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
            {/* Powered by Hedera Badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 mb-1 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 backdrop-blur-sm"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-6 h-6 text-accent" />
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">
                Powered by Hedera
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

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                <motion.span
                  className="inline-block bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent bg-[length:200%_auto] drop-shadow-lg"
                  animate={{
                    backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  BIMA
                </motion.span>
                <br className="leading-none" />
                <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none drop-shadow-lg">Decentralized Land Marketplace</span>
              </h1>

              <motion.p
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Trust • Speed • On-Chain Security
              </motion.p>

              <motion.p
                className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8 drop-shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Secure land transactions with Hedera-verified ownership
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Link to="/marketplace">
                  <motion.button
                    className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg overflow-hidden flex items-center gap-3 text-lg shadow-[0_0_40px_rgba(59,130,246,1)] border-2 border-white/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(59,130,246,1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <TrendingUp className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Explore Marketplace</span>
                    <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/sell-land">
                  <motion.button
                    className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg overflow-hidden flex items-center gap-3 text-lg shadow-[0_0_40px_rgba(59,130,246,1)] border-2 border-white/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(59,130,246,1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <MapPin className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">List Your Land</span>
                    <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full Width Sections */}
      <div className="w-full">
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">

          {/* Key Features - Keep the green cards appearance */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-green-400">Key Features</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.title}
                  className="group relative p-6 rounded-xl bg-green-500/10 backdrop-blur-sm border border-green-500/30 hover:border-green-400/60 transition-all hover:shadow-[0_20px_60px_rgba(34,197,94,0.25)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 40px rgba(34,197,94,0.2)"
                  }}
                >
                  <div className="relative z-10">
                    <motion.div
                      className="inline-flex p-3 rounded-lg bg-green-500/20 mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <solution.icon className="w-6 h-6 text-green-400" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2 text-green-300">{solution.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{solution.description}</p>
                    <div className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full inline-block">
                      ✓ {solution.benefit}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>


          {/* How It Works Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">How BIMA Works</span>
            </h2>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              <span className="text-foreground">Three simple steps to secure, transparent land transactions</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-green-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/20">
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Step number with enhanced design */}
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-primary rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-green-500 via-green-500 to-primary rounded-full shadow-lg group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all duration-300">
                      <span className="text-3xl font-black text-background drop-shadow-sm">1</span>
                    </div>
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-green-500/30 group-hover:border-green-500/60 transition-colors animate-pulse"></div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-green-400 transition-colors">List Your Property</h3>
                    <p className="text-muted-foreground leading-relaxed">Upload land documents and create a verified listing on the blockchain marketplace with complete transparency</p>
                    
                    {/* Feature badge */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
                      <MapPin className="w-3 h-3" />
                      Document Upload
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-green-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/20">
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Step number with enhanced design */}
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-primary rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-green-500 via-green-500 to-primary rounded-full shadow-lg group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all duration-300">
                      <span className="text-3xl font-black text-background drop-shadow-sm">2</span>
                    </div>
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-green-500/30 group-hover:border-green-500/60 transition-colors animate-pulse"></div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-green-400 transition-colors">Community Verification</h3>
                    <p className="text-muted-foreground leading-relaxed">Trusted inspectors validate ownership and property details through multi-signature consensus protocols</p>
                    
                    {/* Feature badge */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
                      <Award className="w-3 h-3" />
                      Multi-Sig Consensus
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-green-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/20">
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Step number with enhanced design */}
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-primary rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-green-500 via-green-500 to-primary rounded-full shadow-lg group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all duration-300">
                      <span className="text-3xl font-black text-background drop-shadow-sm">3</span>
                    </div>
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-green-500/30 group-hover:border-green-500/60 transition-colors animate-pulse"></div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-green-400 transition-colors">Secure Transaction</h3>
                    <p className="text-muted-foreground leading-relaxed">Complete instant, fraud-proof transactions with automated escrow and seamless title transfer</p>
                    
                    {/* Feature badge */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      Smart Escrow
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              <span className="text-foreground">Why Choose BIMA?</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <motion.div
                className="text-center p-6 rounded-xl bg-card/50 border border-border/50"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: 2.4 }}
              >
                <div className="text-3xl font-black text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Fraud Prevention</div>
              </motion.div>
              
              <motion.div
                className="text-center p-6 rounded-xl bg-card/50 border border-border/50"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: 2.5 }}
              >
                <div className="text-3xl font-black text-accent mb-2">5min</div>
                <div className="text-sm text-muted-foreground">Transaction Time</div>
              </motion.div>
              
              <motion.div
                className="text-center p-6 rounded-xl bg-card/50 border border-border/50"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: 2.6 }}
              >
                <div className="text-3xl font-black text-green-400 mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Global Access</div>
              </motion.div>
              
              <motion.div
                className="text-center p-6 rounded-xl bg-card/50 border border-border/50"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: 2.7 }}
              >
                <div className="text-3xl font-black text-blue-400 mb-2">0%</div>
                <div className="text-sm text-muted-foreground">Hidden Fees</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Impact Metrics */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Eliminates Land Fraud</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span>Minutes vs Months</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-400" />
              <span>Community-Verified Trust</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Carbon-Negative Network</span>
            </div>
          </motion.div>
          </div>
        </section>
      </div>
      <div className="pointer-events-none relative h-24 -mt-24">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[conic-gradient(from_180deg_at_50%_100%,theme(colors.primary/20),theme(colors.fuchsia.500/15),theme(colors.accent/20),transparent_70%)] blur-2xl" />
      </div>
    </div>
  );
};

export default Index;