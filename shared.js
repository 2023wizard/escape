// Shared utilities and lesson storage
class LessonStorage {
    static STORAGE_KEY = 'educational_snake_lessons';
    static CURRENT_LESSON_KEY = 'current_lesson_code';

    // Generate unique lesson code
    static generateCode() {
        return 'LESSON-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Save lesson
    static saveLesson(lesson) {
        if (!lesson.code) {
            lesson.code = this.generateCode();
        }
        lesson.createdAt = new Date().toISOString();

        const lessons = this.getAllLessons();
        const existingIndex = lessons.findIndex(l => l.code === lesson.code);

        if (existingIndex >= 0) {
            lessons[existingIndex] = lesson;
        } else {
            lessons.push(lesson);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lessons));
        return lesson;
    }

    // Get all lessons
    static getAllLessons() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Get lesson by code
    static getLesson(code) {
        const lessons = this.getAllLessons();
        return lessons.find(l => l.code === code);
    }

    // Delete lesson
    static deleteLesson(code) {
        const lessons = this.getAllLessons();
        const filtered = lessons.filter(l => l.code !== code);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }

    // Set current lesson
    static setCurrentLesson(code) {
        localStorage.setItem(this.CURRENT_LESSON_KEY, code);
    }

    // Get current lesson
    static getCurrentLesson() {
        const code = localStorage.getItem(this.CURRENT_LESSON_KEY);
        return code ? this.getLesson(code) : null;
    }

    // Clear current lesson
    static clearCurrentLesson() {
        localStorage.removeItem(this.CURRENT_LESSON_KEY);
    }
}

// Share lesson code with URL
function generateShareLink(lessonCode) {
    const baseUrl = window.location.origin + window.location.pathname.replace('teacher.html', 'index.html');
    return `${baseUrl}?lesson=${lessonCode}`;
}

// Copy to clipboard helper
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✓ Copied to clipboard!');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}

// Notification helper
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
