import React from 'react';
import './StockOptions.css';

const StockOptions = () => {
    // awaiting data state
    const [isAwaitingData, setIsAwaitingData] = React.useState(true);

    // data upload state
    const [data, setData] = React.useState(null);

    // handle sample data upload
    const handleSampleDataUpload = () => {
        // fetch sample data
        // data is at /public/Customer_Investment_Data.csv
        fetch('/Customer_Investment_Data.csv')
            .then((response) => response.text())
            .then((text) => {
                setData(text);
            });
        setIsAwaitingData(false);
    }

    // handle file input change
    const handleDataUpload = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (!file) {
            console.error("No file selected");
            return;
        }
        const reader = new FileReader();

        reader.onload = async (event) => {
            const text = event.target.result;
            setData(text);
            setIsAwaitingData(false);
        };

        reader.readAsText(file);
    };

    return (
        <div className="stock-window">            
            {/* upload banking data */}
            {isAwaitingData && (
                <div className="upload">
                    <h2>Upload Banking Data</h2>
                    <button className='sample-data-button' onClick={handleSampleDataUpload}>Upload sample data</button>
                    <p>Upload custom data</p>
                    <input type="file" accept=".csv,.rtf" onChange={handleDataUpload} />
                </div>
            )}

            {/* investment advice and options results */}
            {!isAwaitingData && (
                <div className="results">
                    <button onClick={() => setIsAwaitingData(true)}>Restart</button>
                    <p>Results</p>  
                    {data && (
                        <div>
                            <p>Investment advice and options</p>
                            <p>{data}</p>
                        </div>
                    )}
                </div>      
            )}
        </div>
    );
};

export default StockOptions;