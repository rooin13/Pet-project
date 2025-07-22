import React, { useState, useRef, useEffect } from 'react';
import CartMenu from '../CartMenu';

function BurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuItemsRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        const header = document.querySelector('header')!;
        if (header) {
            const header = document.querySelector('header')!;

            const cart = document.querySelector('.cart') as SVGElement;


            if (isOpen) {
                header.style.backgroundColor = 'white';
                cart.classList.add('header-active');



                header.style.transition = 'background-color 0.2s ease-in-out';
            } else {
                cart.classList.remove('header-active');
                header.style.backgroundColor = 'transparent';

                header.style.transition = 'background-color 0.8s ease-in-out';

            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (menuRef.current) {

            menuRef.current.style.opacity = '0';
        }
    }, []);


    useEffect(() => {
        if (isOpen && menuRef.current && menuItemsRef.current && buttonRef.current) {
            const header = document.querySelector('header')!;
            menuRef.current.style.transition = 'opacity 0.3s ease-in-out';
            menuRef.current.style.opacity = '1';
            buttonRef.current.classList.remove('cross--remove');
            buttonRef.current.classList.add('cross');
            menuRef.current.style.transition = 'background-color 0.4s ease-in-out';


            setTimeout(() => {
                menuRef.current?.classList.add('bg-white')



            }, 40)

            const menuItems = menuItemsRef.current.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                item.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
                item.style.transform = `translateY(${index * 5}px)`;

                requestAnimationFrame(() => {
                    item.style.transform = 'translateY(0)';
                })

                setTimeout(() => {
                    setTimeout(() => {

                        item.style.opacity = '1';
                    }, index * 90);


                }, 500)

            });



        } else if (menuRef.current && menuItemsRef.current && buttonRef.current) {

            menuRef.current.style.transition = 'opacity 0.8s ease-in-out';
            menuRef.current.style.opacity = '0';
            buttonRef.current.classList.remove('cross');
            buttonRef.current.classList.add('cross--remove');



            const menuItems = menuItemsRef.current.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                item.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';


                requestAnimationFrame(() => {
                    item.style.transform = `translateY(${index * 30}px)`;
                })
                setTimeout(() => {

                    item.style.opacity = '0';

                }, (menuItems.length - index - 1) * 90);

            });


        }

    }, [isOpen]);

    return (
        <div>
            <button
                ref={buttonRef}
                className="  right-0 z-40 top-7 w-full  h-full rounded-md focus:outline-none "
                onClick={toggleMenu}
            >
                <div className='w-9  h-6 relative flex flex-col justify-between cursor-pointer'>
                    <span className="w-8 h-0.5 bg-white  pointer-events-none"></span>
                    <span className="w-8 h-0.5 bg-white  pointer-events-none"></span>
                    <span className="w-8 h-0.5 bg-white  pointer-events-none"></span>
                </div>
            </button>

            <div className={`h-full w-full  ${isOpen ? "block" : "hidden"}`}>
                <div className='absolute menu-logo z-50 '>
                    <img className="dark-logo " src="//necklacesbysamaa.com/cdn/shop/files/SAMAA_LOGO_COLORS_2COLOR_TRNS_x55.png?v=1614343838" />
                </div>

                <div
                    ref={menuRef}
                    className={`z-40 absolute w-full   inset-x-0  h-screen dark:bg-gray-800 overflow-y-auto 
                  opacity-0 ${isOpen ? 'opacity-1 ' : ''}`}
                >

                    <ul ref={menuItemsRef} className=" flex items-center flex-col py-9 space-y-4">
                        <li className='opacity-0'>HOME</li>
                        <li className='opacity-0'>NECKLACES</li>
                        <li className='opacity-0'>BRACELETS & ANKLETS</li>
                        <li className='opacity-0'>RINGS & EARRINGS</li>
                        <li className='opacity-0'>MEN COLLECTION</li>
                        <li className='opacity-0'>CUFFLINKS</li>
                        <li className='opacity-0'>KEY RINGS</li>
                        <li className='opacity-0'>CUSTOMIZABLE & ENGRAVABLE</li>
                        <li className='opacity-0'>ALL COLLECTIONS</li>
                        <li className='opacity-0'>KNOW MORE</li>
                    </ul>
                </div>
            </div >
        </div>
    );
}

export default BurgerMenu;
