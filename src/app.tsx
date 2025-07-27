import { createRoot } from 'react-dom/client';
import { Button } from './components/Button';
import { useState } from 'react';
import Logo from './assets/icons/logo.svg';
import { BenchmarkData, BenchmarkModal } from './components/BenchmarkModal';

const App = () => {

    const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
    const [showBenchmarkModal, setShowBenchmarkModal] = useState(true);

    return (
        <div className='app-container'>
            <div className='app-header'>
                <img src={Logo} alt="Logo" className='app-logo' />
                <Button onClick={() => setShowBenchmarkModal(true)}>Add Benchmark</Button>
            </div>
            <div className='app-content'>
                <div className='benchmarks-list'>
                    {benchmarks.length > 0 ? benchmarks.map((benchmark, index) => (
                        <div key={index} className='benchmark-item'>
                            <h3>{benchmark.name}</h3>
                            <p>{benchmark.description}</p>
                            <span>Dataset: {benchmark.dataset ? benchmark.dataset.name : 'None'}</span>
                        </div>
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