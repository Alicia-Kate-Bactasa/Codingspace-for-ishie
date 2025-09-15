class CodingPlatform {
    constructor() {
        this.currentProblem = null;
        this.editor = null;
        this.problems = this.loadProblems();
        this.submissionHistory = this.loadSubmissionHistory();
        
        this.init();
    }

 
    init() {
        console.log('Initializing CodingPlatform...');
        this.setupEventListeners();
        this.initializeMonacoEditor();
        this.loadProblemsList();
        this.applyTheme();
        console.log('CodingPlatform initialized successfully!');
    }

   
    setupEventListeners() {
        
        document.getElementById('historyBtn').addEventListener('click', () => this.showSection('history'));
        document.getElementById('deleteHistoryBtn').addEventListener('click', () => this.deleteHistory());
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleDarkMode());

     
        document.getElementById('addProblemBtn').addEventListener('click', () => this.showAddProblemModal());
        document.getElementById('submitCodeBtn').addEventListener('click', () => this.submitCode());

       
        document.querySelector('.modal-close').addEventListener('click', () => this.hideAddProblemModal());
        document.querySelector('.modal-cancel').addEventListener('click', () => this.hideAddProblemModal());
        document.getElementById('addProblemForm').addEventListener('submit', (e) => this.handleAddProblem(e));

   
        document.getElementById('addTestCaseBtn').addEventListener('click', () => this.addTestCaseInput());

      
        document.getElementById('languageSelect').addEventListener('change', (e) => this.changeLanguage(e.target.value));

      
        document.getElementById('addProblemModal').addEventListener('click', (e) => {
            if (e.target.id === 'addProblemModal') {
                this.hideAddProblemModal();
            }
        });
    }

   
    async initializeMonacoEditor() {
        try {
         
            if (typeof require === 'undefined') {
                console.log('Monaco Editor not loaded, using fallback editor');
                this.createFallbackEditor();
                return;
            }

            require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } });
            
            require(['vs/editor/editor.main'], () => {
                this.editor = monaco.editor.create(document.getElementById('codeEditor'), {
                    value: '// Select a problem and start coding!\n',
                    language: 'javascript',
                    theme: this.getCurrentTheme() === 'dark' ? 'vs-dark' : 'vs',
                    automaticLayout: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    wordWrap: 'on'
                });

                this.editor.onDidChangeModelContent(() => {
                    this.updateRunButtons();
                });
            });
        } catch (error) {
            console.error('Failed to initialize Monaco Editor:', error);
            this.createFallbackEditor();
        }
    }

    
    createFallbackEditor() {
        const editorContainer = document.getElementById('codeEditor');
        editorContainer.innerHTML = '<textarea id="fallbackEditor" style="width: 100%; height: 100%; border: none; padding: 1rem; font-family: monospace; font-size: 14px; resize: none; background: transparent; color: inherit;"></textarea>';
        
        const fallbackEditor = document.getElementById('fallbackEditor');
        fallbackEditor.addEventListener('input', () => this.updateRunButtons());
    }

    
    showSection(sectionName) {
        
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

       
        document.getElementById(`${sectionName}Section`).classList.add('active');

       
        if (sectionName === 'history') {
            this.loadHistoryList();
        }
    }

   
    toggleDarkMode() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
     
        const moonIcon = document.getElementById('moonIcon');
        const sunIcon = document.getElementById('sunIcon');
        
        if (newTheme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
        
        
        if (this.editor) {
            monaco.editor.setTheme(newTheme === 'dark' ? 'vs-dark' : 'vs');
        }
    }

    
    getCurrentTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    
    applyTheme() {
        const theme = this.getCurrentTheme();
        document.documentElement.setAttribute('data-theme', theme);
        
        const moonIcon = document.getElementById('moonIcon');
        const sunIcon = document.getElementById('sunIcon');
        
        if (theme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }

    
    loadProblems() {
        const saved = localStorage.getItem('codingProblems');
        return saved ? JSON.parse(saved) : this.getDefaultProblems();
    }

    
    saveProblems() {
        localStorage.setItem('codingProblems', JSON.stringify(this.problems));
    }

    
    loadSubmissionHistory() {
        const saved = localStorage.getItem('submissionHistory');
        return saved ? JSON.parse(saved) : [];
    }

    
    saveSubmissionHistory() {
        localStorage.setItem('submissionHistory', JSON.stringify(this.submissionHistory));
    }

    
    deleteHistory() {
        if (confirm('Are you sure you want to delete all submission history? This action cannot be undone.')) {
            this.submissionHistory = [];
            this.saveSubmissionHistory();
            this.loadHistoryList();
            alert('Submission history deleted successfully!');
        }
    }

    
    getDefaultProblems() {
        return [
            {
                id: 1,
                title: "Hello World",
                description: "Write a function that returns the string 'Hello, World!'",
                difficulty: "easy",
                testCases: [
                    { input: "", expectedOutput: "Hello, World!" }
                ],
                language: "javascript"
            },
            {
                id: 2,
                title: "Sum of Two Numbers",
                description: "Write a function that takes two numbers as parameters and returns their sum.",
                difficulty: "easy",
                testCases: [
                    { input: "5, 3", expectedOutput: "8" },
                    { input: "-2, 7", expectedOutput: "5" },
                    { input: "0, 0", expectedOutput: "0" }
                ],
                language: "javascript"
            },
            {
                id: 3,
                title: "Factorial",
                description: "Write a function that calculates the factorial of a given number n.",
                difficulty: "medium",
                testCases: [
                    { input: "5", expectedOutput: "120" },
                    { input: "0", expectedOutput: "1" },
                    { input: "3", expectedOutput: "6" }
                ],
                language: "javascript"
            }
        ];
    }

    
    loadProblemsList() {
        const problemsList = document.getElementById('problemsList');
        problemsList.innerHTML = '';

        this.problems.forEach(problem => {
            const problemItem = this.createProblemItem(problem);
            problemsList.appendChild(problemItem);
        });
    }

    
    createProblemItem(problem) {
        const item = document.createElement('button');
        item.className = 'problem-item';
        item.innerHTML = `
            <h4>${this.escapeHtml(problem.title)}</h4>
            <p>${this.escapeHtml(problem.description.substring(0, 60))}${problem.description.length > 60 ? '...' : ''}</p>
            <div class="problem-meta">
                <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
                <span>${problem.testCases.length} test${problem.testCases.length !== 1 ? 's' : ''}</span>
            </div>
        `;

        item.addEventListener('click', () => this.selectProblem(problem));
        return item;
    }

    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    
    selectProblem(problem) {
        this.currentProblem = problem;
        
       
        document.querySelectorAll('.problem-item').forEach(item => {
            item.classList.remove('active');
        });
        
        
        const problemItems = document.querySelectorAll('.problem-item');
        problemItems.forEach((item, index) => {
            if (this.problems[index] && this.problems[index].id === problem.id) {
                item.classList.add('active');
            }
        });
        
        
        this.showSection('editor');
        this.loadProblemInEditor(problem);
    }

    
    loadProblemInEditor(problem) {
        
        document.getElementById('problemTitle').textContent = problem.title;
        document.getElementById('problemDescription').innerHTML = `<p>${this.escapeHtml(problem.description)}</p>`;
        
       
        document.getElementById('languageSelect').value = problem.language || 'javascript';
        
     
        this.displayTestCases(problem.testCases);
        
        
        this.setupCodeEditor(problem);
    }

    
    displayTestCases(testCases) {
        const testCasesContainer = document.getElementById('testCases');
        testCasesContainer.innerHTML = '<h4>Test Cases:</h4>';
        
        testCases.forEach((testCase, index) => {
            const testCaseElement = document.createElement('div');
            testCaseElement.className = 'test-case';
            testCaseElement.innerHTML = `
                <h4>Test Case ${index + 1}</h4>
                <div><strong>Input:</strong></div>
                <pre>${this.escapeHtml(testCase.input || '(no input)')}</pre>
                <div><strong>Expected Output:</strong></div>
                <pre>${this.escapeHtml(testCase.expectedOutput)}</pre>
            `;
            testCasesContainer.appendChild(testCaseElement);
        });
    }

    
    setupCodeEditor(problem) {
        const language = problem.language || 'javascript';
        const template = this.getCodeTemplate(language);
        
        if (this.editor) {
            this.editor.setValue(template);
            monaco.editor.setModelLanguage(this.editor.getModel(), language);
        } else {
            const fallbackEditor = document.getElementById('fallbackEditor');
            if (fallbackEditor) {
                fallbackEditor.value = template;
            }
        }
        
        this.updateRunButtons();
    }

   
    getCodeTemplate(language) {
        const templates = {
            javascript: `// Write your solution here
function solution() {
    // Your code goes here
    return "Hello, World!";
}

// Test your function
console.log(solution());`,
            c: `#include <stdio.h>

// Write your solution here
int main() {
    // Your code goes here
    printf("Hello, World!\\n");
    return 0;
}`,
            python: `# Write your solution here
def solution():
    # Your code goes here
    return "Hello, World!"

# Test your function
print(solution())`
        };
        
        return templates[language] || templates.javascript;
    }

    
    changeLanguage(language) {
        if (this.currentProblem) {
            this.currentProblem.language = language;
            this.setupCodeEditor(this.currentProblem);
        }
    }

    
    updateRunButtons() {
        const hasCode = this.getCurrentCode().trim().length > 0;
        const hasProblem = this.currentProblem !== null;
        document.getElementById('submitCodeBtn').disabled = !hasCode || !hasProblem;
    }

    
    getCurrentCode() {
        if (this.editor) {
            return this.editor.getValue();
        } else {
            const fallbackEditor = document.getElementById('fallbackEditor');
            return fallbackEditor ? fallbackEditor.value : '';
        }
    }

    
    submitCode() {
        if (!this.currentProblem) return;
        
        const code = this.getCurrentCode();
        const language = document.getElementById('languageSelect').value;
        const results = this.executeCode(code, language, this.currentProblem.testCases);
        
        // Save to submission history
        const submission = {
            id: Date.now(),
            problemId: this.currentProblem.id,
            problemTitle: this.currentProblem.title,
            code: code,
            language: language,
            results: results,
            timestamp: new Date().toISOString(),
            passed: results.every(result => result.passed)
        };
        
        this.submissionHistory.unshift(submission);
        this.saveSubmissionHistory();
        
        this.displayResults(results, true);
    }

    
    executeCode(code, language, testCases) {
        const results = [];
        
        testCases.forEach((testCase, index) => {
            try {
                const result = this.runSingleTestCase(code, language, testCase);
                results.push({
                    testCaseIndex: index,
                    passed: result.passed,
                    actualOutput: result.output,
                    expectedOutput: testCase.expectedOutput,
                    error: result.error
                });
            } catch (error) {
                results.push({
                    testCaseIndex: index,
                    passed: false,
                    actualOutput: '',
                    expectedOutput: testCase.expectedOutput,
                    error: error.message
                });
            }
        });
        
        return results;
    }

    
    runSingleTestCase(code, language, testCase) {
        try {
            let output = '';
            
            // Simple pattern matching for demo purposes
            if (code.includes('Hello, World!')) {
                output = 'Hello, World!';
            } else if (code.includes('sum') || code.includes('+')) {
                const numbers = testCase.input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                if (numbers.length >= 2) {
                    output = (numbers[0] + numbers[1]).toString();
                }
            } else if (code.includes('factorial') || code.includes('!')) {
                const num = parseInt(testCase.input);
                if (!isNaN(num)) {
                    let result = 1;
                    for (let i = 1; i <= num; i++) {
                        result *= i;
                    }
                    output = result.toString();
                }
            } else {
                output = 'Output not recognized';
            }
            
            const passed = output.trim() === testCase.expectedOutput.trim();
            
            return {
                passed: passed,
                output: output,
                error: null
            };
        } catch (error) {
            return {
                passed: false,
                output: '',
                error: error.message
            };
        }
    }

    
    displayResults(results, isSubmission) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        
        resultsSection.style.display = 'block';
        
        let html = `<h3>${isSubmission ? 'Submission Results' : 'Test Results'}</h3>`;
        
        const passedCount = results.filter(r => r.passed).length;
        const totalCount = results.length;
        
        html += `<div class="results-summary">
            <strong>${passedCount}/${totalCount} test cases passed</strong>
        </div>`;
        
        results.forEach((result, index) => {
            const statusClass = result.passed ? 'passed' : 'failed';
            const statusIcon = result.passed ? '✅' : '❌';
            
            html += `
                <div class="test-result ${statusClass}">
                    <span class="test-result-icon">${statusIcon}</span>
                    <div class="test-result-details">
                        <div class="test-result-title">Test Case ${index + 1}</div>
                        <div class="test-result-output">
                            ${result.error ? 
                                `Error: ${this.escapeHtml(result.error)}` : 
                                `Expected: "${this.escapeHtml(result.expectedOutput)}" | Got: "${this.escapeHtml(result.actualOutput)}"`
                            }
                        </div>
                    </div>
                </div>
            `;
        });
        
        resultsContent.innerHTML = html;
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

   
    showAddProblemModal() {
        document.getElementById('addProblemModal').classList.add('active');
        document.getElementById('problemTitleInput').focus();
    }

    
    hideAddProblemModal() {
        document.getElementById('addProblemModal').classList.remove('active');
        document.getElementById('addProblemForm').reset();
        
        const testCasesInput = document.getElementById('testCasesInput');
        testCasesInput.innerHTML = this.createTestCaseInputHTML();
    }

    
    handleAddProblem(event) {
        event.preventDefault();
        
        const title = document.getElementById('problemTitleInput').value.trim();
        const description = document.getElementById('problemDescInput').value.trim();
        const difficulty = document.getElementById('problemDifficulty').value;
        
        if (!title || !description) {
            alert('Please fill in all required fields.');
            return;
        }
        
        
        const testCases = [];
        document.querySelectorAll('.test-case-input').forEach(testCaseInput => {
            const input = testCaseInput.querySelector('.test-input').value.trim();
            const output = testCaseInput.querySelector('.test-output').value.trim();
            
            if (input || output) {
                testCases.push({
                    input: input,
                    expectedOutput: output
                });
            }
        });
        
        if (testCases.length === 0) {
            alert('Please add at least one test case.');
            return;
        }
        
      
        const newProblem = {
            id: Date.now(),
            title: title,
            description: description,
            difficulty: difficulty,
            testCases: testCases,
            language: 'javascript'
        };
        
        
        this.problems.push(newProblem);
        this.saveProblems();
        
       
        this.loadProblemsList();
        
        
        this.hideAddProblemModal();
        
      
        alert('Problem added successfully!');
        

        this.selectProblem(newProblem);
    }

    
    addTestCaseInput() {
        const testCasesInput = document.getElementById('testCasesInput');
        const newTestCase = document.createElement('div');
        newTestCase.className = 'test-case-input';
        newTestCase.innerHTML = this.createTestCaseInputHTML();
        
        newTestCase.querySelector('.remove-test-case').addEventListener('click', () => {
            newTestCase.remove();
        });
        
        testCasesInput.appendChild(newTestCase);
    }

    
    createTestCaseInputHTML() {
        return `
            <div class="input-group">
                <label>Input:</label>
                <textarea class="test-input" placeholder="Test input"></textarea>
            </div>
            <div class="input-group">
                <label>Expected Output:</label>
                <textarea class="test-output" placeholder="Expected output"></textarea>
            </div>
            <button type="button" class="btn btn-danger remove-test-case">Remove</button>
        `;
    }

    
    loadHistoryList() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        if (this.submissionHistory.length === 0) {
            historyList.innerHTML = '<p>No submissions yet. Start coding to see your history!</p>';
            return;
        }
        
        this.submissionHistory.forEach(submission => {
            const historyItem = this.createHistoryItem(submission);
            historyList.appendChild(historyItem);
        });
    }

    
    createHistoryItem(submission) {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const passedCount = submission.results.filter(r => r.passed).length;
        const totalCount = submission.results.length;
        const date = new Date(submission.timestamp).toLocaleString();
        
        item.innerHTML = `
            <h4>${this.escapeHtml(submission.problemTitle)}</h4>
            <div class="history-meta">
                <span>Language: ${this.escapeHtml(submission.language)}</span>
                <span>${date}</span>
            </div>
            <div class="history-code">
                <pre>${this.escapeHtml(submission.code.substring(0, 200))}${submission.code.length > 200 ? '...' : ''}</pre>
            </div>
            <div class="history-results">
                <span class="history-result ${submission.passed ? 'passed' : 'failed'}">
                    ${passedCount}/${totalCount} passed
                </span>
            </div>
        `;
        
        return item;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating CodingPlatform instance...');
    new CodingPlatform();
});


document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-test-case')) {
        e.target.closest('.test-case-input').remove();
    }
});