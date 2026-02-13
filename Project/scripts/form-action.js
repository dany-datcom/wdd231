// ===== FORM-ACTION.JS =====
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar año
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const formDataElement = document.getElementById('form-data');
    
    if (!formDataElement) return;
    
    if (urlParams.toString() === '') {
        formDataElement.innerHTML = `
            <div class="data-item">
                <div class="data-label">Status:</div>
                <div class="data-value">No form data submitted</div>
            </div>
            <div class="data-item">
                <div class="data-label">Timestamp:</div>
                <div class="data-value">${new Date().toLocaleString()}</div>
            </div>
        `;
        return;
    }
    
    let html = '';
    const formData = {};
    
    urlParams.forEach((value, key) => {
        const decodedValue = decodeURIComponent(value);
        const formattedKey = formatKey(key);
        
        formData[key] = decodedValue;
        
        html += `
            <div class="data-item">
                <div class="data-label">${formattedKey}:</div>
                <div class="data-value">${decodedValue || '(empty)'}</div>
            </div>
        `;
    });
    
    html += `
        <div class="data-item">
            <div class="data-label">Submitted at:</div>
            <div class="data-value">${new Date().toLocaleString()}</div>
        </div>
    `;
    
    // Guardar en localStorage
    saveToLocalStorage(formData);
    
    formDataElement.innerHTML = html;
    
    function formatKey(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/_/g, ' ')
            .replace('email', 'Email')
            .replace('name', 'Full Name')
            .replace('subject', 'Subject')
            .replace('message', 'Message')
            .replace('phone', 'Phone')
            .replace('newsletter', 'Newsletter Subscription');
    }
    
    function saveToLocalStorage(data) {
        try {
            const submissions = JSON.parse(localStorage.getItem('dama_shop_contact_submissions') || '[]');
            submissions.push({
                ...data,
                timestamp: new Date().toISOString(),
                page: 'form-action'
            });
            localStorage.setItem('dama_shop_contact_submissions', JSON.stringify(submissions));
            console.log('✅ Form data saved to localStorage');
        } catch (error) {
            console.error('❌ Error saving to localStorage:', error);
        }
    }
});