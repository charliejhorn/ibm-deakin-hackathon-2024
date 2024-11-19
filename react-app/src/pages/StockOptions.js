import React from 'react';
import './StockOptions.css';
import generateResponse from '../Model';

const StockOptions = () => {
    // awaiting data state
    const [isAwaitingData, setIsAwaitingData] = React.useState(true);

    // data upload state
    const [data, setData] = React.useState(null);

    // handle sample data upload
    const handleSampleDataUpload = () => {
        // fetch sample data
        fetch('/customer-data.csv')
            .then((response) => response.text())
            .then((text) => {
                const parsedData = parseCSV(text);
                getInvestmentAdvice(parsedData).then(advice => {
                    setData(advice);
                    setIsAwaitingData(false);
                });
            });
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
            const parsedData = parseCSV(text);
            const advice = await getInvestmentAdvice(parsedData);
            setData(advice);
            setIsAwaitingData(false);
        };

        reader.readAsText(file);
    };

    const parseCSV = (text) => {
        // Implement a simple CSV parsing logic
        // parse csv
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, i) => {
                obj[header] = values[i];
                return obj;
            }, {});
        });

        return data;
    };

    const getInvestmentAdvice = async (data) => {
        // Get investment advice
        let prompt;
        const userData = data.map(row => JSON.stringify(row)).join('\n');
        const systemPrompt = `You are an AI financial advisor specializing in investment strategies. Your goal is to provide clear, accurate, and helpful investment advice to banking users. You should consider the user's financial goals, risk tolerance, and investment horizon when giving advice. Always prioritize the user's financial well-being and provide information on potential risks and benefits associated with different investment options. Remember to be polite, professional, and informative in your responses. Please provide investment advice with respect to the following user data:`;

        prompt = `${systemPrompt}\n${userData}`;

        // Get AI response
        const aiResponse = await generateResponse('FinAdviceINST', prompt);

        return aiResponse;
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
                    <h2>Results</h2>  
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