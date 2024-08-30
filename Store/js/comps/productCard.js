export {getProductCard}

function getProductCard(productImage, productName, productType, productPrice) {
    const $productCard = document.createElement('li');
    const $productDscr = document.createElement('div');

    const $productName = document.createElement('p');
    const $productType = document.createElement('p');
    const $productBtn = document.createElement('button');
    const $productImage = document.createElement('img');
    const $productPrice = document.createElement('p');

    $productCard.classList.add('product-card');
    $productImage.classList.add('product-image');
    $productDscr.classList.add('product-dscr');
    $productType.classList.add('product-type');
    $productName.classList.add('product-name');
    $productBtn.classList.add('btn-reset');
    $productBtn.classList.add('btn-product');

    $productName.textContent = productName;
    $productType.textContent = productType;
    $productPrice.textContent = `${productPrice} $`;

    $productImage.src = productImage;


    $productDscr.append($productName);
    $productDscr.append($productType);
    $productDscr.append($productPrice);
    $productBtn.append($productImage);
    $productCard.append($productBtn);
    $productCard.append($productDscr);


    return $productCard;

}