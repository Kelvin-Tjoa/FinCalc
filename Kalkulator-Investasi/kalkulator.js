function setAmount(amount) {
    document.getElementById('targetDana').value = amount;
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka);
}

function formatRupiahInput(input) {
    // Hapus semua karakter selain angka
    let angka = input.value.replace(/[^\d]/g, '');
    
    // Format ke rupiah dengan koma sebagai pemisah ribuan
    if (angka) {
        const number = parseInt(angka);
        input.value = formatRupiahString(number);
    }
}

function formatRupiahString(angka) {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka);
}

function parseRupiahToNumber(rupiahString) {
    // Hapus semua karakter selain angka
    return parseInt(rupiahString.replace(/[^\d]/g, '')) || 0;
}

function getSaranInvestasi(totalDana) {
    let saran = '';
    
    if (totalDana < 10000000) { // < 10 juta
        saran = `
            <h3>Saran Pengelolaan Dana</h3>
            <ul>
                <li>Tabungan Emergency Fund (40%): ${formatRupiah(totalDana * 0.4)}</li>
                <li>Reksadana Pasar Uang (30%): ${formatRupiah(totalDana * 0.3)}</li>
                <li>Deposito (30%): ${formatRupiah(totalDana * 0.3)}</li>
            </ul>
            <p><strong>Tips:</strong> Untuk dana di bawah 10 juta, fokus utama sebaiknya pada pembentukan dana darurat dan instrumen investasi yang aman.</p>
        `;
    } else if (totalDana < 100000000) { // 10-100 juta
        saran = `
            <h3>Saran Pengelolaan Dana</h3>
            <ul>
                <li>Emergency Fund (30%): ${formatRupiah(totalDana * 0.3)}</li>
                <li>Reksadana Campuran (30%): ${formatRupiah(totalDana * 0.3)}</li>
                <li>Obligasi Pemerintah (20%): ${formatRupiah(totalDana * 0.2)}</li>
                <li>Emas (20%): ${formatRupiah(totalDana * 0.2)}</li>
            </ul>
            <p><strong>Tips:</strong> Mulai diversifikasi portfolio dengan instrumen yang lebih beragam namun tetap konservatif.</p>
        `;
    } else if (totalDana < 500000000) { // 100-500 juta
        saran = `
            <h3>Saran Pengelolaan Dana</h3>
            <ul>
                <li>Emergency Fund (20%): ${formatRupiah(totalDana * 0.2)}</li>
                <li>Saham (30%): ${formatRupiah(totalDana * 0.3)}</li>
                <li>Obligasi Pemerintah (20%): ${formatRupiah(totalDana * 0.2)}</li>
                <li>Reksadana (20%): ${formatRupiah(totalDana * 0.2)}</li>
                <li>Emas (10%): ${formatRupiah(totalDana * 0.1)}</li>
            </ul>
            <p><strong>Tips:</strong> Bisa mulai berinvestasi di instrumen yang lebih agresif dengan potensi return lebih tinggi.</p>
        `;
    } else { // > 500 juta
        saran = `
            <h3>Saran Pengelolaan Dana</h3>
            <ul>
                <li>Emergency Fund (15%): ${formatRupiah(totalDana * 0.15)}</li>
                <li>Saham Blue Chip (30%): ${formatRupiah(totalDana * 0.3)}</li>
                <li>Reksadana (25%): ${formatRupiah(totalDana * 0.25)}</li>
                <li>Obligasi Pemerintah (15%): ${formatRupiah(totalDana * 0.15)}</li>
                <li>Emas dan Logam Mulia (10%): ${formatRupiah(totalDana * 0.1)}</li>
                <li>Cryptocurrency (5%): ${formatRupiah(totalDana * 0.05)}</li>
            </ul>
            <p><strong>Tips:</strong> Pertimbangkan untuk konsultasi dengan perencana keuangan profesional untuk strategi yang lebih personal.</p>
        `;
    }
    return saran;
}

