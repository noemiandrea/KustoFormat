class FormattingOptionsUI {
    constructor(formattingOptions, onOptionsChange) {
        this.formattingOptions = formattingOptions;
        this.onOptionsChange = onOptionsChange || (() => {});
        this.isVisible = false;
        this.init();
    }

    init() {
        this.createOptionsPanel();
        this.setupEventListeners();
        this.updateUI();
    }

    createOptionsPanel() {
        const panelHTML = `
            <div id="formatting-options-panel" class="options-panel">
                <div class="options-header">
                    <h3>Formatting Options</h3>
                    <div class="header-controls">
                        <button id="preset-compact" class="preset-btn" data-preset="compact">Compact</button>
                        <button id="preset-verbose" class="preset-btn" data-preset="verbose">Verbose</button>
                        <button id="preset-microsoft" class="preset-btn" data-preset="microsoft">Microsoft</button>
                        <button id="reset-options" class="reset-btn">Reset</button>
                        <button id="close-options" class="close-btn">×</button>
                    </div>
                </div>
                
                <div class="options-content">
                    <div class="options-tabs">
                        <button class="tab-btn active" data-tab="basic">Basic</button>
                        <button class="tab-btn" data-tab="advanced">Advanced</button>
                        <button class="tab-btn" data-tab="keywords">Keywords</button>
                        <button class="tab-btn" data-tab="structure">Structure</button>
                        <button class="tab-btn" data-tab="export">Import/Export</button>
                    </div>
                    
                    <div class="tab-content active" id="tab-basic">
                        <div class="option-group">
                            <h4>Indentation</h4>
                            <div class="option-row">
                                <label>Type:</label>
                                <select id="indentationType">
                                    <option value="spaces">Spaces</option>
                                    <option value="tabs">Tabs</option>
                                </select>
                            </div>
                            <div class="option-row">
                                <label>Size:</label>
                                <input type="number" id="indentationSize" min="1" max="8" value="4">
                            </div>
                        </div>
                        
                        <div class="option-group">
                            <h4>Commas</h4>
                            <div class="option-row">
                                <label>Style:</label>
                                <select id="commaStyle">
                                    <option value="trailing">Trailing</option>
                                    <option value="leading">Leading</option>
                                </select>
                            </div>
                            <div class="option-row">
                                <label>Space after comma:</label>
                                <input type="checkbox" id="spaceAfterComma">
                            </div>
                        </div>
                        
                        <div class="option-group">
                            <h4>Operators</h4>
                            <div class="option-row">
                                <label>Space around operators:</label>
                                <input type="checkbox" id="spaceAroundOperators">
                            </div>
                            <div class="option-row">
                                <label>Space around assignment (=):</label>
                                <input type="checkbox" id="spaceAroundAssignment">
                            </div>
                            <div class="option-row">
                                <label>Space around comparison (==, !=, etc.):</label>
                                <input type="checkbox" id="spaceAroundComparison">
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="tab-advanced">
                        <div class="option-group">
                            <h4>Line Length</h4>
                            <div class="option-row">
                                <label>Max line length:</label>
                                <input type="number" id="maxLineLength" min="40" max="200" value="120">
                            </div>
                            <div class="option-row">
                                <label>Break complex expressions:</label>
                                <input type="checkbox" id="breakComplexExpressions">
                            </div>
                        </div>
                        
                        <div class="option-group">
                            <h4>Parentheses</h4>
                            <div class="option-row">
                                <label>Space inside parentheses:</label>
                                <input type="checkbox" id="spaceInsideParentheses">
                            </div>
                            <div class="option-row">
                                <label>Space before opening parenthesis:</label>
                                <input type="checkbox" id="spaceBeforeOpeningParenthesis">
                            </div>
                        </div>
                        
                        <div class="option-group">
                            <h4>String Literals</h4>
                            <div class="option-row">
                                <label>Preferred quote style:</label>
                                <select id="preferredQuoteStyle">
                                    <option value="double">Double quotes (")</option>
                                    <option value="single">Single quotes (')</option>
                                    <option value="preserve">Preserve original</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="option-group">
                            <h4>Whitespace</h4>
                            <div class="option-row">
                                <label>Trim trailing whitespace:</label>
                                <input type="checkbox" id="trimTrailingWhitespace">
                            </div>
                            <div class="option-row">
                                <label>Insert final newline:</label>
                                <input type="checkbox" id="insertFinalNewline">
                            </div>
                            <div class="option-row">
                                <label>Preserve empty lines:</label>
                                <input type="checkbox" id="preserveEmptyLines">
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="tab-keywords">
                        <div class="option-group">
                            <h4>Keyword Casing</h4>
                            <div class="option-row">
                                <label>KQL keywords:</label>
                                <select id="keywordCase">
                                    <option value="lowercase">lowercase</option>
                                    <option value="uppercase">UPPERCASE</option>
                                    <option value="capitalize">Capitalize</option>
                                </select>
                            </div>
                            <div class="option-row">
                                <label>Function names:</label>
                                <select id="functionCase">
                                    <option value="lowercase">lowercase</option>
                                    <option value="uppercase">UPPERCASE</option>
                                    <option value="capitalize">Capitalize</option>
                                </select>
                            </div>
                            <div class="option-row">
                                <label>Table names:</label>
                                <select id="tableCase">
                                    <option value="preserve">Preserve original</option>
                                    <option value="lowercase">lowercase</option>
                                    <option value="uppercase">UPPERCASE</option>
                                    <option value="capitalize">Capitalize</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="option-group">
                            <h4>Special Operators</h4>
                            <div class="option-row">
                                <label>Space around 'has':</label>
                                <input type="checkbox" id="spaceAroundHas">
                            </div>
                            <div class="option-row">
                                <label>Space around 'contains':</label>
                                <input type="checkbox" id="spaceAroundContains">
                            </div>
                            <div class="option-row">
                                <label>Space around 'startswith':</label>
                                <input type="checkbox" id="spaceAroundStartswith">
                            </div>
                            <div class="option-row">
                                <label>Space around logical operators:</label>
                                <input type="checkbox" id="spaceAroundLogical">
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="tab-structure">
                        <div class="option-group">
                            <h4>Line Breaking</h4>
                            <div class="option-row">
                                <label>Pipe operator on new line:</label>
                                <input type="checkbox" id="pipeOnNewLine">
                            </div>
                            <div class="option-row">
                                <label>WHERE clauses on new line:</label>
                                <input type="checkbox" id="whereOnNewLine">
                            </div>
                            <div class="option-row">
                                <label>JOIN clauses on new line:</label>
                                <input type="checkbox" id="joinOnNewLine">
                            </div>
                            <div class="option-row">
                                <label>LET statements on new line:</label>
                                <input type="checkbox" id="letOnNewLine">
                            </div>
                            <div class="option-row">
                                <label>SORT BY on new line:</label>
                                <input type="checkbox" id="sortByOnNewLine">
                            </div>
                        </div>
                        
                        <div class="option-group">
                            <h4>Alignment</h4>
                            <div class="option-row">
                                <label>Align JOIN conditions:</label>
                                <input type="checkbox" id="alignJoinConditions">
                            </div>
                            <div class="option-row">
                                <label>Align function parameters:</label>
                                <input type="checkbox" id="alignFunctionParameters">
                            </div>
                            <div class="option-row">
                                <label>Align UNION queries:</label>
                                <input type="checkbox" id="alignUnionQueries">
                            </div>
                        </div>
                        
                        <div class="option-group">
                            <h4>Aggregation</h4>
                            <div class="option-row">
                                <label>SUMMARIZE BY on new line:</label>
                                <input type="checkbox" id="summarizeByOnNewLine">
                            </div>
                            <div class="option-row">
                                <label>Function parameters on new line:</label>
                                <input type="checkbox" id="functionParametersOnNewLine">
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="tab-export">
                        <div class="option-group">
                            <h4>Configuration Management</h4>
                            <div class="option-row">
                                <button id="export-config" class="action-btn">Export Configuration</button>
                                <p class="help-text">Export your current formatting settings to a JSON file</p>
                            </div>
                            <div class="option-row">
                                <label for="import-file">Import Configuration:</label>
                                <input type="file" id="import-file" accept=".json" class="file-input">
                                <p class="help-text">Import formatting settings from a JSON file</p>
                            </div>
                            <div class="option-row">
                                <textarea id="config-preview" placeholder="Configuration will appear here..." readonly rows="10"></textarea>
                                <button id="apply-config" class="action-btn">Apply Configuration</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert the panel into the page
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        this.panel = document.getElementById('formatting-options-panel');
    }

    setupEventListeners() {
        // Close button
        document.getElementById('close-options').addEventListener('click', () => {
            this.hide();
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.applyPreset(preset);
            });
        });

        // Reset button
        document.getElementById('reset-options').addEventListener('click', () => {
            this.resetToDefaults();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // All form controls
        this.setupFormListeners();

        // Import/Export
        this.setupImportExport();

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.panel.contains(e.target) && !e.target.matches('#options-btn')) {
                this.hide();
            }
        });
    }

    setupFormListeners() {
        const inputs = this.panel.querySelectorAll('input, select');
        inputs.forEach(input => {
            const eventType = input.type === 'checkbox' ? 'change' : 'input';
            input.addEventListener(eventType, () => {
                this.updateOption(input.id, this.getInputValue(input));
            });
        });
    }

    setupImportExport() {
        document.getElementById('export-config').addEventListener('click', () => {
            this.exportConfiguration();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importConfiguration(e.target.files[0]);
        });

        document.getElementById('apply-config').addEventListener('click', () => {
            this.applyConfigurationFromText();
        });

        // Update preview when switching to export tab
        document.querySelector('[data-tab="export"]').addEventListener('click', () => {
            setTimeout(() => this.updateConfigPreview(), 100);
        });
    }

    getInputValue(input) {
        if (input.type === 'checkbox') {
            return input.checked;
        } else if (input.type === 'number') {
            return parseInt(input.value, 10);
        } else {
            return input.value;
        }
    }

    updateOption(optionName, value) {
        if (this.formattingOptions.updateOption(optionName, value)) {
            this.onOptionsChange();
        }
    }

    updateUI() {
        const options = this.formattingOptions.options;
        
        Object.keys(options).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = options[key];
                } else {
                    input.value = options[key];
                }
            }
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });
    }

    applyPreset(presetName) {
        if (this.formattingOptions.applyPreset(presetName)) {
            this.updateUI();
            this.onOptionsChange();
            this.showNotification(`Applied ${presetName} preset`);
        }
    }

    resetToDefaults() {
        this.formattingOptions.resetToDefaults();
        this.updateUI();
        this.onOptionsChange();
        this.showNotification('Reset to default settings');
    }

    exportConfiguration() {
        const config = this.formattingOptions.exportOptions();
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kusto-formatting-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Configuration exported');
    }

    importConfiguration(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const config = e.target.result;
            if (this.formattingOptions.importOptions(config)) {
                this.updateUI();
                this.onOptionsChange();
                this.showNotification('Configuration imported successfully');
            } else {
                this.showNotification('Failed to import configuration', 'error');
            }
        };
        reader.readAsText(file);
    }

    updateConfigPreview() {
        const preview = document.getElementById('config-preview');
        if (preview) {
            preview.value = this.formattingOptions.exportOptions();
        }
    }

    applyConfigurationFromText() {
        const preview = document.getElementById('config-preview');
        if (preview && preview.value.trim()) {
            if (this.formattingOptions.importOptions(preview.value)) {
                this.updateUI();
                this.onOptionsChange();
                this.showNotification('Configuration applied successfully');
            } else {
                this.showNotification('Invalid configuration format', 'error');
            }
        }
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to panel
        this.panel.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    show() {
        this.isVisible = true;
        this.panel.classList.add('visible');
        this.updateUI();
    }

    hide() {
        this.isVisible = false;
        this.panel.classList.remove('visible');
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormattingOptionsUI;
} else {
    window.FormattingOptionsUI = FormattingOptionsUI;
}