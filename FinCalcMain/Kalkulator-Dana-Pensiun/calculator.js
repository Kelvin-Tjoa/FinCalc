function calculatePensionFunds(inputs) {
    const {currentAge, retirementAge, monthlyExpense, currentSavings, 
           monthlySavings, inflation, returnRate} = inputs;

    const yearsToRetirement = retirementAge - currentAge;
    const totalMonths = yearsToRetirement * 12;
    
    // Perhitungan dana yang dibutuhkan
    const annualExpense = monthlyExpense * 12;
    const inflationFactor = Math.pow(1 + inflation / 100, yearsToRetirement);
    const futureAnnualExpense = annualExpense * inflationFactor;
    const totalNeeded = futureAnnualExpense / 0.04; // 4% rule
    
    // Perhitungan akumulasi investasi
    const monthlyRate = returnRate / 100 / 12;
    
    // Future Value dari dana awal
    const futureValueInitial = currentSavings * Math.pow(1 + monthlyRate, totalMonths);
    
    // Future Value dari setoran bulanan
    const futureValueMonthly = monthlySavings * 
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
        (1 + monthlyRate);
    
    // Total proyeksi dana
    const projectedSavings = futureValueInitial + futureValueMonthly;
    
    // Perhitungan modal dan keuntungan
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