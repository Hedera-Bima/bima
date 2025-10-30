import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  MapPin,
  DollarSign,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  Home,
  ListChecks,
  ShoppingBag,
  Users,
  AlertCircle,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SellerDashboard = () => {
  const [selectedInspectors, setSelectedInspectors] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Mock data
  const walletBalance = "12,450.00";
  const stats = {
    landsOwned: 8,
    landsListed: 3,
    landsSold: 12,
  };

  const inspectors = [
    { id: "1", name: "John Smith", rating: 4.8, verifications: 156 },
    { id: "2", name: "Sarah Johnson", rating: 4.9, verifications: 203 },
    { id: "3", name: "Michael Chen", rating: 4.7, verifications: 142 },
    { id: "4", name: "Emma Davis", rating: 4.9, verifications: 189 },
  ];

  const verificationCards = [
    {
      id: "1",
      title: "Downtown Plot #4523",
      location: "Manhattan, NY",
      status: "pending",
      inspector: "John Smith",
      date: "2024-03-15",
    },
    {
      id: "2",
      title: "Suburban Land #8912",
      location: "Brooklyn, NY",
      status: "verified",
      inspector: "Sarah Johnson",
      date: "2024-03-12",
    },
    {
      id: "3",
      title: "Commercial Plot #1234",
      location: "Queens, NY",
      status: "rejected",
      inspector: "Michael Chen",
      date: "2024-03-10",
      reason: "Boundary dispute pending resolution",
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInspector = (inspectorId: string) => {
    setSelectedInspectors((prev) =>
      prev.includes(inspectorId)
        ? prev.filter((id) => id !== inspectorId)
        : [...prev, inspectorId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "verified":
        return <CheckCircle className="w-5 h-5" />;
      case "rejected":
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-warning bg-warning/10 text-warning";
      case "verified":
        return "border-success bg-success/10 text-success";
      case "rejected":
        return "border-destructive bg-destructive/10 text-destructive";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 text-foreground overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
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
            ease: [0.45, 0, 0.55, 1],
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
            ease: [0.45, 0, 0.55, 1],
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl font-black mb-4"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          >
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent bg-[length:200%_auto]">
              Seller Dashboard
            </span>
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Manage your land listings and track verifications
          </motion.p>
        </motion.div>

        {/* Wallet & Stats Overview */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Wallet Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden"
            whileHover={{
              y: -8,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: "radial-gradient(circle at center, hsl(var(--primary) / 0.1), transparent 70%)",
              }}
              initial={false}
              transition={{ duration: 0.5 }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Wallet className="w-6 h-6 text-primary" />
                </motion.div>
                <motion.div
                  className="w-2 h-2 rounded-full bg-success"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <motion.p 
                className="text-sm text-muted-foreground mb-2"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                Wallet Balance
              </motion.p>
              <motion.p 
                className="text-3xl font-black text-foreground"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                ${walletBalance}
              </motion.p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {[
            { icon: Home, label: "Lands Owned", value: stats.landsOwned, color: "from-primary/20 to-primary-glow/20" },
            { icon: ListChecks, label: "Listed", value: stats.landsListed, color: "from-accent/20 to-primary/20" },
            { icon: ShoppingBag, label: "Sold", value: stats.landsSold, color: "from-success/20 to-accent/20" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500"
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="relative z-10">
                <motion.div 
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <motion.p 
                  className="text-sm text-muted-foreground mb-2"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {stat.label}
                </motion.p>
                <motion.p 
                  className="text-3xl font-black text-foreground"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.value}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* List New Land Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <motion.div 
            className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 overflow-hidden"
            whileHover={{ borderColor: "hsl(var(--primary) / 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10">
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.div 
                  className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <FileText className="w-6 h-6 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-black">List New Land</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="titleId" className="text-sm font-semibold mb-2 block">
                      Title ID
                    </Label>
                    <Input
                      id="titleId"
                      placeholder="Enter title ID"
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm font-semibold mb-2 block">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Enter location"
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="size" className="text-sm font-semibold mb-2 block">
                        Size (sq ft)
                      </Label>
                      <Input
                        id="size"
                        type="number"
                        placeholder="0"
                        className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price" className="text-sm font-semibold mb-2 block">
                        Price ($)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="0.00"
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold mb-2 block">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the land..."
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">
                      Land Image
                    </Label>
                    <motion.div
                      className="relative border-2 border-dashed border-border/50 rounded-xl p-8 hover:border-primary/50 transition-all duration-500 cursor-pointer bg-background/30"
                      whileHover={{ scale: 1.02, borderColor: "hsl(var(--primary) / 0.5)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <AnimatePresence mode="wait">
                        {imagePreview ? (
                          <motion.div 
                            key="preview"
                            className="relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                              layoutId="image"
                            />
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg flex items-end justify-center pb-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <span className="text-sm font-semibold text-foreground">
                                Click to change image
                              </span>
                            </motion.div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="placeholder"
                            className="flex flex-col items-center justify-center text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div
                              className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4"
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <ImageIcon className="w-8 h-8 text-primary" />
                            </motion.div>
                            <p className="text-sm font-semibold mb-1">Upload Image</p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG up to 10MB
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Select Inspectors */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Select Inspectors
                    </Label>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {inspectors.map((inspector) => (
                        <motion.div
                          key={inspector.id}
                          className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                            selectedInspectors.includes(inspector.id)
                              ? "border-primary bg-primary/5"
                              : "border-border/50 bg-background/30 hover:border-primary/30"
                          }`}
                          onClick={() => toggleInspector(inspector.id)}
                          whileHover={{ 
                            scale: 1.02,
                            y: -2,
                            transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                          }}
                          whileTap={{ scale: 0.98 }}
                          layout
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm">{inspector.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {inspector.verifications} verifications
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-warning text-lg">★</span>
                                <span className="text-sm font-semibold">
                                  {inspector.rating}
                                </span>
                              </div>
                              <motion.div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedInspectors.includes(inspector.id)
                                    ? "border-primary bg-primary"
                                    : "border-border"
                                }`}
                                animate={{
                                  scale: selectedInspectors.includes(inspector.id)
                                    ? [1, 1.2, 1]
                                    : 1,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <AnimatePresence>
                                  {selectedInspectors.includes(inspector.id) && (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      exit={{ scale: 0, rotate: 180 }}
                                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.div 
                className="mt-8" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Button className="w-full py-6 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 relative overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent to-primary"
                      initial={{ x: "100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <motion.span 
                      className="relative z-10 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Upload className="w-5 h-5" />
                      </motion.div>
                      List Land for Verification
                    </motion.span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Verification Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-black">Verification Status</h2>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.5,
                },
              },
            }}
          >
            {verificationCards.map((card, index) => (
              <motion.div
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                className="group relative rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden"
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="relative z-10 p-6">
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 ${getStatusColor(card.status)}`}>
                    {getStatusIcon(card.status)}
                    <span className="text-xs font-bold uppercase">
                      {card.status}
                    </span>
                  </div>

                  {/* Card Content */}
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{card.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{card.inspector}</span>
                    </div>
                  </div>

                  {card.reason && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                      <p className="text-xs text-destructive font-semibold">
                        {card.reason}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">{card.date}</span>
                    <motion.button
                      className="text-xs font-semibold text-primary hover:text-primary-glow transition-colors relative group/btn"
                      whileHover={{ scale: 1.05, x: 3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="relative">
                        View Details
                        <motion.span
                          className="inline-block ml-1"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          →
                        </motion.span>
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerDashboard;