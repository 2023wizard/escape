// Educational Snake Game - Student Version
class EducationalSnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            this.showError('Canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        
        // Game variables
        this.snake = [{x: 10, y: 10}];
        this.gridSize = 20;
        this.books = [];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.gameRunning = false;
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
        this.currentLesson = null;
        
        // Initialize
        this.initializeGame();
    }

    initializeGame() {
        // Get lesson from storage
        this.currentLesson = LessonStorage.getCurrentLesson();
        
        if (!this.currentLesson) {
            this.showError('No lesson found. Please start from the home page.');
            return;
        }

        this.lessonQuestions = this.currentLesson.questions || [];
        this.totalBooks = this.currentLesson.totalBooks || 20;
        this.totalRounds = Math.ceil(this.totalBooks / 5);

        // Display lesson info
        document.getElementById('lessonInfo').innerHTML = `
            <span class="lesson-title">${this.currentLesson.name}</span>
        `;

        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize books and start
        this.spawnBook();
        this.gameRunning = true;
        this.updateStats();
        
        // Start game loop
        this.gameLoop();
    }

    showError(message) {
        const loadingScreen = document.getElementById('loadingScreen');
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('loadingError').textContent = message;
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Button controls
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('quitBtn').addEventListener('click', () => this.quitGame());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitAnswer());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.playAgain());
    }
    
    handleKeyPress(e) {
        if (this.gamePaused || !this.gameRunning) return;
        
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

    quitGame() {
        if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
            LessonStorage.clearCurrentLesson();
            window.location.href = 'index.html';
        }
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
            alert('No questions in this lesson.');
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
    
    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    // First show loading screen
    const game = new EducationalSnakeGame();
    
    // If game initialized successfully, hide loading screen
    if (game.currentLesson) {
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.remove('active');
            document.getElementById('gameScreen').classList.add('active');
        }, 500);
    }
});
