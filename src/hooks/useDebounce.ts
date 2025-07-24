import { useEffect, useState } from "react";

const useDebounce = (value: any, delay: number = 250): any => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timeout); 
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;