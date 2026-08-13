export const DEFAULT_TEMPLATE_MARKDOWN = `# Rahasia Kuasai TOEFL Score 550+ 🚀
## Panduan Ringkas & Praktis untuk Pemula
---
# 1. Kuasai Structure & Written Expression 📝
- **Fokus pada Subject & Verb**: Pastikan setiap kalimat memiliki subjek dan kata kerja yang jelas.
- **Waspada Trap Words**: Hati-hati dengan *appositive*, *present participle*, dan *past participle*.
- **Latihan Rutin**: Minimal 20 soal setiap hari untuk mengasah insting grammar Anda.
---
# 2. Listening Comprehension Strategy 🎧
- **Fokus pada Pembicara Kedua**: Di Short Conversation (Part A), kunci jawaban 80% ada di pembicara kedua.
- **Cari Sinonim (Restatement)**: Jawaban benar hampir selalu merupakan bentuk frasa ulang dari kata kunci.
- **Jangan Biarkan Kosong**: Tidak ada minus point di TOEFL!
---
# 3. Reading Comprehension Speed Test 📖
- **Gunakan Teknik Skimming & Scanning**: Jangan baca seluruh bacaan word-by-word.
- **Jawab Main Idea Dulu**: Temukan topik utama di kalimat pertama setiap paragraf.
- **Vocabulary in Context**: Tebak arti kata berdasarkan konteks kalimat sekitarnya.
---
# Siap Dapatkan Skor TOEFL Impianmu? 🎯
- Save & Share postingan ini ke teman seperjuanganmu!
- Follow **@kawan.toefl** untuk info & tips TOEFL harian gratis!
`;

export function downloadMarkdownTemplate() {
  const blob = new Blob([DEFAULT_TEMPLATE_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'template-slideshow-konten.md');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
