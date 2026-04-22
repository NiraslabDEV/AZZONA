// ── Menu loader ───────────────────────────────────────────────
const menuGrid = document.getElementById('menuGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
let allDishes = [];

function dishCard(dish, delay) {
  return `
    <div class="dish-card reveal-scale" style="transition-delay:${delay}s">
      <div class="dish-card-img">
        <img src="${dish.image_url}" alt="${dish.name}" loading="lazy">
      </div>
      <div class="p-6">
        <h3 class="font-playfair text-[22px] font-normal mb-2">${dish.name}</h3>
        <p class="text-muted text-[15px] font-light leading-relaxed">${dish.description}</p>
        <div class="flex items-center justify-between mt-4">
          <span class="font-syne text-[10px] tracking-[3px] uppercase text-gold">${dish.category}</span>
          ${dish.price ? `<span class="font-syne text-[13px] tracking-[1px] text-cream">${dish.price.toLocaleString('pt-MZ')} MZN</span>` : ''}
        </div>
      </div>
    </div>`;
}

function renderDishes(dishes) {
  if (!dishes.length) {
    menuGrid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <p class="font-playfair text-2xl text-muted italic">Nenhum prato encontrado nesta categoria.</p>
      </div>`;
    return;
  }
  menuGrid.innerHTML = dishes.map((d, i) => dishCard(d, (i % 4) * 0.07)).join('');
  // Re-trigger scroll reveal for new cards
  if (window.observeNewCards) window.observeNewCards();
}

async function loadMenu(category = 'all') {
  menuGrid.innerHTML = Array(4).fill(`
    <div class="dish-card">
      <div class="dish-card-img skeleton"></div>
      <div class="p-6 space-y-3">
        <div class="skeleton h-4 rounded w-3/4" style="height:16px"></div>
        <div class="skeleton h-3 rounded w-full" style="height:12px"></div>
        <div class="skeleton h-3 rounded w-1/2" style="height:12px"></div>
      </div>
    </div>`).join('');

  try {
    const url = category === 'all' ? '/api/dishes' : `/api/dishes?category=${encodeURIComponent(category)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    allDishes = await res.json();
    renderDishes(allDishes);
  } catch (err) {
    menuGrid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <p class="text-muted font-light">Não foi possível carregar o menu. Tente novamente.</p>
        <button onclick="loadMenu()" class="mt-4 font-syne text-[10px] tracking-[3px] uppercase text-gold border border-gold px-6 py-2 hover:bg-gold hover:text-dark transition-all">
          Tentar novamente
        </button>
      </div>`;
    console.error('Menu load error:', err);
  }
}

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadMenu(btn.dataset.category);
  });
});

// Initial load
loadMenu();
