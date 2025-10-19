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
                    const nearBottomThreshold = -window.innerHeight * 0.1;

                    if (isMobile) {
                        // Для мобилок - раздельная логика
                        const startTransparent = rect.top <= window.innerHeight * 0.1; // Начало прозрачности
                        const endTransparent = rect.bottom <= -window.innerHeight * 0.3; // Конец прозрачности (когда canvas полностью ушел)

                        if (!newAtTop && startTransparent && !endTransparent) {
                            newTransparent = true;
                        }
                    } else {
                        // Для десктопа - раздельная логика с гистерезисом
                        // Вход в прозрачность - когда секция заходит
                        const enterTransparent = rect.top <= window.innerHeight * 0.01;
                        // Выход из прозрачности сверху - с запасом, чтобы не мигало при скролле вверх
                        const exitTransparentTop = rect.top <= window.innerHeight * 0.01;
                        // Выход из прозрачности снизу - когда canvas ушел
                        const exitTransparentBottom = rect.bottom <= window.innerHeight * 0.3;

                        // Если уже прозрачный - используем более мягкие условия выхода
                        if (isHeaderTransparentRef.current) {
                            if (!newAtTop && exitTransparentTop && !exitTransparentBottom) {
                                newTransparent = true;
                            }
                        } else {
                            // Если еще не прозрачный - используем строгие условия входа
                            if (!newAtTop && enterTransparent && !exitTransparentBottom) {
                                newTransparent = true;
                            }
                        }
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
