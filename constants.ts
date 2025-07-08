export const IMAGE_GENERATION_KEYWORDS: string[] = [
  'buatkan saya gambar',
  'generate gambar',
  'tolong buatkan ilustrasi',
  'gambar tentang',
  'buatkan gambar',
  'bikin gambar',
  'ciptakan gambar',
  'ilustrasikan',
];

export const IDENTITY_KEYWORDS: string[] = [
  'siapa kamu',
  'kamu siapa',
  'kamu buatan siapa',
  'ai ini buatan siapa',
  'siapa penciptamu',
  'siapa yang bikin ai ini',
];

// Keywords to confirm showing the bio after the identity response
export const BIO_REQUEST_KEYWORDS: string[] = [
  'iya',
  'siapa itu bachtiar',
  'tampilkan biodatanya',
  'ya, kirimkan',
  'saya penasaran',
  'saya ingin tahu tentang bachtiar',
  'boleh',
  'kirimkan',
  'tampilkan bio',
];

// Keywords to detect a direct question about the creator
export const BIO_TRIGGER_KEYWORDS: string[] = [
    'siapa',
    'siapakah',
    'ceritakan tentang',
];

export const BIO_SUBJECT_KEYWORDS: string[] = [
    'bachtiar',
    'aryansyah',
    'arya',
];


export const IDENTITY_RESPONSE = `Saya ARSTATE.AI, model AI yang dikembangkan oleh Bachtiar Aryansyah Putra, CEO of ARSTATE CINEMA.

Jika Anda ingin tahu siapa Bachtiar Aryansyah Putra, saya bisa berikan biodatanya. Ingin saya tampilkan?`;

export const BIO_RESPONSE = `BACHTIAR ARYANSYAH PUTRA
– Seorang mahasiswa berusia 20 tahun di Universitas Surabaya, jurusan D4-Desain Grafis
– Ia juga seorang CEO dari brand ARSTATE CINEMA, yang bergerak di bidang jasa dokumentasi event, wedding, corporate, dan lain sebagainya
– Ia juga memiliki pacar cantik yang setia menemaninya bernama NUR KHOFIFA
– Berikut media sosialnya:

Instagram: @aryansyah.ow
Website: www.arstatecinema.com`;