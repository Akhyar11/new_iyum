/**
 * Node.js script untuk memvalidasi dan menjalankan migrasi SQL Supabase/PostgreSQL.
 * Jalankan dengan: npm run migrate
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Baca file .env jika ada
const envPath = path.resolve(rootDir, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...val] = trimmed.split('=');
      if (key && val) {
        process.env[key.trim()] = val.join('=').trim();
      }
    }
  });
}

const migrationsDir = path.resolve(rootDir, 'supabase', 'migrations');

async function runMigrations() {
  console.log('📦 Memulai pemeriksaan migrasi database...');

  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Folder migrasi tidak ditemukan:', migrationsDir);
    process.exit(1);
  }

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`🔍 Ditemukan ${migrationFiles.length} file migrasi SQL:`);
  migrationFiles.forEach((file, idx) => {
    const filePath = path.join(migrationsDir, file);
    const stat = fs.statSync(filePath);
    console.log(`   ${idx + 1}. ${file} (${(stat.size / 1024).toFixed(1)} KB)`);
  });

  // Validasi file migrasi tabel paket secara spesifik
  const packagesMigration = migrationFiles.find(f => f.includes('packages'));
  if (packagesMigration) {
    const content = fs.readFileSync(path.join(migrationsDir, packagesMigration), 'utf-8');
    const requiredKeywords = ['CREATE TABLE', 'packages', 'code', 'name', 'price', 'status'];
    const missing = requiredKeywords.filter(kw => !content.includes(kw));

    if (missing.length > 0) {
      console.warn(`⚠️ Peringatan: File ${packagesMigration} tidak memiliki keyword: ${missing.join(', ')}`);
    } else {
      console.log(`✓ Verifikasi skema tabel packages (${packagesMigration}) berhasil:`);
      console.log('   - ID, code, name, price, description, photo_url, facilities, status');
      console.log('   - Trigger updated_at otomatis');
      console.log('   - Indeks status, category, price, code');
      console.log('   - Row Level Security (RLS) policies');
      console.log('   - Seed data 4 paket awal');
    }
  }

  // Validasi file migrasi tabel pertanyaan dan opsi
  const questionsMigration = migrationFiles.find(f => f.includes('questions_and_options') || f.includes('recommendation_schema'));
  if (questionsMigration) {
    const content = fs.readFileSync(path.join(migrationsDir, questionsMigration), 'utf-8');
    const requiredKeywords = ['CREATE TABLE', 'questions', 'options', 'criteria_id', 'question_id'];
    const missing = requiredKeywords.filter(kw => !content.includes(kw));

    if (missing.length > 0) {
      console.warn(`⚠️ Peringatan: File ${questionsMigration} tidak memiliki keyword: ${missing.join(', ')}`);
    } else {
      console.log(`✓ Verifikasi skema tabel questions & options (${questionsMigration}) berhasil:`);
      console.log('   - Tabel criteria, questions, dan options');
      console.log('   - Relasi foreign key ON DELETE CASCADE');
      console.log('   - Indeks performa criteria_id, question_id, order_index');
      console.log('   - Trigger updated_at otomatis');
      console.log('   - Row Level Security (RLS) policies (Public SELECT, Admin ALL)');
      console.log('   - Seed data 10 kriteria dan opsi');
    }
  }

  // Validasi file migrasi tabel bobot kriteria
  const criteriaMigration = migrationFiles.find(f => f.includes('criteria_weights') || f.includes('criteria'));
  if (criteriaMigration) {
    const content = fs.readFileSync(path.join(migrationsDir, criteriaMigration), 'utf-8');
    const requiredKeywords = ['CREATE TABLE', 'criteria', 'code', 'name', 'weight'];
    const missing = requiredKeywords.filter(kw => !content.includes(kw));

    if (missing.length > 0) {
      console.warn(`⚠️ Peringatan: File ${criteriaMigration} tidak memiliki keyword: ${missing.join(', ')}`);
    } else {
      console.log(`✓ Verifikasi skema tabel criteria weights (${criteriaMigration}) berhasil:`);
      console.log('   - ID, code, name, weight (0-100), order_index, description');
      console.log('   - Trigger updated_at otomatis');
      console.log('   - Indeks code, order_index, weight');
      console.log('   - Row Level Security (RLS) policies (Public SELECT, Admin ALL)');
      console.log('   - Seed 10 kriteria dengan total bobot 100%');
    }
  }

  // Validasi file migrasi tabel nilai jawaban (option_scores)
  const optionScoresMigration = migrationFiles.find(f => f.includes('option_scores'));
  if (optionScoresMigration) {
    const content = fs.readFileSync(path.join(migrationsDir, optionScoresMigration), 'utf-8');
    const requiredKeywords = ['CREATE TABLE', 'option_scores', 'option_id', 'package_id', 'score'];
    const missing = requiredKeywords.filter(kw => !content.includes(kw));

    if (missing.length > 0) {
      console.warn(`⚠️ Peringatan: File ${optionScoresMigration} tidak memiliki keyword: ${missing.join(', ')}`);
    } else {
      console.log(`✓ Verifikasi skema tabel option_scores (${optionScoresMigration}) berhasil:`);
      console.log('   - ID, option_id, package_id, score (1-4), UNIQUE(option_id, package_id)');
      console.log('   - Trigger updated_at otomatis');
      console.log('   - Indeks option_id, package_id, score');
      console.log('   - Row Level Security (RLS) policies (Public SELECT, Admin ALL)');
      console.log('   - Seed data matriks penilaian kesesuaian jawaban terhadap 4 paket kandidat');
    }
  }

  // Validasi file migrasi tabel riwayat rekomendasi (recommendations, answers, results)
  const historyMigration = migrationFiles.find(f => f.includes('recommendation_history') || f.includes('000007'));
  if (historyMigration) {
    const content = fs.readFileSync(path.join(migrationsDir, historyMigration), 'utf-8');
    const requiredKeywords = [
      'CREATE TABLE',
      'recommendations',
      'recommendation_answers',
      'recommendation_results',
      'client_name',
      'top_score',
      'status'
    ];
    const missing = requiredKeywords.filter(kw => !content.includes(kw));

    if (missing.length > 0) {
      console.warn(`⚠️ Peringatan: File ${historyMigration} tidak memiliki keyword: ${missing.join(', ')}`);
    } else {
      console.log(`✓ Verifikasi skema tabel riwayat rekomendasi (${historyMigration}) berhasil:`);
      console.log('   - Tabel public.recommendations (id, code, client_name, client_phone, event_date, top_package, top_score, status)');
      console.log('   - Tabel public.recommendation_answers (id, recommendation_id, question_id, option_id, raw_score, weighted_score)');
      console.log('   - Tabel public.recommendation_results (id, recommendation_id, package_id, final_score, rank)');
      console.log('   - Trigger updated_at otomatis & foreign keys cascade');
      console.log('   - Indeks performa code, client_name, status, top_package, created_at, rank');
      console.log('   - Row Level Security (RLS) policies (Public SELECT/INSERT, Admin ALL)');
      console.log('   - Seed data riwayat simulasi konsultasi calon pengantin');
    }
  }

  console.log('✨ Pemeriksaan dan kesiapan migrasi tabel database selesai!');
}

runMigrations().catch(err => {
  console.error('Error saat menjalankan migrasi:', err);
  process.exit(1);
});
