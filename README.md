# AI Model Comparison Tool

A web application for comparing outputs from multiple AI models side by side. Test the same prompt across different AI models simultaneously and compare their responses in real-time.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TrentPierce/ai-model-comparison)

**Live Demo**: https://ai-model-comparison-six.vercel.app/

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

### 1. OpenAI (GPT-5.2 & DALL-E)

**Text Generation**: GPT-5.2 for high-quality text responses
**Image Generation**: DALL-E 3 for creating images from text prompts

**Features**:
- Advanced reasoning and creative writing
- Code generation and debugging
- Image generation with automatic prompt refinement
- Supports up to 2000 tokens per response

**API Documentation**: https://platform.openai.com/docs/api-reference

### 2. Anthropic Claude Opus 4

**Latest Model**: Claude Opus 4

**Features**:
- Extended context window for long documents
- Strong analytical and reasoning capabilities
- Safe and helpful responses
- Excellent at following complex instructions

**API Documentation**: https://docs.anthropic.com/claude/reference

### 3. Google Gemini 3 Pro

**Latest Model**: Gemini 3 Pro

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

### Additional Supported Models

**Kimi k2.5 (Moonshot AI)**:
- Extended context windows up to 200K tokens
- Strong multilingual capabilities, especially for Chinese
- Excellent for document analysis and long-form content
- API Documentation: https://platform.moonshot.cn/docs

**GLM 4.7 (BAAI - Beijing Academy of AI)**:
- Open-source model with strong performance
- Bilingual (English and Chinese) capabilities
- Cost-effective alternative to commercial models
- API Documentation: https://open.bigmodel.cn/dev/api

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

**Pricing**: Pay-as-you-go, pricing varies by model (GPT-5.2 rates available on pricing page)

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

### Moonshot AI API Key (Kimi k2.5)

1. Visit https://platform.moonshot.cn/
2. Register for an account
3. Navigate to API settings
4. Generate a new API key
5. Add credits or payment method for usage

**Pricing**: Competitive pricing for extended context windows

### BAAI API Key (GLM 4.7)

1. Visit https://open.bigmodel.cn/
2. Register for an account
3. Go to API credentials section
4. Create a new API key
5. Note any free tier quotas available

**Pricing**: Free tier available, with paid options for higher usage

## Configuring API Keys

1. Open the application in your browser
2. Click the "Show/Hide API Keys" button to reveal the configuration panel
3. Enter your API keys for each model you want to use
4. Set custom display names for each model (e.g., "GPT-5.2", "Claude Opus 4", "Gemini 3 Pro", "Kimi k2.5")
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

**Long Document Analysis** (with Kimi k2.5):
```
Prompt: "Summarize this 50-page research paper: [paste content]"
Leverage extended context windows for comprehensive document processing
```

**Multilingual Tasks** (with GLM 4.7 or Kimi):
```
Prompt: "Translate and explain this technical document from English to Chinese"
Compare multilingual capabilities across models
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
- **Moonshot AI**: Based on subscription level
- **BAAI**: Free tier available with rate limits

The application will display helpful error messages if you hit rate limits.

## File Structure

```
ai-model-comparison/
├── index.html       # Main HTML structure
├── style.css        # Styling and responsive design
├── script.js        # Application logic and API integrations
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

- Additional AI model integrations (Mistral, Cohere, DeepSeek, etc.)
- Enhanced UI/UX features
- Export/comparison tools
- Performance optimizations
- Better error handling
- Usage analytics and cost tracking

## License

MIT License - feel free to use this project for any purpose.

## Roadmap

- [x] OpenAI GPT-5.2 integration
- [x] Anthropic Claude Opus 4 integration
- [x] Google Gemini 3 Pro integration
- [x] Stability AI integration
- [x] DALL-E image generation
- [x] Kimi k2.5 (Moonshot AI) support
- [x] GLM 4.7 (BAAI) support
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
- OpenAI GPT-5.2 and DALL-E
- Anthropic Claude Opus 4
- Google Gemini 3 Pro
- Stability AI
- Kimi k2.5 (Moonshot AI)
- GLM 4.7 (BAAI)

Thank you to all AI providers for their excellent APIs and documentation.