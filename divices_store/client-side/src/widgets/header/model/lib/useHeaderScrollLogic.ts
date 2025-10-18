import { useEffect, useRef } from "react";
import { throttle } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAtTop, setIsHeaderTransparent } from "../slice";

export const useHeaderScrollLogic = (isHome: boolean) => {
    const dispatch = useAppDispatch();
    const atTop = useAppSelector((state) => state?.ui?.atTop ?? true);
    const isHeaderTransparent = useAppSelector((state) => state?.ui?.isHeaderTransparent ?? false);

    const atTopRef = useRef(atTop);
    const isHeaderTransparentRef = useRef(isHeaderTransparent);

    useEffect(() => {
        atTopRef.current = atTop;
        isHeaderTransparentRef.current = isHeaderTransparent;
    }, [atTop, isHeaderTransparent]);

    useEffect(() => {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const offset = isMobile ? -40 : -170;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const newAtTop = scrollY < 25;

            if (newAtTop !== atTopRef.current) {
                dispatch(setAtTop(newAtTop));
            }

            let newTransparent = false;

            if (isHome) {
                const section = document.getElementById("keyboard-section");
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const nearBottomThreshold = window.innerHeight * 0.33;

                    if (!newAtTop) {
                        const isNearBottom = rect.bottom <= nearBottomThreshold;
                        const isVisibleAtTop = rect.top <= offset && rect.bottom >= 100;
                        newTransparent = !(isNearBottom || !isVisibleAtTop);
                    }
                }
            } else {
                newTransparent = newAtTop;
            }

            if (newTransparent !== isHeaderTransparentRef.current) {
                dispatch(setIsHeaderTransparent(newTransparent));
            }
        };

        const throttled = throttle(handleScroll, 100);
        window.addEventListener("scroll", throttled, { passive: true });
        throttled();

        return () => {
            window.removeEventListener("scroll", throttled);
            throttled.cancel();
        };
    }, [dispatch, isHome]);
};
