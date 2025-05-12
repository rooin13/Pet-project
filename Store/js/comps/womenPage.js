export {getWomenPage}
import {getProductCard} from './productCard.js';

function getWomenPage() {
    let $productCardList = document.createElement('ul');
    $productCardList.classList.add('flex', "flex-wrap");


    $productCardList.append(getProductCard('./img/women/balence-women-something-1-front.jpg', 'Crypto T-shirt Oversize', 'T-shirt', '50'),
        getProductCard('./img/women/balence-women-something-2-front.jpg', 'Balance Turtleneck', 'Turtleneck', '150'),
        getProductCard('./img/women/balence-women-something-3-front.jpg', 'Balance Hoodie', 'Hoodie', '200'),
        getProductCard('./img/women/balence-women-something-4-front.jpg', 'Crypto T-shirt Oversize', 'T-shirt', '50'),
        getProductCard('./img/women/balence-women-something-5-front.jpg', 'Balance T-shirt Flower', 'T-shirt', '80'),
        getProductCard('./img/women/balence-women-something-6-front.jpg', 'Balance T-shirt', 'T-shirt', '85'),
        getProductCard('./img/women/balence-women-something-1-front.jpg', 'Crypto T-shirt Oversize', 'T-shirt', '50'),
        getProductCard('./img/women/balence-women-something-2-front.jpg', 'Balance Turtleneck', 'Turtleneck', '150'),
        getProductCard('./img/women/balence-women-something-3-front.jpg', 'Balance Hoodie', 'Hoodie', '200'),
        getProductCard('./img/women/balence-women-something-4-front.jpg', 'Crypto T-shirt Oversize', 'T-shirt', '50'),
        getProductCard('./img/women/balence-women-something-5-front.jpg', 'Balance T-shirt Flower', 'T-shirt', '80'),
        getProductCard('./img/women/balence-women-something-6-front.jpg', 'Balance T-shirt', 'T-shirt', '85'),
    );

    return $productCardList;

}