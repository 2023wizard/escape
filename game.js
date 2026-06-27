// Educational Snake Game
class EducationalSnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game variables
        this.snake = [{x: 10, y: 10}];
        this.gridSize = 20;
        this.books = [];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameSpeed = 100;
        this.lastMoveTime = 0;
        
        // Game state
        this.booksCollected = 0;
        this.totalBooks = 20;
        this.booksInRound = 0;
        this.currentRound = 0;
        this.totalRounds = 4;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        
        // Quiz state
        this.currentQuestion = null;
        this.selectedAnswer = null;
        this.lessonQuestions = [];
        
        // Initialize books
        this.spawnBook();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Button controls
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitAnswer());
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('loadSampleBtn').addEventListener('click', () => this.loadSampleQuestions());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.playAgain());
        document.getElementById('uploadNewBtn').addEventListener('click', () => this.uploadNew());
        
        // PDF upload
        const uploadArea = document.getElementById('uploadArea');
        const pdfInput = document.getElementById('pdfInput');
        
        uploadArea.addEventListener('click', () => pdfInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            if (e.dataTransfer.files[0]) {
                this.handlePDFUpload(e.dataTransfer.files[0]);
            }
        });
        
        pdfInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.handlePDFUpload(e.target.files[0]);
            }
        });
    }
    
    handleKeyPress(e) {
        if (this.gamePaused || !this.gameRunning) return;
        
        const key = e.key.toLowerCase();
        const arrowKey = e.key.includes('Arrow');
        
        if (arrowKey) {
            e.preventDefault();
        }
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.direction.y === 0) {
                    this.nextDirection = {x: 0, y: -1};
                    e.preventDefault();
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.direction.y === 0) {
                    this.nextDirection = {x: 0, y: 1};
                    e.preventDefault();
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.direction.x === 0) {
                    this.nextDirection = {x: -1, y: 0};
                    e.preventDefault();
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.direction.x === 0) {
                    this.nextDirection = {x: 1, y: 0};
                    e.preventDefault();
                }
                break;
        }
    }
    
    spawnBook() {
        let newBook;
        let valid = false;
        
        while (!valid) {
            newBook = {
                x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
                y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
            };
            
            valid = !this.snake.some(segment => segment.x === newBook.x && segment.y === newBook.y);
        }
        
        this.books.push(newBook);
    }
    
    update(deltaTime) {
        if (this.gamePaused || !this.gameRunning) return;
        
        this.lastMoveTime += deltaTime;
        
        if (this.lastMoveTime < this.gameSpeed) return;
        
        this.lastMoveTime = 0;
        this.direction = this.nextDirection;
        
        // Move snake
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        
        // Check boundaries
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.endGame();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check book collision
        for (let i = 0; i < this.books.length; i++) {
            if (this.books[i].x === head.x && this.books[i].y === head.y) {
                this.books.splice(i, 1);
                this.booksCollected++;
                this.booksInRound++;
                this.updateStats();
                this.spawnBook();
                
                if (this.booksInRound >= 5) {
                    this.pauseGameForQuiz();
                }
                
                if (this.booksCollected >= this.totalBooks) {
                    this.completeGame();
                }
                break;
            }
        }
        
        // Remove tail if no book collected
        if (this.books.length > 0) {
            this.snake.pop();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.canvas.height; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
            } else {
                // Body
                this.ctx.fillStyle = '#00dd00';
                this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
            }
        });
        
        // Draw books
        this.books.forEach(book => {
            const x = book.x * this.gridSize;
            const y = book.y * this.gridSize;
            
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
            
            // Book icon
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('📚', x + this.gridSize / 2, y + this.gridSize / 2);
        });
        
        // Draw pause overlay
        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    gameLoop = (timestamp = 0) => {
        const deltaTime = 16; // Approximate 60fps
        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
    }
    
    pauseGameForQuiz() {
        this.gameRunning = false;
        this.showQuiz();
    }
    
    endGame() {
        this.gameRunning = false;
        alert('Game Over! You hit a wall or yourself. Try again!');
        this.resetGame();
    }
    
    completeGame() {
        this.gameRunning = false;
        this.showGameOver();
    }
    
    updateStats() {
        document.getElementById('bookCount').textContent = this.booksCollected;
        document.getElementById('roundCount').textContent = Math.floor(this.booksCollected / 5);
    }
    
    showQuiz() {
        this.currentRound = Math.floor(this.booksCollected / 5);
        
        if (this.lessonQuestions.length === 0) {
            alert('No questions loaded. Please load lesson content first.');
            this.resumeGame();
            return;
        }
        
        const questionIndex = (this.currentRound - 1) % this.lessonQuestions.length;
        this.currentQuestion = this.lessonQuestions[questionIndex];
        this.selectedAnswer = null;
        
        // Update quiz display
        document.getElementById('questionText').textContent = this.currentQuestion.question;
        document.getElementById('quizRound').textContent = this.currentRound;
        
        const answersContainer = document.getElementById('answersContainer');
        answersContainer.innerHTML = '';
        
        this.currentQuestion.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.addEventListener('click', () => this.selectAnswer(index));
            answersContainer.appendChild(btn);
        });
        
        document.getElementById('feedbackText').textContent = '';
        document.getElementById('submitBtn').disabled = true;
        
        this.switchScreen('quizScreen');
    }
    
    selectAnswer(index) {
        this.selectedAnswer = index;
        
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach((btn, i) => {
            btn.classList.remove('selected');
            if (i === index) {
                btn.classList.add('selected');
            }
        });
        
        document.getElementById('submitBtn').disabled = false;
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        this.questionsAnswered++;
        const isCorrect = this.selectedAnswer === this.currentQuestion.correctAnswer;
        
        if (isCorrect) {
            this.correctAnswers++;
            document.getElementById('feedbackText').textContent = '✅ Correct! Great job!';
            document.getElementById('feedbackText').className = 'feedback correct';
        } else {
            document.getElementById('feedbackText').textContent = `❌ Incorrect. The correct answer is: ${this.currentQuestion.answers[this.currentQuestion.correctAnswer]}`;
            document.getElementById('feedbackText').className = 'feedback incorrect';
        }
        
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach((btn, i) => {
            btn.classList.add('disabled');
            if (i === this.currentQuestion.correctAnswer) {
                btn.classList.add('correct');
            } else if (i === this.selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        document.getElementById('submitBtn').disabled = true;
        
        setTimeout(() => this.resumeGame(), 3000);
    }
    
    resumeGame() {
        this.booksInRound = 0;
        this.gameRunning = true;
        this.switchScreen('gameScreen');
    }
    
    resetGame() {
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.books = [];
        this.booksCollected = 0;
        this.booksInRound = 0;
        this.currentRound = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.gameRunning = true;
        this.gamePaused = false;
        this.spawnBook();
        this.updateStats();
        document.getElementById('pauseBtn').textContent = 'Pause';
    }
    
    startGame() {
        if (this.lessonQuestions.length === 0) {
            alert('Please load lesson questions first.');
            return;
        }
        this.resetGame();
        this.switchScreen('gameScreen');
    }
    
    showGameOver() {
        document.getElementById('finalQuestions').textContent = this.questionsAnswered;
        document.getElementById('finalCorrect').textContent = this.correctAnswers;
        const accuracy = this.questionsAnswered > 0 ? 
            Math.round((this.correctAnswers / this.questionsAnswered) * 100) : 0;
        document.getElementById('finalAccuracy').textContent = accuracy;
        
        this.switchScreen('gameOverScreen');
    }
    
    playAgain() {
        this.resetGame();
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.switchScreen('gameScreen');
    }
    
    uploadNew() {
        this.resetGame();
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.lessonQuestions = [];
        this.switchScreen('lessonScreen');
    }
    
    handlePDFUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.extractPDFText(e.target.result);
        };
        reader.readAsArrayBuffer(file);
    }
    
    async extractPDFText(pdfData) {
        try {
            const pdf = await pdfjsLib.getDocument({data: pdfData}).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map(item => item.str).join(' ');
            }
            
            document.getElementById('uploadStatus').textContent = '✅ PDF uploaded successfully!';
            document.getElementById('uploadStatus').className = 'success';
            
            // Display extracted text preview
            const preview = document.getElementById('pdfPreview');
            preview.innerHTML = `<strong>Extracted Text Preview:</strong><p>${fullText.substring(0, 300)}...</p>`;
            
            // Generate questions from the text
            this.generateQuestionsFromText(fullText);
            
            document.getElementById('startGameBtn').disabled = false;
        } catch (error) {
            document.getElementById('uploadStatus').textContent = '❌ Error reading PDF: ' + error.message;
            document.getElementById('uploadStatus').className = 'error';
        }
    }
    
    generateQuestionsFromText(text) {
        // This is a simplified question generator
        // In production, you'd use NLP or have pre-defined questions
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
        const questions = [];
        
        for (let i = 0; i < Math.min(4, sentences.length); i++) {
            const sentence = sentences[i].trim();
            if (sentence.length > 20) {
                questions.push({
                    question: `What is mentioned about: ${sentence.substring(0, 60)}...?`,
                    answers: [
                        `${sentence.substring(0, 40)}...`,
                        `Option B: ${Math.random().toString(36).substring(7)}`,
                        `Option C: ${Math.random().toString(36).substring(7)}`,
                        `Option D: ${Math.random().toString(36).substring(7)}`
                    ],
                    correctAnswer: 0
                });
            }
        }
        
        this.lessonQuestions = questions.length > 0 ? questions : this.loadSampleQuestions();
    }
    
    loadSampleQuestions() {
        this.lessonQuestions = [
            {
                question: "What is the capital of France?",
                answers: ["Paris", "London", "Berlin", "Madrid"],
                correctAnswer: 0
            },
            {
                question: "What is 2 + 2?",
                answers: ["3", "4", "5", "6"],
                correctAnswer: 1
            },
            {
                question: "Who wrote Romeo and Juliet?",
                answers: ["Jane Austen", "Charles Dickens", "William Shakespeare", "Mark Twain"],
                correctAnswer: 2
            },
            {
                question: "What is the largest planet in our solar system?",
                answers: ["Saturn", "Neptune", "Jupiter", "Earth"],
                correctAnswer: 2
            }
        ];
        
        document.getElementById('uploadStatus').textContent = '📚 Sample questions loaded!';
        document.getElementById('uploadStatus').className = 'success';
        document.getElementById('startGameBtn').disabled = false;
        
        return this.lessonQuestions;
    }
    
    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Show lesson screen first
    document.getElementById('lessonScreen').classList.add('active');
    new EducationalSnakeGame();
});
