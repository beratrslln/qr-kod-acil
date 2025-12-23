import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function App() {
  const [formData, setFormData] = useState({ blood: '', phone: '' });
  const [showQR, setShowQR] = useState(false);

  // Veri değişimini takip et
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowQR(false); // Veri değişince eski QR'ı gizle
  };

  // QR'ı resim olarak indirme fonksiyonu
  const downloadQR = () => {
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "acil-durum-qr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
      <h1>Acil Durum QR Oluşturucu</h1>
      <p> bilgilerini gir, kilit ekranına koy </p>

      <div style={{ margin: '20px' }}>
        <select name="blood" onChange={handleChange} style={inputStyle}>
          <option value="">Kan Grubunu Seç</option>
          <option value="A Rh+">A Rh+</option>
          <option value="A Rh-">A Rh-</option>
          <option value="B Rh+">B Rh+</option>
          <option value="B Rh-">B Rh-</option>
          <option value="AB Rh+">AB Rh+</option>
          <option value="0 Rh+">0 Rh+</option>
          {/* Diğerlerini de ekle üşenme! */}
        </select>
        <br />
        <input 
          type="text" name="phone" placeholder="Acil Durum Telefonu" 
          onChange={handleChange} style={inputStyle} 
        />
        <br />
        <button onClick={() => setShowQR(true)} style={btnStyle}>QR Oluştur</button>
      </div>

      {showQR && (
        <div style={{ marginTop: '30px', border: '2px solid #333', display: 'inline-block', padding: '20px' }}>
          <QRCodeCanvas 
            id="qr-gen"
            value={`ACIL DURUM\nKan Grubu: ${formData.blood}\nTel: ${formData.phone}`} 
            size={256}
            level={"H"} // En yüksek hata düzeltme seviyesi!
            includeMargin={true}
          />
          <br />
          <button onClick={downloadQR} style={{...btnStyle, backgroundColor: '#28a745'}}>Resmi İndir</button>
        </div>
      )}
    </div>
  );
}

// Basit stiller
const inputStyle = { padding: '10px', margin: '10px', width: '250px', borderRadius: '5px' };
const btnStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' };

export default App;