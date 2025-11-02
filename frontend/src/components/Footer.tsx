import { motion } from "framer-motion";
import { Shield, Twitter, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  const footerLinks = {
    product: [
      { label: "How it Works", href: "https://hedera-bima.gitbook.io/hedera-bima-docs/" },
      { label: "Marketplace", href: "/hero" },
      { label: "Inspectors", href: "/trusted" },
      { label: "Pricing", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/BBjuniour", label: "Twitter" },
    { icon: Github, href: "https://github.com/mokayaj857", label: "Github" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/john-mokaya-3b926a261", label: "LinkedIn" },
    { icon: Mail, href: "6940.2021@students.ku.ac.ke", label: "Email" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative bg-gradient-to-b from-background via-background to-background/95 border-t border-primary/10 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated Orbs */}
        <motion.div
          className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.1, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -60, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-6 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Shield className="w-8 h-8 text-primary relative" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Bima
              </span>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Revolutionizing land ownership with Hedera technology. 
              Secure, transparent, and verified property transactions on Hedera.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ x: 5, color: "hsl(var(--primary))" }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="w-4 h-4" />
                <span>Nairobi, Kenya</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ x: 5, color: "hsl(var(--primary))" }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="w-4 h-4" />
                <span>+254 746271236</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                whileHover={{ x: 5, color: "hsl(var(--primary))" }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="w-4 h-4" />
                <span>6940.2021@students.ku.ac.ke</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-foreground mb-4 relative inline-block">
              Product
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-foreground mb-4 relative inline-block">
              Company
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-foreground mb-4 relative inline-block">
              Legal
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider with Animation */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Bottom Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Copyright */}
          <motion.p
            variants={itemVariants}
            className="text-sm text-muted-foreground"
          >
            © {new Date().getFullYear()} Bima. All rights reserved. 
            <span className="ml-2 text-primary/60">Built on Hedera</span>
          </motion.p>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="relative group"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 flex items-center justify-center group-hover:border-primary/30 transition-all duration-300">
                  <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Blockchain Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-xs text-primary font-medium">Hedera Hashgraph Secured</span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};