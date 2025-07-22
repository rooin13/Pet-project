import React, { CSSProperties } from 'react';
import "./style.css"

type TProps = {
    type?: 'primary' | 'outline'
    disabled?: boolean
    children: React.ReactNode
    link?: string
}

const Button = ({ type = 'primary', disabled, children, link }: TProps) => {

    const classNames = {
        primary: `bg-secondery text-white border-none `,
        outline: `bg-white text-primary border border-orange-500`
    };



    return (
        <button
            disabled={disabled}
            className={`z-20 main-btn px-9 z-5 py-3 text-xs text-center font-bold ${classNames[type]}`}

        >
            {children}
        </button>
    );
};

export default Button;

