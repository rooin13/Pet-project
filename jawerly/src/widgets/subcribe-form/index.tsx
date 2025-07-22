import { useEffect, useRef, useState } from "react";
import "./style.css"

type Tprops = {
    type?: 'footer' | 'default'
}

export const SubscribeForm = ({ type = 'default' }: Tprops) => {

    const formRef = useRef<HTMLFormElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);


    useEffect(() => {
        const form = formRef.current;
        const arrow = arrowRef.current;
        const btn = btnRef.current;

        form?.addEventListener('submit', (e) => {
            e.preventDefault();


        });

    }, [formRef.current]);

    const classNames = {
        default: "border-b-3 border-primary placeholder-primary",
        footer: "border-b-9 border-red placeholder-white ",
    };


    return (

        <form className={`w-full   flex h-10 border-b-3  border-primary ${classNames[type]}`} action="#" id="subscribe-form" ref={formRef}>
            <input placeholder='Enter your email address  ' className={`w-full h-10 border-b-3  border-primary ${classNames[type]}`} type="text" />
            <button className='text-primary text-xs subscribe-form__btn' id="subscribe-form__btn" ref={btnRef}>
                SUBSCRIBE
            </button>
            <span id="arrow" className={`pt-2 arrow`} ref={arrowRef} style={{ color: "#FFB08B" }}>
                ▸
            </span>
        </form>

    )
}



