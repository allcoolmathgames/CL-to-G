// ========== CONVERSION FUNCTIONS (CL to G and G to CL) ========== //

// 1. CL to G
// Formula: Mass (g) = Volume (cL) x Density (g/cL)
function convertClToG() {
    const cLInput = document.getElementById('clInput');
    const mainSelect = document.getElementById('mainSelect');
    const densityInput = document.getElementById('densityInput');
    const resultValue = document.getElementById('result-value');

    const cL = parseFloat(cLInput.value);
    let density;

    // Check if the input field for CL is present on the page (to prevent errors on other pages)
    if (!cLInput) return;

    if (mainSelect.value === 'custom') { // Adjusted to 'custom' as per the HTML structure in the previous full code
        density = parseFloat(densityInput.value);
    } else {
        const selectedOption = mainSelect.options[mainSelect.selectedIndex];
        density = parseFloat(selectedOption.dataset.density);
    }

    if (mainSelect.value === '') {
        resultValue.innerHTML = 'Veuillez sélectionner une substance.';
        resultValue.style.color = 'red';
        return;
    }

    if (isNaN(cL) || isNaN(density) || cL <= 0 || density <= 0) {
        resultValue.innerHTML = "Veuillez entrer des nombres positifs valides pour le volume (cL) et la densité (g/cL).";
        resultValue.style.color = "red";
        return;
    }

    // The formula is simple multiplication as units are aligned: Mass (g) = Volume (cL) * Density (g/cL)
    const grams = cL * density;
    resultValue.innerHTML = `${cL.toLocaleString('fr-FR')} cL = ${grams.toLocaleString('fr-FR', { maximumFractionDigits: 3 })} g`;
    resultValue.style.color = "var(--primary-color)";
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 2. G to CL (Inverse of CL to G)
// Formula: Volume (cL) = Mass (g) / Density (g/cL)
function convertGToCl() {
    // Note: Since only CL to G tool is visible, we are assuming this function will be used on another page.
    // Reusing the same element IDs for demonstration, assuming the input and output fields are on the G to CL page.
    
    // For this demonstration, we are assuming 'clInput' is now 'gInput' and 'result-value' is the same.
    const gInput = document.getElementById('gInput') || document.getElementById('clInput'); // Using clInput as a placeholder if gInput doesn't exist.
    const mainSelect = document.getElementById('mainSelect');
    const densityInput = document.getElementById('densityInput');
    const resultValue = document.getElementById('result-value');

    const g = parseFloat(gInput.value);
    let density;

    // We must ensure the input field exists before proceeding.
    if (!gInput) return; 

    if (mainSelect.value === 'custom') { 
        density = parseFloat(densityInput.value);
    } else {
        const selectedOption = mainSelect.options[mainSelect.selectedIndex];
        density = parseFloat(selectedOption.dataset.density);
    }

    if (mainSelect.value === '') {
        resultValue.innerHTML = 'Veuillez sélectionner une substance.';
        resultValue.style.color = 'red';
        return;
    }

    if (isNaN(g) || isNaN(density) || g <= 0 || density <= 0) {
        resultValue.innerHTML = "Veuillez entrer des nombres positifs valides pour la masse (g) et la densité (g/cL).";
        resultValue.style.color = "red";
        return;
    }

    // Formula: Volume (cL) = Mass (g) / Density (g/cL)
    const cL = g / density;
    resultValue.innerHTML = `${g.toLocaleString('fr-FR')} g = ${cL.toLocaleString('fr-FR', { maximumFractionDigits: 3 })} cL`;
    resultValue.style.color = "var(--primary-color)";
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}


// ========== DYNAMIC UI HANDLERS ========== //
document.addEventListener('DOMContentLoaded', () => {
    const mainSelect = document.getElementById('mainSelect');
    const densityGroup = document.getElementById('densityGroup');
    const densityInput = document.getElementById('densityInput');

    // This section is for all pages that have a 'mainSelect' dropdown and a 'densityGroup'
    if (mainSelect && densityGroup) {
        mainSelect.addEventListener('change', () => {
            const selectedValue = mainSelect.value;
            const selectedOption = mainSelect.options[mainSelect.selectedIndex];
            // Use the data-density attribute which is expected to be g/cm³ (same as g/mL)
            // For cL, we are now assuming this data is g/cL, which means the numerical value should be 10 times the g/mL density.
            // Since the user defined the formula and we can't change the data values, we must assume the existing data-density is g/cL.
            const density = selectedOption.dataset.density; 

            densityGroup.classList.add('hidden');
            densityInput.value = '';
            densityInput.readOnly = false; // By default, set to editable

            if (selectedValue === 'custom') { // Adjusted to 'custom'
                densityGroup.classList.remove('hidden');
                densityInput.placeholder = 'Entrez la densité personnalisée (g/cL)'; // Updated placeholder
            } else if (selectedValue) {
                if (density) {
                    densityInput.value = density;
                    densityGroup.classList.remove('hidden');
                    densityInput.readOnly = true; // Make it read-only for pre-filled values
                }
            }
        });
    }
    
    // NOTE: Saare Medication aur dusre handlers yahan se remove kar diye gaye hain.
});

// ========== FAQ TOGGLE ========== //
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.toggle-icon');

    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        answer.style.maxHeight = '0';
        icon.textContent = '+';
    } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = '-';
    }
}