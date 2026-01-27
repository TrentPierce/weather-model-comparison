// Configuration Management
class ConfigManager {
    constructor() {
        this.storageKey = 'aiModelConfig';
        this.loadConfig();
    }

    loadConfig() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const config = JSON.parse(saved);
            // Populate form fields
            document.getElementById('apiKey1').value = config.apiKey1 || '';
            document.getElementById('apiKey2').value = config.apiKey2 || '';
            document.getElementById('apiKey3').value = config.apiKey3 || '';
            document.getElementById('apiKey4').value = config.apiKey4 || '';
            document.getElementById('model1Name').value = config.model1Name || 'Model 1';
            document.getElementById('model2Name').value = config.model2Name || 'Model 2';
            document.getElementById('model3Name').value = config.model3Name || 'Model 3';
            document.getElementById('model4Name').value = config.model4Name || 'Model 4';
            
            // Update panel titles
            this.updatePanelTitles(config);
        }
    }

    saveConfig() {
        const config = {
            apiKey1: document.getElementById('apiKey1').value,
            apiKey2: document.getElementById('apiKey2').value,
            apiKey3: document.getElementById('apiKey3').value,
            apiKey4: document.getElementById('apiKey4').value,
            model1Name: document.getElementById('model1Name').value || 'Model 1',
            model2Name: document.getElementById('model2Name').value || 'Model 2',
            model3Name: document.getElementById('model3Name').value || 'Model 3',
            model4Name: document.getElementById('model4Name').value || 'Model 4'
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(config));
        this.updatePanelTitles(config);
        return config;
    }

    updatePanelTitles(config) {
        document.getElementById('model1Title').textContent = config.model1Name || 'Model 1';
        document.getElementById('model2Title').textContent = config.model2Name || 'Model 2';
        document.getElementById('model3Title').textContent = config.model3Name || 'Model 3';
        document.getElementById('model4Title').textContent = config.model4Name || 'Model 4';
    }

    getConfig() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {};
    }
}

// AI Model API Caller
class AIModelCaller {
    constructor(modelNumber, apiKey, modelName) {
        this.modelNumber = modelNumber;
        this.apiKey = apiKey;
        this.modelName = modelName;
        this.resultElement = document.getElementById(`result${modelNumber}`);
        this.statusElement = document.getElementById(`status${modelNumber}`);
    }

    async callModel(prompt) {
        if (!this.apiKey) {
            this.displayError('API key not configured');
            return;
        }

        this.setStatus('loading', 'Loading...');
        const startTime = Date.now();

        try {
            // Placeholder for actual API implementation
            // This is where you would integrate specific AI model APIs
            const result = await this.mockAPICall(prompt);
            const responseTime = Date.now() - startTime;
            
            this.displayResult(result, responseTime);
            this.setStatus('success', 'Complete');
        } catch (error) {
            this.displayError(error.message);
            this.setStatus('error', 'Error');
        }
    }

    async mockAPICall(prompt) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Mock response
        return {
            type: 'text',
            content: `Mock response from ${this.modelName}\n\nThis is a placeholder response. To integrate real AI models, implement the API calls in the callModel() method.\n\nPrompt received: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`
        };
    }

    // Placeholder methods for different AI APIs
    async callOpenAI(prompt) {
        // Implementation for OpenAI API
        throw new Error('OpenAI API integration not yet implemented');
    }

    async callAnthropic(prompt) {
        // Implementation for Anthropic Claude API
        throw new Error('Anthropic API integration not yet implemented');
    }

    async callGoogle(prompt) {
        // Implementation for Google Gemini API
        throw new Error('Google API integration not yet implemented');
    }

    async callCustomModel(prompt) {
        // Implementation for custom model API
        throw new Error('Custom model API integration not yet implemented');
    }

    displayResult(result, responseTime) {
        this.resultElement.innerHTML = '';

        if (result.type === 'text') {
            const textDiv = document.createElement('div');
            const pre = document.createElement('pre');
            pre.textContent = result.content;
            textDiv.appendChild(pre);
            this.resultElement.appendChild(textDiv);
        } else if (result.type === 'image') {
            const img = document.createElement('img');
            img.src = result.content;
            img.alt = 'AI Generated Image';
            this.resultElement.appendChild(img);
        } else if (result.type === 'svg') {
            const svgContainer = document.createElement('div');
            svgContainer.innerHTML = result.content;
            this.resultElement.appendChild(svgContainer);
        }

        // Add response time
        if (responseTime) {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'response-time';
            timeDiv.textContent = `Response time: ${(responseTime / 1000).toFixed(2)}s`;
            this.resultElement.appendChild(timeDiv);
        }
    }

    displayError(message) {
        this.resultElement.innerHTML = `<p class="error">Error: ${message}</p>`;
    }

    setStatus(type, text) {
        this.statusElement.className = `status ${type}`;
        this.statusElement.textContent = text;
    }
}

// Main Application Controller
class ComparisonApp {
    constructor() {
        this.configManager = new ConfigManager();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle API configuration visibility
        document.getElementById('toggleConfig').addEventListener('click', () => {
            document.getElementById('apiConfig').classList.toggle('hidden');
        });

        // Save configuration
        document.getElementById('saveConfig').addEventListener('click', () => {
            this.configManager.saveConfig();
            alert('Configuration saved successfully!');
        });

        // Submit comparison
        document.getElementById('submitBtn').addEventListener('click', () => {
            this.compareModels();
        });

        // Allow Enter key with Ctrl/Cmd to submit
        document.getElementById('promptInput').addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.compareModels();
            }
        });
    }

    async compareModels() {
        const prompt = document.getElementById('promptInput').value.trim();
        
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        const config = this.configManager.getConfig();
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Comparing...';

        // Create callers for each model
        const callers = [
            new AIModelCaller(1, config.apiKey1, config.model1Name),
            new AIModelCaller(2, config.apiKey2, config.model2Name),
            new AIModelCaller(3, config.apiKey3, config.model3Name),
            new AIModelCaller(4, config.apiKey4, config.model4Name)
        ];

        // Call all models in parallel
        try {
            await Promise.all(callers.map(caller => caller.callModel(prompt)));
        } catch (error) {
            console.error('Error during comparison:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Compare Models';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComparisonApp();
});