function getAnalisisDana(totalInvestasi, targetDana) {
    const selisih = totalInvestasi - targetDana;
    const persentaseSelisih = (selisih / targetDana) * 100;
    
    let statusClass = '';
    let analisis = '';
    let saran = '';

    if (selisih >= 0) {
        statusClass = 'success';
        analisis = `Selamat! Target dana Anda tercapai dengan kelebihan ${formatRupiah(selisih)} (${persentaseSelisih.toFixed(1)}% di atas target).`;
        saran = `
            <h4>Saran untuk Kelebihan Dana:</h4>
            <ul>
                <li>Pertimbangkan untuk meningkatkan dana darurat Anda</li>
                <li>Diversifikasi portfolio ke instrumen investasi dengan risiko lebih rendah</li>
                <li>Alokasikan sebagian untuk asuransi kesehatan atau pendidikan</li>
                <li>Pertimbangkan untuk investasi properti atau bisnis</li>
            </ul>
        `;
    } else {
        statusClass = 'warning';
        analisis = `Target dana Anda belum tercapai, kurang ${formatRupiah(Math.abs(selisih))} (${Math.abs(persentaseSelisih).toFixed(1)}% di bawah target).`;
        saran = `
            <h4>Saran untuk Mencapai Target:</h4>
            <ul>
                <li>Tingkatkan jumlah investasi berkala Anda</li>
                <li>Pertimbangkan instrumen investasi dengan return lebih tinggi</li>
                <li>Evaluasi dan kurangi pengeluaran tidak perlu</li>
                <li>Cari sumber pendapatan tambahan</li>
            </ul>
        `;
    }

    return `
        <div class="analisis-section ${statusClass}">
            <h3>Analisis Pencapaian Target</h3>
            <p class="analisis-text">${analisis}</p>
            <div class="saran-pencapaian">
                ${saran}
            </div>
        </div>
    `;
}

