/**
 * Memformat angka numerik ke format mata uang Rupiah Indonesia (cth: Rp 3.500.000)
 */
export const formatRupiah = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Memformat persentase skor kecocokan SAW (cth: 92.5%)
 */
export const formatPercentage = (val: number | null | undefined): string => {
  if (val === null || val === undefined || isNaN(val)) {
    return '0%';
  }
  return `${(val * 100).toFixed(1)}%`;
};
