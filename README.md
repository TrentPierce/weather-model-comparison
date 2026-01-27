# AI Model Comparison Tool

A web application for comparing outputs from multiple AI models side by side. Test the same prompt across different AI models simultaneously and compare their responses in real-time.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TrentPierce/ai-model-comparison)

**Live Demo**: https://ai-model-comparison-six.vercel.app/

## Preview

![AI Model Comparison Tool Interface](screenshot.png)

The interface provides a clean, intuitive layout for comparing AI model outputs. Configure up to 4 different models, enter your prompt once, and see all responses side by side with real-time status indicators and response times.

## Features

- Side-by-side comparison of up to 4 AI models
- Configurable API keys stored locally in your browser
- Clean, responsive interface that works on desktop and mobile
- Support for multiple content types (text, images, SVG)
- Response time tracking for each model
- Parallel API calls for faster results
- Automatic content type detection
- Built-in error handling with helpful hints

## Quick Deploy

This is a static site with no backend requirements. Deploy instantly to your preferred hosting platform:

- **Vercel**: Click the "Deploy with Vercel" button above for one-click deployment
- **Netlify**: Drag and drop the repository folder to https://app.netlify.com/drop
- **GitHub Pages**: Enable in repository Settings → Pages → Select branch
- **Cloudflare Pages**: Connect your repository at https://pages.cloudflare.com
- **AWS S3**: Upload files to an S3 bucket with static website hosting enabled
- **Azure Static Web Apps**: Deploy directly from your GitHub repository

No build process, environment variables, or server configuration needed. Just deploy and add your API keys in the browser.

## Supported AI Models

### 1. OpenAI (GPT-4 & DALL-E)

**Text Generation**: GPT-4 for high-quality text responses
**Image Generation**: DALL-E 3 for creating images from text prompts

**Features**:
- Advanced reasoning and creative writing
- Code generation and debugging
- Image generation with automatic prompt refinement
- Supports up to 2000 tokens per response

**API Documentation**: https://platform.openai.com/docs/api-reference

### 2. Anthropic Claude

**Latest Model**: Claude 3.5 Sonnet

**Features**:
- Extended context window for long documents
- Strong analytical and reasoning capabilities
- Safe and helpful responses
- Excellent at following complex instructions

**API Documentation**: https://docs.anthropic.com/claude/reference

### 3. Google Gemini

**Latest Model**: Gemini 1.5 Pro

**Features**:
- Multimodal understanding (text, images, video)
- Large context window
- Fast response times
- Strong factual accuracy

**API Documentation**: https://ai.google.dev/docs

### 4. Stability AI

**Model**: Stable Diffusion XL 1.0

**Features**:
- High-quality image generation
- Artistic and photorealistic styles
- Fast generation times
- Returns base64 encoded images

**API Documentation**: https://platform.stability.ai/docs/api-reference

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

## Obtaining API Keys

### OpenAI API Key

