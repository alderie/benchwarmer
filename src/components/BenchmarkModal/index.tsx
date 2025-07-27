import { Dataset } from "../../utils/datasets";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { SearchInput } from "../Search";
import './BenchmarkModal.css';
import React, { useState } from "react";

interface BenchmarkModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: T) => void;
    title: string;
}

export type BenchmarkData = {
    name: string;
    description: string;
    dataset: Dataset | null;
}

export const BenchmarkModal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
}: BenchmarkModalProps<BenchmarkData>) => {

    const [dataset, setDataset] = useState<Dataset | null>(null);

    const onHandleDatasetSelection = (selectedDataset: Dataset) => {
        setDataset(selectedDataset);
    };

    return (
        <Modal isOpen={isOpen} title={title} onClose={onClose}>
            <form className="benchmark-modal-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('benchmark-name') as string;
                const description = formData.get('benchmark-description') as string;
                onSubmit?.({
                    name,
                    description,
                    dataset,
                });
                onClose();
            }}>
                <div className="form-group">
                    <label htmlFor="benchmark-search" className="form-label">Search Datasets</label>
                    <SearchInput onSelectedOption={onHandleDatasetSelection} />
                    <label className="form-helper-text">
                        Search for datasets to benchmark, this will search locally downloaded datasets and HuggingFace datasets.
                    </label>
                </div>

                <div className="form-group">
                    <label htmlFor="benchmark-name" className="form-label">Benchmark Name</label>
                    <input
                        type="text"
                        id="benchmark-name"
                        className="form-input"
                        name="benchmark-name"
                        placeholder="Enter benchmark name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="benchmark-description" className="form-label">Description</label>
                    <textarea
                        id="benchmark-description"
                        name="benchmark-description"
                        className="form-textarea"
                        placeholder="Enter benchmark description"
                        rows={4}
                        required
                    />
                </div>

                <div className="modal-actions">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="accent">
                        Create Benchmark
                    </Button>
                </div>
            </form>
        </Modal>
    );
};