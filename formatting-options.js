class FormattingOptions {
    constructor() {
        this.options = this.getDefaultOptions();
        this.loadFromStorage();
    }

    getDefaultOptions() {
        return {
            // Indentation
            indentationType: 'spaces', // 'spaces' or 'tabs'
            indentationSize: 4,
            
            // Comma formatting
            commaStyle: 'trailing', // 'trailing', 'leading'
            spaceAfterComma: true,
            spaceBeforeComma: false,
            
            // Whitespace
            trimTrailingWhitespace: true,
            insertFinalNewline: true,
            maxLineLength: 120,
            preserveEmptyLines: false,
            
            // Operators
            spaceAroundOperators: true,
            spaceAroundAssignment: true,
            spaceAroundComparison: true,
            spaceAroundLogical: true,
            spaceAroundArithmetic: true,
            
            // Keywords
            keywordCase: 'lowercase', // 'lowercase', 'uppercase', 'capitalize'
            functionCase: 'lowercase',
            tableCase: 'preserve', // 'preserve', 'lowercase', 'uppercase', 'capitalize'
            
            // Line breaks
            pipeOnNewLine: true,
            whereOnNewLine: true,
            joinOnNewLine: true,
            unionOnNewLine: true,
            letOnNewLine: true,
            
            // Parentheses
            spaceInsideParentheses: false,
            spaceBeforeOpeningParenthesis: false,
            spaceAfterOpeningParenthesis: false,
            spaceBeforeClosingParenthesis: false,
            
            // String literals
            preferredQuoteStyle: 'double', // 'single', 'double', 'preserve'
            
            // Comments
            spaceAfterCommentDelimiter: true,
            alignInlineComments: false,
            
            // Function calls
            alignFunctionParameters: false,
            functionParametersOnNewLine: false,
            
            // Advanced structures
            alignJoinConditions: true,
            indentJoinConditions: true,
            alignUnionQueries: true,
            
            // Special operators
            spaceAroundPipe: true,
            spaceAroundHas: true,
            spaceAroundContains: true,
            spaceAroundStartswith: true,
            spaceAroundEndswith: true,
            
            // Aggregation functions
            aggregationOnNewLine: false,
            summarizeByOnNewLine: true,
            
            // Sort and ordering
            sortByOnNewLine: true,
            orderByOnNewLine: true,
            
            // Complex expressions
            breakComplexExpressions: true,
            complexExpressionThreshold: 80,
            
            // Data types
            preserveDataTypeCase: true,
            
            // Literals
            normalizeNumbers: false,
            normalizeDates: false,
            
            // Advanced formatting
            alignColumnDefinitions: false,
            alignTableColumns: false,
            groupSimilarOperations: false
        };
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('kustoformat-options');
            if (stored) {
                const parsed = JSON.parse(stored);
                this.options = { ...this.options, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load formatting options from storage:', error);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('kustoformat-options', JSON.stringify(this.options));
        } catch (error) {
            console.warn('Failed to save formatting options to storage:', error);
        }
    }

    updateOption(key, value) {
        if (key in this.options) {
            this.options[key] = value;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.saveToStorage();
    }

    resetToDefaults() {
        this.options = this.getDefaultOptions();
        this.saveToStorage();
    }

    exportOptions() {
        return JSON.stringify(this.options, null, 2);
    }

    importOptions(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            // Validate that all imported options are valid
            const validOptions = {};
            const defaults = this.getDefaultOptions();
            
            for (const [key, value] of Object.entries(imported)) {
                if (key in defaults) {
                    validOptions[key] = value;
                }
            }
            
            this.updateOptions(validOptions);
            return true;
        } catch (error) {
            console.error('Failed to import options:', error);
            return false;
        }
    }

    getPreset(presetName) {
        const presets = {
            compact: {
                indentationSize: 2,
                spaceAroundOperators: false,
                spaceAfterComma: false,
                maxLineLength: 200,
                pipeOnNewLine: false,
                whereOnNewLine: false,
                keywordCase: 'lowercase',
                preserveEmptyLines: false
            },
            verbose: {
                indentationSize: 4,
                spaceAroundOperators: true,
                spaceAfterComma: true,
                maxLineLength: 80,
                pipeOnNewLine: true,
                whereOnNewLine: true,
                keywordCase: 'uppercase',
                preserveEmptyLines: true,
                alignJoinConditions: true,
                alignFunctionParameters: true
            },
            microsoft: {
                indentationSize: 4,
                keywordCase: 'lowercase',
                spaceAroundOperators: true,
                pipeOnNewLine: true,
                commaStyle: 'trailing'
            }
        };
        
        return presets[presetName] || null;
    }

    applyPreset(presetName) {
        const preset = this.getPreset(presetName);
        if (preset) {
            this.updateOptions(preset);
            return true;
        }
        return false;
    }

    // Helper methods for specific formatting rules
    getIndentation(level = 1) {
        const unit = this.options.indentationType === 'tabs' ? '\t' : ' '.repeat(this.options.indentationSize);
        return unit.repeat(level);
    }

    formatComma(isLast = false) {
        if (isLast) return '';
        
        const comma = ',';
        if (this.options.commaStyle === 'trailing') {
            return comma + (this.options.spaceAfterComma ? ' ' : '');
        } else {
            return (this.options.spaceBeforeComma ? ' ' : '') + comma;
        }
    }

    formatOperator(operator) {
        if (!this.options.spaceAroundOperators) return operator;
        
        const needsSpacing = this.shouldSpaceOperator(operator);
        return needsSpacing ? ` ${operator} ` : operator;
    }

    shouldSpaceOperator(operator) {
        const operatorTypes = {
            assignment: ['='],
            comparison: ['==', '!=', '<>', '>', '<', '>=', '<='],
            logical: ['and', 'or', 'not'],
            arithmetic: ['+', '-', '*', '/', '%'],
            string: ['has', 'contains', 'startswith', 'endswith', 'matches']
        };

        for (const [type, ops] of Object.entries(operatorTypes)) {
            if (ops.includes(operator.toLowerCase())) {
                switch (type) {
                    case 'assignment': return this.options.spaceAroundAssignment;
                    case 'comparison': return this.options.spaceAroundComparison;
                    case 'logical': return this.options.spaceAroundLogical;
                    case 'arithmetic': return this.options.spaceAroundArithmetic;
                    case 'string': return this.options.spaceAroundHas;
                }
            }
        }
        
        return this.options.spaceAroundOperators;
    }

    formatKeyword(keyword) {
        switch (this.options.keywordCase) {
            case 'uppercase': return keyword.toUpperCase();
            case 'capitalize': return keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
            case 'lowercase':
            default: return keyword.toLowerCase();
        }
    }

    formatTableName(tableName) {
        switch (this.options.tableCase) {
            case 'uppercase': return tableName.toUpperCase();
            case 'lowercase': return tableName.toLowerCase();
            case 'capitalize': return tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase();
            case 'preserve':
            default: return tableName;
        }
    }

    shouldBreakLine(currentLength, addition) {
        return this.options.maxLineLength > 0 && 
               (currentLength + addition.length) > this.options.maxLineLength;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormattingOptions;
} else {
    window.FormattingOptions = FormattingOptions;
}