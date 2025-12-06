# @enduroshieldhub/sdk

TypeScript SDK for EnduroShield Hub AI-powered search integration.

## Installation

```bash
npm install @enduroshieldhub/sdk
# or
yarn add @enduroshieldhub/sdk
# or
pnpm add @enduroshieldhub/sdk
```

**Note:** This is a TypeScript package. You'll need TypeScript installed in your project to use it.

## Quick Start

```typescript
import { EnduroShieldHub } from '@enduroshieldhub/sdk';

// Initialize SDK
const sdk = new EnduroShieldHub({
  apiKey: 'your-api-key-here',
  subdomain: 'your-subdomain',
});

// Perform search
const result = await sdk.search('What is the company policy on remote work?');
console.log(result.answer);
```

## Usage

### TypeScript / ES6 Modules

```typescript
import { EnduroShieldHub, SearchResponse } from '@enduroshieldhub/sdk';

const sdk = new EnduroShieldHub({
  apiKey: 'your-api-key',
  subdomain: 'your-subdomain'
});

const result: SearchResponse = await sdk.search('Your query here');
```

### With TypeScript Compiler

This package provides TypeScript source files. Your TypeScript compiler will handle the compilation. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## API Reference

### Constructor

```typescript
new EnduroShieldHub(options: EnduroShieldHubOptions)
```

**Options:**
- `apiKey` (string, required): Your API key
- `subdomain` (string, required): Your organization subdomain
- `baseUrl` (string, optional): Custom base URL (defaults to `https://${subdomain}.enduroshieldhub.com`)
- `conversationHistory` (array, optional): Initial conversation history

### Methods

#### `search(query, options?)`

Perform an AI-powered search query.

```typescript
const result = await sdk.search('What is the refund policy?');
// Returns: { answer: string, query: string, timestamp: string }
```

**Parameters:**
- `query` (string): The search query
- `options` (object, optional):
  - `conversationHistory` (array): Override conversation history for this query

**Returns:** Promise<SearchResponse>

#### `clearHistory()`

Clear the conversation history.

```typescript
sdk.clearHistory();
```

#### `getHistory()`

Get the current conversation history.

```typescript
const history = sdk.getHistory();
// Returns: Array<{ role: 'USER' | 'ASSISTANT', content: string }>
```

#### `setHistory(history)`

Set the conversation history.

```typescript
sdk.setHistory([
  { role: 'USER', content: 'Hello' },
  { role: 'ASSISTANT', content: 'Hi! How can I help?' }
]);
```

#### `addToHistory(role, content)`

Add a message to the conversation history.

```typescript
sdk.addToHistory('USER', 'What is the vacation policy?');
sdk.addToHistory('ASSISTANT', 'The vacation policy states...');
```

## Complete Example

```typescript
import { EnduroShieldHub, SearchResponse, ConversationMessage } from '@enduroshieldhub/sdk';

// Initialize
const sdk = new EnduroShieldHub({
  apiKey: 'your-api-key',
  subdomain: 'your-subdomain'
});

// Simple query
const result1: SearchResponse = await sdk.search('What is the company policy?');
console.log(result1.answer);

// Query with conversation context
const result2: SearchResponse = await sdk.search('Tell me more about that', {
  conversationHistory: [
    { role: 'USER' as const, content: 'What is the vacation policy?' },
    { role: 'ASSISTANT' as const, content: 'The vacation policy allows...' }
  ]
});

// Manage conversation history
sdk.addToHistory('USER', 'What about sick leave?');
const history: ConversationMessage[] = sdk.getHistory();
console.log(history);

// Clear history for new conversation
sdk.clearHistory();
```

## Error Handling

```typescript
try {
  const result = await sdk.search('What is the policy?');
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      console.error('Invalid or expired API key');
    } else if (error.message.includes('limit')) {
      console.error('Usage limit exceeded');
    } else {
      console.error('Search failed:', error.message);
    }
  }
}
```

## Requirements

- Node.js 18.0.0 or higher
- TypeScript 5.0.0 or higher
- A valid EnduroShield Hub API key
- Your organization subdomain

## TypeScript Configuration

This package is written in TypeScript and requires TypeScript in your project. Your `tsconfig.json` should include:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## License

MIT

## Support

For issues, questions, or feature requests, please visit [GitHub Issues](https://github.com/your-org/enduroshieldhub-sdk/issues).

