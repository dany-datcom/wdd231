// filters.js - VERSIÓN CORREGIDA
export function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length === 0) return;
    
    // Leer categoría de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = urlParams.get('category') || 'all';
    
    console.log('🎯 Filtro activo desde URL:', activeCategory);
    
    // 1. PRIMERO: Resetear todos los botones
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    // 2. SEGUNDO: Activar el botón correcto
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === activeCategory) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            console.log('✅ Botón activado:', activeCategory);
        }
    });
    
    // 3. TERCERO: Remover event listeners anteriores y agregar nuevos
    // Clonar y reemplazar para evitar listeners duplicados
    filterButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // 4. CUARTO: Agregar event listeners a los botones nuevos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.dataset.filter;
            console.log('🖱️ Click en filtro:', filter);
            
            // Actualizar URL y recargar
            const url = new URL(window.location);
            url.searchParams.set('category', filter);
            window.location.href = url.toString();
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Pequeño retraso para asegurar que todo está cargado
    setTimeout(() => {
        initFilters();
    }, 100);
});