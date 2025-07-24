import { useEffect } from "react";

const useUnloadWarning = (condition =true) => {
    useEffect(() => {
        if(!condition) return;

        const listener = (event: BeforeUnloadEvent) => {
            event.preventDefault(); // prevents from closing the page
        }
        window.addEventListener("beforeunload", listener);
        return () => window.removeEventListener("beforeunload", listener);
    }, [condition])
}

export default useUnloadWarning;