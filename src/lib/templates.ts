export const DEFAULT_TEMPLATE_MARKDOWN = `# Question of the Day
## TOEFL ITP | Structure & Written Expression
---
# Soal Hari Ini
The professor, along with his students, ___ to the conference every year.

- A. go
- B. goes
- C. going
- D. have gone
---
# Tips Ngerjain
- Coret frasa di antara koma, itu cuma penghias kalimat
- Cari subject asli: tunggal atau jamak?
- Verb harus sepakat sama subject-nya
---
# Jawabannya: B
- Subject "The professor" itu tunggal, jadi verb yang cocok: goes
- "Along with his students" cuma tambahan, subject tetap si professor
---
# Lanjut Latihan?
- Latihan ribuan soal lainnya GRATIS di Kawan TOEFL
- Soal baru tiap hari, skor langsung + pembahasan instan
- Tryout TOEFL ITP gratis
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
