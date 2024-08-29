import { useEffect, useState } from "react";

export const getTimestampString = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000);

    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        return timestamp.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    }
};

export enum LoadingStatus {Loading, Success, Error};
export const useLoadingValue = <T>(promiseFn: () => Promise<T>): [T | undefined, LoadingStatus] => {
    const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.Loading);
    const [value, setValue] = useState<T>();

    useEffect(() => {
        promiseFn()
            .then(val => {
                setStatus(LoadingStatus.Success);
                setValue(val);
            })
            .catch(err => {
                console.error(err);
                setStatus(LoadingStatus.Error);
            });
    }, []);

    return [value, status];
}