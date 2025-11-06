import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  Upload,
  DollarSign,
  Eye,
  Edit3,
  TrendingUp,
  Users,
  Shield,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { api } from "../lib/api";

interface LandListing {
  id: string;
  title: string;
  location: string;
  area: string;
  price: string;
  status: "draft" | "pending-verification" | "verified" | "listed" | "sold";
  createdDate: string;
  verificationProgress: number;
  inspectorsAssigned: number;
  requiredInspectors: number;
  viewCount: number;
  inquiries: number;
  documents: string[];
  images: number;
  metadataHash?: string; // Added for minting
}

interface SellerStats {
  totalListings: number;
  activeListings: number;
  soldProperties: number;
  totalRevenue: string;
  averageVerificationTime: string;
  successRate: number;
}

const sellerStats: SellerStats = {
  totalListings: 8,
  activeListings: 3,
  soldProperties: 2,
  totalRevenue: "78,500,000 KES",
  averageVerificationTime: "5.2 days",
  successRate: 95,
};

const statusConfig = {
  draft: {
    label: "Draft",
    icon: Edit3,
    color: "text-gray-400",
    bg: "bg-gray-500/20",
    border: "border-gray-500/30",
  },
  "pending-verification": {
    label: "Pending Verification",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
  },
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/20",
    border: "border-green-500/30",
  },
  listed: {
    label: "Listed",
    icon: Eye,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
  },
  sold: {
    label: "Sold",
    icon: DollarSign,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
    border: "border-purple-500/30",
  },
};

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "listings" | "analytics" | "create"
  >("listings");
  // const [selectedListing, setSelectedListing] = useState<LandListing | null>(null);
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
  const [isMintingId, setIsMintingId] = useState<string | null>(null);
  const [hederaListings, setHederaListings] = useState<LandListing[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [editMeta, setEditMeta] = useState<any>(null);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    async function loadParcels() {
      // Try IPFS index first
      const indexCid = localStorage.getItem('LISTINGS_INDEX_CID');
      if (indexCid) {
        try {
          const res = await api.getListingsByIndex(indexCid);
          const arr = Array.isArray(res?.items) ? res.items : [];
          const mappedFromIndex: LandListing[] = arr.map((r: any) => ({
            id: String(r.listingId || r.id || Date.now()),
            title: (r.location || 'Land Parcel'),
            location: r.location || 'Unknown',
            area: r.size || r.area || '',
            price: (r.price ?? '').toString(),
            status: 'listed',
            createdDate: new Date(r.createdAt || Date.now()).toISOString(),
            verificationProgress: 100,
            inspectorsAssigned: 0,
            requiredInspectors: 2,
            viewCount: 0,
            inquiries: 0,
            documents: [],
            images: 0,
            metadataHash: r.metadataHash,
          }));
          setHederaListings(mappedFromIndex);
          return;
        } catch {
          // fall through to Hedera log
        }
      }
      // Fallback to Hedera verification log
      try {
        const res = await api.getParcels();
        const items = Array.isArray(res?.items) ? res.items : [];
        const mapped: LandListing[] = items.map((p: any) => ({
          id: String(p.landId),
          title: p.location || 'Land Parcel',
          location: p.location || 'Unknown',
          area: p.size || '',
          price: (p.price ?? '').toString(),
          status: (p.status === 'minted' ? 'verified' : p.status === 'pending' ? 'pending-verification' : 'listed') as any,
          createdDate: new Date(p.submittedAt || Date.now()).toISOString(),
          verificationProgress: p.status === 'pending' ? 50 : 100,
          inspectorsAssigned: p.approvals?.length ?? 0,
          requiredInspectors: 2,
          viewCount: 0,
          inquiries: 0,
          documents: [],
          images: 0,
          metadataHash: p.metadataHash,
        }));
        setHederaListings(mapped);
      } catch (e) {
        setHederaListings([]);
      }
    }
    loadParcels();
  }, []);

  const openEdit = async (listing: any) => {
    try {
      if (!listing?.metadataHash) return;
      const r = await fetch(
        `https://gateway.pinata.cloud/ipfs/${listing.metadataHash}?cb=${Date.now()}`,
      );
      const meta = r.ok ? await r.json() : {};
      setEditTarget(listing);
      setEditMeta(meta);
      setEditFiles([]);
      setEditOpen(true);
    } catch {
      setEditTarget(listing);
      setEditMeta({});
      setEditFiles([]);
      setEditOpen(true);
    }
  };

  const handleEditFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setEditFiles((prev) => [...prev, ...arr]);
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    try {
      setSavingEdit(true);
      const uploaded: string[] = [];
      for (const f of editFiles) {
        const res = await api.uploadFileToIPFS(f as any);
        if (res?.ipfsHash) uploaded.push(res.ipfsHash);
      }
      const existingImages = Array.isArray(editMeta?.images)
        ? editMeta.images
        : [];
      const legacyAdditional = Array.isArray(editMeta?.documents?.additional)
        ? editMeta.documents.additional
        : [];
      const mergedImages = [
        ...existingImages,
        ...uploaded.map((cid) => ({ cid })),
        ...(!existingImages.length && legacyAdditional.length
          ? legacyAdditional.map((cid: string) => ({ cid }))
          : []),
      ];

      const documents = Array.isArray(editMeta?.documents)
        ? editMeta.documents
        : (() => {
            const arr: any[] = [];
            if (editMeta?.documents?.titleDeed)
              arr.push({
                name: "Title Deed",
                type: "title-deed",
                cid: editMeta.documents.titleDeed,
              });
            if (editMeta?.documents?.surveyReport)
              arr.push({
                name: "Survey Report",
                type: "survey",
                cid: editMeta.documents.surveyReport,
              });
            if (Array.isArray(editMeta?.documents?.additional))
              for (const cid of editMeta.documents.additional)
                arr.push({ name: "Attachment", type: "certificate", cid });
            return arr;
          })();

      const nextMeta = {
        ...editMeta,
        images: mergedImages,
        documents,
      };
      const up = await api.uploadJSONToIPFS(nextMeta);
      const newHash = up?.ipfsHash;
      if (!newHash) throw new Error("Failed to upload updated metadata");
      await api.updateParcel(editTarget.id, { metadataHash: newHash });
      setEditOpen(false);
      setEditTarget(null);
      setEditMeta(null);
      setEditFiles([]);
      const res = await api.getParcels();
      const items = Array.isArray(res?.items) ? res.items : [];
      const mapped: LandListing[] = items.map((p: any) => ({
        id: String(p.landId),
        title: p.location || "Land Parcel",
        location: p.location || "Unknown",
        area: p.size || "",
        price: (p.price ?? "").toString(),
        status: (p.status === "minted"
          ? "verified"
          : p.status === "pending"
            ? "pending-verification"
            : "listed") as any,
        createdDate: new Date(p.submittedAt || Date.now()).toISOString(),
        verificationProgress: p.status === "pending" ? 50 : 100,
        inspectorsAssigned: p.approvals?.length ?? 0,
        requiredInspectors: 2,
        viewCount: 0,
        inquiries: 0,
        documents: [],
        images: 0,
        metadataHash: p.metadataHash,
      }));
      setHederaListings(mapped);
      alert("Listing updated successfully");
    } catch (e: any) {
      alert(e?.message || "Failed to update listing");
    } finally {
      setSavingEdit(false);
    }
  };

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

  const TOKEN_ID = "0.0.7158415";
  const handleMint = async (
    listing: LandListing & { metadataHash?: string },
  ) => {
    try {
      if (listing.status !== "verified") return;
      if (!listing.metadataHash) {
        alert(
          "No metadataHash found for this listing. Ensure metadata was uploaded to IPFS during creation.",
        );
        return;
      }
      setIsMintingId(listing.id);
      const metadata = {
        metadataHash: listing.metadataHash,
        size: listing.area,
        price: listing.price,
        location: listing.location,
      };
      await api.mintLandNFT(TOKEN_ID, metadata);
      alert("NFT minted successfully!");
    } catch (e: any) {
      alert(e?.message || "Failed to mint NFT");
    } finally {
      setIsMintingId(null);
    }
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    let createdSuccessfully = false;
    let metadataHash = "";
    let hederaSuccess = false;

    try {
      // 1) Optionally upload documents to IPFS if provided
      let titleDeedHash: string | null = null;
      let surveyReportHash: string | null = null;
      let additional: string[] = [];
      try {
        if (uploadedDocs.titleDeed) {
          const res = await api.uploadFileToIPFS(uploadedDocs.titleDeed as any);
          titleDeedHash = res?.ipfsHash || null;
        }
        if (uploadedDocs.surveyReport) {
          const res = await api.uploadFileToIPFS(
            uploadedDocs.surveyReport as any,
          );
          surveyReportHash = res?.ipfsHash || null;
        }
        // images as additional optional documents
        for (const img of uploadedImages) {
          const res = await api.uploadFileToIPFS(img as any);
          if (res?.ipfsHash) additional.push(res.ipfsHash);
        }
      } catch (error) {
        console.warn("IPFS upload warning:", error);
        // Continue without IPFS uploads
      }

      // 2) Build metadata JSON (images array + documents array) and upload to IPFS
      const images = Array.isArray(additional)
        ? additional.map((cid) => ({ cid }))
        : [];
      const documents: Array<{
        name: string;
        type: "title-deed" | "survey" | "certificate" | "inspection";
        cid: string;
      }> = [];
      if (titleDeedHash)
        documents.push({
          name: "Title Deed",
          type: "title-deed",
          cid: titleDeedHash,
        });
      if (surveyReportHash)
        documents.push({
          name: "Survey Report",
          type: "survey",
          cid: surveyReportHash,
        });

      const metadata = {
        title: formData.title,
        size: formData.size,
        price: formData.price,
        location: formData.location,
        description: formData.description,
        landType: formData.landType,
        zoning: formData.zoning,
        utilities: formData.utilities,
        accessibility: formData.accessibility,
        nearbyAmenities: formData.nearbyAmenities,
        seller: {
          name: formData.sellerName,
          phone: formData.sellerPhone,
          email: formData.sellerEmail,
        },
        images, // <- used by Hero and LandDetails
        documents, // <- used by LandDetails documents section
        timestamp: new Date().toISOString(),
        status: "pending",
      };

      // Try to upload metadata to IPFS
      try {
        const result = await api.uploadJSONToIPFS(metadata);
        metadataHash = result.ipfsHash;
      } catch (error) {
        console.warn("Metadata IPFS upload warning:", error);
        metadataHash = `local-${Date.now()}`; // Fallback metadata hash
      }

      // 3) Try to create verification entry on Hedera backend (optional)
      try {
        await api.createLandNFT({
          metadataHash,
          size: formData.size,
          price: formData.price,
          location: formData.location,
        });
        hederaSuccess = true;
      } catch (hederaError) {
        console.warn("Hedera submission warning (non-critical):", hederaError);
        // Continue even if Hedera fails - we'll still save to local database
      }

      // 4) Save listing to Hedera service for marketplace visibility (IPFS index-backed)
      try {
        const sellerId = formData.sellerEmail || formData.sellerPhone || 'anonymous';
        const existingIndex = localStorage.getItem('LISTINGS_INDEX_CID');
        const resp = await api.createListing(metadataHash, sellerId, existingIndex || null);
        if (resp?.indexCid) {
          localStorage.setItem('LISTINGS_INDEX_CID', resp.indexCid);
        }
        createdSuccessfully = true;
      } catch (error) {
        console.error('Error saving listing:', error);
        alert('Error saving listing. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // If we got here, the listing was saved successfully to local database
      if (createdSuccessfully) {
        alert(
          isDraft
            ? "Listing created successfully!"
            : hederaSuccess
              ? "Listing submitted successfully and registered on Hedera blockchain!"
              : "Listing submitted successfully! (Hedera registration pending)",
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

        // Navigate to marketplace to see the new listing
        setTimeout(() => {
          navigate("/marketplace");
        }, 500);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Seller Portal</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Seller Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              List your land, track verification progress, and manage sales
              through Hedera-secured transactions
            </p>
          </motion.div>

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
                <span className="text-sm text-muted-foreground">
                  Total Listings
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {sellerStats.totalListings}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Active Listings
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {sellerStats.activeListings}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Total Revenue
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {sellerStats.totalRevenue}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Success Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {sellerStats.successRate}%
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-xl bg-card p-6 border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Edit Listing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Add Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleEditFiles(e.target.files)}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Selected: {editFiles.length}
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditOpen(false);
                  setEditFiles([]);
                }}
                className="px-3 py-2 rounded-lg bg-card/50 border border-border/50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
              >
                {savingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-8 p-1 bg-card/30 rounded-xl border border-border/50 w-fit"
          >
            {[
              { id: "listings", label: "My Listings", icon: MapPin },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "create", label: "Create Listing", icon: Plus },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Listings Tab */}
          {activeTab === "listings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Land Listings</h2>
                <button
                  onClick={() => setActiveTab("create")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Listing
                </button>
              </div>

              <div className="grid gap-6">
                {hederaListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {listing.location} • {listing.area} • ID:{" "}
                            {listing.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {listing.price}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Listed Price
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[listing.status].bg} ${statusConfig[listing.status].color}`}
                        >
                          {React.createElement(
                            statusConfig[listing.status].icon,
                            { className: "w-3 h-3" },
                          )}
                          {statusConfig[listing.status].label}
                        </div>
                      </div>
                    </div>

                    {/* Mint button for verified listings */}
                    {listing.status === "verified" && (
                      <div className="mb-4 flex gap-2 items-center">
                        <button
                          onClick={() => handleMint(listing as any)}
                          disabled={isMintingId === listing.id}
                          className="px-3 py-1 rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-500/10 text-sm"
                        >
                          {isMintingId === listing.id
                            ? "Minting..."
                            : "Mint NFT (Hedera)"}
                        </button>
                        {listing.metadataHash && (
                          <a
                            href={`https://gateway.pinata.cloud/ipfs/${listing.metadataHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-500/10 text-sm"
                          >
                            View Metadata
                          </a>
                        )}
                      </div>
                    )}

                    {/* Verification Progress */}
                    {listing.status === "pending-verification" && (
                      <div className="mb-4 p-4 rounded-lg bg-card/30 border border-border/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Verification Progress
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {listing.verificationProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-border/50 rounded-full h-2 mb-2">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${listing.verificationProgress}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Inspectors: {listing.inspectorsAssigned}/
                            {listing.requiredInspectors}
                          </span>
                          <span>Est. completion: 2-3 days</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Views
                        </span>
                        <p className="font-medium text-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {listing.viewCount}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Inquiries
                        </span>
                        <p className="font-medium text-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {listing.inquiries}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Documents
                        </span>
                        <p className="font-medium text-foreground flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {listing.documents.length}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Images
                        </span>
                        <p className="font-medium text-foreground flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {listing.images}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Created: {listing.createdDate}
                      </div>

                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors text-sm">
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          onClick={() => openEdit(listing)}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors text-sm"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                        {listing.status === "draft" && (
                          <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
                            <Upload className="w-3 h-3" />
                            Submit for Verification
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold">Analytics & Performance</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Metrics */}
                <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Performance Metrics
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Average Verification Time
                      </span>
                      <span className="font-medium">
                        {sellerStats.averageVerificationTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Listing Success Rate
                      </span>
                      <span className="font-medium text-green-400">
                        {sellerStats.successRate}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Average Views per Listing
                      </span>
                      <span className="font-medium">64</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Inquiry to Sale Conversion
                      </span>
                      <span className="font-medium text-blue-400">12.5%</span>
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    Revenue Breakdown
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Sales</span>
                      <span className="font-medium">
                        {sellerStats.totalRevenue}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Platform Fees
                      </span>
                      <span className="font-medium">2,355,000 KES</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Verification Costs
                      </span>
                      <span className="font-medium">450,000 KES</span>
                    </div>
                    <div className="border-t border-border/50 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Net Revenue</span>
                        <span className="font-bold text-primary">
                          75,695,000 KES
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Create Listing Tab */}
          {activeTab === "create" && (
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
                      <h3 className="text-lg font-semibold mb-4">
                        Property Details
                      </h3>
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
                                    <p className="text-sm font-medium">
                                      {doc.label}
                                    </p>
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
                                <X className="w-4 h-4" />
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
                              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-lg font-medium mb-2">
                                Upload Property Images ({uploadedImages.length}
                                /4)
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
                        {isSubmitting
                          ? "Submitting..."
                          : "Submit for Verification"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
