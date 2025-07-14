document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://localhost:8989';

    // --- LÓGICA DAS ABAS ---
    const tabContainer = document.querySelector('.tab-container');

    tabContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const targetContentId = e.target.getAttribute('data-tab');

            if (document.querySelector('.tab-button.active')) {
                tabContainer.querySelector('.active').classList.remove('active');
            }
            if (document.querySelector('.tab-content.active')) {
                document.querySelector('.tab-content.active').classList.remove('active');
            }

            e.target.classList.add('active');
            document.getElementById(targetContentId).classList.add('active');
        }
    });

    // --- Elementos do DOM ---
    const productForm = document.getElementById('product-form');
    const productsTableBody = document.getElementById('products-table-body');
    const customerForm = document.getElementById('customer-form');
    const customersTableBody = document.getElementById('customers-table-body');
    const saleForm = document.getElementById('sale-form');
    const salesTableBody = document.getElementById('sales-table-body');
    const saleCustomerSelect = document.getElementById('sale-customer');
    const saleProductsSelect = document.getElementById('sale-products');

    // --- Funções Auxiliares (TRADUÇÃO) ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const entityNames = {
        customers: 'pelanggan',
        products: 'produk',
        sales: 'penjualan'
    };

    // --- Lógica de PRODUTOS ---
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Kesalahan jaringan saat mengambil produk');
            const products = await response.json();

            productsTableBody.innerHTML = '';
            saleProductsSelect.innerHTML = '';

            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td><button class="delete-btn" onclick="deleteItem('products', ${product.id})">Hapus</button></td>
                `;
                productsTableBody.appendChild(row);

                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} - ${formatCurrency(product.price)}`;
                saleProductsSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Gagal mengambil produk:', error);
            productsTableBody.innerHTML = `<tr><td colspan="4">Gagal memuat produk.</td></tr>`;
        }
    };

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productData = {
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value)
        };
        await createItem('products', productData);
        productForm.reset();
        fetchProducts();
    });

    // --- Lógica de CLIENTES ---
    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/customers`);
            if (!response.ok) throw new Error('Kesalahan jaringan saat mengambil pelanggan');
            const customers = await response.json();

            customersTableBody.innerHTML = '';
            saleCustomerSelect.innerHTML = '<option value="">Pilih pelanggan</option>';

            customers.forEach(customer => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.phoneNumber || 'N/A'}</td>
                    <td><button class="delete-btn" onclick="deleteItem('customers', ${customer.id})">Hapus</button></td>
                `;
                customersTableBody.appendChild(row);

                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = customer.name;
                saleCustomerSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Gagal mengambil pelanggan:', error);
            customersTableBody.innerHTML = `<tr><td colspan="4">Gagal memuat pelanggan.</td></tr>`;
        }
    };

    customerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const customerData = {
            name: document.getElementById('customer-name').value,
            phoneNumber: document.getElementById('customer-phone').value
        };
        await createItem('customers', customerData);
        customerForm.reset();
        fetchCustomers();
    });

    // --- Lógica de VENDAS ---
    const fetchSales = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/sales`);
            if (!response.ok) throw new Error('Kesalahan jaringan saat mengambil penjualan');
            const sales = await response.json();

            salesTableBody.innerHTML = '';
            sales.forEach(sale => {
                const row = document.createElement('tr');
                const productList = sale.products.map(p => `<li>${p.name}</li>`).join('');

                row.innerHTML = `
                    <td>${sale.id}</td>
                    <td>${sale.customer.name}</td>
                    <td><ul>${productList}</ul></td>
                    <td>${formatCurrency(sale.totalPrice)}</td>
                    <td>${new Date(sale.dateOfSale).toLocaleString('id-ID')}</td>
                    <td><button class="delete-btn" onclick="deleteItem('sales', ${sale.id})">Hapus</button></td>
                `;
                salesTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Gagal mengambil penjualan:', error);
            salesTableBody.innerHTML = `<tr><td colspan="6">Gagal memuat penjualan.</td></tr>`;
        }
    };

    saleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedProductIds = Array.from(saleProductsSelect.selectedOptions).map(option => option.value);
        const customerId = saleCustomerSelect.value;

        if (!customerId || selectedProductIds.length === 0) {
            alert('Silakan pilih pelanggan dan minimal satu produk.');
            return;
        }

        const saleData = { customerId, products: selectedProductIds };
        await createItem('sales', saleData);
        saleForm.reset();
        fetchSales();
    });

    // --- Funções Genéricas de CRUD ---
    const createItem = async (entity, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${entity}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Gagal membuat ${entity}`);
            }
        } catch (error) {
            console.error(error);
            alert(`Gagal membuat item: ${error.message}`);
        }
    };

    window.deleteItem = async (entity, id) => {
        const entityName = entityNames[entity] || 'item';
        if (confirm(`Anda yakin ingin menghapus ${entityName} dengan ID ${id}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/${entity}/delete/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error(`Gagal menghapus ${entity}`);

                if (entity === 'products') await fetchProducts();
                if (entity === 'customers') await fetchCustomers();
                if (entity === 'sales') await fetchSales();
            } catch (error) {
                console.error(error);
                alert(`Gagal menghapus item: ${error.message}`);
            }
        }
    };

    // --- Inicialização ---
    const initialize = () => {
        fetchCustomers();
        fetchProducts();
        fetchSales();
    };

    initialize();
});