function hitungInvestasi() {
    // Ambil nilai input
    const targetDana = parseRupiahToNumber(document.getElementById('targetDana').value);
    const jangkaWaktu = parseFloat(document.getElementById('jangkaWaktu').value);
    const targetInvestasi = parseRupiahToNumber(document.getElementById('targetInvestasi').value);
    const returnInvestasi = parseFloat(document.getElementById('returnInvestasi').value);
    const danaAwal = parseRupiahToNumber(document.getElementById('danaAwal').value) || 0;
    const periodeTabung = document.getElementById('periodeTabung').value;

    // Debug log
    console.log({
    targetDana,
    jangkaWaktu,
    targetInvestasi,
    returnInvestasi,
    danaAwal,
    periodeTabung
    });

    // Validasi input
    if (!targetDana) {
        alert('Mohon isi Target Dana');
        return;
    }

    if (!jangkaWaktu) {
        alert('Mohon isi Jangka Waktu');
        return;
    }

    if (!targetInvestasi) {
        alert('Mohon isi Target Investasi per Periode');
        return;
    }

    if (!returnInvestasi && returnInvestasi !== 0) {
        alert('Mohon isi Return Investasi');
        return;
    }


    // Dana awal boleh kosong (akan dianggap 0)
    // Hitung investasi (logika diperbaiki)
    const periodeBunga = periodeTabung === 'bulanan' ? 12 : 1;
    const totalPeriode = jangkaWaktu * periodeBunga;

    const bungaPerPeriode = (returnInvestasi && periodeBunga)
        ? (returnInvestasi / 100) / periodeBunga
        : 0;

    // Hitung total hasil investasi (future value)
    let totalInvestasi = 0;

    // Komponen 1: Dana awal
    if (danaAwal && bungaPerPeriode !== 0) {
        totalInvestasi += danaAwal * Math.pow(1 + bungaPerPeriode, totalPeriode);
    } else {
        totalInvestasi += danaAwal;
    }

    // Komponen 2: Investasi rutin
    if (targetInvestasi && bungaPerPeriode !== 0) {
        totalInvestasi += targetInvestasi * ((Math.pow(1 + bungaPerPeriode, totalPeriode) - 1) / bungaPerPeriode);
    } else {
        totalInvestasi += targetInvestasi * totalPeriode;
    }

    // Hitung kontribusi
    const totalKontribusi = (targetInvestasi * totalPeriode);

    // Hitung return
    const totalReturn = totalInvestasi - (danaAwal+totalKontribusi);

    if (isNaN(totalInvestasi) || isNaN(totalKontribusi) || isNaN(totalReturn)) {
        alert('Terjadi kesalahan perhitungan. Pastikan semua input sudah benar.');
        return;
    }


    // Menampilkan hasil
    const hasilSection = document.getElementById('hasilPerhitungan');
    hasilSection.innerHTML = `
        <div class="result-header">
            <h2>Hasil Perhitungan</h2>
        </div>
        
        <div class="result-numbers">
            <div class="result-item">
                <label>Target Dana</label>
                <div class="value">${formatRupiah(targetDana)}</div>
            </div>
            <div class="result-item">
                <label>Total Hasil Investasi</label>
                <div class="value">${formatRupiah(totalInvestasi)}</div>
            </div>
            <div class="result-item">
                <label>Dana Awal</label>
                <div class="value">${formatRupiah(danaAwal)}</div>
            </div>
            <div class="result-item">
                <label>Total Kontribusi</label>
                <div class="value">${formatRupiah(totalKontribusi)}</div>
            </div>
            <div class="result-item">
                <label>Total Return</label>
                <div class="value">${formatRupiah(totalReturn)}</div>
            </div>
        </div>

        ${getAnalisisDana(totalInvestasi, targetDana)}

        <div class="chart-container">
            <canvas id="investmentChart"></canvas>
        </div>

        <div class="saran-section">
            <h3>Saran Pengelolaan Dana</h3>
            <ul class="saran-list">
                <li class="saran-item">
                    <span class="label">Emergency Fund (15%)</span>
                    <span class="amount">${formatRupiah(totalInvestasi * 0.15)}</span>
                </li>
                <li class="saran-item">
                    <span class="label">Saham Blue Chip (30%)</span>
                    <span class="amount">${formatRupiah(totalInvestasi * 0.30)}</span>
                </li>
                <li class="saran-item">
                    <span class="label">Reksadana (25%)</span>
                    <span class="amount">${formatRupiah(totalInvestasi * 0.25)}</span>
                </li>
                <li class="saran-item">
                    <span class="label">Obligasi Pemerintah (15%)</span>
                    <span class="amount">${formatRupiah(totalInvestasi * 0.15)}</span>
                </li>
                <li class="saran-item">
                    <span class="label">Emas dan Logam Mulia (10%)</span>
                    <span class="amount">${formatRupiah(totalInvestasi * 0.10)}</span>
                </li>
                <li class="saran-item">
                    <span class="label">Cryptocurrency (5%)</span>
                    <span class="amount">${formatRupiah(totalInvestasi * 0.05)}</span>
                </li>
            </ul>
            <div class="tips-section">
                <strong>Tips:</strong> Pertimbangkan untuk konsultasi dengan perencana keuangan profesional untuk strategi yang lebih personal.
            </div>
        </div>
    `;
    hasilSection.classList.add('show');

    // Buat chart
    const ctx = document.getElementById('investmentChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Dana Awal', 'Total Kontribusi', 'Return Investasi'],
            datasets: [{
                data: [
                    danaAwal,
                    totalKontribusi,
                    totalReturn
                ],
                backgroundColor: [
                    '#2ecc71',  // Hijau cerah
                    '#3498db',  // Biru cerah
                    '#e74c3c'   // Merah cerah
                ],
                borderColor: '#ffffff', // Border putih
                borderWidth: 2,         // Lebar border
                hoverBackgroundColor: [
                    '#27ae60',  // Hijau hover
                    '#2980b9',  // Biru hover
                    '#c0392b'   // Merah hover
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#2c3e50',  // Warna teks legend
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const meta = chart.getDatasetMeta(0);
                                    const style = meta.controller.getStyle(i);
                                    return {
                                        text: label,
                                        fillStyle: style.backgroundColor,
                                        strokeStyle: style.borderColor,
                                        lineWidth: style.borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.raw;
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let percentage = ((value / total) * 100).toFixed(1);
                            
                            if (label) {
                                label += ': ';
                            }
                            label += formatRupiah(value) + ' (' + percentage + '%)';
                            return label;
                        }
                    },
                    backgroundColor: 'rgba(44, 62, 80, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            }
        }
    });

    // Scroll ke bagian hasil dengan smooth scroll
    hasilSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });

    // Tambahkan class show untuk animasi fade in
    hasilSection.classList.add('show');
}

