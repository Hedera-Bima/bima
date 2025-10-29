import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Wallet, ChevronRight, Shield, 
  Zap, Lock, TrendingUp, Users, CheckCircle 
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { connectHashpack } from "@/lib/hashpack";
import { Link } from "react-router-dom";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "How It Works", id: "how-it-works" },
    { name: "Inspectors", id: "inspectors" },
    { name: "Marketplace", id: "marketplace" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  const handleConnect = async () => {
    if (isConnecting) return;
    try {
      setIsConnecting(true);
      const { accountIds } = await connectHashpack('testnet');
      if (accountIds && accountIds.length > 0) {
        setAccountId(accountIds[0]);
      }
    } catch (e) {
      console.error('Failed to connect to HashPack:', e);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Hedera Security",
      description: "Immutable on-chain records",
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      description: "Lightning-fast payments and settlement",
    },
    {
      icon: Lock,
      title: "Smart Contracts",
      description: "Automated trust & escrow",
    },
  ];

  return (
    <div id="home" className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 text-foreground overflow-hidden">
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

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
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
      </div>

      {/* Header */}
      <motion.header
        className="relative z-50 border-b border-border/50 backdrop-blur-xl bg-background/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-lg opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                  <span className="text-2xl font-black text-background">Bima</span>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <motion.button
                  type="button"
                  key={link.name}
                  onClick={() => handleNavClick(link.id)}
                  className="relative px-4 py-2 text-sm font-semibold rounded-md text-foreground/80 hover:text-foreground transition-colors bg-transparent hover:bg-secondary/60 border border-transparent hover:border-primary/30 group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="relative z-10">{link.name}</span>
                  <motion.div
                    className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/10 via-accent/10 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Theme Toggle & Connect Wallet Button - Desktop */
            }
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              <motion.button
                  type="button"
                  aria-label="Connect Wallet"
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="cursor-pointer select-none flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60 focus-visible:ring-offset-background disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <motion.div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent to-primary"
                    initial={{ x: "100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <Wallet className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">
                    {isConnecting ? 'Connecting…' : accountId ? `Connected: ${accountId.slice(0,6)}…${accountId.slice(-4)}` : 'Connect Wallet'}
                  </span>
             </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link, index) => (
                  <motion.button
                    type="button"
                    key={link.name}
                    onClick={() => { handleNavClick(link.id); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/60 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.name}
                  </motion.button>
                ))}
                <div className="flex items-center gap-4 pt-4">
                  <ThemeToggle />
                  <motion.button
                    type="button"
                    aria-label="Connect Wallet"
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="cursor-pointer select-none flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60 focus-visible:ring-offset-background disabled:opacity-70 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent to-primary"
                      initial={{ x: "100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <Wallet className="w-5 h-5" />
                    <span>{isConnecting ? 'Connecting…' : accountId ? `Connected: ${accountId.slice(0,6)}…${accountId.slice(-4)}` : 'Connect Wallet'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Blockchain Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 backdrop-blur-sm"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Lock className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">
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

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
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
                Land Ownership
              </motion.span>
              <br />
              <span className="text-foreground">Reinvented</span>
            </h1>

            <motion.p
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              with Trust, Speed, and On-Chain Security
            </motion.p>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Bima connects buyers, sellers, and inspectors using Hedera's secure public ledger
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
                  <Link to="/hero">
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent text-background font-bold rounded-lg overflow-hidden flex items-center gap-3 text-lg shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59,130,246,0.7)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent to-primary"
                initial={{ x: "100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <TrendingUp className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Explore Marketplace</span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <Link to="/trusted">
            <motion.button
              className="group px-8 py-4 bg-secondary/50 backdrop-blur-sm text-foreground font-bold rounded-lg border-2 border-primary/30 hover:border-primary hover:bg-secondary transition-all flex items-center gap-3 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-6 h-6" />
              <span>Become an Inspector</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            </Link>
          
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative p-6 rounded-xl bg-secondary/30 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(59,130,246,0.2)"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div className="relative z-10">
                  <motion.div
                    className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>10,000+ Properties Listed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>500+ Verified Inspectors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>99.9% Transaction Success</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;