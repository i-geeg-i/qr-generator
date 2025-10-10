import { useState, useEffect } from 'react'
import QRCode from "react-qr-code";
import './App.css'

function App() {
  const [link, setLink] = useState('')
  const [color, setColor] = useState('#000000')
  const [colorInverted, setColorInverted] = useState('#FFFFFF')
  const colors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  const handleInputLinkChange = (event) => {
    const value = event.target.value;
    if (!value || !value.includes('.') || value.split('.')[0].length < 1 || value.split('.')[1].length < 2) {
      setLink('');
      return;
    }
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      setLink('https://' + value);
      return;
    }
    setLink(value);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      let newColor = '#';
      for (let i = 0; i < 6; i++) {
        newColor += colors[Math.floor(Math.random() * colors.length)];
      }
      let newColorInverted = '#';
      for (let i = 0; i < 6; i += 2) {
        const part = 255 - parseInt(newColor.substring(i, i + 2), 16);
        newColorInverted += colors[Math.floor(part / 16)] + colors[part % 16];
      }
      newColorInverted += '4a';
      console.log(newColor, newColorInverted);
      setColorInverted(newColorInverted);
      setColor(newColor);      

    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function handleDownload() {
    const svgElement = document.getElementById('qr');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  function handlePNGDownload(){
    const img = new Image();
    const svgElement = document.getElementById('qr');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Convert canvas to PNG
      const pngUrl = canvas.toDataURL("image/png");

      // Trigger download
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "image.png";
      link.click();

      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="App">
      <div className="phrase">
        <h1>Let's create QR for your </h1> <span style={{color: color, backgroundColor: colorInverted}}>beautiful</span> <h1> link!</h1>
      </div>
      <input
        type="text"
        placeholder="https://example.com"
        onChange={handleInputLinkChange}
      />
      {link && (
        <>
          <div className='QR'>
            <QRCode
              value={link}
              id='qr'
            />
          </div>
          <div className='download'>
            <button onClick={() => {handleDownload()}}>Download SVG</button>
            <button onClick={() => {handlePNGDownload()}}>Download PNG</button>
          </div>
        </>
      )}

      <div className="footer">
        <p>Made with ❤️ by <a href="https://geeg.tatar">GEEG</a></p>
      </div>
    </div>
  )
}

export default App
