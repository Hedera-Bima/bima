import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  User,
  Shield,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  FileText,
  Download,
  Eye,
  Wallet,
  Heart,
  Share2,
  Phone,
  Mail,
  Navigation,
  Zap,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";

// Route-driven component: landId is read from URL params

interface PropertyImage {
  id: string;
  url: string;
  title: string;
  description?: string;
}

interface Document {
  cid: any;
  id: string;
  name: string;
  type: "title-deed" | "survey" | "certificate" | "inspection";
  verified: boolean;
  uploadDate: string;
  size: string;
}

interface InspectionReport {
  id: string;
  inspectorName: string;
  rating: number;
  date: string;
  summary: string;
  verified: boolean;
}

const LandDetails: React.FC = () => {
  const params = useParams<{ landId: string }>();
  const landId = params.landId as string | undefined;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "location" | "documents" | "history"
  >("overview");
  const [isLiked, setIsLiked] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  // Fetch property data from backend
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        if (!landId) {
          setError("Invalid property ID");
          setLoading(false);
          return;
        }

        // Try fetching from main backend first (newly created listings)
        let match: any = null;
        try {
          const backendRes = await fetch(
            `http://localhost:5000/api/listings/${landId}`,
          );
          if (backendRes.ok) {
            match = await backendRes.json();
            // Mark as coming from main backend
            match.source = "backend";
          }
        } catch (err) {
          console.log("Not found in main backend, checking Hedera backend...");
        }

        // If not found, try Hedera backend
        if (!match) {
          const res = await api.getParcels();
          const items = Array.isArray(res)
            ? res
            : (res?.items ?? res?.data ?? []);
          match = items.find((p: any) => String(p.landId) === String(landId));
          if (match) {
            match.source = "hedera";
          }
        }

        if (!match) {
          setError("Property not found");
          setProperty(null);
          setLoading(false);
          return;
        }
        let meta: any = null;

        // Process Hedera listing only

        // For Hedera listings, fetch metadata from IPFS
        if (match.metadataHash) {
          try {
            const m = await fetch(
              `https://gateway.pinata.cloud/ipfs/${match.metadataHash}?cb=${Date.now()}`,
            );
            if (m.ok) meta = await m.json();
          } catch {}
        }
        // Normalize images and documents from metadata (support old and new formats)
        const imagesFromMeta: any[] = (() => {
          const prefer = (arr: any) =>
            Array.isArray(arr) && arr.length > 0 ? arr : null;
          const imgs =
            prefer(meta?.images) || prefer(meta?.photos) || prefer(meta?.media);
          if (imgs) return imgs;
          // single image field
          if (typeof meta?.image === "string") return [meta.image];
          // backward-compat: documents.additional used to hold image hashes
          const add = meta?.documents?.additional;
          if (Array.isArray(add) && add.length > 0) return add;
          // last resort: scan for first CID-like string in metadata
          const cidRegex = /Qm[1-9A-Za-z]{44}/;
          const scan = (obj: any): string | null => {
            if (!obj) return null;
            if (typeof obj === "string" && cidRegex.test(obj)) return obj;
            if (Array.isArray(obj)) {
              for (const v of obj) {
                const f = scan(v);
                if (f) return f;
              }
            } else if (typeof obj === "object") {
              for (const k of Object.keys(obj)) {
                const f = scan(obj[k]);
                if (f) return f;
              }
            }
            return null;
          };
          const found = scan(meta);
          return found ? [found] : [];
        })();

        const documentsFromMeta: any[] = (() => {
          if (Array.isArray(meta?.documents)) return meta.documents;
          const arr: any[] = [];
          if (meta?.documents?.titleDeed)
            arr.push({
              name: "Title Deed",
              type: "title-deed",
              cid: meta.documents.titleDeed,
            });
          if (meta?.documents?.surveyReport)
            arr.push({
              name: "Survey Report",
              type: "survey",
              cid: meta.documents.surveyReport,
            });
          if (Array.isArray(meta?.documents?.additional)) {
            for (const cid of meta.documents.additional)
              arr.push({ name: "Attachment", type: "certificate", cid });
          }
          return arr;
        })();

        const formattedPrice = match?.price ? String(match.price) : "0";
        setProperty({
          id: String(match.landId),
          title: meta?.title || match.location || "Property",
          location: meta?.location || match.location || "Unknown",
          coordinates: meta?.coordinates || { lat: -1.1719, lng: 36.8315 },
          price: formattedPrice,
          currency: meta?.currency || "KES",
          area: meta?.size || match.size || "N/A",
          description: meta?.description || "",
          features: Array.isArray(meta?.features) ? meta.features : [],
          ownerDID: meta?.owner?.did || "",
          ownerName: meta?.owner?.name || "",
          ownerContact: {
            phone: meta?.owner?.phone || "",
            email: meta?.owner?.email || "",
          },
          verificationStatus:
            match.status === "minted"
              ? "verified"
              : match.status === "pending"
                ? "pending"
                : "unverified",
          listedDate: match.submittedAt
            ? new Date(match.submittedAt).toLocaleDateString()
            : "N/A",
          lastUpdated: match.updatedAt
            ? new Date(match.updatedAt).toLocaleDateString()
            : match.submittedAt
              ? new Date(match.submittedAt).toLocaleDateString()
              : "N/A",
          views: 0,
          inspections: match.approvals?.length ?? 0,
          images: imagesFromMeta,
          documents: documentsFromMeta,
          metadataHash: match.metadataHash || null,
          nftSerial: match.nftSerial,
          verificationHistory: match.verificationHistory || [],
        });
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [landId]);

  // Transform backend/IPFS images or use fallback
  const images: PropertyImage[] =
    property?.images?.length > 0
      ? property.images.map((img: any, index: number) => {
          const cid =
            typeof img === "string"
              ? img
              : img?.cid || img?.ipfsHash || img?.hash || img?.image;
          const url = img?.path
            ? `http://localhost:5000${img.path}`
            : cid
              ? `https://gateway.pinata.cloud/ipfs/${cid}`
              : img?.url ||
                `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop`;
          return {
            id: index.toString(),
            url,
            title: `Property Image ${index + 1}`,
            description: `Property view ${index + 1}`,
          };
        })
      : [
          {
            id: "1",
            url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
            title: "Main View",
            description: "Overview of the entire property",
          },
          {
            id: "2",
            url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?w=800&h=600&fit=crop",
            title: "Soil Quality",
            description: "Rich, fertile soil perfect for agriculture",
          },
          {
            id: "3",
            url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
            title: "Access Road",
            description: "Well-maintained access road",
          },
          {
            id: "4",
            url: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&h=600&fit=crop",
            title: "Boundary View",
            description: "Clear property boundaries",
          },
        ];

  // Transform IPFS documents or use fallback
  const documents: Document[] =
    property?.documents?.length > 0
      ? property.documents.map((doc: any, i: number) => ({
          id: String(i + 1),
          name: doc?.name || doc?.type || `Document ${i + 1}`,
          type: doc?.type || "certificate",
          verified: true,
          uploadDate: new Date().toLocaleDateString(),
          size: doc?.size || "—",
        }))
      : [
          {
            id: "1",
            name: "Title Deed Certificate",
            type: "title-deed",
            verified: true,
            uploadDate: "2024-01-10",
            size: "2.4 MB",
          },
          {
            id: "2",
            name: "Survey Report 2024",
            type: "survey",
            verified: true,
            uploadDate: "2024-01-12",
            size: "5.1 MB",
          },
          {
            id: "3",
            name: "Tax Compliance Certificate",
            type: "certificate",
            verified: true,
            uploadDate: "2024-01-08",
            size: "1.2 MB",
          },
          {
            id: "4",
            name: "Professional Inspection Report",
            type: "inspection",
            verified: true,
            uploadDate: "2024-01-18",
            size: "3.7 MB",
          },
        ];

  const inspectionReports: InspectionReport[] = [
    {
      id: "1",
      inspectorName: "Sarah Mwangi",
      rating: 4.8,
      date: "2024-01-18",
      summary:
        "Excellent soil quality and infrastructure. Highly recommended for agricultural use.",
      verified: true,
    },
    {
      id: "2",
      inspectorName: "David Ochieng",
      rating: 4.6,
      date: "2024-01-15",
      summary:
        "Good accessibility and clear boundaries. Minor drainage improvements recommended.",
      verified: true,
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const TOKEN_ID = (import.meta as any).env?.VITE_TOKEN_ID || "0.0.7158415";
  const nftUrl = property?.nftSerial
    ? `https://hashscan.io/testnet/nft/${TOKEN_ID}/${property.nftSerial}`
    : null;
  const tokenUrl = `https://hashscan.io/testnet/token/${TOKEN_ID}`;
  const handleMint = async () => {
    try {
      if (!property || property.verificationStatus !== "verified") return;
      if (!property.metadataHash) {
        alert(
          "Metadata hash not available for this listing. Please ensure the listing was created with IPFS metadata.",
        );
        return;
      }
      setIsMinting(true);
      const metadata = {
        metadataHash: property.metadataHash,
        size: property.area,
        price: property.price,
        location: property.location,
      };
      await api.mintLandNFT(TOKEN_ID, metadata);
      alert("NFT minted successfully!");
    } catch (e: any) {
      alert(e?.message || "Failed to mint NFT");
    } finally {
      setIsMinting(false);
    }
  };

  const getDocumentIcon = (type: Document["type"]) => {
    switch (type) {
      case "title-deed":
        return FileText;
      case "survey":
        return Navigation;
      case "certificate":
        return Shield;
      case "inspection":
        return Eye;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/marketplace" className="text-primary hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Property not found</p>
          <Link to="/marketplace" className="text-primary hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/marketplace"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsLiked(!isLiked)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked
                    ? "bg-red-500/20 text-red-500"
                    : "bg-card/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-card/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-card">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex].url}
                    alt={images[currentImageIndex].title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Verification Badge */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-sm border ${
                      property.verificationStatus === "verified"
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                        : property.verificationStatus === "pending"
                          ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
                          : "bg-red-500/20 border-red-500/30 text-red-400"
                    }`}
                  >
                    {property.verificationStatus === "verified" && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {property.verificationStatus === "pending" && (
                      <Clock className="w-4 h-4" />
                    )}
                    {property.verificationStatus === "unverified" && (
                      <Shield className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {property.verificationStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-primary shadow-lg"
                        : "border-border/50 hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Information Tabs */}
            <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-border/50">
                {[
                  { id: "overview", label: "Overview", icon: FileText },
                  { id: "location", label: "Location", icon: MapPin },
                  { id: "documents", label: "Documents", icon: Shield },
                  { id: "history", label: "History", icon: Clock },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                        activeTab === tab.id
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Property Description
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {property.description}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Key Features
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {property.features.map(
                              (feature: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {property.views}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Views
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {property.inspections}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Inspections
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              4.7
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Rating
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              100%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Verified
                            </div>
                          </div>
                        </div>

                        {/* On-chain Verification History (from backend) */}
                        {property.verificationHistory?.length > 0 && (
                          <div className="pt-6 border-t border-border/50">
                            <h4 className="font-medium mb-3">
                              On-chain Verification
                            </h4>
                            <div className="space-y-2 text-sm">
                              {property.verificationHistory.map(
                                (h: any, i: number) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-md border border-border/50"
                                  >
                                    <span className="font-medium">
                                      {h.role}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {h.name}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {new Date(h.date).toLocaleString()}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* HashScan links */}
                        <div className="pt-6 border-t border-border/50 flex items-center gap-3">
                          <a
                            href={tokenUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-md bg-card border border-border/50 hover:border-primary/50 text-sm"
                          >
                            View Token on HashScan
                          </a>
                          {nftUrl && (
                            <a
                              href={nftUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 rounded-md bg-card border border-border/50 hover:border-primary/50 text-sm"
                            >
                              View NFT #{property.nftSerial}
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "location" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Location Details
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>{property.location}</span>
                          </div>
                        </div>

                        {/* Simple Map/Link from metadata coordinates */}
                        <div className="aspect-[16/9] rounded-lg border border-border/50 flex items-center justify-between p-4 bg-card/40">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-5 h-5" />
                            <span>
                              Lat: {property.coordinates.lat}, Lng:{" "}
                              {property.coordinates.lng}
                            </span>
                          </div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm"
                          >
                            Open in Maps
                          </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h4 className="font-medium">Nearby Amenities</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div>🏥 Kiambu Hospital - 2.5 km</div>
                              <div>🏫 Kiambu High School - 1.8 km</div>
                              <div>🛒 Kiambu Market - 3.2 km</div>
                              <div>⛽ Shell Petrol Station - 1.5 km</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-medium">Transportation</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div>🚌 Matatu Stage - 800m</div>
                              <div>🛣️ Kiambu-Nairobi Highway - 2km</div>
                              <div>✈️ JKIA Airport - 45 min drive</div>
                              <div>🚂 Kiambu Railway Station - 3km</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "documents" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Legal Documents
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            All documents are Hedera-verified and legally
                            compliant
                          </p>
                        </div>

                        <div className="grid gap-4">
                          {documents.map((doc) => {
                            const Icon = getDocumentIcon(doc.type);
                            return (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-primary/10">
                                    <Icon className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {doc.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {doc.size} • Uploaded {doc.uploadDate}
                                    </div>
                                  </div>
                                  {doc.verified && (
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-600 text-xs">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Verified
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={
                                      doc.cid
                                        ? `https://gateway.pinata.cloud/ipfs/${doc.cid}`
                                        : "#"
                                    }
                                    target={doc.cid ? "_blank" : undefined}
                                    rel="noreferrer"
                                    className="p-2 rounded-lg bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </a>
                                  <a
                                    href={
                                      doc.cid
                                        ? `https://gateway.pinata.cloud/ipfs/${doc.cid}?download=1`
                                        : "#"
                                    }
                                    target={doc.cid ? "_blank" : undefined}
                                    rel="noreferrer"
                                    className="p-2 rounded-lg bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeTab === "history" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Inspection Reports
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {inspectionReports.map((report) => (
                            <div
                              key={report.id}
                              className="p-4 rounded-lg border border-border/50"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="font-medium">
                                    {report.inspectorName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {report.date}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < Math.floor(report.rating)
                                            ? "text-yellow-500 fill-current"
                                            : "text-muted-foreground"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium ml-1">
                                    {report.rating}
                                  </span>
                                  {report.verified && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-2" />
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {report.summary}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-border/50">
                          <h4 className="font-medium mb-3">
                            Property Timeline
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              <span className="text-muted-foreground">
                                Listed on marketplace
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span>{property.listedDate}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-muted-foreground">
                                Professional inspection completed
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span>2024-01-18</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              <span className="text-muted-foreground">
                                Blockchain verification completed
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span>2024-01-10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Price and Quick Info */}
              <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {property.currency} {property.price.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">{property.area}</div>
                </div>

                {/* On-chain badge and links */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Token</span>
                    <a
                      href={tokenUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      View on HashScan
                    </a>
                  </div>
                  {property.nftSerial && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">NFT Serial</span>
                      <a
                        href={nftUrl!}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        #{property.nftSerial}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <div className="flex items-center gap-1">
                      {property.verificationStatus === "verified" && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      {property.verificationStatus === "pending" && (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      {property.verificationStatus === "unverified" && (
                        <Shield className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`font-medium capitalize ${
                          property.verificationStatus === "verified"
                            ? "text-emerald-600"
                            : property.verificationStatus === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {property.verificationStatus}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Listed</span>
                    <span>{property.listedDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{property.lastUpdated}</span>
                  </div>
                </div>

                {/* Buy Button */}
                <motion.button
                  className="group relative w-full px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg overflow-hidden flex items-center justify-center gap-3 text-lg shadow-[0_0_40px_rgba(59,130,246,1)] border-2 border-white/30 backdrop-blur-sm"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 60px rgba(59,130,246,1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <Wallet className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Buy now</span>
                </motion.button>

                {/* Mint NFT Button - visible when verified */}
                <button
                  disabled={
                    property.verificationStatus !== "verified" || isMinting
                  }
                  onClick={handleMint}
                  className={`mt-3 w-full px-6 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    property.verificationStatus === "verified" && !isMinting
                      ? "border-emerald-500 text-emerald-600 hover:bg-emerald-500/10"
                      : "border-border/50 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {isMinting ? "Minting..." : "Mint NFT (Hedera)"}
                </button>

                <div className="text-center mt-3">
                  <p className="text-xs text-muted-foreground">
                    Secure Hedera transaction • Instant ownership transfer
                  </p>
                </div>
              </div>

              {/* Verification & Trust Indicators */}
              <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Trust & Security
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        Blockchain Verified
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Title deed on Hedera network
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Eye className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        Professional Inspection
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Verified by certified inspectors
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <FileText className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        Legal Compliance
                      </div>
                      <div className="text-xs text-muted-foreground">
                        All documents verified
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <Zap className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        Instant Transfer
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Smart contract execution
                      </div>
                    </div>
                  </div>

                  {property.metadataHash && (
                    <div className="mt-4 p-3 rounded-lg border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">
                        IPFS Metadata
                      </div>
                      <a
                        className="text-xs font-mono underline text-blue-500 break-all"
                        href={`https://gateway.pinata.cloud/ipfs/${property.metadataHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {property.metadataHash}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Property Owner
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="font-medium">{property.ownerName}</div>
                    <div className="text-sm text-muted-foreground">
                      Verified Owner
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{property.ownerContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{property.ownerContact.email}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">
                      Hedera DID
                    </div>
                    <div className="text-xs font-mono bg-card/50 p-2 rounded mt-1 break-all">
                      {property.ownerDID}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandDetails;
