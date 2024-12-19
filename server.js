const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors'); // Tambahkan middleware CORS
const app = express();

// URL aplikasi yang ingin dipantau
const targetAppUrl = 'https://klinikmitradelima.com/'; // Ganti dengan URL aplikasi yang ingin dipantau

// Data monitoring
let monitoringData = []; // Array untuk menyimpan status dan latency aplikasi

// Middleware
app.use(cors()); // Mengizinkan akses lintas origin
app.use(express.static(path.join(__dirname, 'frontend'))); // Melayani file statis

// Fungsi untuk memonitor aplikasi
const monitorApp = async () => {
  const startTime = Date.now(); // Waktu mulai request
  try {
    const response = await axios.get(targetAppUrl);
    const latency = Date.now() - startTime; // Hitung latency dalam ms

    // Tambahkan data monitoring
    monitoringData.push({ 
      time: new Date().toLocaleTimeString(), 
      status: 'ok', 
      latency 
    });

    // Batasi data hanya 10 entri terakhir
    if (monitoringData.length > 10) monitoringData.shift();

    console.log('Monitoring data berhasil diperbarui:', monitoringData);
  } catch (error) {
    const latency = Date.now() - startTime; // Tetap hitung latency meskipun gagal
    monitoringData.push({ 
      time: new Date().toLocaleTimeString(), 
      status: 'error', 
      latency 
    });

    // Batasi data hanya 10 entri terakhir
    if (monitoringData.length > 10) monitoringData.shift();

    console.error('Error saat memonitor aplikasi:', error.message);
  }
};

// Polling setiap 3 detik
setInterval(monitorApp, 3000);

// Route untuk mendapatkan data monitoring
app.get('/data', (req, res) => {
  console.log('Data monitoring dikirim:', monitoringData);
  res.json(monitoringData);
});

// Menjalankan server
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

