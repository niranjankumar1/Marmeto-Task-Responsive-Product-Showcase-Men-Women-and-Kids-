document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
  let categories = [];
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      categories = data.categories;
      displayCategory('Men'); // Display the 'Men' category by default

      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelector('.tab.active').classList.remove('active');
          tab.classList.add('active');
          displayCategory(tab.getAttribute('data-category'));
        });
      });
    })
    .catch(error => console.error('Error fetching data:', error));
  function displayCategory(categoryName) {
    const category = categories.find(cat => cat.category_name === categoryName);
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';

    if (category) {
      category.category_products.forEach(product => {
        const discount = calculateDiscount(product.price, product.compare_at_price);
        const productCard = `
          <div class="product-card">
              <img src="${product.image}" alt="${product.title}">
            ${product.badge_text ?`<div class="badge">${product.badge_text}</div>`:''}
            <div class="iname">
              <h3>${product.title}</h3>
                <p>&#8226; ${product.vendor}</p>
            </div>
            <div class="iprice">
              <p>₹${product.price}</p>
              <p class="compare-at-price">₹${product.compare_at_price}</p>
               ${discount ? `<p class="offer">${discount}% off</p>` : ''}
            </div>
            <button class="add-to-cart">Add to Cart</button>
          </div>
        `;
        productContainer.innerHTML += productCard;
      });
    }
  }
  function calculateDiscount(price, compareAtPrice) {
    const priceNum = parseFloat(price);
    const compareAtPriceNum = parseFloat(compareAtPrice);
    if (compareAtPriceNum > priceNum) {
      return Math.round(((compareAtPriceNum - priceNum) / compareAtPriceNum) * 100);
    }
    return null;
  }
});
