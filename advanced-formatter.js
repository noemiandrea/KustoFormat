class AdvancedKQLFormatter {
    constructor(formattingOptions) {
        this.options = formattingOptions;
        this.keywords = [
            'let', 'table', 'where', 'project', 'extend', 'summarize', 'join', 'union', 
            'sort', 'order', 'take', 'limit', 'distinct', 'count', 'top', 'evaluate', 
            'render', 'print', 'search', 'find', 'datatable', 'range', 'materialize', 
            'serialize', 'fork', 'facet', 'mv-expand', 'mv-apply', 'parse', 'parse-where', 
            'getschema', 'externaldata', 'invoke', 'as', 'asc', 'desc', 'by', 'on', 'kind',
            'inner', 'left', 'right', 'outer', 'anti', 'semi', 'fullouter', 'leftanti', 
            'rightsemi', 'leftantisemi', 'rightanti', 'rightouter', 'leftouter', 
            'innerunique', 'leftouterunique'
        ];
        
        this.functions = [
            'ago', 'now', 'startof', 'endof', 'bin', 'case', 'iff', 'iif', 'contains', 
            'startswith', 'endswith', 'matches', 'regex', 'split', 'strcat', 'strlen', 
            'substring', 'indexof', 'replace', 'extract', 'trim', 'toupper', 'tolower', 
            'todynamic', 'tostring', 'toint', 'tolong', 'toreal', 'todatetime', 'totimespan',
            'min', 'max', 'sum', 'avg', 'count', 'dcount', 'make_set', 'make_list', 
            'arg_max', 'arg_min', 'any', 'percentile', 'stdev', 'variance'
        ];
        
        this.operators = [
            '==', '!=', '<>', '>=', '<=', '>', '<', '=', 'and', 'or', 'not', 'in', 
            'between', 'has', 'hasprefix', 'hassuffix', 'contains', 'startswith', 
            'endswith', 'matches', '+', '-', '*', '/', '%'
        ];
    }

    format(query) {
        if (!query || typeof query !== 'string') {
            return '';
        }

        try {
            // Tokenize the query
            const tokens = this.tokenize(query);
            
            // Parse into structured format
            const parsed = this.parseTokens(tokens);
            
            // Format the parsed structure
            const formatted = this.formatParsedQuery(parsed);
            
            // Apply final cleanup
            return this.finalCleanup(formatted);
        } catch (error) {
            console.error('Advanced formatting failed:', error);
            // Fallback to basic formatting
            return this.basicFormat(query);
        }
    }

    tokenize(query) {
        const tokens = [];
        let current = '';
        let inString = false;
        let stringChar = '';
        let inComment = false;
        
        for (let i = 0; i < query.length; i++) {
            const char = query[i];
            const nextChar = query[i + 1];
            
            // Handle comments
            if (!inString && char === '/' && nextChar === '/') {
                if (current.trim()) {
                    tokens.push({ type: 'text', value: current.trim() });
                    current = '';
                }
                inComment = true;
                current = char;
                continue;
            }
            
            if (inComment) {
                current += char;
                if (char === '\n') {
                    tokens.push({ type: 'comment', value: current.trim() });
                    current = '';
                    inComment = false;
                }
                continue;
            }
            
            // Handle strings
            if (!inString && (char === '"' || char === "'")) {
                if (current.trim()) {
                    tokens.push({ type: 'text', value: current.trim() });
                    current = '';
                }
                inString = true;
                stringChar = char;
                current = char;
                continue;
            }
            
            if (inString) {
                current += char;
                if (char === stringChar && query[i - 1] !== '\\') {
                    tokens.push({ type: 'string', value: current });
                    current = '';
                    inString = false;
                    stringChar = '';
                }
                continue;
            }
            
            // Handle special characters and operators
            if (this.isSpecialChar(char)) {
                if (current.trim()) {
                    tokens.push({ type: 'text', value: current.trim() });
                    current = '';
                }
                
                // Check for multi-character operators
                const twoChar = char + nextChar;
                if (this.operators.includes(twoChar)) {
                    tokens.push({ type: 'operator', value: twoChar });
                    i++; // Skip next character
                } else {
                    tokens.push({ type: 'special', value: char });
                }
                continue;
            }
            
            current += char;
        }
        
        if (current.trim()) {
            if (inComment) {
                tokens.push({ type: 'comment', value: current.trim() });
            } else {
                tokens.push({ type: 'text', value: current.trim() });
            }
        }
        
        return tokens;
    }

    isSpecialChar(char) {
        return /[|;,()=<>!+\-*/%\s]/.test(char);
    }

    parseTokens(tokens) {
        const statements = [];
        let currentStatement = [];
        
        for (const token of tokens) {
            if (token.type === 'special' && token.value === ';') {
                if (currentStatement.length > 0) {
                    statements.push(this.parseStatement(currentStatement));
                    currentStatement = [];
                }
            } else {
                currentStatement.push(token);
            }
        }
        
        if (currentStatement.length > 0) {
            statements.push(this.parseStatement(currentStatement));
        }
        
        return statements;
    }

    parseStatement(tokens) {
        const statement = {
            type: 'statement',
            parts: []
        };
        
        let currentPart = [];
        
        for (const token of tokens) {
            if (token.type === 'special' && token.value === '|') {
                if (currentPart.length > 0) {
                    statement.parts.push(this.parsePart(currentPart));
                    currentPart = [];
                }
            } else if (token.type !== 'text' || token.value.trim()) {
                currentPart.push(token);
            }
        }
        
        if (currentPart.length > 0) {
            statement.parts.push(this.parsePart(currentPart));
        }
        
        return statement;
    }

    parsePart(tokens) {
        if (tokens.length === 0) return { type: 'empty', tokens: [] };
        
        const firstToken = tokens.find(t => t.type === 'text');
        if (!firstToken) return { type: 'unknown', tokens };
        
        const firstWord = firstToken.value.split(/\s+/)[0].toLowerCase();
        
        if (firstWord === 'let') {
            return { type: 'let', tokens };
        } else if (this.keywords.includes(firstWord)) {
            return { type: 'operation', operation: firstWord, tokens };
        } else {
            return { type: 'table', tokens };
        }
    }

    formatParsedQuery(statements) {
        const formatted = [];
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            const formattedStatement = this.formatStatement(statement, i === 0);
            
            if (formattedStatement.trim()) {
                formatted.push(formattedStatement);
            }
        }
        
        return formatted.join(this.options.options.insertFinalNewline ? '\n\n' : '\n');
    }

    formatStatement(statement, isFirst) {
        const parts = [];
        
        for (let i = 0; i < statement.parts.length; i++) {
            const part = statement.parts[i];
            const isFirstPart = i === 0;
            const formattedPart = this.formatPart(part, isFirstPart, isFirst && isFirstPart);
            
            if (formattedPart.trim()) {
                parts.push(formattedPart);
            }
        }
        
        return parts.join(this.options.options.pipeOnNewLine ? '\n' : ' ');
    }

    formatPart(part, isFirstPart, isVeryFirst) {
        let formatted = '';
        const indent = isFirstPart && !isVeryFirst ? '' : this.options.getIndentation(isFirstPart ? 0 : 1);
        
        if (!isFirstPart && this.options.options.pipeOnNewLine) {
            formatted += this.options.formatOperator('|') + ' ';
        } else if (!isFirstPart) {
            formatted += this.options.formatOperator('|') + ' ';
        }
        
        const tokenText = this.formatPartTokens(part);
        formatted += tokenText;
        
        return indent + formatted.trim();
    }

    formatPartTokens(part) {
        let result = '';
        
        for (const token of part.tokens) {
            switch (token.type) {
                case 'text':
                    result += this.formatTextToken(token.value);
                    break;
                case 'operator':
                    result += this.options.formatOperator(token.value);
                    break;
                case 'string':
                    result += this.formatStringLiteral(token.value);
                    break;
                case 'comment':
                    result += this.formatComment(token.value);
                    break;
                case 'special':
                    result += this.formatSpecialChar(token.value);
                    break;
                default:
                    result += token.value;
            }
        }
        
        return result;
    }

    formatTextToken(text) {
        const words = text.split(/(\s+)/);
        const formatted = [];
        
        for (const word of words) {
            if (!word.trim()) {
                formatted.push(' ');
                continue;
            }
            
            const lowerWord = word.toLowerCase();
            
            if (this.keywords.includes(lowerWord)) {
                formatted.push(this.options.formatKeyword(lowerWord));
            } else if (this.functions.includes(lowerWord)) {
                formatted.push(this.formatFunction(lowerWord));
            } else if (this.operators.includes(lowerWord)) {
                formatted.push(this.options.formatOperator(lowerWord));
            } else {
                // Could be a table name or column name
                formatted.push(this.options.formatTableName(word));
            }
        }
        
        return formatted.join('').replace(/\s+/g, ' ');
    }

    formatFunction(funcName) {
        switch (this.options.options.functionCase) {
            case 'uppercase': return funcName.toUpperCase();
            case 'capitalize': return funcName.charAt(0).toUpperCase() + funcName.slice(1);
            case 'lowercase':
            default: return funcName.toLowerCase();
        }
    }

    formatStringLiteral(str) {
        if (this.options.options.preferredQuoteStyle === 'preserve') {
            return str;
        }
        
        const content = str.slice(1, -1); // Remove existing quotes
        const targetQuote = this.options.options.preferredQuoteStyle === 'single' ? "'" : '"';
        
        // Escape quotes if necessary
        const escaped = content.replace(new RegExp(targetQuote, 'g'), '\\' + targetQuote);
        
        return targetQuote + escaped + targetQuote;
    }

    formatComment(comment) {
        if (!this.options.options.spaceAfterCommentDelimiter) {
            return comment;
        }
        
        return comment.replace(/^\/\/(\S)/, '// $1');
    }

    formatSpecialChar(char) {
        switch (char) {
            case ',':
                return this.options.formatComma();
            case '(':
                return this.options.options.spaceBeforeOpeningParenthesis ? ' (' : '(';
            case ')':
                return ')' + (this.options.options.spaceAfterClosingParenthesis ? ' ' : '');
            default:
                return char;
        }
    }

    finalCleanup(formatted) {
        let result = formatted;
        
        // Remove trailing whitespace
        if (this.options.options.trimTrailingWhitespace) {
            result = result.replace(/[ \t]+$/gm, '');
        }
        
        // Handle empty lines
        if (!this.options.options.preserveEmptyLines) {
            result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
        }
        
        // Ensure final newline
        if (this.options.options.insertFinalNewline && !result.endsWith('\n')) {
            result += '\n';
        }
        
        return result.trim();
    }

    // Fallback basic formatting
    basicFormat(query) {
        return query
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\s*\|\s*/g, '\n| ')
            .replace(/\s*;\s*/g, ';\n')
            .replace(/\b(let\s+\w+\s*=)/gi, '\n$1')
            .replace(/^\n+/, '');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedKQLFormatter;
} else {
    window.AdvancedKQLFormatter = AdvancedKQLFormatter;
}