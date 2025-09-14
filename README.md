# KustoFormat

A web application for formatting Kusto KQL (Kusto Query Language) queries with syntax highlighting and beautification.

## Features

- **Interactive Query Input**: Simple textarea for entering KQL queries
- **Monaco Editor Integration**: Syntax highlighting and formatting using Monaco Editor with Kusto language support
- **Basic Formatting**: Automatic formatting with proper indentation and keyword capitalization
- **Copy to Clipboard**: Easy copying of formatted queries
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Option 1: Open Directly in Browser
Simply open `index.html` in your web browser. The application uses CDN-hosted Monaco Editor, so no local installation is required.

### Option 2: Run with Local Server
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local server:
   ```bash
   npm start
   ```

3. Open http://localhost:8080 in your browser

## Usage

1. Enter your KQL query in the input textarea on the left
2. Click "Format Query" to format and display the query with syntax highlighting
3. Use "Copy to Clipboard" to copy the formatted query
4. Use "Clear" to reset both input and output

## Example KQL Query

```kusto
let timeRange = ago(7d);
SecurityEvent 
| where TimeGenerated > timeRange 
| where EventID == 4625 
| summarize FailedLogins = count() by Account, Computer 
| where FailedLogins > 10 
| sort by FailedLogins desc
```

## Technology Stack

- **Monaco Editor**: Microsoft's code editor that powers VS Code
- **Kusto Language Support**: Custom syntax highlighting and language configuration
- **Vanilla JavaScript**: No framework dependencies for simplicity
- **CSS Grid**: Responsive layout design

## Browser Compatibility

- Chrome/Edge 60+
- Firefox 55+
- Safari 12+

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test the functionality
5. Submit a pull request

## License

MIT License