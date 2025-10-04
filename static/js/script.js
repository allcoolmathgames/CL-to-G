// ========== CONVERSION FUNCTIONS (L to G and G to L) ========== //

// 1. L to G (Litre to Gram)
// Formula: Mass (g) = Volume (L) x Density (g/cm³) x 1000 (since 1 L = 1000 cm³)
function convertLToG() {
    // Assuming 'lInput' is the ID for the Litre input field
    const lInput = document.getElementById('lInput');
    const mainSelect = document.getElementById('mainSelect');
    const densityInput = document.getElementById('densityInput');
    // Using main-result-value as per the previous full code
    const resultValue = document.getElementById('main-result-value'); 

    // Check if the input field for L is present on the page (to prevent errors on other pages)
    if (!lInput) return;

    const L = parseFloat(lInput.value);
    let density_g_per_cm3;

    let selectedOption;
    if (mainSelect.value !== '') {
        selectedOption = mainSelect.options[mainSelect.selectedIndex];
    }
    
    // Determine density value
    if (mainSelect.value === 'custom') {
        density_g_per_cm3 = parseFloat(densityInput.value);
    } else if (mainSelect.value !== '') {
        density_g_per_cm3 = parseFloat(selectedOption.dataset.density);
    }

    if (mainSelect.value === '') {
        resultValue.innerHTML = 'Veuillez sélectionner une substance.';
        resultValue.style.color = 'red';
        return;
    }

    if (isNaN(L) || isNaN(density_g_per_cm3) || L <= 0 || density_g_per_cm3 <= 0) {
        resultValue.innerHTML = "Veuillez entrer des nombres positifs valides pour le volume (L) et la densité (g/cm³).";
        resultValue.style.color = "red";
        return;
    }

    // Formula: Mass (g) = Volume (L) * Density (g/cm³) * 1000
    // 1000 is the conversion factor from L to cm³ (or mL)
    const grams = L * density_g_per_cm3 * 1000;
    
    // Use formatNumber helper from the previous script to ensure correct formatting
    // For simplicity here, we'll use a direct formatting approach for this function.
    resultValue.innerHTML = `<strong>${L.toLocaleString('fr-FR', { maximumFractionDigits: 3 })} L</strong> = <strong>${grams.toLocaleString('fr-FR', { maximumFractionDigits: 3 })} G</strong>`;
    resultValue.style.color = "var(--primary-color)";
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 2. G to L (Gram to Litre)
// Formula: Volume (L) = Mass (g) / (Density (g/cm³) x 1000)
function convertGToL() {
    // Assuming 'gInput' is the ID for the Gram input field
    const gInput = document.getElementById('gInput');
    const mainSelect = document.getElementById('mainSelect');
    const densityInput = document.getElementById('densityInput');
    // Using main-result-value as per the previous full code
    const resultValue = document.getElementById('main-result-value');

    // We must ensure the input field exists before proceeding.
    if (!gInput) return; 

    const g = parseFloat(gInput.value);
    let density_g_per_cm3;
    
    let selectedOption;
    if (mainSelect.value !== '') {
        selectedOption = mainSelect.options[mainSelect.selectedIndex];
    }

    // Determine density value
    if (mainSelect.value === 'custom') {
        density_g_per_cm3 = parseFloat(densityInput.value);
    } else if (mainSelect.value !== '') {
        density_g_per_cm3 = parseFloat(selectedOption.dataset.density);
    }

    if (mainSelect.value === '') {
        resultValue.innerHTML = 'Veuillez sélectionner une substance.';
        resultValue.style.color = 'red';
        return;
    }

    if (isNaN(g) || isNaN(density_g_per_cm3) || g <= 0 || density_g_per_cm3 <= 0) {
        resultValue.innerHTML = "Veuillez entrer des nombres positifs valides pour la masse (G) et la densité (g/cm³).";
        resultValue.style.color = "red";
        return;
    }

    // Formula: Volume (L) = Mass (g) / (Density (g/cm³) * 1000)
    // 1000 is the conversion factor from cm³ (or mL) to L
    const L = g / (density_g_per_cm3 * 1000);
    
    resultValue.innerHTML = `<strong>${g.toLocaleString('fr-FR', { maximumFractionDigits: 3 })} G</strong> = <strong>${L.toLocaleString('fr-FR', { maximumFractionDigits: 5 })} L</strong>`;
    resultValue.style.color = "var(--primary-color)";
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}


// ========== DYNAMIC UI HANDLERS ========== //
document.addEventListener('DOMContentLoaded', () => {
    const mainSelect = document.getElementById('mainSelect');
    const densityGroup = document.getElementById('densityGroup');
    const densityInput = document.getElementById('densityInput');
    
    // Check if the conversion functions are present (for live update logic)
    const isLToGPage = document.getElementById('lInput');
    const isGToLPage = document.getElementById('gInput');

    // This section is for all pages that have a 'mainSelect' dropdown and a 'densityGroup'
    if (mainSelect && densityGroup) {
        
        // Helper function to trigger the appropriate conversion based on the current page
        const triggerConversion = () => {
            if (isLToGPage) {
                // Check if the function exists before calling (safer in a real environment)
                if (typeof convertLToG === 'function') convertLToG(); 
            } else if (isGToLPage) {
                if (typeof convertGToL === 'function') convertGToL();
            }
        };

        mainSelect.addEventListener('change', () => {
            const selectedValue = mainSelect.value;
            const selectedOption = mainSelect.options[mainSelect.selectedIndex];
            const density = selectedOption.dataset.density; 

            densityGroup.classList.add('hidden');
            densityInput.value = '';
            densityInput.readOnly = false; 

            if (selectedValue === 'custom') { 
                densityGroup.classList.remove('hidden');
                // Updated placeholder to reflect L/G page unit assumption (g/cm³ or g/mL)
                densityInput.placeholder = 'Entrez la densité personnalisée (g/cm³ ou g/mL)'; 
            } else if (selectedValue) {
                if (density) {
                    densityInput.value = density;
                    densityGroup.classList.remove('hidden');
                    densityInput.readOnly = true; 
                }
                // Trigger conversion immediately after selecting a pre-set substance
                triggerConversion(); 
            } else {
                // If '--Select...' is chosen, trigger conversion to show error/reset
                triggerConversion(); 
            }
        });

        // Add input listeners for live updates (if needed)
        const inputField = isLToGPage ? document.getElementById('lInput') : document.getElementById('gInput');
        if (inputField) {
            inputField.addEventListener('input', triggerConversion);
        }
        
        densityInput.addEventListener('input', () => {
             if (mainSelect.value === 'custom') {
                 triggerConversion();
             }
        });
    }
});

// ========== FAQ TOGGLE (No change needed) ========== //
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.toggle-icon');

    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        answer.style.maxHeight = '0';
        icon.textContent = '+';
    } else {
        // Set max height dynamically for transition
        answer.style.maxHeight = answer.scrollHeight + 'px'; 
        icon.textContent = '-';
    }
}