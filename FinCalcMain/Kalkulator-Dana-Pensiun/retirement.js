// ============= FORMATTER FUNCTIONS =============
function formatRupiah(angka) {
    // Pastikan angka adalah number dan bulatkan
    angka = Math.round(angka);
    
    // Konversi ke string dan tambahkan separator ribuan
    let numberString = String(angka);
    let split = numberString.split('.');
    let sisa = split[0];
    let rupiah = '';
    
    while (sisa.length > 3) {
        rupiah = '.' + sisa.substr(sisa.length - 3) + rupiah;
        sisa = sisa.substr(0, sisa.length - 3);
    }
    
    rupiah = sisa + rupiah;
    return rupiah;
}

function formatInputRupiah(input) {
    let value = input.value.replace(/[^\d]/g, '');
    
    if (!value) {
        input.value = '';
        return;
    }

    let formatted = '';
    while (value.length > 3) {
        formatted = '.' + value.substr(value.length - 3) + formatted;
        value = value.substr(0, value.length - 3);
    }
    formatted = value + formatted;
    
    input.value = formatted;
}

function getNominalValue(inputId) {
    let value = document.getElementById(inputId).value;
    return parseInt(value.replace(/\./g, '')) || 0;
}

// ============= CALCULATOR FUNCTIONS =============
function calculatePensionFunds(inputs) {
    const {currentAge, retirementAge, monthlyExpense, currentSavings, 
           monthlySavings, inflation, returnRate} = inputs;

    const yearsToRetirement = retirementAge - currentAge;
    const totalMonths = yearsToRetirement * 12;
    
    const annualExpense = monthlyExpense * 12;
    const inflationFactor = Math.pow(1 + inflation / 100, yearsToRetirement);
    const futureAnnualExpense = annualExpense * inflationFactor;
    const totalNeeded = futureAnnualExpense / 0.04;
    
    const monthlyRate = returnRate / 100 / 12;
    const futureValueInitial = currentSavings * Math.pow(1 + monthlyRate, totalMonths);
    const futureValueMonthly = monthlySavings * 
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
        (1 + monthlyRate);
    
    const projectedSavings = futureValueInitial + futureValueMonthly;
    const modalInvestasi = currentSavings + (monthlySavings * totalMonths);
    const totalKeuntungan = projectedSavings - modalInvestasi;

    return {
        totalNeeded,
        projectedSavings,
        modalInvestasi,
        totalKeuntungan,
        yearsToRetirement,
        inflation,
        returnRate
    };
}

