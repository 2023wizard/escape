// Teacher Dashboard Logic
class TeacherDashboard {
    constructor() {
        this.currentLesson = null;
        this.questions = [];
        this.setupEventListeners();
        this.loadActiveLessons();
    }

    setupEventListeners() {
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

        // Buttons
        document.getElementById('addQuestionBtn').addEventListener('click', () => this.addQuestionForm());
        document.getElementById('loadSampleQuestionsBtn').addEventListener('click', () => this.loadSampleQuestions());
        document.getElementById('createLessonBtn').addEventListener('click', () => this.createLesson());
        document.getElementById('clearFormBtn').addEventListener('click', () => this.clearForm());
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
            // Wait for pdfjsLib to be defined
            if (typeof pdfjsLib === 'undefined') {
                throw new Error('PDF.js library not loaded yet. Please try again.');
            }

            const pdf = await pdfjsLib.getDocument({data: pdfData}).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map(item => item.str).join(' ');
            }

            document.getElementById('uploadStatus').textContent = '✅ PDF uploaded successfully!';
            document.getElementById('uploadStatus').className = 'success';

            // Display preview
            const preview = document.getElementById('pdfPreview');
            preview.innerHTML = `<strong>Extracted Content Preview:</strong><p>${fullText.substring(0, 300)}...</p>`;

