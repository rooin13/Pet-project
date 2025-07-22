import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CollectionItem = ({ src, alt, title }: { src: string, alt: string, title: string }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <li className="items-center flex flex-col">
            <Link href="#" className='mb-4 relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className='overflow-hidden'>
                    <Image
                        ref={imageRef}
                        src={src}
                        alt={alt}
                        width={220}
                        height={220}
                        className={`transition-transform duration-700 ease-in-out ${isHovered ? 'scale-105' : ''}`}
                    />
                </div>
            </Link>
            <span className="text-xs text-text">
                {title}
            </span>
        </li>
    );
};

export default CollectionItem;