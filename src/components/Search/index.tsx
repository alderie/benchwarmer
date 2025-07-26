import { LoaderCircle, LoaderIcon, Search } from 'lucide-react';
import './Search.css';
import { useState, useMemo, useCallback } from 'react';
import { Dataset } from '../../utils/datasets';

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function(this: any, ...args: any[]) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    } as T;
}

export const SearchInput = () => {

    const [results, setResults] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState(false);

    const search = useCallback(async (q: string) => {
        setLoading(true);
        // Simulate a search operation
        const results = await window.electronAPI.searchDatasets(q, 5);
        setLoading(false);
        setResults(results);
    }, []);

    const debouncedSearchRequest = useMemo(() => debounce(search, 500), [search]);

    const onSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target.value.length < 3) {
            setResults([]); // Clear results for short queries
            setLoading(false);
            return; // Avoid triggering search for short queries
        }
        debouncedSearchRequest(evt.target.value);
    }

    return (
        <div className={"search-container " + (loading || results.length > 0 ? 'show-results' : '')}>
            <div className='search-input-group'>
                {loading ? <LoaderCircle className='icon icon-spin' /> : <Search className='icon' />}
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search datasets..."
                    onChange={onSearch}
                />
            </div>
            {!loading && results.length > 0 && <div className='search-results'>
                {results.map((item) => (
                    <div className='search-result-item' key={item.id}>
                        <div className='item-header'>
                            <span className='source-tag'>🤗 HuggingFace</span>
                            <span className='search-result-name'>{item.name}</span>
                        </div>
                    </div>
                ))}
            </div>}
        </div>
    );
}