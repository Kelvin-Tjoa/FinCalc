function formatRupiah(angka) {
    let numberString = String(angka);
    
    // Split angka untuk memisahkan bagian desimal jika ada
    let split = numberString.split('.');
    let sisa = split[0];
    let rupiah = '';
    
    // Proses dari belakang, tambahkan titik setiap 3 digit
    while (sisa.length > 3) {
        rupiah = '.' + sisa.substr(sisa.length - 3) + rupiah;
        sisa = sisa.substr(0, sisa.length - 3);
    }
    
    rupiah = 'Rp ' + sisa + rupiah;
    return rupiah;
}

function formatInputRupiah(input) {
    // Hapus semua karakter non-digit
    let value = input.value.replace(/[^\d]/g, '');
    
    // Jika kosong, jangan lakukan apa-apa
    if (!value) {
        input.value = '';
        return;
    }

    // Format angka dengan titik sebagai pemisah ribuan
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
    // Hapus semua titik dan konversi ke integer
    return parseInt(value.replace(/\./g, '')) || 0;
} 