1. Visit https://platform.openai.com/signup
2. Create an account or sign in
3. Navigate to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key immediately (you won't be able to see it again)
6. Add billing information at https://platform.openai.com/account/billing

**Pricing**: Pay-as-you-go, approximately $0.03 per 1K tokens for GPT-4

### Anthropic API Key

1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to "API Keys" in your account settings
4. Click "Create Key"
5. Copy and save the key securely
6. Add payment method for usage

**Pricing**: Pay-as-you-go, check https://www.anthropic.com/pricing for current rates

### Google Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Select or create a Google Cloud project
5. Copy the generated API key

**Pricing**: Free tier available with rate limits, paid plans for higher usage

### Stability AI API Key

1. Visit https://platform.stability.ai/
2. Sign up for an account
3. Navigate to your account settings
4. Find "API Keys" section
5. Generate a new API key
6. Add credits to your account for usage

**Pricing**: Credit-based system, check https://platform.stability.ai/pricing

## Configuring API Keys

1. Open the application in your browser
2. Click the "Show/Hide API Keys" button to reveal the configuration panel
3. Enter your API keys for each model you want to use
4. Set custom display names for each model (e.g., "GPT-4", "Claude Sonnet", "Gemini Pro", "Stable Diffusion")
5. Click "Save Configuration" to store settings locally

### Security Notes

**IMPORTANT**: This application runs entirely in your browser. Your API keys are:

- Stored in browser localStorage (never sent to any server except the AI provider APIs)
- Only accessible on your local machine
- Never transmitted to GitHub or any third-party service
- Cleared if you clear your browser data

**Security Best Practices**:

1. **Never share your API keys** with anyone
2. **Use read-only or limited-scope keys** when available
3. **Set spending limits** on your AI provider accounts
4. **Monitor usage** regularly through provider dashboards
5. **Rotate keys periodically** for enhanced security
6. **Use environment variables** if deploying to a server

**For Production Use**:

If deploying this application for team or public use, consider:

- Implementing a backend proxy server to secure API keys
- Using OAuth or authentication to restrict access
- Setting up server-side rate limiting
- Implementing usage tracking and quotas
- Using environment variables instead of localStorage

**Recommended Architecture for Production**:

```
Client Browser → Your Backend Server → AI Provider APIs
```

This prevents exposing API keys in the browser and allows better control over usage and costs.

## Usage

### Basic Usage

1. Configure your API keys (see above)
2. Enter a prompt in the text area
3. Click "Compare Models" or press Ctrl+Enter (Cmd+Enter on Mac)
4. View and compare responses from all configured models

### Content Type Detection

The application automatically detects the type of content you're requesting:

- **Text**: Default for most prompts (questions, instructions, conversations)
- **Images**: Detected when prompts include keywords like "image", "picture", "generate", "create"
- **SVG**: Detected for vector graphics requests (icons, logos, diagrams)

### Example Use Cases

**Comparing Text Responses**:
```
Prompt: "Explain quantum computing in simple terms"
Compares how different models explain complex topics
```

**Creative Writing**:
```
Prompt: "Write a short story about a time-traveling cat"
See different creative interpretations from each model
```

**Code Generation**:
```
Prompt: "Write a Python function to calculate Fibonacci numbers"
Compare code quality and approach from different models
```

**Image Generation**:
```
Prompt: "Create an image of a futuristic city at sunset"
Note: Only OpenAI DALL-E and Stability AI support image generation
```

**Technical Explanations**:
```
Prompt: "What are the key differences between REST and GraphQL?"
Compare technical accuracy and clarity
```

**Problem Solving**:
```
Prompt: "How would you debug a memory leak in a Node.js application?"
See different troubleshooting approaches
```

## Response Display

Each panel shows:

- **Model name**: Custom name you configured
- **Status indicator**: 
  - Orange = Loading
  - Green = Complete
  - Red = Error
- **Response content**: Text, image, or other content
- **Response time**: How long the API call took
- **Error hints**: Helpful suggestions when something goes wrong

## Rate Limits and Quotas

Be aware of rate limits for each API:

- **OpenAI**: Varies by tier (free, paid, enterprise)
- **Anthropic**: Based on your plan
- **Google Gemini**: 60 requests per minute (free tier)
- **Stability AI**: Based on credits and plan

The application will display helpful error messages if you hit rate limits.

## File Structure

```
ai-model-comparison/
├── index.html       # Main HTML structure
├── style.css        # Styling and responsive design
├── script.js        # Application logic and API integrations
├── screenshot.png   # Interface preview
└── README.md        # This file
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design supported

Requires modern browser with ES6+ JavaScript support and localStorage.

## Troubleshooting

### API Key Issues

**Error**: "API key not configured"
- Solution: Enter your API key in the configuration panel and save

**Error**: "401 Unauthorized" or authentication errors
- Solution: Verify your API key is correct and active
- Check that you've added billing information to your account

### Rate Limit Errors

**Error**: "429 Too Many Requests"
- Solution: Wait a few moments before trying again
- Consider upgrading your API plan for higher limits

### Content Safety Errors

**Error**: "Response blocked by safety filters"
- Solution: Rephrase your prompt to avoid potentially sensitive content
- Some models have stricter content policies than others

### No Response

- Check your internet connection
- Verify the API service is operational (check provider status pages)
- Look at browser console for detailed error messages (F12)

## Contributing

Contributions are welcome. To contribute:

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with real API keys
5. Submit a pull request

Focus areas for contribution:

- Additional AI model integrations (Mistral, Cohere, etc.)
- Enhanced UI/UX features
- Export/comparison tools
- Performance optimizations
- Better error handling
- Usage analytics and cost tracking

## License

MIT License - feel free to use this project for any purpose.

## Roadmap

- [x] OpenAI GPT-4 integration
- [x] Anthropic Claude integration
- [x] Google Gemini integration
- [x] Stability AI integration
- [x] DALL-E image generation
- [ ] Conversation history and session management
- [ ] Export comparison results (JSON, PDF, Markdown)
- [ ] Advanced comparison metrics and analytics
- [ ] Template prompts library
- [ ] Batch testing with multiple prompts
- [ ] Cost tracking per API call
- [ ] Model parameter customization (temperature, max tokens)
- [ ] Streaming responses for real-time output
- [ ] Image upload for multimodal models

## Disclaimer

This application makes direct API calls to third-party AI services. You are responsible for:

- Your own API keys and their security
- Costs incurred from API usage
- Compliance with each provider's terms of service
- Content generated by the AI models

The developers of this tool are not responsible for API costs, data privacy issues, or generated content.

## Support

For issues or questions:

- Open an issue on GitHub
- Check provider documentation for API-specific questions
- Review the troubleshooting section above

## Acknowledgments

Built with integrations for:
- OpenAI GPT-4 and DALL-E
- Anthropic Claude
- Google Gemini
- Stability AI

Thank you to all AI providers for their excellent APIs and documentation.