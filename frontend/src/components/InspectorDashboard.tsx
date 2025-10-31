import { motion } from "framer-motion";
import { 
  Shield, MapPin, Clock, CheckCircle2, AlertCircle, 
  FileText, Award, TrendingUp, 
  Eye, Download, Upload, Star, Badge, Coins
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from '../lib/api';
import React from "react";

interface VerificationRequest {
  id: string;
  propertyId: string;
  location: string;
  area: string;
  sellerName: string;
  sellerDID: string;
  requestDate: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed' | 'disputed';
  priority: 'high' | 'medium' | 'low';
  documents: string[];
  compensation: string;
  requiredInspectors: number;
  currentInspectors: number;
}

interface InspectorStats {
  totalVerifications: number;
  completedThisMonth: number;
  reputationScore: number;
  earningsThisMonth: string;
  averageRating: number;
  specializations: string[];
}

type VerifyForm = { landId: string; role: 'Chief' | 'Surveyor'; name: string };
type Parcel = { landId: number; status: string; location?: string; size?: string; price?: string; metadataHash?: string };

const mockRequests: VerificationRequest[] = [
  {
    id: "VR-001",
    propertyId: "PROP-2024-001",
    location: "Nairobi, Karen Estate",
    area: "2.5 acres",
    sellerName: "John Kamau",
    sellerDID: "did:hedera:testnet:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
    requestDate: "2024-01-15",
    deadline: "2024-01-22",
    status: "pending",
    priority: "high",
    documents: ["Title Deed", "Survey Report", "Tax Certificate"],
    compensation: "2,500 HBAR",
    requiredInspectors: 3,
    currentInspectors: 1
  },
  {
    id: "VR-002", 
    propertyId: "PROP-2024-002",
    location: "Kisumu, Milimani",
    area: "1.2 acres",
    sellerName: "Mary Wanjiku",
    sellerDID: "did:hedera:testnet:z6MkfrQbsAH1PjjAup54GzNx13HgWNup2BM15WsDRgW9GvuP",
    requestDate: "2024-01-14",
    deadline: "2024-01-21",
    status: "in-progress",
    priority: "medium",
    documents: ["Title Deed", "Survey Report"],
    compensation: "1,800 HBAR",
    requiredInspectors: 2,
    currentInspectors: 2
  },
  {
    id: "VR-003",
    propertyId: "PROP-2024-003", 
    location: "Mombasa, Nyali",
    area: "0.8 acres",
    sellerName: "David Ochieng",
    sellerDID: "did:hedera:testnet:z6Mkw94ByR26zMSkNdCUi6FNRsWnc2DtoBJNjTL4BPJiSKsz",
    requestDate: "2024-01-13",
    deadline: "2024-01-20",
    status: "completed",
    priority: "low",
    documents: ["Title Deed", "Survey Report", "Environmental Clearance"],
    compensation: "2,000 HBAR",
    requiredInspectors: 2,
    currentInspectors: 2
  }
];

const inspectorStats: InspectorStats = {
  totalVerifications: 47,
  completedThisMonth: 8,
  reputationScore: 94,
  earningsThisMonth: "18,500 HBAR",
  averageRating: 4.8,
  specializations: ["Land Surveying", "Title Verification", "Environmental Assessment"]
};

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30"
  },
  'in-progress': {
    label: "In Progress", 
    icon: Eye,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    border: "border-blue-500/30"
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-400", 
    bg: "bg-green-500/20",
    border: "border-green-500/30"
  },
  disputed: {
    label: "Disputed",
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-500/20", 
    border: "border-red-500/30"
  }
};

