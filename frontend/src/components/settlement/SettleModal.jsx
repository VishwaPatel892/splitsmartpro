import { useState } from 'react';
import { 
  X, CheckCircle2, Loader2, IndianRupee, QrCode, 
  Copy, UploadCloud, Image as ImageIcon, ShieldCheck 
} from 'lucide-react';
import { createSettlement } from '../../services/settlementService.js';
import { toast } from '../common/Toast.jsx';

export default function SettleModal({ settlement, groupId, onClose, onSettled }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [proofFile, setProofFile] = useState(null);

  // Generate a dummy UPI ID based on the receiver's name
  const upiId = `${settlement.to.name.toLowerCase().replace(/\s+/g, '')}@okicici`;

  const handleSettle = async () => {
    setLoading(true);
    try {
      await createSettlement({
        fromUser: settlement.from._id,
        toUser: settlement.to._id,
        groupId,
        amount: settlement.amount,
      });
      toast('Payment recorded and marked as paid!', 'success');
      onSettled();
      onClose();
    } catch (err) {
      toast(err.message || 'Failed to record payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUpi = async () => {
    await navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast('UPI ID Copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0F172A]/30">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Secure Payment
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl text-[#64748B] hover:text-white hover:bg-[#334155] transition-all active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Amount Display */}
          <div className="text-center mb-8">
            <p className="text-[#94A3B8] text-sm font-medium mb-1">Paying {settlement.to.name}</p>
            <div className="inline-flex items-center justify-center gap-1 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              <IndianRupee className="w-8 h-8 text-emerald-400" />
              {settlement.amount.toFixed(2)}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mt-2">Status: <span className="text-amber-400">Pending</span></p>
          </div>

          {/* UPI Section */}
          <div className="rounded-2xl border border-[#334155] bg-[#0F172A]/50 p-5 mb-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center relative group">
                <QrCode className="w-24 h-24 text-[#0F172A]" />
                <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <p className="text-white text-xs font-bold">Scan to Pay</p>
                </div>
              </div>
              
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2 text-center">Or pay via UPI ID</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2.5 text-[#94A3B8] font-mono text-sm tracking-wider text-center truncate">
                    {upiId}
                  </div>
                  <button onClick={handleCopyUpi} className={`p-2.5 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${copied ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-[#334155] text-[#94A3B8] hover:text-white hover:bg-[#334155]'}`}>
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Proof Section */}
          <div>
            <p className="text-sm font-bold text-white mb-2">Upload Payment Proof <span className="text-[#64748B] font-normal">(Optional)</span></p>
            {proofFile ? (
              <div className="relative rounded-2xl border border-[#334155] overflow-hidden group">
                <img src={proofFile} alt="Payment Proof" className="w-full h-32 object-cover opacity-80" />
                <button onClick={() => setProofFile(null)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-rose-500/80 transition-colors backdrop-blur-md">
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white font-medium flex items-center gap-1.5"><ImageIcon className="w-3 h-3" /> Proof attached</p>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 rounded-2xl border-2 border-dashed border-[#334155] bg-[#0F172A]/30 hover:bg-[#0F172A] hover:border-indigo-500/50 transition-all cursor-pointer">
                <div className="flex items-center gap-2 text-[#64748B] group-hover:text-indigo-400">
                  <UploadCloud className="w-5 h-5" />
                  <span className="text-sm font-medium">Click to upload screenshot</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#0F172A]/80 border-t border-[#334155] backdrop-blur-md">
          <button
            onClick={handleSettle}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-black tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mark as Paid'}
          </button>
        </div>
      </div>
    </div>
  );
}