            // Enable auto-generate option
            showNotification('PDF loaded! You can now add questions manually or load samples.');
        } catch (error) {
            document.getElementById('uploadStatus').textContent = '❌ Error reading PDF: ' + error.message;
            document.getElementById('uploadStatus').className = 'error';
        }
    }

    addQuestionForm() {
        const container = document.getElementById('questionsContainer');
        const questionNum = this.questions.length + 1;

        const questionForm = document.createElement('div');
        questionForm.className = 'question-form';
        questionForm.id = `question-${questionNum}`;
        questionForm.innerHTML = `
            <div class="question-header">
                <h4>Question ${questionNum}</h4>
                <button type="button" class="btn-small btn-danger" onclick="dashboard.removeQuestion(${questionNum - 1})">Remove</button>
            </div>
            <div class="form-group">
                <label>Question Text:</label>
                <input type="text" class="question-text" placeholder="Enter your question...">
            </div>
            <div class="answers-options">
                <label>Answer Options:</label>
                <div class="answer-option">
                    <input type="text" class="answer-input" placeholder="Option A (Correct Answer)">
                    <input type="radio" name="correct-${questionNum}" class="correct-answer" checked>
                    <span>Correct</span>
                </div>
                <div class="answer-option">
                    <input type="text" class="answer-input" placeholder="Option B">
                    <input type="radio" name="correct-${questionNum}" class="correct-answer">
                    <span>Correct</span>
                </div>
                <div class="answer-option">
                    <input type="text" class="answer-input" placeholder="Option C">
                    <input type="radio" name="correct-${questionNum}" class="correct-answer">
                    <span>Correct</span>
                </div>
                <div class="answer-option">
                    <input type="text" class="answer-input" placeholder="Option D">
                    <input type="radio" name="correct-${questionNum}" class="correct-answer">
                    <span>Correct</span>
                </div>
            </div>
        `;

        container.appendChild(questionForm);
        this.questions.push({});
        this.updateCreateButton();
    }

    removeQuestion(index) {
        const container = document.getElementById('questionsContainer');
        const forms = container.querySelectorAll('.question-form');
        if (forms[index]) {
            forms[index].remove();
            this.questions.splice(index, 1);
            this.updateCreateButton();
        }
    }

    loadSampleQuestions() {
        const sampleQuestions = [
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

        const container = document.getElementById('questionsContainer');
        container.innerHTML = '';
        this.questions = [];

        sampleQuestions.forEach((q, index) => {
            const questionForm = document.createElement('div');
            questionForm.className = 'question-form';
            questionForm.id = `question-${index + 1}`;

            let answersHTML = '';
            q.answers.forEach((answer, answerIndex) => {
                const isCorrect = answerIndex === q.correctAnswer;
                answersHTML += `
                    <div class="answer-option">
                        <input type="text" class="answer-input" value="${answer}">
                        <input type="radio" name="correct-${index}" class="correct-answer" ${isCorrect ? 'checked' : ''}>
                        <span>Correct</span>
                    </div>
                `;
            });

            questionForm.innerHTML = `
                <div class="question-header">
                    <h4>Question ${index + 1}</h4>
                    <button type="button" class="btn-small btn-danger" onclick="dashboard.removeQuestion(${index})">Remove</button>
                </div>
                <div class="form-group">
                    <label>Question Text:</label>
                    <input type="text" class="question-text" value="${q.question}">
                </div>
                <div class="answers-options">
                    <label>Answer Options:</label>
                    ${answersHTML}
                </div>
            `;

            container.appendChild(questionForm);
            this.questions.push(q);
        });

        showNotification('Sample questions loaded! Feel free to edit them.');
        this.updateCreateButton();
    }

    createLesson() {
        const name = document.getElementById('lessonName').value.trim();
        const description = document.getElementById('lessonDescription').value.trim();

        if (!name) {
            showNotification('Please enter a lesson name', 'error');
            return;
        }

        if (this.questions.length === 0) {
            showNotification('Please add at least one question', 'error');
            return;
        }

        // Collect questions from forms
        const questions = [];
        const forms = document.querySelectorAll('.question-form');
        
        forms.forEach((form, index) => {
            const questionText = form.querySelector('.question-text').value;
            const answerInputs = form.querySelectorAll('.answer-input');
            const correctRadios = form.querySelectorAll('.correct-answer');

            let correctAnswer = 0;
            const answers = [];

            answerInputs.forEach((input, i) => {
                answers.push(input.value || `Option ${String.fromCharCode(65 + i)}`);
                if (correctRadios[i].checked) {
                    correctAnswer = i;
                }
            });

            if (questionText) {
                questions.push({
                    question: questionText,
                    answers: answers,
                    correctAnswer: correctAnswer
                });
            }
        });

        if (questions.length === 0) {
            showNotification('Please enter all question texts', 'error');
            return;
        }

        // Create lesson
        const lesson = {
            name: name,
            description: description,
            questions: questions,
            totalBooks: 20,
            booksPerRound: 5
        };

        const saved = LessonStorage.saveLesson(lesson);
        showNotification(`✅ Lesson created! Code: ${saved.code}`);

        this.clearForm();
        this.loadActiveLessons();
    }

    clearForm() {
        document.getElementById('lessonName').value = '';
        document.getElementById('lessonDescription').value = '';
        document.getElementById('questionsContainer').innerHTML = '';
        document.getElementById('pdfPreview').innerHTML = '';
        document.getElementById('uploadStatus').textContent = '';
        this.questions = [];
        this.updateCreateButton();
    }

    updateCreateButton() {
        const btn = document.getElementById('createLessonBtn');
        const hasName = document.getElementById('lessonName').value.trim() !== '';
        const hasQuestions = this.questions.length > 0;
        btn.disabled = !(hasName && hasQuestions);
    }

    loadActiveLessons() {
        const lessons = LessonStorage.getAllLessons();
        const container = document.getElementById('lessonsListContainer');
        const noMsg = document.getElementById('noLessonsMsg');

        container.innerHTML = '';

        if (lessons.length === 0) {
            noMsg.style.display = 'block';
            return;
        }

        noMsg.style.display = 'none';

        lessons.forEach(lesson => {
            const card = document.createElement('div');
            card.className = 'lesson-card';
            const shareLink = generateShareLink(lesson.code);

            card.innerHTML = `
                <div class="lesson-card-header">
                    <h3>${lesson.name}</h3>
                    <span class="lesson-code">Code: ${lesson.code}</span>
                </div>
                <p class="lesson-description">${lesson.description || 'No description'}</p>
                <p class="lesson-stats">📋 ${lesson.questions.length} questions | 📖 ${lesson.totalBooks} books</p>
                <div class="lesson-actions">
                    <button class="btn btn-small" onclick="dashboard.copyShareLink('${lesson.code}')">📋 Copy Share Link</button>
                    <button class="btn btn-small" onclick="dashboard.deleteLesson('${lesson.code}')">🗑️ Delete</button>
                </div>
                <div class="share-link-preview">
                    <small>Share this link with students:</small>
                    <code>${shareLink}</code>
                </div>
            `;

            container.appendChild(card);
        });
    }

    copyShareLink(code) {
        const link = generateShareLink(code);
        copyToClipboard(link);
    }

    deleteLesson(code) {
        if (confirm('Are you sure you want to delete this lesson? This cannot be undone.')) {
            LessonStorage.deleteLesson(code);
            showNotification('Lesson deleted');
            this.loadActiveLessons();
        }
    }
}

// Initialize when page loads
let dashboard;
window.addEventListener('DOMContentLoaded', () => {
    dashboard = new TeacherDashboard();

    // Update create button on input change
    document.getElementById('lessonName').addEventListener('input', () => {
        dashboard.updateCreateButton();
    });
});
