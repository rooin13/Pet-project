import { useState, useRef, useCallback } from 'react';

const useFocus = () => {
    const [isFocused, setIsFocused] = useState(false);
    const ref = useRef(null);

    const onFocus = useCallback(() => setIsFocused(true), []);
    const onBlur = useCallback(() => {
        const timeout = setTimeout(() => setIsFocused(false), 130);
    }, []);


    return { ref, isFocused, onFocus, onBlur };
};

export default useFocus;