import React, { useState, useRef } from 'react';
import { ShieldAlert, Download, Smartphone, HeartPulse, Phone, Share2, Info, User, Pill, Activity, AlertCircle } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({ 
    blood: '', phone: '', name: '', chronic: '', meds: '', allergies: ''
  });
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (showQR) setShowQR(false);
  };

  const qrData = `ACIL DURUM BILGISI\nAD: ${formData.name || '-'}\nKAN: ${formData.blood || '-'}\nTEL: ${formData.phone || '-'}\nKRONIK: ${formData.chronic || 'Yok'}\nILACLAR: ${formData.meds || 'Yok'}\nALERJI: ${formData.allergies || 'Yok'}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrData)}&margin=2`;

  const handleDownload = () => {
    setLoading(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = qrUrl;

    img.onload = () => {
      // 1. Zemin Tasarımı (Görseldeki gibi derin koyu tonlar)
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, '#020617'); // En üst
      grad.addColorStop(0.5, '#0f172a'); // Orta (Hafif aydınlık)
      grad.addColorStop(1, '#020617'); // En alt
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Hafif Izgara (Grid) Deseni - Görseldeki o ince detay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for(let i = 0; i < 1080; i += 60) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1920); ctx.stroke();
      }
      for(let j = 0; j < 1920; j += 60) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(1080, j); ctx.stroke();
      }

      // 3. QR Yerleşimi ve Glow (Parlama) Efekti
      const qrSize = 640;
      const x = (1080 - qrSize) / 2;
      const y = (1920 - qrSize) / 2;

      // QR arkasındaki beyaz yumuşak parlama
      ctx.shadowBlur = 80;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.15)';
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.roundRect(x - 25, y - 25, qrSize + 50, qrSize + 50, 45);
      ctx.fill();
      
      ctx.shadowBlur = 0; // Yazı için gölgeyi kapat
      ctx.drawImage(img, x, y, qrSize, qrSize);

      // 4. Alt Bilgi Yazısı (Görseldeki minimalist yazı)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = '300 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EMERGENCY MEDICAL ID • LIFESAVER', 540, 1820);

      // İndirme tetikleyici
      const link = document.createElement('a');
      link.download = `lifesaver-id-${formData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setLoading(false);
    };
  };

  const bloodTypes = ["A Rh+", "A Rh-", "B Rh+", "B Rh-", "AB Rh+", "AB Rh-", "0 Rh+", "0 Rh-"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-red-500/30 font-sans p-4 md:p-8 flex flex-col items-center">
      <canvas ref={canvasRef} width="1080" height="1920" className="hidden" />

      <header className="max-w-4xl w-full text-center mb-10 mt-8">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-2xl mb-4 border border-red-500/20 animate-pulse">
          <ShieldAlert className="text-red-500 w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent mb-4 tracking-tight">
          ACİL DURUM QR
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
         Bilgiler hayat kurtarır. Eksiksiz doldur, QR kodunu oluştur.
        </p>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* FORM KISMI - DEĞİŞMEDİ */}
        <section className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Info className="text-blue-400 w-5 h-5" />
            </div> 
            Kritik Sağlık Bilgileri
          </h2>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3 h-3" /> Tam Adın
                </label>
                <input type="text" name="name" placeholder="Mehmet Can" onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <HeartPulse className="w-3 h-3 text-red-500" /> Kan Grubu
                </label>
<select 
  name="blood" 
  onChange={handleChange} 
  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-red-500/50 text-slate-200 cursor-pointer appearance-none"
>
  <option value="" className="bg-slate-900 text-slate-400">Seçiniz</option>
  {bloodTypes.map(type => (
    <option key={type} value={type} className="bg-slate-900 text-slate-200">
      {type}
    </option>
  ))}
</select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-3 h-3 text-green-500" /> Acil Durum Yakını Telefonu
              </label>
              <input type="tel" name="phone" placeholder="05xx xxx xx xx" onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-green-500/50 transition-all"/>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3 h-3 text-amber-500" /> Kronik Rahatsızlıklar
              </label>
              <input type="text" name="chronic" placeholder="Şeker, Tansiyon vb." onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-all"/>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-3 h-3 text-purple-500" /> Düzenli Kullanılan İlaçlar
              </label>
              <input type="text" name="meds" placeholder="İlaç isimleri..." onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all"/>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-orange-500" /> Alerjik Reaksiyonlar
              </label>
              <input type="text" name="allergies" placeholder="Alerjileriniz..." onChange={handleChange} className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50 transition-all"/>
            </div>

            <button onClick={() => setShowQR(true)} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg mt-4">
              <Smartphone className="w-6 h-6" /> QR Kodunu Hazırla
            </button>
          </div>
        </section>

        {/* SAĞ TARAF - GÖRSELDEKİ ÖNİZLEME STİLİ */}
        <section className="flex flex-col gap-8 h-full">
          {!showQR ? (
            <div className="flex-1 min-h-[400px] border-2 border-dashed border-slate-800/50 rounded-[2rem] flex flex-col items-center justify-center text-slate-700 p-12 text-center">
              <Share2 className="w-12 h-12 opacity-20 mb-4" />
              <p className="text-xl font-medium">Önizleme Bekleniyor</p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex flex-col items-center shadow-2xl animate-in fade-in zoom-in duration-500">
              <div className="bg-[#020617] p-6 rounded-[2.5rem] mb-8 border border-slate-800 shadow-inner flex flex-col items-center relative overflow-hidden">
                {/* Küçük Dekoratif Grid Deseni Önizlemesi */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div className="bg-white p-4 rounded-2xl relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <img src={qrUrl} alt="QR" className="w-48 h-48 object-contain" />
                </div>
                <div className="mt-8 text-[10px] text-slate-600 font-light tracking-[0.2em] z-10">EMERGENCY MEDICAL ID</div>
              </div>

              <button onClick={handleDownload} disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95">
                {loading ? "Görsel İşleniyor..." : <><Download className="w-5 h-5" /> PNG OLARAK İNDİR</>}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}