// ============= CHART FUNCTIONS =============
function createChart(modalInvestasi, totalKeuntungan) {
    const ctx = document.getElementById('investmentChart');
    if (ctx) {
        // Hapus chart lama jika ada
        if (window.myChart instanceof Chart) {
            window.myChart.destroy();
        }
        
        // Hitung total dan persentase
        const total = modalInvestasi + totalKeuntungan;
        
        window.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Modal Investasi', 'Total Keuntungan'],
                datasets: [{
                    data: [modalInvestasi, totalKeuntungan],
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Perbandingan Modal dan Keuntungan',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${formatRupiah(context.raw)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// ============= DISPLAY FUNCTIONS =============
function displayResults(results) {
    const resultDiv = document.getElementById('result');
    resultDiv.classList.add('show');
    
    // Tambahkan scroll ke bagian hasil
    setTimeout(() => {
        resultDiv.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
    
    const isSufficient = results.projectedSavings >= results.totalNeeded;
    const shortfall = Math.max(0, results.totalNeeded - results.projectedSavings);
    
    // Hitung tambahan tabungan bulanan yang diperlukan
    let additionalMonthlySavings = 0;
    let currentMonthly = parseFloat(document.getElementById('monthlySavings').value.replace(/\./g, ''));
    
    if (!isSufficient && results.yearsToRetirement > 0) {
        const monthlyRate = results.returnRate / 100 / 12;
        const totalMonths = results.yearsToRetirement * 12;
        additionalMonthlySavings = Math.ceil(
            (shortfall * monthlyRate) / 
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        );
    }

    const totalMonthly = currentMonthly + additionalMonthlySavings;

    const recommendationHtml = isSufficient ? `
        <div class="recommendation-card success-card">
            <h4><i class="fas fa-star"></i> Rekomendasi untuk Mempertahankan Strategi</h4>
            <ul class="recommendation-list">
                <li>
                    <i class="fas fa-piggy-bank"></i>
                    Lanjutkan menabung Rp ${formatRupiah(currentMonthly)} per bulan
                </li>
                <li>
                    <i class="fas fa-chart-line"></i>
                    Pertimbangkan untuk meningkatkan alokasi dana
                </li>
                <li>
                    <i class="fas fa-balance-scale"></i>
                    Diversifikasi portofolio untuk menyebarkan risiko
                </li>
                <li>
                    <i class="fas fa-sync-alt"></i>
                    Evaluasi strategi investasi setiap 6-12 bulan
                </li>
                <li>
                    <i class="fas fa-shield-alt"></i>
                    Pertimbangkan asuransi untuk proteksi dana
                </li>
            </ul>
        </div>
    ` : `
        <div class="recommendation-card warning-card">
            <h4><i class="fas fa-lightbulb"></i> Rekomendasi untuk Mencapai Target</h4>
            <div class="shortfall-info">
                <p><i class="fas fa-exclamation-circle"></i> Kekurangan dana: Rp ${formatRupiah(shortfall)}</p>
                <p>Untuk mencapai target, Anda perlu:</p>
                <ul>
                    <li>
                        <i class="fas fa-plus-circle"></i>
                        Tambahan tabungan: Rp ${formatRupiah(additionalMonthlySavings)} per bulan
                    </li>
                    <li>
                        <i class="fas fa-coins"></i>
                        Total yang dibutuhkan: Rp ${formatRupiah(totalMonthly)} per bulan
                    </li>
                </ul>
            </div>
            <ul class="recommendation-list">
                <li>
                    <i class="fas fa-tasks"></i>
                    Buat dan patuhi anggaran bulanan
                </li>
                <li>
                    <i class="fas fa-chart-pie"></i>
                    Cari instrumen investasi dengan return lebih tinggi
                </li>
                <li>
                    <i class="fas fa-briefcase"></i>
                    Tingkatkan pendapatan melalui side hustle
                </li>
                <li>
                    <i class="fas fa-user-tie"></i>
                    Konsultasi dengan perencana keuangan
                </li>
                <li>
                    <i class="fas fa-clock"></i>
                    Pertimbangkan menunda usia pensiun
                </li>
            </ul>
        </div>
    `;
    
    // Tambahkan class untuk animasi pada angka-angka
    const numberElements = document.querySelectorAll('.nominal-value');
    numberElements.forEach((element, index) => {
        element.classList.add('animate-number');
        element.style.animationDelay = `${index * 0.1}s`;
    });
    
    resultDiv.innerHTML = `
        <h3>Hasil Perhitungan Dana Pensiun</h3>
        <div class="calculation-summary">
            <p>
                <span>Dana yang Dibutuhkan:</span>
                <span class="nominal-value">Rp ${formatRupiah(results.totalNeeded)}</span>
            </p>
            <p>
                <span>Dana yang Terkumpul:</span>
                <span class="nominal-value">Rp ${formatRupiah(results.projectedSavings)}</span>
            </p>
            <p>
                <span>Status:</span>
                <span class="status-badge ${isSufficient ? 'success' : 'warning'}">
                    <i class="${isSufficient ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'}"></i>
                    ${isSufficient ? 'Strategi Mencukupi' : 'Perlu Penyesuaian'}
                </span>
            </p>
        </div>
        
        <div class="chart-container">
            <canvas id="investmentChart"></canvas>
        </div>
        
        <div class="result-item">
            <p>
                <span class="label">Modal Investasi:</span>
                <span class="value nominal-value">Rp ${formatRupiah(results.modalInvestasi)}</span>
            </p>
            <p>
                <span class="label">Total Keuntungan:</span>
                <span class="value nominal-value">Rp ${formatRupiah(results.totalKeuntungan)}</span>
            </p>
            <p>
                <span class="label">Total Dana Terkumpul:</span>
                <span class="value nominal-value">Rp ${formatRupiah(results.projectedSavings)}</span>
            </p>
            
            <div class="calculation-details">
                <small>Periode Investasi: ${results.yearsToRetirement} tahun</small>
                <small>Inflasi: ${results.inflation}% per tahun</small>
                <small>Return: ${results.returnRate}% per tahun</small>
            </div>
        </div>
        
        ${recommendationHtml}
    `;

    // Buat chart setelah container-nya ada di DOM
    createChart(results.modalInvestasi, results.totalKeuntungan);
}

// ============= MAIN FUNCTIONS =============
document.addEventListener('DOMContentLoaded', function() {
    ['monthlyExpense', 'monthlySavings', 'currentSavings'].forEach(id => {
        let input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                formatInputRupiah(this);
            });
        }
    });

    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateRetirement);
    }

    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.classList.remove('show');
    }
});