function exportToExcel() {
        const targetDana = parseRupiahToNumber(document.getElementById('targetDana').value);
        const jangkaWaktu = parseFloat(document.getElementById('jangkaWaktu').value);
        const targetInvestasi = parseRupiahToNumber(document.getElementById('targetInvestasi').value);
        const returnInvestasi = parseFloat(document.getElementById('returnInvestasi').value);
        const danaAwal = parseRupiahToNumber(document.getElementById('danaAwal').value) || 0;
        const periodeTabung = document.getElementById('periodeTabung').value;

        const periodeBunga = periodeTabung === 'bulanan' ? 12 : 1;
        const totalPeriode = jangkaWaktu * periodeBunga;
        const bungaPerPeriode = (returnInvestasi && periodeBunga) ? (returnInvestasi / 100) / periodeBunga : 0;

        let totalInvestasi = 0;
        if (bungaPerPeriode !== 0) {
            totalInvestasi += danaAwal * Math.pow(1 + bungaPerPeriode, totalPeriode);
            totalInvestasi += targetInvestasi * ((Math.pow(1 + bungaPerPeriode, totalPeriode) - 1) / bungaPerPeriode);
        } else {
            totalInvestasi += danaAwal + (targetInvestasi * totalPeriode);
        }

        const totalKontribusi = targetInvestasi * totalPeriode;
        const totalReturn = totalInvestasi - totalKontribusi;

        const data = [
            ['Item', 'Nilai'],
            ['Target Dana', formatRupiah(targetDana)],
            ['Jangka Waktu (tahun)', jangkaWaktu],
            ['Periode Menabung', periodeTabung],
            ['Dana Awal', formatRupiah(danaAwal)],
            ['Jumlah Investasi per Periode', formatRupiah(targetInvestasi)],
            ['Return Investasi (%/tahun)', returnInvestasi + '%'],
            ['Total Hasil Investasi', formatRupiah(totalInvestasi)],
            ['Total Kontribusi (investasi rutin)', formatRupiah(totalKontribusi)],
            ['Total Return', formatRupiah(totalReturn)]
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Investasi');

        XLSX.writeFile(workbook, 'hasil-investasi.xlsx');
    }

// Fungsi untuk menangani klik pada button quick amount
function setQuickAmount(amount) {
    const targetDanaInput = document.getElementById('targetDana');
    targetDanaInput.value = formatRupiahString(amount);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Event listener untuk tombol hitung
    const hitungButton = document.getElementById('btnHitung');
    if (hitungButton) {
        hitungButton.addEventListener('click', function(e) {
            e.preventDefault(); // Mencegah form submit
            hitungInvestasi();
        });
    }

    // Event listener untuk input rupiah
    const rupiahInputs = document.querySelectorAll('.rupiah-input');
    rupiahInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatRupiahInput(this);
        });
    });

    // Event listener untuk quick amount buttons
    document.getElementById('btn10juta').addEventListener('click', function() {
        setQuickAmount(10000000);
    });
    document.getElementById('btn50juta').addEventListener('click', function() {
        setQuickAmount(50000000);
    });
    document.getElementById('btn100juta').addEventListener('click', function() {
        setQuickAmount(100000000);
    });

    


});
