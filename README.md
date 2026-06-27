# 📚 Educational Snake Game

An interactive educational gaming platform that combines a classic snake game with lesson-based quizzes. Students collect books in a snake game, and after collecting 5 books, they answer a question about the lesson content. Perfect for making learning engaging and fun!

## Features

✨ **Key Features:**
- 🎮 Classic snake game mechanics with educational twist
- 📖 PDF lesson upload support
- ❓ Auto-generated quiz questions from lesson content
- 📊 Progress tracking (collect 20 books total)
- 🔄 Cycling quiz system (4 questions repeated)
- 📱 Responsive design - works on desktop and mobile
- 🌐 GitHub Pages ready - host it directly from your repository

## How It Works

### Game Flow:
1. **Upload Lesson** - Teacher uploads a PDF with lesson content
2. **Play Game** - Student controls the snake to collect books (red squares)
3. **Answer Question** - After collecting 5 books, a question appears
4. **Continue** - Correct answer returns to game, collect 5 more books
5. **Complete** - After collecting 20 books and answering all rounds, game complete!

### Controls:
- **Arrow Keys** or **WASD** - Move the snake
- **Space/Pause Button** - Pause the game
- **Mouse** - Select quiz answers

## Setup & Deployment

### Option 1: GitHub Pages (Recommended for Teachers)

1. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Scroll to "GitHub Pages" section
   - Select "Deploy from a branch"
   - Choose the `educational-snake-game` branch
   - Choose `/root` folder

2. **Share with Students:**
   - Your game will be available at: `https://yourusername.github.io/escape/`
   - Share this link with your class!

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/escape.git
cd escape

# Use a local server (Python)
python -m http.server 8000

# Or use Node.js http-server
npx http-server

# Visit http://localhost:8000 in your browser
```

## Usage for Teachers

### Creating Your First Lesson Game:

1. **Create your lesson PDF:**
   - Write your lesson content
   - Export as PDF (any format: Word, Google Docs, etc.)
   - Keep it focused - the game will extract questions from it

2. **Open the game in a browser**
3. **Upload your PDF:**
   - Click the upload area
   - Or drag and drop your PDF
   - The system will extract text and generate questions

4. **Generate Sample Questions** (if preferred):
   - Instead of PDF, use the "Load Sample Questions" button
   - Edit the questions directly in `game.js` if needed

### Customizing Questions:

Edit `game.js` and modify the `loadSampleQuestions()` function:

```javascript
loadSampleQuestions() {
    this.lessonQuestions = [
        {
            question: "Your question here?",
            answers: ["Correct Answer", "Wrong 1", "Wrong 2", "Wrong 3"],
            correctAnswer: 0  // Index of correct answer (0-3)
        },
        // Add more questions...
    ];
}
```

## Game Settings (for Advanced Customization)

In `game.js`, you can adjust:

```javascript
this.totalBooks = 20;        // Total books to collect
this.totalRounds = 4;        // Number of unique questions
this.gameSpeed = 100;        // Snake movement speed (lower = faster)
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## PDF Processing

The game uses PDF.js to extract text from uploaded PDFs. The current implementation:
- Extracts all text from the PDF
- Separates text into sentences
- Generates multiple choice questions automatically

**Note:** For best results with auto-generated questions, consider using the sample questions feature and customizing them manually.

## Troubleshooting

### Game won't load:
- Clear browser cache and reload
- Check that all files (HTML, CSS, JS) are in the same directory
- Ensure you're using a modern browser

### PDF upload fails:
- Try a different PDF file
- Ensure the PDF is not corrupted
- Check browser console for error messages (F12)

### Questions not appearing:
- Use "Load Sample Questions" button instead
- Manually edit questions in `game.js`
- Check that PDF extraction worked in the preview

## File Structure

```
educational-snake-game/
├── index.html          # Main HTML file
├── style.css           # Styling
├── game.js             # Game logic and quiz system
├── README.md           # This file
└── pdfjs-dist/         # PDF.js library (auto-included via CDN)
```

## Features for Future Enhancement

- 🤖 AI-powered question generation from PDFs
- 💾 Save student progress and scores
- 🎨 Customizable themes and difficulty levels
- 🏆 Leaderboard system
- 🔊 Sound effects and music
- 📝 Teacher dashboard for creating quizzes
- 🌍 Multi-language support

## Tips for Teachers

1. **Keep lessons concise** - Best with 2-5 minute reading/learning content
2. **Use clear questions** - Multiple choice with one obvious correct answer
3. **Balance difficulty** - Mix easy and challenging questions to maintain engagement
4. **Test before class** - Try the game yourself before sharing with students
5. **Give time limits** - Consider the game a formative assessment tool
6. **Make it fun** - Celebrate students who complete all rounds!

## License

MIT License - Feel free to modify and use in your classroom!

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Create an issue in your GitHub repository

---

**Made with ❤️ for educators and students!**
