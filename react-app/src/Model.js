const generateResponse = async (selectedModel, prompt) => {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            model: selectedModel,
            prompt: prompt,
            stream: false
            }),
        });

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error processing your request.';
    }
};

export default generateResponse;