class KustoFormatter {
    constructor() {
        this.outputEditor = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupOutputEditor();
    }

    setupEventListeners() {
        const formatBtn = document.getElementById('format-btn');
        const clearBtn = document.getElementById('clear-btn');
        const copyBtn = document.getElementById('copy-btn');
        
        formatBtn.addEventListener('click', () => this.formatQuery());
        clearBtn.addEventListener('click', () => this.clearQuery());
        copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    setupOutputEditor() {
        // Create a simple textarea with syntax highlighting styling
        const editorContainer = document.getElementById('monaco-editor');
        editorContainer.innerHTML = `
            <textarea id="output-editor" readonly 
                style="width: 100%; height: 100%; border: none; padding: 15px; 
                       font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
                       font-size: 14px; resize: none; background: #f8f9fa; 
                       line-height: 1.5; color: #333; outline: none;"></textarea>
        `;
        
        this.outputEditor = document.getElementById('output-editor');
    }

    async formatQuery() {
        const inputQuery = document.getElementById('input-query').value.trim();
        
        if (!inputQuery) {
            this.showStatus('Please enter a KQL query to format.', 'error');
            return;
        }

        const formatBtn = document.getElementById('format-btn');
        formatBtn.disabled = true;
        formatBtn.textContent = 'Formatting...';

        try {
            // Apply KQL formatting
            const formattedQuery = this.formatKQLQuery(inputQuery);
            
            if (this.outputEditor) {
                this.outputEditor.value = formattedQuery;
            }
            
            this.showStatus('Query formatted successfully!', 'success');
        } catch (error) {
            console.error('Formatting error:', error);
            this.showStatus('Error formatting query. Please check your KQL syntax.', 'error');
        } finally {
            formatBtn.disabled = false;
            formatBtn.textContent = 'Format Query';
        }
    }

    formatKQLQuery(query) {
        // Enhanced KQL formatting with proper indentation and structure
        let formatted = query
            // Normalize whitespace and remove extra spaces
            .replace(/\s+/g, ' ')
            .trim()
            
            // Handle pipe operators with proper line breaks
            .replace(/\s*\|\s*/g, '\n| ')
            
            // Handle semicolons
            .replace(/\s*;\s*/g, ';\n')
            
            // Handle let statements
            .replace(/\b(let\s+\w+\s*=)/gi, '\n$1')
            
            // Clean up the beginning
            .replace(/^\n+/, '');

        // Split into lines for detailed formatting
        const lines = formatted.split('\n');
        const formattedLines = [];
        let indentLevel = 0;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            
            if (!line) continue;

            // Determine indentation
            let currentIndent = indentLevel;
            
            // Main query operators at base level
            if (line.match(/^\w+\s*$/)) {
                currentIndent = 0;
                indentLevel = 0;
            }
            // Pipe operators
            else if (line.startsWith('|')) {
                currentIndent = 0;
                
                // Special handling for certain operators that might have sub-clauses
                if (line.match(/\|\s*(where|project|extend|summarize|join|union|sort|order)/i)) {
                    // Check if this line continues or if next line is indented content
                    if (i + 1 < lines.length && !lines[i + 1].trim().startsWith('|') && !lines[i + 1].trim().match(/^\w+\s*$/)) {
                        indentLevel = 1;
                    }
                }
            }
            // Let statements
            else if (line.match(/^let\s+/i)) {
                currentIndent = 0;
                indentLevel = 0;
            }
            // Continuation lines
            else {
                currentIndent = Math.max(indentLevel, 1);
            }

            // Apply indentation
            const indent = '    '.repeat(currentIndent);
            
            // Format the line content
            line = this.formatLineContent(line);
            
            formattedLines.push(indent + line);
        }

        return formattedLines.join('\n').trim();
    }

    formatLineContent(line) {
        // Format operators and keywords
        return line
            // Normalize spaces around operators
            .replace(/\s*([=<>!]+)\s*/g, ' $1 ')
            .replace(/\s*([,])\s*/g, '$1 ')
            .replace(/\s+(and|or)\s+/gi, ' $1 ')
            
            // Format parentheses
            .replace(/\s*([()])\s*/g, '$1')
            .replace(/\(\s*/g, '(')
            .replace(/\s*\)/g, ')')
            
            // Capitalize/format keywords (keep original casing for now, but ensure consistency)
            .replace(/\b(let|table|where|project|extend|summarize|join|union|sort|order|take|limit|distinct|count|top|evaluate|render|print|search|find|datatable|range|materialize|serialize|fork|facet|mv-expand|mv-apply|parse|parse-where|getschema|externaldata|invoke|as|asc|desc|by|on|kind|inner|left|right|outer|anti|semi|fullouter|leftanti|rightsemi|leftantisemi|rightanti|rightouter|leftouter|innerunique|leftouterunique|ago|now|startof|endof|bin|case|iff|iif|contains|startswith|endswith|matches|regex|split|strcat|strlen|substring|indexof|replace|extract|trim|toupper|tolower|todynamic|tostring|toint|tolong|toreal|todatetime|totimespan|min|max|sum|avg|count|dcount|make_set|make_list|arg_max|arg_min|any|percentile|stdev|variance|and|or|not|in|between|has|hasprefix|hassuffix)\b/gi, 
                match => match.toLowerCase())
            
            // Clean up extra spaces
            .replace(/\s+/g, ' ')
            .trim();
    }

    clearQuery() {
        document.getElementById('input-query').value = '';
        if (this.outputEditor) {
            this.outputEditor.value = '';
        }
        this.clearStatus();
    }

    async copyToClipboard() {
        if (!this.outputEditor || !this.outputEditor.value.trim()) {
            this.showStatus('No formatted query to copy.', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.outputEditor.value);
            this.showStatus('Formatted query copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            this.outputEditor.select();
            document.execCommand('copy');
            this.showStatus('Formatted query copied to clipboard!', 'success');
        }
    }

    showStatus(message, type) {
        this.clearStatus();
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message ${type}`;
        statusDiv.textContent = message;
        
        // Add to output section
        const outputSection = document.querySelector('.output-section');
        outputSection.appendChild(statusDiv);
        
        // Auto-hide after 3 seconds
        setTimeout(() => this.clearStatus(), 3000);
    }

    clearStatus() {
        const existingStatus = document.querySelector('.status-message');
        if (existingStatus) {
            existingStatus.remove();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KustoFormatter();
});