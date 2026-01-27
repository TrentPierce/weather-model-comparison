# AI Model Comparison Tool

A web application for comparing outputs from multiple AI models side by side. Test the same prompt across different AI models simultaneously and compare their responses in real-time.

## Features

- Side-by-side comparison of up to 4 AI models
- Configurable API keys stored locally in your browser
- Clean, responsive interface that works on desktop and mobile
- Support for multiple content types (text, images, SVG)
- Response time tracking for each model
- Parallel API calls for faster results

## Setup Instructions

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/TrentPierce/ai-model-comparison.git
   cd ai-model-comparison
   ```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Use a local development server:
     ```bash
     python -m http.server 8000
     # or
     npx serve
     ```
   - Navigate to `http://localhost:8000`

3. No build process or dependencies required - this is a pure HTML/CSS/JavaScript application.

### Deployment

Deploy to any static hosting service:

- **GitHub Pages**: Enable in repository settings
- **Netlify**: Drag and drop the repository folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload files to an S3 bucket with static hosting enabled

## Configuring API Keys

1. Click the "Show/Hide API Keys" button to reveal the configuration panel
2. Enter your API keys for each model you want to use
3. Optionally, customize the display name for each model
4. Click "Save Configuration" to store settings locally

API keys are stored in your browser's localStorage and never sent to any server except the respective AI model APIs.

### Security Note

This application runs entirely in your browser. API keys are stored locally using localStorage. For production use, consider:

- Implementing a backend proxy to secure API keys
- Using environment variables for server-side deployments
- Adding authentication to restrict access

## Usage

1. Configure your API keys (see above)
2. Enter a prompt in the text area
3. Click "Compare Models" or press Ctrl+Enter (Cmd+Enter on Mac)
4. View and compare responses from all configured models

The application will call all models in parallel, displaying results as they arrive. Each panel shows:

- Model name
- Status indicator (loading, complete, or error)
- Response content
- Response time

## Supported AI Models

The application is designed to support any AI model with an API. Integration points are provided for:

- OpenAI (GPT-4, GPT-3.5, etc.)
- Anthropic Claude
- Google Gemini
- Meta Llama (via various providers)
- Custom model endpoints

### Adding Model Integrations

To integrate a specific AI model:

1. Open `script.js`
2. Locate the `AIModelCaller` class
3. Implement the appropriate API call method (e.g., `callOpenAI`, `callAnthropic`)
4. Update the `callModel` method to route to your implementation

Example structure:

```javascript
async callOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }]
        })
    });
    
    const data = await response.json();
    return {
        type: 'text',
        content: data.choices[0].message.content
    };
}
```

## File Structure

```
ai-model-comparison/
├── index.html       # Main HTML structure
├── style.css        # Styling and responsive design
├── script.js        # Application logic and API integration
└── README.md        # This file
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design supported

Requires modern browser with ES6+ JavaScript support.

## Contributing

Contributions are welcome. To contribute:

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Focus areas for contribution:

- Additional AI model integrations
- Enhanced UI/UX features
- Export/comparison tools
- Performance optimizations

## License

MIT License - feel free to use this project for any purpose.

## Roadmap

- [ ] Pre-built integrations for popular AI models
- [ ] Export comparison results (JSON, PDF, Markdown)
- [ ] Conversation history and session management
- [ ] Advanced comparison metrics and analytics
- [ ] Template prompts library
- [ ] Batch testing with multiple prompts
- [ ] Cost tracking per API call

## Support

For issues or questions, please open an issue on GitHub.