import { createRoot } from 'react-dom/client';
import { Button } from './components/Button';
import { useState } from 'react';
import Logo from './assets/icons/logo.svg';
import { BenchmarkData, BenchmarkModal } from './components/BenchmarkModal';
import { BenchmarkItem } from './components/BenchmarkItem';

const App = () => {

    const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([{
        name: 'Example Benchmark',
        description: 'This is an example benchmark to demonstrate the UI.',
        dataset: {
            id: 'example-dataset',
            name: 'openai/gmsk8',
            description: 'An example dataset for testing purposes.',
            url: 'https://example.com/dataset'
        }
    }]);
    const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);

    return (
        <div className='app-container'>
            <div className='app-header'>
                <img src={Logo} alt="Logo" className='app-logo' />
                <Button onClick={() => setShowBenchmarkModal(true)}>Add Benchmark</Button>
            </div>
            <div className='app-content'>
                <div className='benchmarks-list'>
                    {benchmarks.length > 0 ? benchmarks.map((benchmark, index) => (
                        <BenchmarkItem key={index} benchmark={benchmark} />
                    )) : (
                        <p className='splash-content'>
                            <h1>No benchmarks added yet.</h1>
                            <p>Add some benchmarks to get started.</p>
                        </p>
                    )}
                </div>
                {showBenchmarkModal && (
                    <BenchmarkModal
                        isOpen={showBenchmarkModal}
                        onSubmit={(data) => {
                            setBenchmarks((prev) => [...(prev || []), data]);
                            setShowBenchmarkModal(false);
                        }}
                        onClose={() => setShowBenchmarkModal(false)}
                        title="Add Benchmark"
                    />
                )}
            </div>
        </div>
    );
}


const root = createRoot(document.body);
root.render(<App />);