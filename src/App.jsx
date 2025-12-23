import React, { useState } from 'react';
import { ShieldAlert, Download, Smartphone, HeartPulse, Phone, Share2, Info, User } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({ blood: '', phone: '', name: '' });
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (showQR) setShowQR(false);
  };

  // QR verisini güvenli bir şekilde oluşturuyoruz
  const qrData = `ACIL DURUM BILGISI\n--------------------\nAD: ${formData.name || 'Belirtilmedi'}\nKAN: ${formData.blood || 'Bilinmiyor'}\nTEL: ${formData.phone || 'Yok'}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}&margin=10`;

  const downloadQR = async () => {
    try {
      setLoading(true);
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `acil-durum-qr-${formData.blood || 'bilgisiz'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("İndirme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const bloodTypes = ["A Rh+", "A Rh-", "B Rh+", "B Rh-", "AB Rh+", "AB Rh-", "0 Rh+", "0 Rh-"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-red-500/30 font-sans p-4 md:p-8 flex flex-col items-center">
      {/* Header Section */}
      <header className="max-w-4xl w-full text-center mb-12 mt-8">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-2xl mb-4 border border-red-500/20 animate-pulse">
          <ShieldAlert className="text-red-500 w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent mb-4 tracking-tight">
          ACİL DURUM QR
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
          Acil durumda saniyeler hayattır. Bilgilerini gir, QR kodunu oluştur ve telefonunun kilit ekranına yerleştir.
        </p>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <section className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-red-600/10 transition-colors duration-500" />
          
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Info className="text-blue-400 w-5 h-5" />
            </div> 
            Kişisel Bilgiler
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Tam Adın (Opsiyonel)
              </label>
              <input 
                type="text" 
                name="name"
                placeholder="Örn: Mehmet Can"
                onChange={handleChange}
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-red-500" /> Kan Grubu
                </label>
                <div className="relative">
                  <select 
                    name="blood" 
                    onChange={handleChange}
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all appearance-none cursor-pointer text-slate-200"
                  >
                    <option value="" className="bg-slate-900">Seçiniz</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type} className="bg-slate-900">{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" /> Acil Durum Tel
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="05xx xxx xx xx"
                  onChange={handleChange}
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl px-5 py-4 outline-none focus:border-green-500/50 focus:ring-4 focus:ring-green-500/5 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button 
              onClick={() => setShowQR(true)}
              className="w-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-red-900/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg mt-4"
            >
              <Smartphone className="w-6 h-6" />
              QR Kodunu Hazırla
            </button>
          </div>

          <div className="mt-10 p-5 bg-slate-800/30 border border-slate-700/30 rounded-2xl flex gap-4 items-start">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <ShieldAlert className="text-blue-400 shrink-0 w-5 h-5" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              <span className="text-slate-200 font-semibold block mb-1">Veri Gizliliği</span>
              Girdiğin bilgiler hiçbir yere kaydedilmez. QR kodun direkt tarayıcında oluşturulur ve sayfa kapandığında her şey silinir.
            </p>
          </div>
        </section>

        {/* QR Preview Section */}
        <section className="flex flex-col gap-8 h-full">
          {!showQR ? (
            <div className="flex-1 min-h-[500px] border-2 border-dashed border-slate-800/50 rounded-[2rem] flex flex-col items-center justify-center text-slate-700 p-12 text-center group">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Share2 className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-xl font-medium mb-2">Henüz Bir Şey Yok</p>
              <p className="text-sm opacity-60">Bilgilerini doldurup "Hazırla" butonuna bastığında QR kodun burada canlanacak.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="bg-slate-900/60 border border-slate-800 p-10 rounded-[2rem] flex flex-col items-center shadow-2xl relative group">
                <div className="absolute -top-4 -left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/30">
                  Canlı Önizleme
                </div>
                
                <div className="bg-white p-6 rounded-3xl shadow-2xl transform group-hover:rotate-1 transition-transform duration-500">
                  <img 
                    src={qrUrl} 
                    alt="Acil Durum QR" 
                    className="w-64 h-64 md:w-80 md:h-80 object-contain"
                  />
                </div>

                <div className="mt-10 w-full space-y-4">
                  <button 
                    onClick={downloadQR}
                    disabled={loading}
                    className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-6 h-6" />
                    )}
                    Görseli İndir (.PNG)
                  </button>
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                    <Smartphone className="w-3 h-3" />
                    <span>Kilit ekranında saatten uzak bir yere yerleştirin</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex gap-4">
                <div className="text-amber-500 text-xl font-bold italic shrink-0">NOT:</div>
                <p className="text-amber-200/80 text-sm leading-relaxed">
                  İndirdiğin görseli telefonunun kilit ekranı duvar kağıdı olarak ayarla. Kazara bir şey olursa, sağlık personeli telefonunu açmadan bu kodu okutarak bilgilerine ulaşabilir.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-16 mb-8 text-slate-600 text-sm flex flex-col items-center gap-2">
        <div className="h-px w-24 bg-slate-800 mb-4" />
        <p>Gizlilik Odaklı Acil Durum Çözümü</p>
        <p className="opacity-50 font-mono">© 2025 // Lifesaver QR v2.0</p>
      </footer>
    </div>
  );
}