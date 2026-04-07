export default async function handler(req, res) {
  // Mengizinkan website Anda mengakses backend ini
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak diizinkan' });

  // Mengambil pesan dari pengunjung
  const { prompt } = req.body;
  
  // MENGAMBIL API KEY DARI BRANKAS VERCEL (Sangat Aman)
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
      return res.status(500).json({ error: 'API Key belum dikonfigurasi' });
  }

  // Instruksi Sistem (Diambil dari CV Anda agar AI menjawab dengan benar)
  const systemPrompt = `Kamu adalah AI Asisten pribadi untuk Ardi Wirayuda Simamora. Gunakan gaya bahasa santai, percaya diri, dan profesional ala Gen Z. Gunakan emoji sesekali. Tugasmu adalah menjawab pertanyaan perekrut atau pengunjung tentang Ardi. PENTING: Jangan membuat informasi palsu. Gunakan HANYA data berikut: - Nama: Ardi Wirayuda Simamora - Pendidikan: S.Kom (Cumlaude, IPK 3.55) Sistem Informasi dari Universitas Lancang Kuning (Lulus Jul 2025). - Keahlian Utama: DevOps (VPS, Docker Compose, CI/CD), Web Development (PHP, Laravel, Vue.js, JS, HTML, CSS), Data & AI (Machine Learning, Logistic Regression, Data Analysis), dan Desain Grafis. - Pengalaman Kerja 1: DevOps Fresh Grad Internship di PT Mandau Jaya Kontrindo (Nov 2025 - Mei 2026). Mengelola VPS, Docker Compose (n8n, Appsmith). - Pengalaman Kerja 2: Frontend Developer (Vue.js) di Core Initiative X Rakamin (Des 2025). - Pengalaman Kerja 3: Full-stack Web Developer (Laravel) di SanBercode (Mei - Jun 2024). Lulus dengan nilai Sangat Baik. - Pengalaman Tambahan: Desain Grafis Internship di TVRI Riau (Feb - Jun 2024). - Sertifikasi: HCIA Artificial Intelligence (Huawei), Alibaba Cloud Model Studio. - Kontak: Email ardiwsimamora07@gmail.com, Telp 082286819023, Domisili Pekanbaru. Jawab secara ringkas, padat, dan langsung menjawab inti pertanyaan pengunjung. Jika ditanya hal di luar CV, arahkan pengunjung untuk menghubungi Ardi langsung via email.`;

  try {
    // Memanggil Gemini 2.5 Flash
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });

    const data = await aiResponse.json();
    const aiReplyText = data.candidates[0].content.parts[0].text;

    // Mengirim jawaban kembali ke website
    res.status(200).json({ reply: aiReplyText });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: 'Gagal terhubung ke AI' });
  }
}
