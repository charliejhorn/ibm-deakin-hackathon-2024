import React, { useState, useEffect, useCallback } from 'react';
import './InvestingAdvice.css';
import generateResponse from '../Model';
import {micromark} from 'micromark'

const InvestingAdvice = () => {
    // awaiting data state
    const [isAwaitingData, setIsAwaitingData] = useState(true);

    // data upload state
    const [userData, setUserData] = useState(null);

    // AI response bool state
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(true);

    // AI advice state
    const [advice, setAdvice] = useState(null);

    // request type
    const [requestType, setRequestType] = useState(null);

    // handle sample data upload
    const handleSampleDataUpload = () => {
        // fetch sample data
        fetch('/customer-data.csv')
            .then((response) => response.text())
            .then((text) => {
                const parsedData = parseCSV(text);
                sendUserData(parsedData);
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
            sendUserData(parsedData);
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

    const sendUserData = (data) => {
        setRequestType("Giving investment advice based on user data.");

        // manipulate data into a string
        let userDataString = '';
        for (const key in data[0]) {
            userDataString += `${key}: ${data[0][key]}\n`;
        }

        setUserData(userDataString);
        setIsAwaitingData(false);
        setIsAwaitingResponse(true);
    };

    const getInvestmentAdvice = useCallback(async () => {
        // Construct prompt
        let prompt;
        const systemPrompt = `You are an AI financial advisor specializing in investment strategies. Your goal is to provide clear, accurate, and helpful investment advice to banking users. You should consider the user's financial goals, risk tolerance, and investment horizon when giving advice. Always prioritize the user's financial well-being and provide information on potential risks and benefits associated with different investment options. Remember to be polite, professional, and informative in your responses. Please provide investment advice with respect to the following user data:`;
        prompt = `${systemPrompt}\n${userData}`;

        // Get AI response
        const aiResponse = await generateResponse('FinAdviceINST', prompt);

        return aiResponse;
    }, [userData]);

    useEffect(() => {
        if (userData) {
            getInvestmentAdvice().then((response) => {
                setAdvice(response);
                setIsAwaitingResponse(false);
            });
        }
    }, [userData, getInvestmentAdvice]);

    const analyseStockData = async () => {
        try {
            // retrieve stock data stored in /sp500.csv
            const response = await fetch('/sp500.csv');
            const text = await response.text();
            const stockData = parseCSV(text);
            setUserData(stockData);

            setRequestType('Analysing stock data.');
            setIsAwaitingData(false);
            setIsAwaitingResponse(true);

            // Construct prompt
            const systemPrompt = `You are an AI financial advisor specializing in investment strategies. Your goal is to provide clear, accurate, and helpful investment advice to banking users. Remember to be polite, professional, and informative in your responses. Do not offer personalised advice. The data provided is complete and sufficient. Provide an analysis on the following stock data:`;
            const prompt = `${systemPrompt}\n${JSON.stringify(stockData)}`;

            console.log(prompt)

            // Get AI response
            const aiResponse = await generateResponse('FinAdviceINST', prompt);

            setIsAwaitingResponse(false);
            setAdvice(aiResponse);
        } catch (error) {
            console.error('Error fetching or processing stock data:', error);
        }
    };

    const renderWithLineBreaks = (text) => {
        return text.split('\n').map((item, index) => (
            <React.Fragment key={index}>
                {item}
                <br />
            </React.Fragment>
        ));
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

                    <h2>Analyse Stock Data</h2>
                    <button className='analyse-stock-button' onClick={analyseStockData}>Analyse</button>
                </div>
            )}

            {/* investment advice and options results */}
            {!isAwaitingData && (
                <div className="results">
                    <button onClick={() => setIsAwaitingData(true)}>Restart</button>
                    <h2>Results</h2>  
                    <div>
                        <p>{requestType}</p>
                        {isAwaitingResponse && (
                            <div className="awaiting-response">Waiting for model response...</div>
                        )}
                        {!isAwaitingResponse && (
                            <div>
                                <h3>Investment advice and options</h3>
                                <div dangerouslySetInnerHTML={{ __html: micromark(advice) }} />
                            </div>
                        )}
                        {userData && (
                            <div className='user-data-container'>
                                <h3>User data</h3>
                                <p>{renderWithLineBreaks(userData)}</p>
                            </div>
                        )}
                    </div>
                </div>      
            )}
        </div>
    );
};

export default InvestingAdvice;