-- Seed Data: 10 Kriteria, Pertanyaan, Opsi, dan Nilai SAW terhadap 4 Paket
-- Total Bobot: 20 + 10 + 15 + 10 + 10 + 5 + 5 + 15 + 5 + 5 = 100%

-- 1. Insert Kriteria
INSERT INTO public.criteria (code, name, weight, order_index)
VALUES
('C1', 'Jenis Acara', 20, 1),
('C2', 'Waktu Pelaksanaan', 10, 2),
('C3', 'Kebutuhan Makeup', 15, 3),
('C4', 'Kebutuhan Busana', 10, 4),
('C5', 'Gaya Riasan', 10, 5),
('C6', 'Jumlah Ibu Mempelai', 5, 6),
('C7', 'Jumlah Jaga Kado', 5, 7),
('C8', 'Kebutuhan Siraman', 15, 8),
('C9', 'Tambahan Rias & Busana', 5, 9),
('C10', 'Anggaran (Budget)', 5, 10)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  weight = EXCLUDED.weight,
  order_index = EXCLUDED.order_index;
