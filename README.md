# Sortify — Belajar Sorting Algorithm Jadi Seru!

[![PWA Status](https://img.shields.io/badge/PWA-Supported-00917A?style=for-the-badge&logo=progressive-web-apps&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**Sortify** adalah aplikasi pembelajaran interaktif berbasis web (**Progressive Web App - PWA**) yang dirancang untuk memvisualisasikan dan mempermudah pemahaman algoritma pengurutan data (*sorting algorithm*) yang sering kali dirasa abstrak oleh mahasiswa atau pelajar. 

Aplikasi ini merupakan **Projek Akhir Mata Kuliah Sistem Pembelajaran Berbasis Multimedia, Gim, dan Peranti Bergerak (Semester 6)**.

---

## Fitur Utama

### 1. Visualisasi Interaktif (*Sorting Visualizer*)
* Memvisualisasikan algoritma secara bertahap (*step-by-step*) sehingga alur data dan perbandingan elemen terlihat dengan jelas.
* Pilihan urutan pengurutan (*Sort Order*): **Ascending** (terkecil ke terbesar) dan **Descending** (terbesar ke terkecil).
* Fitur acak array (*Randomize Array*) dan kontrol visualisasi lengkap.
* Highlight baris kode algoritma secara real-time yang sedang dieksekusi selama visualisasi berjalan.
* Mendukung algoritma dasar hingga lanjutan:
  * **Bubble Sort** (Algoritma pengurutan dasar dengan membandingkan pasangan elemen bertetangga).
  * **Selection Sort** (Pengurutan dengan mencari elemen ekstremum secara berulang).
  * **Insertion Sort** (Pengurutan dengan menyisipkan elemen pada posisi yang tepat).
  * **Quick Sort** (Algoritma pengurutan cepat berbasis *divide-and-conquer*).

### 2. Gamifikasi Pembelajaran
* **Code Puzzle Game**: Pengguna ditantang mengisi bagian kode algoritma yang kosong dengan pilihan ganda agar kode menjadi utuh dan benar.
* **Code Arrangement Game**: Pengguna menyusun potongan baris kode acak agar membentuk algoritma pengurutan yang logis dan valid.
* **Sistem Nyawa (*Hearts System*) & Cooldown**: Pengguna dibekali 3 nyawa. Setiap jawaban salah akan mengurangi nyawa. Jika nyawa habis (0), pengguna masuk ke dalam masa *cooldown* selama 3 menit untuk belajar ulang lewat visualisasi sebelum mencoba kembali.
* **Skor & Streak Belajar**: Mengumpulkan poin setiap kali menyelesaikan modul dan melacak kebiasaan belajar harian (*streak*) berturut-turut.

### 3. Panduan Pengguna Interaktif (*Interactive Onboarding*)
* Panduan interaktif langsung (*guided tour*) menggunakan **React Joyride** saat pengguna baru pertama kali masuk ke halaman *dashboard*.
* Menuntun pengguna mengenali fungsi setiap tombol, navigasi, serta menu aplikasi agar tidak kebingungan.
* **Halaman Panduan Mandiri**: Halaman bantuan statis yang dapat diakses kapan pun melalui menu profil pengguna jika lupa cara kerja fitur.

### 4. Progressive Web App (PWA)
* Aplikasi dapat diinstal langsung di perangkat mobile (Android & iOS) maupun desktop tanpa melalui App Store atau Play Store.
* Memiliki tampilan fullscreen layaknya aplikasi native (*standalone*).
* Status jaringan terintegrasi (**Network Status Indicator**) untuk mendeteksi status online/offline dengan ramah pengguna.

### 5. Integrasi Database Supabase
* Autentikasi pengguna yang aman (Registrasi, Login, dan Logout bersih dengan penghapusan token sesi).
* Sinkronisasi data skor, progres pembelajaran per modul, streak, dan riwayat belajar secara persisten.

---

## Tech Stack & Library

* **Framework Utama**: Next.js v16.2.6 (App Router), React v19, TypeScript
* **Styling**: Tailwind CSS v4, Lucide React (Ikon)
* **PWA Engine**: `next-pwa`, Service Workers, Web App Manifest
* **Database & Auth**: Supabase (@supabase/ssr, @supabase/supabase-js)
* **Gim & Efek**: Canvas Confetti, HTML5 Audio API (Sound effects kemenangan)
* **Tour Guide**: `react-joyride`

---

## 📂 Struktur Folder Repositori

```text
├── app/                  # Next.js App Router (Layout & Pages)
│   ├── audio/            # File aset audio internal
│   ├── courses/          # Halaman daftar materi & visualizer/game dinamis ([courseId])
│   ├── dashboard/        # Halaman utama pengguna setelah login & onboarding
│   ├── guide/            # Halaman panduan/bantuan mandiri
│   ├── login/            # Halaman masuk akun
│   ├── profile/          # Halaman pengaturan profil & logout
│   ├── register/         # Halaman pembuatan akun baru
│   └── globals.css       # Konfigurasi CSS global & custom variables
├── components/           # Reusable Components
│   ├── ui/               # Primitives Shadcn UI / Radix
│   ├── sorting-visualizer.tsx  # Panel visualisasi algoritma pengurutan
│   ├── code-puzzle-game.tsx    # Komponen permainan puzzle kode
│   ├── code-arrangement-game.tsx # Komponen permainan susun kode
│   ├── onboarding-guide.tsx    # Komponen tour guide interaktif
│   ├── network-status.tsx      # Komponen deteksi status jaringan
│   └── install-prompt.tsx      # Banner instalasi PWA di Mobile/Web
├── lib/                  # Utilities & Helpers
│   ├── client.ts         # Inisialisasi Supabase client (Browser)
│   ├── supabase.ts       # Inisialisasi Supabase client (Server / SSR)
│   ├── types.ts          # Definisi interface TypeScript
│   └── sorting-algorithms.ts # Generator langkah visualisasi & dataset game
├── public/               # Static assets (PWA Manifest, Icons, Images)
└── next.config.mjs       # Konfigurasi Next.js & PWA
```

---

## ⚙️ Setup

### Prerequisites
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) (Versi LTS yang direkomendasikan)
* [pnpm](https://pnpm.io/) (Package manager proyek ini menggunakan pnpm)

### Langkah Pemasangan

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/hiisyaam/sortify.git
   cd sortify
   ```

2. **Instal dependensi proyek:**
   ```bash
   pnpm install
   ```

3. **Konfigurasi Environment Variable (`.env.local`):**
   Buat berkas bernama `.env.local` di direktori utama dan isi dengan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
   ```

4. **Jalankan server pengembangan lokal:**
   ```bash
   pnpm dev
   ```
   Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Konfigurasi Skema Database Supabase

Untuk menjalankan aplikasi ini secara fungsional bersama database, jalankan kueri SQL berikut pada panel **SQL Editor** di Supabase Dashboard Anda:

### 1. Tabel Profil Pengguna (`profiles`)
```sql
-- Buat tabel profil yang menampung skor dan progres pengguna
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  email text not null,
  points integer default 0,
  streak integer default 0,
  lives integer default 3,
  last_activity_date date,
  completed_courses text[] default '{}',
  course_progress jsonb default '{}'::jsonb
);

-- Aktifkan Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Buat Policy agar pengguna hanya bisa membaca & mengedit profilnya sendiri
create policy "Allow users to read their own profiles"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Allow users to update their own profiles"
  on public.profiles for update
  using (auth.uid() = id);
```

### 2. Trigger Pembuatan Profil Otomatis (Optional)
Agar profil terbuat otomatis setiap kali ada pendaftaran akun baru melalui Supabase Auth:
```sql
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'User Baru'),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 3. Tabel Riwayat Belajar (`learning_history`)
```sql
create table public.learning_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id text not null,
  course_title text not null,
  points_earned integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS untuk learning_history
alter table public.learning_history enable row level security;

create policy "Allow users to view their own history"
  on public.learning_history for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own history"
  on public.learning_history for insert
  with check (auth.uid() = user_id);
```

---

## Panduan Instalasi PWA di Handphone / Mobile

Karena Sortify dirancang dengan tata letak *mobile-first* (resolusi maksimal 430px di layar lebar agar menyerupai aplikasi mobile), aplikasi ini sangat direkomendasikan untuk diinstal langsung ke layar utama handphone Anda:

### Perangkat Android (Google Chrome)
1. Buka situs Sortify melalui peramban **Google Chrome**.
2. Di bagian bawah layar, akan muncul *banner* pop-up bertuliskan **"Tambahkan Sortify ke Layar Utama"** atau klik ikon instalasi di pojok kanan atas alamat web browser.
3. Klik **Instal / Tambahkan**.
4. Aplikasi Sortify sekarang akan muncul di daftar aplikasi utama ponsel Anda dan dapat dibuka tanpa bar navigasi browser.

### Perangkat iOS / iPhone (Safari Browser)
1. Buka situs Sortify melalui peramban **Safari**.
2. Klik tombol **Share** (ikon persegi dengan panah mengarah ke atas di bagian bawah layar).
3. Gulir ke bawah lalu pilih menu **Add to Home Screen** (Tambahkan ke Layar Utama).
4. Berikan nama aplikasi (misal: `Sortify`) lalu klik **Add** di pojok kanan atas.
5. Ikon Sortify akan langsung terpasang di beranda iOS Anda.

---

## Pengembang & Kontributor

Aplikasi ini dikembangkan untuk memenuhi tugas akhir kuliah **Sistem Pembelajaran Berbasis Multimedia, Gim, dan Peranti Bergerak**:

* **Nama Pengembang**: Faris Hisyam Hardiman
* **NIM**: 235150600111037

---

*Selamat belajar sorting algorithm dengan menyenangkan! Jika Anda menyukai proyek ini, silakan berikan Star ⭐ di repositori ini.*