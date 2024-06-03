document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const productList = document.getElementById('product-list');

    // Fetch data from the Makeup API
    async function fetchMakeupData() {
        try {
            const response = await fetch('https://makeup-api.herokuapp.com/api/v1/products.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error: ', error);
        }
    }

    // Render the product list
    async function renderProducts() {
        const products = await fetchMakeupData();
        if (products) {
            productList.innerHTML = products.map(product => `
                <div class="product">
                    <h2>${product.name}</h2>
                    <p>${product.brand}</p>
                    <p>${product.price} ${product.currency}</p>
                </div>
            `).join('');
        }
    }

    // Highlight the search text in product names
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Filter products based on search input
    async function filterProducts(event) {
        const query = event.target.value.toLowerCase();
        const products = await fetchMakeupData();
        if (products) {
            productList.innerHTML = products
                .filter(product => product.name.toLowerCase().includes(query))
                .map(product => `
                    <div class="product">
                        <h2>${highlightText(product.name, query)}</h2>
                        <p>${product.brand}</p>
                        <p>${product.price} ${product.currency}</p>
                    </div>
                `).join('');
        }
    }

    // Initial render of products
    renderProducts();

    // Add event listener to the search input
    searchInput.addEventListener('input', filterProducts);
});
