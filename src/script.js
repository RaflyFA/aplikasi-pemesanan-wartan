(() => {
	const STORAGE_KEY = 'wartan:selectedMenu';
	const SHIPPING_COST = 5000;

	const currencyFormatter = new Intl.NumberFormat('id-ID');

	const formatRupiah = (value) => `Rp ${currencyFormatter.format(Number(value) || 0)}`;
	const parseRupiah = (text = '') => Number(String(text).replace(/[^\d]/g, '')) || 0;

	const getPathname = () => window.location.pathname.toLowerCase();
	const isCatalogPage = () => {
		const path = getPathname();
		// Menangani buka via browser, live server, dan langsung dari file system
		return (
			path.endsWith('/index.html') ||
			path.endsWith('/index') ||
			path.endsWith('/src/') ||
			path === '/' ||
			path === '' ||
			/\/index\.html$/i.test(path)
		);
	};
	const isOrderPage = () => {
		const path = getPathname();
		return path.endsWith('/form-pemesanan.html');
	};

	const saveSelectedMenu = (payload) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	};

	const getSelectedMenu = () => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return null;
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed[0] || null;
			return parsed;
		} catch {
			return null;
		}
	};

	const calculateOrder = (menu) => {
		const jumlahPorsi = Math.max(1, Number(menu?.jumlahPorsi) || 1);
		const harga = Number(menu?.harga) || 0;
		const subtotal = harga * jumlahPorsi;

		return {
			...menu,
			jumlahPorsi,
			harga,
			subtotal,
			biayaKirim: SHIPPING_COST,
			total: subtotal + SHIPPING_COST,
		};
	};

	const redirectToOrderPage = () => {
		window.location.href = 'form-pemesanan.html';
	};

	const extractMenuFromCard = (menuCard) => {
		const namaMenu = menuCard.querySelector('h3')?.textContent.trim() || menuCard.dataset.nama || 'Menu Pilihan';
		const hargaText = [...menuCard.querySelectorAll('div, span')]
			.map((element) => element.textContent.trim())
			.find((text) => /^Rp\s?[\d.]+$/i.test(text));

		const harga = parseRupiah(hargaText);
		const jumlahPorsi = parseInt(menuCard.querySelector('.qty-display')?.textContent || '1', 10) || 1;
		const imageUrl = menuCard.querySelector('img')?.getAttribute('src') || '';

		return {
			namaMenu,
			harga,
			jumlahPorsi,
			imageUrl,
		};
	};

	const applyMenuFilter = (state) => {
		const cards = document.querySelectorAll('.menu-card');
		const emptyState = document.getElementById('menu-kosong');
		let visibleCount = 0;

		cards.forEach((card) => {
			const status = (card.dataset.status || '').toLowerCase();
			const nama = (card.dataset.nama || card.querySelector('h3')?.textContent || '').toLowerCase();

			const statusMatch = state.status === 'semua' || status === state.status;
			const keywordMatch = !state.keyword || nama.includes(state.keyword);
			const isVisible = statusMatch && keywordMatch;

			card.style.display = isVisible ? '' : 'none';
			if (isVisible) visibleCount += 1;
		});

		if (emptyState) {
			emptyState.classList.toggle('hidden', visibleCount > 0);
		}
	};

	const initCatalogPage = () => {
		const filterState = {
			status: 'semua',
			keyword: '',
		};

		window.tambahKeranjang = (buttonElement) => {
			const menuCard = buttonElement?.closest('.menu-card');
			if (!menuCard) return;

			const menu = extractMenuFromCard(menuCard);
			saveSelectedMenu(menu);
			redirectToOrderPage();
		};

		window.cariMenu = (keyword = '') => {
			filterState.keyword = String(keyword).trim().toLowerCase();
			applyMenuFilter(filterState);
		};

		window.filterMenu = (buttonElement, status = 'semua') => {
			filterState.status = String(status).toLowerCase();

			document.querySelectorAll('.filter-tab').forEach((tab) => {
				tab.classList.remove('active', 'border-primary-600', 'bg-primary-600', 'text-white');
				tab.classList.add('border-slate-200', 'text-slate-600');
			});

			if (buttonElement) {
				buttonElement.classList.add('active', 'border-primary-600', 'bg-primary-600', 'text-white');
				buttonElement.classList.remove('border-slate-200', 'text-slate-600');
			}

			applyMenuFilter(filterState);
		};

		document.querySelectorAll('.btn-pesan').forEach((button) => {
			button.type = 'button';
			button.addEventListener('click', (event) => {
				event.preventDefault();
				window.tambahKeranjang(button);
			});
		});

		applyMenuFilter(filterState);
	};

	const setIdIfMissing = (element, id) => {
		if (element && !element.id) {
			element.id = id;
		}
	};

	const renderOrderSummary = (summaryContainer, order) => {
		if (!summaryContainer) return;

		const image = order.imageUrl || 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80';

		summaryContainer.innerHTML = `
			<div class="flex items-center gap-2 text-primary-700 font-semibold mb-4">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
				</svg>
				Ringkasan Pesanan
			</div>

			<div class="bg-white rounded-xl p-4 mb-3 border border-slate-200 flex gap-4" id="order-summary-item-card">
				<img src="${image}" alt="${order.namaMenu}" class="w-20 h-20 rounded-lg object-cover">
				<div class="flex-1">
					<div class="font-bold text-slate-800" id="order-summary-menu-name">${order.namaMenu}</div>
					<div class="text-primary-600 font-semibold text-lg" id="order-summary-menu-price">${formatRupiah(order.harga)}</div>
					<div class="flex items-center gap-2 text-sm text-slate-500 mt-1">
						<span class="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold" id="order-summary-qty-badge">${order.jumlahPorsi} porsi</span>
						<span>Biaya Kirim: ${formatRupiah(order.biayaKirim)}</span>
					</div>
				</div>
			</div>

			<div class="mt-4 pt-4 border-t-2 border-primary-200 flex justify-between items-center">
				<span class="font-semibold text-slate-600">Total Pesanan:</span>
				<span class="font-extrabold text-primary-600 text-xl" id="order-summary-total">${formatRupiah(order.total)}</span>
			</div>
		`;
	};

	const renderDigitalReceipt = (receiptContainer, order) => {
		if (!receiptContainer) return;

		const now = new Date();
		const tanggal = now.toLocaleString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});

		receiptContainer.innerHTML = `
			<div>
				<div class="text-center border-b-2 border-dashed border-slate-200 pb-4 mb-4">
					<div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">W</div>
					<h3 class="font-bold text-xl text-slate-800">WARTAN</h3>
					<p class="text-xs text-slate-500">Warung Makan & Minuman</p>
					<p class="text-xs text-slate-400 mt-1">Struk #WRT-2026-042</p>
				</div>

				<div class="border-b-2 border-dashed border-slate-200 pb-4 mb-4 space-y-1">
					<div class="flex justify-between text-sm">
						<span class="text-slate-500">Nama:</span>
						<span class="font-medium text-slate-700" id="receipt-customer-name">-</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-slate-500">No. HP:</span>
						<span class="font-medium text-slate-700" id="receipt-customer-phone">-</span>
					</div>
					<div class="mt-2">
						<span class="text-sm text-slate-500 block mb-1">Alamat Lengkap:</span>
						<span class="text-sm font-medium text-slate-700 block bg-slate-100 p-2 rounded-lg" id="receipt-customer-address">-</span>
					</div>
					<div class="flex justify-between text-sm mt-2">
						<span class="text-slate-500">Tanggal:</span>
						<span class="font-medium text-slate-700" id="receipt-order-date">${tanggal}</span>
					</div>
				</div>

				<div class="border-b-2 border-dashed border-slate-200 pb-4 mb-4 space-y-1">
					<div class="flex justify-between text-sm">
						<span class="text-slate-500">Menu:</span>
						<span class="font-medium text-slate-700" id="receipt-menu-name">${order.namaMenu} (${order.jumlahPorsi}x)</span>
					</div>
					<div class="flex justify-between text-sm pl-4">
						<span class="text-slate-500">Catatan:</span>
						<span class="font-medium text-slate-700 italic text-right" id="receipt-order-note">-</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-slate-500">Subtotal:</span>
						<span class="font-medium text-slate-700" id="receipt-subtotal">${formatRupiah(order.subtotal)}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-slate-500">Biaya Kirim:</span>
						<span class="font-medium text-slate-700" id="receipt-shipping-fee">${formatRupiah(order.biayaKirim)}</span>
					</div>
				</div>

				<div class="flex justify-between items-center mb-2">
					<span class="font-bold text-slate-600">TOTAL:</span>
					<span class="font-extrabold text-primary-600 text-xl" id="receipt-grand-total">${formatRupiah(order.total)}</span>
				</div>

				<div class="text-center text-xs text-slate-400 border-t-2 border-dashed border-slate-200 pt-4 mt-2">
					<p>Terima kasih telah memesan di Wartan!</p>
					<p class="mt-1">*Struk ini merupakan bukti pemesanan digital</p>
				</div>
			</div>
		`;
	};

	const bindFormToReceipt = (formElement) => {
		if (!formElement) return;

		const [namaInput, nomorHpInput, alamatInput, catatanInput] = formElement.querySelectorAll('input, textarea');
		const labels = formElement.querySelectorAll('label');

		setIdIfMissing(namaInput, 'input-nama-lengkap');
		setIdIfMissing(nomorHpInput, 'input-nomor-hp');
		setIdIfMissing(alamatInput, 'input-alamat-lengkap');
		setIdIfMissing(catatanInput, 'input-catatan-tambahan');

		if (labels[0]) labels[0].htmlFor = 'input-nama-lengkap';
		if (labels[1]) labels[1].htmlFor = 'input-nomor-hp';
		if (labels[2]) labels[2].htmlFor = 'input-alamat-lengkap';
		if (labels[3]) labels[3].htmlFor = 'input-catatan-tambahan';

		const updateText = (selector, value, fallback = '-') => {
			const target = document.querySelector(selector);
			if (target) {
				target.textContent = value && String(value).trim() ? String(value).trim() : fallback;
			}
		};

		const handleBinding = () => {
			updateText('#receipt-customer-name', namaInput?.value);
			updateText('#receipt-customer-phone', nomorHpInput?.value);
			updateText('#receipt-customer-address', alamatInput?.value);
			updateText('#receipt-order-note', catatanInput?.value, '-');
		};

		[namaInput, nomorHpInput, alamatInput, catatanInput].forEach((field) => {
			field?.addEventListener('input', handleBinding);
		});

		handleBinding();
	};

	const showSuccessModal = (order) => {
		const modal = document.getElementById('modal-sukses');
		const panel = document.getElementById('modal-panel');
		if (!modal) return;

		// Isi konten modal dengan data pesanan
		const namaEl = document.getElementById('modal-nama-menu');
		const porsiEl = document.getElementById('modal-jumlah-porsi');
		const totalEl = document.getElementById('modal-total');
		if (namaEl) namaEl.textContent = order.namaMenu;
		if (porsiEl) porsiEl.textContent = `${order.jumlahPorsi} porsi`;
		if (totalEl) totalEl.textContent = formatRupiah(order.total);

		// Tampilkan overlay
		modal.classList.remove('hidden');
		modal.classList.add('flex');
		document.body.style.overflow = 'hidden';

		// Animasi masuk panel
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (panel) {
					panel.classList.remove('scale-95', 'opacity-0');
					panel.classList.add('scale-100', 'opacity-100');
				}
			});
		});
	};

	const hideSuccessModal = () => {
		const modal = document.getElementById('modal-sukses');
		const panel = document.getElementById('modal-panel');
		if (!modal) return;

		// Animasi keluar panel
		if (panel) {
			panel.classList.remove('scale-100', 'opacity-100');
			panel.classList.add('scale-95', 'opacity-0');
		}

		setTimeout(() => {
			modal.classList.add('hidden');
			modal.classList.remove('flex');
			document.body.style.overflow = '';
		}, 300);
	};

	// Ekspos ke window agar bisa dipanggil dari atribut HTML jika diperlukan
	window.hideSuccessModal = hideSuccessModal;

	const downloadReceipt = async (receiptContainer) => {
		if (!receiptContainer) return;

		const btnDownload = document.getElementById('btn-download-struk');
		const iconDefault = document.getElementById('icon-download-default');
		const iconLoading = document.getElementById('icon-download-loading');
		const labelDownload = document.getElementById('label-download-struk');

		if (typeof html2canvas === 'undefined') {
			alert('Library html2canvas belum dimuat. Pastikan koneksi internet tersedia.');
			return;
		}

		// Set state loading
		if (btnDownload) btnDownload.disabled = true;
		if (iconDefault) iconDefault.classList.add('hidden');
		if (iconLoading) iconLoading.classList.remove('hidden');
		if (labelDownload) labelDownload.textContent = 'Memproses...';

		try {
			const canvas = await html2canvas(receiptContainer, {
				scale: 2,              // Resolusi 2x agar gambar tajam
				backgroundColor: '#ffffff',
				logging: false,
				useCORS: true,         // Agar gambar dari URL eksternal ter-render
				allowTaint: false,
			});

			// Buat nama file dengan timestamp
			const timestamp = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
			const link = document.createElement('a');
			link.download = `struk-wartan-${timestamp}.png`;
			link.href = canvas.toDataURL('image/png');
			link.click();
		} catch (err) {
			console.error('Gagal mengunduh struk:', err);
			alert('Gagal mengunduh struk. Silakan coba lagi.');
		} finally {
			// Kembalikan state tombol
			if (btnDownload) btnDownload.disabled = false;
			if (iconDefault) iconDefault.classList.remove('hidden');
			if (iconLoading) iconLoading.classList.add('hidden');
			if (labelDownload) labelDownload.textContent = 'Download Struk';
		}
	};

	const initOrderPage = () => {
		const fallbackOrder = {
			namaMenu: 'Nasi Goreng Spesial',
			harga: 20000,
			jumlahPorsi: 1,
			imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
		};

		const selectedMenu = getSelectedMenu() || fallbackOrder;
		const order = calculateOrder(selectedMenu);

		const summaryContainer = document.querySelector('.from-primary-50.to-slate-50');
		const receiptContainer = document.getElementById('receipt-area') || document.querySelector('.from-slate-50.to-white');
		const formElement = document.querySelector('form');

		renderOrderSummary(summaryContainer, order);
		renderDigitalReceipt(receiptContainer, order);
		bindFormToReceipt(formElement);

		// Handle submit → tampilkan modal sukses
		formElement?.addEventListener('submit', (event) => {
			event.preventDefault();
			showSuccessModal(order);
		});

		// Handle klik modal 'Tutup'
		document.getElementById('modal-btn-tutup')?.addEventListener('click', hideSuccessModal);

		// Handle download struk
		document.getElementById('btn-download-struk')?.addEventListener('click', () => {
			downloadReceipt(receiptContainer);
		});
	};

	document.addEventListener('DOMContentLoaded', () => {
		if (isCatalogPage()) {
			initCatalogPage();
			return;
		}

		if (isOrderPage()) {
			initOrderPage();
		}
	});
})();
