import { motion } from "framer-motion";
import { FileText, Shield, Coins, CheckCircle, ArrowRight, Zap, Users, MapPin, Award, Globe } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Seller Lists Land",
    description: "Property owner uploads documents and creates a verified listing on the BIMA platform",
    icon: FileText,
    color: "from-emerald-500 to-teal-600",
    details: [
      "Upload ownership documents to IPFS",
      "Set property details and pricing", 
      "Submit for multi-signature verification",
      "Track verification progress in real-time"
    ],
    stakeholder: "Land Sellers",
    benefit: "Transparent, fraud-proof listing process"
  },
  {
    number: "02", 
    title: "Multi-Signature Verification",
    description: "Trusted inspectors conduct on-ground verification and sign off using Hedera consensus",
    icon: Shield,
    color: "from-blue-500 to-indigo-600",
    details: [
      "Automatic inspector assignment based on location",
      "Physical verification by local chiefs/surveyors",
      "Dual-signature consensus requirement",
      "Reputation NFTs earned for honest verification"
    ],
    stakeholder: "Trusted Inspectors",
    benefit: "Community-driven trust and accountability"
  },
  {
    number: "03",
    title: "Tokenized on Hedera",
    description: "Title is minted as an NFT on Hedera network, creating immutable proof of ownership",
    icon: Coins,
    color: "from-purple-500 to-violet-600", 
    details: [
      "NFT minting via Hedera Token Service",
      "Smart contract escrow for payments",
      "Instant ownership transfer on purchase",
      "Permanent on-chain ownership record"
    ],
    stakeholder: "Land Buyers",
    benefit: "Instant, secure, immutable ownership"
  }
];

const keyFeatures = [
  {
    icon: Globe,
    title: "Decentralized Identifiers (DIDs)",
    description: "All participants use verifiable digital identities, reducing fraud and ensuring authenticity"
  },
  {
    icon: Award,
    title: "Reputation NFTs",
    description: "Inspectors earn non-transferable NFTs reflecting their credibility (Bronze, Silver, Gold)"
  },
  {
    icon: Zap,
    title: "Smart Escrow Payments",
    description: "HBAR payments automatically held and released upon verified title transfer"
  },
  {
    icon: MapPin,
    title: "Transparency Layer",
    description: "All interactions visible on Hedera ledger for full traceability via HashScan"
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(74,222,128,0.1),transparent_50%)]" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Revolutionary Process</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              How BIMA Works
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              Three simple steps to revolutionize land ownership with Hedera Hashgraph technology, 
              community verification, and tokenized titles on Hedera Hashgraph
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 text-sm"
            >
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">🌍 Emerging Economies</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">⚡ Hedera Powered</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">🔒 Community Verified</span>
            </motion.div>
          </motion.div>

          {/* Steps Flow */}
          <div className="relative">
            {/* Connection Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
              className="absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hidden lg:block transform origin-left"
              style={{ top: "120px" }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="relative"
                  >
                    {/* Step Card */}
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl group"
                    >
                      {/* Step Number Badge */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200,
                          delay: index * 0.2 + 0.3 
                        }}
                        className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-background shadow-lg"
                      >
                        <span className="text-2xl font-bold text-primary-foreground">
                          {step.number}
                        </span>
                      </motion.div>

                      {/* Icon */}
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="mb-6 mt-4"
                      >
                        <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${step.color} p-1 group-hover:scale-110 transition-transform duration-300`}>
                          <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                            <StepIcon className="w-12 h-12 text-primary" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold mb-3 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Details List */}
                      <div className="space-y-2 mb-6">
                        {step.details.map((detail, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + idx * 0.1 + 0.5 }}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{detail}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Stakeholder & Benefit */}
                      <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-accent" />
                          <span className="text-sm font-semibold text-accent">{step.stakeholder}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-primary">Benefit:</strong> {step.benefit}
                        </p>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-300 pointer-events-none" />
                    </motion.div>

                    {/* Arrow Between Steps (Desktop) */}
                    {index < steps.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                        className="hidden lg:flex absolute top-28 -right-6 z-10"
                      >
                        <motion.div
                          animate={{
                            x: [0, 8, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <ArrowRight className="w-12 h-12 text-primary drop-shadow-lg" />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Arrow Between Steps (Mobile) */}
                    {index < steps.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                        className="flex lg:hidden justify-center my-6"
                      >
                        <motion.div
                          animate={{
                            y: [0, 8, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="rotate-90"
                        >
                          <ArrowRight className="w-12 h-12 text-primary drop-shadow-lg" />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Key Innovation Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0 }}
            className="mt-32"
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Key Innovation Features</span>
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16">
              BIMA leverages Hedera Hashgraph technology to create a transparent, secure, and efficient land ownership ecosystem
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                >
                  <motion.div
                    className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              <span className="text-sm font-medium text-foreground">
                Powered by <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Hedera Hashgraph</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
