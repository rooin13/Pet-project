function header(){
    const $mainPage = document.getElementById('main');
    const $womenNavBtn = document.getElementById('women-nav');
    const $menNavBtn = document.getElementById('men-nav');
    const $devicesNavBtn = document.getElementById('devices-nav');
    const $logoBtn = document.getElementById('logo-btn');

    $womenNavBtn.addEventListener('click', async function () {
        $mainPage.innerHTML = '';
        const pageModule = await import('./comps/womenPage.js');
        $mainPage.innerHTML = '';
        $mainPage.append(pageModule.getWomenPage())
    })

    $menNavBtn.addEventListener('click', async function () {
        $mainPage.innerHTML = '';
        const pageModule = await import('./comps/menPage.js');
        $mainPage.innerHTML = '';
        $mainPage.append(pageModule.getMenPage())
    })

    $devicesNavBtn.addEventListener('click', function () {

    })
    
    $logoBtn.addEventListener('click', function () {
        $mainPage.innerHTML = '';
        main()
 
    })

}

header();


function main() {
    const $womenNavBtn = document.getElementById('women-nav');
    const $menNavBtn = document.getElementById('men-nav');
    const $devicesNavBtn = document.getElementById('devices-nav');
    const $logoBtn = document.getElementById('logo-btn');

    const $mainPage = document.getElementById('main');
    $mainPage.classList.add('main-page');


    const $heroBtn = document.createElement('hero-btn');
    const $hero = document.createElement('div');
    const $heroTitle = document.createElement('h1');
    const $heroSubTitle = document.createElement('h1');


    $hero.classList.add('hero');
    $heroBtn.classList.add('reset-btn');
    $heroBtn.classList.add('hero-btn');
    $heroTitle.classList.add('hero-title');
    $heroSubTitle.classList.add('hero-subtitle');
    $hero.style.backgroundImage = 'url(./img/HERO-IMG.png)';

    $heroTitle.textContent = 'Hidden eXperiences';
    $heroSubTitle.textContent = 'SUMMER 2024';

    $hero.append($heroSubTitle);
    $hero.append($heroTitle);
    $heroBtn.append($hero)
    $mainPage.append($heroBtn);

}



function loadpage(){
    main()
}

loadpage();
