export {getMenPage}
import {getProductCard} from './productCard.js';

function getMenPage() {
    let $productCardList = document.createElement('ul');
    $productCardList.classList.add('flex', "flex-wrap");
    $productCardList.append(getProductCard('./img/men/balance-hoddie-1-front.jpg', 'Balance Hoodie', 'Hoodie', '200'),
        getProductCard('./img/men/balance-tshirt-1-front.jpg', 'Balance T-shirt White Fire', 'T-shirt', '50'),
        getProductCard('./img/men/balance-tshirt-2-front.jpg', 'Balance T-shirt Orange Fire', 'T-shirt', '50'),
        getProductCard('./img/men/balance-tshirt-3-front.jpg', 'Balance T-shirt Flower', 'T-shirt', '80'),
        getProductCard('./img/men/balance-turtleneck-1-front.jpg', 'Balance Turtleneck', 'Turtleneck', '150'),
        getProductCard('./img/men/balance-tshirt-4-front.jpg', 'Balance T-shirt', 'T-shirt', '85'),
        getProductCard('./img/men/balance-hoddie-1-front.jpg', 'Balance Hoodie', 'Hoodie', '200'),
        getProductCard('./img/men/balance-tshirt-1-front.jpg', 'Balance T-shirt White Fire', 'T-shirt', '50'),
        getProductCard('./img/men/balance-tshirt-2-front.jpg', 'Balance T-shirt Orange Fire', 'T-shirt', '50'),
        getProductCard('./img/men/balance-tshirt-3-front.jpg', 'Balance T-shirt Flower', 'T-shirt', '80'),
        getProductCard('./img/men/balance-turtleneck-1-front.jpg', 'Balance Turtleneck', 'Turtleneck', '150'),
        getProductCard('./img/men/balance-tshirt-4-front.jpg', 'Balance T-shirt', 'T-shirt', '85')
    );
    return $productCardList;

}


