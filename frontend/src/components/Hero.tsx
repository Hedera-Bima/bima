import { motion, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import {
  MapPin,
  Shield,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Upload,
  Plus,
} from "lucide-react";

interface LandListing {
  id: string;
  location: string;
  area: string;
  price: string;
  ownerDID?: string;
  verificationStatus: "verified" | "pending" | "in-progress" | "unverified";
  inspectors: number;
  imageGradient: string;
  lastUpdated: string;
  imageUrl?: string;
  title?: string;
  size?: string;
  description?: string;
  landType?: string;
  images?: Array<{ path: string }>;
  status?: string;
  seller?: {
    name: string;
    phone: string;
    email: string;
  };
}

// Resolve available images from src/assets at build time (Vite)

// Bind exact images: moon, barn, valley, run

// Import SellerDashboard component content
const SellLandContent = ({
  fetchListings,
  setActiveTab,
}: {
  fetchListings: () => Promise<void>;
  setActiveTab: (tab: "buy" | "sell") => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    size: "",
    price: "",
    description: "",
    landType: "",
    zoning: "",
    utilities: "",
    accessibility: "",
    nearbyAmenities: "",
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState({
    titleDeed: null as File | null,
    surveyReport: null as File | null,
    taxCertificate: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 4 - uploadedImages.length);
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleDocumentUpload = (docType: string, file: File) => {
    setUploadedDocs((prev) => ({ ...prev, [docType]: file }));
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (docType: string) => {
    setUploadedDocs((prev) => ({ ...prev, [docType]: null }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    try {
      // 1) Upload images to IPFS (optional list)
      const imageHashes = await Promise.all(
        uploadedImages.map(async (file) => {
          const { ipfsHash } = await api.uploadFileToIPFS(file);
          return ipfsHash as string;
        }),
      );

      // 2) Upload documents to IPFS (if provided)
      const docEntries = await Promise.all(
        Object.entries(uploadedDocs).map(async ([key, file]) => {
          if (file) {
            const { ipfsHash } = await api.uploadFileToIPFS(file);
            return [key, ipfsHash] as const;
          }
          return [key, null] as const;
        }),
      );
      const documents = Object.fromEntries(docEntries) as Record<string, string | null>;

      // 3) Upload metadata JSON to IPFS
      const metadata = {
        ...formData,
        images: imageHashes,
        documents,
        timestamp: new Date().toISOString(),
        status: isDraft ? "draft" : "pending",
      } as const;

      const { ipfsHash: metadataHash } = await api.uploadJSONToIPFS(metadata);

      // 4) Create land entry on Hedera service (returns landId)
      const created = await api.createLandNFT({
        metadataHash,
        size: formData.size,
        price: formData.price,
        location: formData.location,
      });

      const landId = (created as any)?.landId;

      alert(
        isDraft
          ? `Listing created successfully! Submission ID: ${landId ?? "N/A"}`
          : `Listing submitted for verification! Submission ID: ${landId ?? "N/A"}`,
      );

      // Reset form
      setFormData({
        title: "",
        location: "",
        size: "",
        price: "",
        description: "",
        landType: "",
        zoning: "",
        utilities: "",
        accessibility: "",
        nearbyAmenities: "",
        sellerName: "",
        sellerPhone: "",
        sellerEmail: "",
      });
      setUploadedImages([]);
      setUploadedDocs({
        titleDeed: null,
        surveyReport: null,
        taxCertificate: null,
      });

      // Refresh listings then switch to Buy
      await fetchListings();
      setActiveTab("buy");
    } catch (error) {
      alert("Error submitting listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Create Listing Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        <h2 className="text-2xl font-bold">Create New Land Listing</h2>

        <div className="max-w-4xl">
          <div className="p-8 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Property Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter property title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City, Area/Estate"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Area Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2.5 acres"
                      value={formData.size}
                      onChange={(e) =>
                        handleInputChange("size", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (KES)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 45000000"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Land Type
                    </label>
                    <select
                      value={formData.landType}
                      onChange={(e) =>
                        handleInputChange("landType", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none text-white [&>option]:text-black"
                    >
                      <option value="">Select land type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="agricultural">Agricultural</option>
                      <option value="industrial">Industrial</option>
                      <option value="mixed-use">Mixed Use</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Zoning
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Residential Zone R1"
                      value={formData.zoning}
                      onChange={(e) =>
                        handleInputChange("zoning", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Available Utilities
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Water, Electricity, Sewer"
                      value={formData.utilities}
                      onChange={(e) =>
                        handleInputChange("utilities", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Road Access
                    </label>
                    <select
                      value={formData.accessibility}
                      onChange={(e) =>
                        handleInputChange("accessibility", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none text-white [&>option]:text-black"
                    >
                      <option value="">Select access type</option>
                      <option value="tarmac">Tarmac Road</option>
                      <option value="murram">Murram Road</option>
                      <option value="footpath">Footpath Access</option>
                      <option value="private">Private Road</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the property, its features, and any additional information..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none resize-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Nearby Amenities
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Schools, Hospitals, Shopping Centers"
                    value={formData.nearbyAmenities}
                    onChange={(e) =>
                      handleInputChange("nearbyAmenities", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Seller Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Seller Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.sellerName}
                      onChange={(e) =>
                        handleInputChange("sellerName", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g., +254 700 000 000"
                      value={formData.sellerPhone}
                      onChange={(e) =>
                        handleInputChange("sellerPhone", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.sellerEmail}
                      onChange={(e) =>
                        handleInputChange("sellerEmail", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Documents Upload */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: "titleDeed", label: "Title Deed" },
                    { key: "surveyReport", label: "Survey Report" },
                    { key: "taxCertificate", label: "Tax Certificate" },
                  ].map((doc) => (
                    <div key={doc.key} className="relative">
                      <input
                        type="file"
                        id={doc.key}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload(doc.key, file);
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor={doc.key}
                        className="block p-4 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <div className="text-center">
                          {uploadedDocs[
                            doc.key as keyof typeof uploadedDocs
                          ] ? (
                            <div>
                              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                              <p className="text-sm font-medium text-green-400">
                                {doc.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {
                                  uploadedDocs[
                                    doc.key as keyof typeof uploadedDocs
                                  ]?.name
                                }
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeDocument(doc.key);
                                }}
                                className="mt-2 text-xs text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div>
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm font-medium">{doc.label}</p>
                              <p className="text-xs text-muted-foreground">
                                Click to upload
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images Upload */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Property Images (Max 4)
                </h3>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border/50"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadedImages.length < 4 && (
                  <div>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="block p-8 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">
                          Upload Property Images ({uploadedImages.length}/4)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop images or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Supports JPG, PNG, WebP (Max 10MB each)
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={
                    isSubmitting ||
                    !formData.title ||
                    !formData.location ||
                    !formData.size ||
                    !formData.price
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  {isSubmitting ? "Creating..." : "Create Listing"}
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={
                    isSubmitting ||
                    !formData.title ||
                    !formData.location ||
                    !formData.size ||
                    !formData.price
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="w-4 h-4" />
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
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
    color: "text-green-400",
    bg: "bg-green-500/20",
    border: "border-green-500/30",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
  },
  "in-progress": {
    label: "In Progress",
    icon: Sparkles,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
  },
  unverified: {
    label: "Unverified",
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/20",
    border: "border-red-500/30",
  },
};

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [backendListings, setBackendListings] = useState<LandListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Fetch listings from both Hedera backend and local SQLite backend
  const fetchListings = async () => {
    setIsLoading(true);
    try {
      // Fetch from Hedera backend (minted parcels)
      let hederaListings: LandListing[] = [];
      try {
        const res = await api.getParcels("minted");
        const items = Array.isArray(res?.items) ? res.items : [];
        hederaListings = await Promise.all(
          items.map(async (p: any) => {
            let imageUrl: string | undefined;
            if (p.metadataHash) {
              try {
                const r = await fetch(
                  `https://gateway.pinata.cloud/ipfs/${p.metadataHash}`,
                );
                if (r.ok) {
                  const j = await r.json();
                  let first =
                    Array.isArray(j?.images) && j.images.length > 0
                      ? j.images[0]
                      : null;
                  if (
                    !first &&
                    j?.documents &&
                    Array.isArray(j.documents.additional) &&
                    j.documents.additional.length > 0
                  ) {
                    first = j.documents.additional[0];
                  }
                  const cid =
                    typeof first === "string"
                      ? first
                      : first?.cid || first?.ipfsHash || first?.hash;
                  imageUrl = cid
                    ? `https://gateway.pinata.cloud/ipfs/${cid}`
                    : (first?.url as string | undefined);
                }
              } catch {}
            }
            return {
              id: String(p.landId),
              location: p.location || "Unknown",
              area: p.size || "",
              price: (p.price ?? "").toString(),
              title: p.location || undefined,
              verificationStatus: "verified" as const,
              inspectors: 2,
              imageGradient:
                "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
              lastUpdated: new Date(
                p.submittedAt || Date.now(),
              ).toLocaleDateString(),
              imageUrl,
              description: undefined,
              landType: undefined,
              seller: undefined,
            } as LandListing;
          }),
        );
      } catch (error) {
        console.error("Failed to fetch Hedera listings:", error);
      }

      // Use only Hedera listings
      setBackendListings(hederaListings);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Show ONLY Hedera-backed listings
  const allListings = backendListings;

  return (
    <section
      ref={ref}
      className="relative py-20 px-4 bg-gradient-to-br from-background via-background to-primary/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
              Land Marketplace
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-foreground/85 max-w-2xl mx-auto"
          >
            {activeTab === "buy"
              ? "Browse verified properties with transparent ownership records secured on Hedera blockchain"
              : "Transform your property into a digital asset with Hedera-verified ownership and reach global buyers through our secure marketplace"}
          </motion.p>

          {/* Buy/Sell Toggle Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 mb-8"
          >
            <motion.button
              onClick={() => setActiveTab("buy")}
              className={`group relative px-8 py-4 font-bold rounded-lg overflow-hidden flex items-center gap-3 text-lg transition-all duration-300 ${
                activeTab === "buy"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_40px_rgba(59,130,246,1)] border-2 border-white/30 backdrop-blur-sm"
                  : "bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === "buy" && (
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
              onClick={() => setActiveTab("sell")}
              className={`group relative px-8 py-4 font-bold rounded-lg overflow-hidden flex items-center gap-3 text-lg transition-all duration-300 ${
                activeTab === "sell"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_40px_rgba(59,130,246,1)] border-2 border-white/30 backdrop-blur-sm"
                  : "bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === "sell" && (
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
        {activeTab === "buy" ? (
          <div className="space-y-6">
            {/* Add Listing Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-foreground">
                Available Land Listings
              </h3>
              <Link to="/seller-dashboard">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Listing
                </motion.button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading listings...</p>
                </div>
              ) : (
                allListings.map((listing: LandListing, index: number) => {
                  const status = statusConfig[listing.verificationStatus];
                  const StatusIcon = status.icon;

                  return (
                    <Link
                      key={listing.id}
                      to={`/land/${listing.id}`}
                      className="block"
                    >
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 50,
                          scale: 0.8,
                          rotateY: -25,
                        }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0, scale: 1, rotateY: 0 }
                            : {}
                        }
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
                            ease: "easeOut",
                          },
                        }}
                        onHoverStart={() => setHoveredCard(listing.id)}
                        onHoverEnd={() => setHoveredCard(null)}
                        style={{ perspective: 1000 }}
                        className="group relative cursor-pointer h-full"
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
                            rotate: {
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            },
                          }}
                        />

                        {/* Card */}
                        <div className="relative h-full bg-card rounded-2xl border border-border/70 overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                          {/* Top glow effect */}
                          <motion.div
                            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                            animate={{
                              opacity: hoveredCard === listing.id ? 1 : 0,
                            }}
                            transition={{ duration: 0.5 }}
                          />

                          {/* Content */}
                          <div className="relative p-6 space-y-4">
                            {/* Image area */}
                            <motion.div
                              className={`relative h-40 -mx-6 -mt-6 mb-4 bg-muted overflow-hidden`}
                              animate={{
                                scale: hoveredCard === listing.id ? 1.05 : 1,
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              {listing.imageUrl ? (
                                <img
                                  src={listing.imageUrl}
                                  alt={`${listing.location} land`}
                                  loading="lazy"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              ) : (
                                <div
                                  className={`absolute inset-0 bg-gradient-to-br ${listing.imageGradient}`}
                                />
                              )}

                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </motion.div>

                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                {listing.title || listing.location}
                              </h3>
                              <motion.div
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}
                                animate={{
                                  scale: hoveredCard === listing.id ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </motion.div>
                            </div>

                            {listing.title && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {listing.location}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {listing.area}
                              </span>
                              <span>{listing.inspectors || 0} inspectors</span>
                            </div>

                            {listing.description && (
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                {listing.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xl font-bold text-primary">
                                  KES {listing.price}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {listing.lastUpdated}
                                </div>
                              </div>

                              <motion.div
                                className="flex items-center gap-1 text-xs text-muted-foreground"
                                animate={{
                                  x: hoveredCard === listing.id ? 5 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <ExternalLink className="w-3 h-3" />
                                View Details
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <SellLandContent
            fetchListings={fetchListings}
            setActiveTab={setActiveTab}
          />
        )}

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
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-emerald-500"
          />
          <span>All listings verified on Hedera Hashgraph</span>
        </motion.div>
      </div>
    </section>
  );
}