const priorityConfig = {
  high: { color: "text-red-400", bg: "bg-red-500/20" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/20" },
  low: { color: "text-green-400", bg: "bg-green-500/20" }
};

export default function InspectorDashboard() {
  const [activeTab, setActiveTab] = useState<'requests' | 'completed' | 'profile'>('requests');
  const [] = useState<VerificationRequest | null>(null);
  const [verifyForm, setVerifyForm] = useState<VerifyForm>({ landId: '', role: 'Chief', name: '' });
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loadingParcels, setLoadingParcels] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  // Token ID required by backend for verification/mint workflows
  const TOKEN_ID = (import.meta as any).env?.VITE_TOKEN_ID || '0.0.7158415';

  async function loadPendingParcels() {
    try {
      setLoadingParcels(true);
      const res = await api.getParcels('pending');
      const items = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
      setParcels(items as Parcel[]);
    } catch (e: any) {
      setParcels([]);
    } finally {
      setLoadingParcels(false);
    }
  }

  useEffect(() => {
    loadPendingParcels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitVerification(e: React.FormEvent) {
    e.preventDefault();
    setVerifyMsg(null);
    try {
      setSubmitting(true);
      const landIdNum = Number(verifyForm.landId);
      if (!Number.isFinite(landIdNum)) {
        setVerifyMsg('Invalid Land ID');
        return;
      }
      // Send role exactly as backend expects (e.g., "Chief" or "Surveyor") and include tokenId
      const body = { landId: landIdNum, role: verifyForm.role as any, name: verifyForm.name, tokenId: TOKEN_ID };
      const res = await api.verifyLand(body);
      setVerifyMsg(`Success. Verified: ${String(res?.verified)}. Status: ${res?.status ?? res?.state ?? 'updated'}.`);
      await loadPendingParcels();
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const backendMsg = (data && typeof data === 'object') ? JSON.stringify(data) : (data || err?.message);
      const msg = backendMsg || 'Verification failed';
      setVerifyMsg(status ? `HTTP ${status}: ${msg}` : String(msg));
    } finally {
      setSubmitting(false);
    }
  }

  const pendingRequests = mockRequests.filter(req => req.status === 'pending' || req.status === 'in-progress');
  const completedRequests = mockRequests.filter(req => req.status === 'completed');

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
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Trusted Inspector Portal</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Inspector Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Verify land ownership, earn reputation NFTs, and build trust in the BIMA ecosystem
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
                  <Award className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-muted-foreground">Total Verifications</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{inspectorStats.totalVerifications}</div>
            </div>

            <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-sm text-muted-foreground">This Month</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{inspectorStats.completedThisMonth}</div>
            </div>

            <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Star className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm text-muted-foreground">Reputation Score</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{inspectorStats.reputationScore}/100</div>
            </div>

            <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Coins className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-sm text-muted-foreground">Earnings</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{inspectorStats.earningsThisMonth}</div>
            </div>
          </motion.div>
        </div>
      </section>

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
              { id: 'requests', label: 'Active Requests', icon: Clock },
              { id: 'completed', label: 'Completed', icon: CheckCircle2 },
              { id: 'profile', label: 'Profile & Reputation', icon: Badge }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Active Requests Tab */}
          {activeTab === 'requests' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-card/40 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">Backend Verification</h3>
                  <button onClick={loadPendingParcels} disabled={loadingParcels} className="text-sm px-3 py-1 rounded-md bg-card border border-border/50 hover:border-primary/50 disabled:opacity-60">
                    {loadingParcels ? 'Refreshing…' : 'Refresh Pending Parcels'}
                  </button>
                </div>
                <form onSubmit={submitVerification} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Land ID" value={verifyForm.landId} onChange={(e)=>setVerifyForm(v=>({ ...v, landId: e.target.value }))} />
                  <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={verifyForm.role} onChange={(e)=>setVerifyForm(v=>({ ...v, role: e.target.value as any }))}>
                    <option value="Chief">Chief</option>
                    <option value="Surveyor">Surveyor</option>
                  </select>
                  <input className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your Name" value={verifyForm.name} onChange={(e)=>setVerifyForm(v=>({ ...v, name: e.target.value }))} />
                  <button type="submit" disabled={submitting || !verifyForm.landId || !verifyForm.name} className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm disabled:opacity-60">
                    {submitting ? 'Submitting…' : 'Submit Approval'}
                  </button>
                </form>
                {verifyMsg && <p className="mt-2 text-sm text-muted-foreground">{verifyMsg}</p>}
                {parcels.length > 0 ? (
                  <div className="mt-4 text-sm">
                    <div className="font-medium mb-1">Pending Parcels</div>
                    <ul className="space-y-1">
                      {parcels.map(p => (
                        <li key={p.landId} className="flex items-center justify-between gap-2 rounded-md border border-border/40 px-3 py-2">
                          <span>#{p.landId} • {p.location ?? 'Unknown'} • {p.size ?? ''}</span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs hidden md:block">{p.metadataHash}</code>
                            <button onClick={()=>setVerifyForm(v=>({ ...v, landId: String(p.landId) }))} className="text-xs px-2 py-1 rounded-md bg-card border border-border/50 hover:border-primary/50">Use ID</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">No pending parcels.</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Verification Requests</h2>
                <div className="text-sm text-muted-foreground">
                  {pendingRequests.length} active requests
                </div>
              </div>

              <div className="grid gap-6">
                {pendingRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
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
                          <h3 className="text-lg font-bold text-foreground">{request.location}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.area} • ID: {request.propertyId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig[request.priority].bg} ${priorityConfig[request.priority].color}`}>
                          {request.priority.toUpperCase()} PRIORITY
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[request.status].bg} ${statusConfig[request.status].color}`}>
                          {React.createElement(statusConfig[request.status].icon, { className: "w-3 h-3" })}
                          {statusConfig[request.status].label}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Seller</span>
                        <p className="font-medium text-foreground">{request.sellerName}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Deadline</span>
                        <p className="font-medium text-foreground">{request.deadline}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Compensation</span>
                        <p className="font-medium text-primary">{request.compensation}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Inspectors</span>
                        <p className="font-medium text-foreground">
                          {request.currentInspectors}/{request.requiredInspectors}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {request.documents.length} documents
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors text-sm font-medium">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        {request.status === 'pending' && (
                          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                            <Shield className="w-4 h-4" />
                            Accept Request
                          </button>
                        )}
                        {request.status === 'in-progress' && (
                          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium">
                            <Upload className="w-4 h-4" />
                            Submit Report
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Completed Tab */}
          {activeTab === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Completed Verifications</h2>
                <div className="text-sm text-muted-foreground">
                  {completedRequests.length} completed this period
                </div>
              </div>

              <div className="grid gap-4">
                {completedRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <div>
                          <h3 className="font-medium text-foreground">{request.location}</h3>
                          <p className="text-sm text-muted-foreground">{request.area} • {request.requestDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-primary">{request.compensation}</span>
                        <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors text-sm">
                          <Download className="w-3 h-3" />
                          Report
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold">Inspector Profile & Reputation</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Reputation Card */}
                <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Reputation Score
                  </h3>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">{inspectorStats.reputationScore}/100</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= Math.floor(inspectorStats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {inspectorStats.averageRating}/5.0
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {inspectorStats.totalVerifications} verifications</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy Rate</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-medium">2.3 hours avg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">100%</span>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Badge className="w-5 h-5 text-blue-400" />
                    Specializations
                  </h3>
                  
                  <div className="space-y-3">
                    {inspectorStats.specializations.map((spec, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card/30">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-medium">{spec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Reputation NFT</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your verification history and reputation are stored as an NFT on Hedera, 
                      providing verifiable credentials for your expertise.
                    </p>
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
