import { createRoot } from 'react-dom/client';
import { Button } from './components/Button';
import { useState } from 'react';
import Logo from './assets/icons/logo.svg';
import { BenchmarkModal } from './components/BenchmarkModal';

const App = () => {


    const [benchmarks, setBenchmarks] = useState();
    const [showBenchmarkModal, setShowBenchmarkModal] = useState(true);

    return (
        <div className='app-container'>
            <div className='app-header'>
                <img src={Logo} alt="Logo" className='app-logo' />
                <Button onClick={() => setShowBenchmarkModal(true)}>Add Benchmark</Button>
            </div>
            <div className='app-content'>
                {showBenchmarkModal && (
                    <BenchmarkModal
                        isOpen={showBenchmarkModal}
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