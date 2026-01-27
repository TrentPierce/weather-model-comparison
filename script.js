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

// Content Type Detector
class ContentTypeDetector {
    static detectContentType(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        // Image generation keywords
        const imageKeywords = [
            'image', 'picture', 'photo', 'generate', 'create', 'draw',
            'painting', 'illustration', 'artwork', 'visual', 'render'
        ];
        
        // SVG keywords
        const svgKeywords = [
            'svg', 'vector', 'icon', 'logo', 'diagram', 'chart', 'graph'
        ];
        
        // Check for image request
        if (imageKeywords.some(keyword => lowerPrompt.includes(keyword)) &&
            (lowerPrompt.includes('of') || lowerPrompt.includes('showing'))) {
            return 'image';
        }
        
        // Check for SVG request
        if (svgKeywords.some(keyword => lowerPrompt.includes(keyword))) {
            return 'svg';
        }
        
        // Default to text
        return 'text';
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
            let result;
            const contentType = ContentTypeDetector.detectContentType(prompt);
            
            // Route to appropriate API based on model name
            const modelLower = this.modelName.toLowerCase();
            
            if (modelLower.includes('gpt') || modelLower.includes('openai')) {
                if (contentType === 'image') {
                    result = await this.callDALLE(prompt);
                } else {
                    result = await this.callOpenAI(prompt);
                }
            } else if (modelLower.includes('claude') || modelLower.includes('anthropic')) {
                result = await this.callAnthropic(prompt);
            } else if (modelLower.includes('gemini') || modelLower.includes('google')) {
                result = await this.callGoogle(prompt);
            } else if (modelLower.includes('stability') || modelLower.includes('stable')) {
                result = await this.callStabilityAI(prompt);
            } else {
                // Try to detect based on API key format or default to OpenAI
                result = await this.callOpenAI(prompt);
            }
            
            const responseTime = Date.now() - startTime;
            this.displayResult(result, responseTime);
            this.setStatus('success', 'Complete');
        } catch (error) {
            console.error(`Error in ${this.modelName}:`, error);
            this.displayError(error.message);
            this.setStatus('error', 'Error');
        }
    }

    async callOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant. Provide clear, accurate, and concise responses.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            type: 'text',
            content: data.choices[0].message.content
        };
    }

    async callDALLE(prompt) {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `DALL-E API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            type: 'image',
            content: data.data[0].url,
            revised_prompt: data.data[0].revised_prompt
        };
    }

    async callAnthropic(prompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle different content types from Claude
        let content = '';
        for (const block of data.content) {
            if (block.type === 'text') {
                content += block.text;
            }
        }
        
        return {
            type: 'text',
            content: content
        };
    }

    async callGoogle(prompt) {
        // Gemini API uses a different URL structure with API key in the URL
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `Google API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response from Gemini');
        }
        
        const candidate = data.candidates[0];
        if (candidate.finishReason === 'SAFETY') {
            throw new Error('Response blocked by safety filters');
        }
        
        const content = candidate.content.parts[0].text;
        
        return {
            type: 'text',
            content: content
        };
    }

    async callStabilityAI(prompt) {
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                text_prompts: [
                    {
                        text: prompt,
                        weight: 1
                    }
                ],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                samples: 1,
                steps: 30
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Stability AI error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.artifacts || data.artifacts.length === 0) {
            throw new Error('No image generated');
        }
        
        // Convert base64 to data URL
        const base64Image = data.artifacts[0].base64;
        const dataUrl = `data:image/png;base64,${base64Image}`;
        
        return {
            type: 'image',
            content: dataUrl
        };
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
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '4px';
            this.resultElement.appendChild(img);
            
            // Add revised prompt if available (DALL-E)
            if (result.revised_prompt) {
                const promptDiv = document.createElement('div');
                promptDiv.style.marginTop = '10px';
                promptDiv.style.fontSize = '0.9rem';
                promptDiv.style.color = '#666';
                promptDiv.innerHTML = `<strong>Revised prompt:</strong> ${result.revised_prompt}`;
                this.resultElement.appendChild(promptDiv);
            }
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
        
        // Add helpful hints for common errors
        if (message.includes('401') || message.includes('authentication') || message.includes('api key')) {
            this.resultElement.innerHTML += '<p class="error">Hint: Check that your API key is correct and active.</p>';
        } else if (message.includes('429') || message.includes('rate limit')) {
            this.resultElement.innerHTML += '<p class="error">Hint: You have exceeded the rate limit. Wait a moment and try again.</p>';
        } else if (message.includes('quota') || message.includes('billing')) {
            this.resultElement.innerHTML += '<p class="error">Hint: Check your API account billing and quota limits.</p>';
        } else if (message.includes('safety') || message.includes('blocked')) {
            this.resultElement.innerHTML += '<p class="error">Hint: Your prompt may have been blocked by content filters. Try rephrasing.</p>';
        }
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