function calculateRetirement() {
    try {
        // Ambil nilai input
        const currentAge = parseInt(document.getElementById('currentAge').value);
        const retirementAge = parseInt(document.getElementById('retirementAge').value);
        const monthlyExpense = getNominalValue('monthlyExpense');
        const currentSavings = getNominalValue('currentSavings');
        const monthlySavings = getNominalValue('monthlySavings');
        const inflation = parseFloat(document.getElementById('inflation').value);
        const returnRate = parseFloat(document.getElementById('returnRate').value);

        // Validasi field kosong
        let errorMessages = [];
        
        if (document.getElementById('currentAge').value === '') errorMessages.push("Usia saat ini");
        if (document.getElementById('retirementAge').value === '') errorMessages.push("Target usia pensiun");
        if (document.getElementById('monthlyExpense').value === '') errorMessages.push("Pengeluaran per bulan");
        if (document.getElementById('monthlySavings').value === '') errorMessages.push("Target tabungan pensiun per bulan");
        if (document.getElementById('inflation').value === '') errorMessages.push("Perkiraan inflasi");
        if (document.getElementById('returnRate').value === '') errorMessages.push("Perkiraan return investasi");

        // Validasi nilai 0 (kecuali currentSavings)
        if (currentAge === 0) errorMessages.push("Usia saat ini tidak boleh 0");
        if (retirementAge === 0) errorMessages.push("Target usia pensiun tidak boleh 0");
        if (monthlyExpense === 0) errorMessages.push("Pengeluaran per bulan tidak boleh 0");
        if (monthlySavings === 0) errorMessages.push("Target tabungan pensiun per bulan tidak boleh 0");
        if (inflation === 0) errorMessages.push("Perkiraan inflasi tidak boleh 0");
        if (returnRate === 0) errorMessages.push("Perkiraan return investasi tidak boleh 0");

        // Jika ada field kosong atau nilai 0, tampilkan popup
        if (errorMessages.length > 0) {
            Swal.fire({
                title: 'Field Belum Lengkap!',
                html: `Mohon lengkapi data berikut:<br><br>${errorMessages.map(msg => `• ${msg}`).join('<br>')}`,
                icon: 'warning',
                confirmButtonText: 'Mengerti',
                confirmButtonColor: '#4e73df'
            });
            return;
        }

        // Validasi logika usia
        if (currentAge >= retirementAge) {
            Swal.fire({
                title: 'Periksa Kembali Usia Anda',
                html: `Target usia pensiun (${retirementAge} tahun) harus lebih besar<br>dari usia saat ini (${currentAge} tahun)`,
                icon: 'warning',
                confirmButtonText: 'Mengerti',
                confirmButtonColor: '#4e73df'
            });
            return;
        }

        // Hitung dana pensiun
        const results = calculatePensionFunds({
            currentAge,
            retirementAge,
            monthlyExpense,
            currentSavings,
            monthlySavings,
            inflation,
            returnRate
        });

        // Tampilkan hasil
        displayResults(results);

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        Swal.fire({
            title: 'Terjadi Kesalahan!',
            text: 'Mohon periksa kembali input Anda',
            icon: 'error',
            confirmButtonText: 'Mengerti',
            confirmButtonColor: '#4e73df'
        });
    }
}
