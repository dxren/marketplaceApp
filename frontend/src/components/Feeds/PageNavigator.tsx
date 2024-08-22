import { MoveLeft, MoveRight } from "lucide-react";
import styles from './navigatorStyles.module.css';

type PageNavigatorProps = {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    maxPage: number;
};
function PageNavigator(props: PageNavigatorProps) {
    const {page, setPage, maxPage} = props;

    const adjustPage = (delta: number) => {
        const newPage = (() => {
            const newPage = page + delta;
            if (newPage < 1) return maxPage;
            else if (newPage > maxPage) return 1;
            else return newPage;
        })();
        setPage(newPage);
    }

    return (
        <div className={styles.pageNavigator}>
            <MoveLeft color='#fff9e6' onClick={() => adjustPage(-1)} size='1.5rem' cursor='pointer' />
            <span>Page {page} of {maxPage}</span>
            <MoveRight color='#fff9e6' onClick={() => adjustPage(1)} size='1.5rem' cursor='pointer' />
        </div>
    )
}

export default PageNavigator;