# 📚 Educational Snake Game - Teacher Dashboard Edition

An interactive educational gaming platform that combines a classic snake game with lesson-based quizzes. Teachers create lessons with custom questions, and students play the game with those specific questions.

## 🎯 Features

✨ **Key Features:**
- 👨‍🏫 **Teacher Dashboard** - Create lessons and upload PDF content
- 🐍 **Snake Game Mechanics** - Students collect books to earn the right to answer questions
- 📋 **Custom Questions** - Teachers add multiple-choice questions
- 📊 **Progress Tracking** - Collect 20 books over 4 rounds
- 🔗 **Share Links** - Generate unique lesson codes for students
- 📱 **Responsive Design** - Works on desktop and mobile
- 💾 **Browser Storage** - Lessons stored locally (no backend needed)
- 🌐 **GitHub Pages Ready** - Host directly from your repository

## 🚀 How It Works

### For Teachers:
1. Go to **Teacher Dashboard** (teacher.html)
2. Enter lesson name and description
3. Optionally upload a lesson PDF
4. Add 4 multiple-choice questions
5. Click **Create Lesson**
6. Copy the **Share Link** and send to students

### For Students:
1. Click on the link sent by the teacher
2. Or enter the lesson code on the home page
3. Play the snake game to collect books
4. After 5 books, answer a lesson question
5. Continue until 20 books are collected
6. See final accuracy score

## 📄 File Structure

```
educational-snake-game/
├── index.html          # Home page - choose role
├── teacher.html        # Teacher dashboard
├── game.html           # Student game page
├── game.js             # Game logic
├── teacher.js          # Teacher dashboard logic
├── shared.js           # Shared utilities & storage
├── style.css           # All styling
└── README.md          # This file
```

## 🌐 Deployment to GitHub Pages

### Step 1: Go to Repository Settings
- Navigate to `https://github.com/yourusername/escape/settings`

### Step 2: Enable GitHub Pages
1. Click **Pages** in the left sidebar
2. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `teacher-dashboard`
   - **Folder**: Select `/ (root)`
3. Click **Save**

### Step 3: Wait for Deployment
- GitHub will build and deploy (takes ~1-2 minutes)
- You'll see a green checkmark when complete

### Step 4: Access Your Game
- Your game is now at: `https://yourusername.github.io/escape/`

## 📖 Usage Guide

### Creating a Lesson (For Teachers)

1. **Open Teacher Dashboard**
   - Go to `https://yourusername.github.io/escape/`
   - Click **"I'm a Teacher"** → **Teacher Dashboard**

2. **Fill in Lesson Details**
   - **Lesson Name**: e.g., "Biology 101 - Photosynthesis"
   - **Description**: Brief overview of the lesson

3. **Add Questions**
   - Click **"+ Add Question"**
   - Enter the question text
   - Fill in 4 answer options
   - Select which option is correct (radio button)
   - Repeat for 4 total questions

4. **Create Lesson**
   - Click **"Create Lesson"**
   - You'll see a unique lesson code (e.g., LESSON-ABC123)

5. **Share with Students**
   - Copy the full share link shown under your lesson
   - Send via email, chat, or paste in a document
   - Share just the lesson code if preferred

### Playing the Game (For Students)

**Using a Share Link:**
- Click the link sent by teacher
- Game loads with the teacher's questions
- Start playing!

**Using Lesson Code:**
- Go to home page
- Enter lesson code in the student section
- Click **Play Game**

**Game Controls:**
- **Arrow Keys** or **WASD** - Move snake
- **Pause Button** - Pause/resume game
- **Quiz Screen** - Click to select answer, click Submit

## 🎮 Game Mechanics

**Objective:** Collect 20 books total

**Process:**
1. Collect 5 books (red squares) in the snake game
2. Answer a lesson question correctly
3. Return to game to collect 5 more books
4. Repeat 4 times (4 rounds × 5 books = 20 books)
5. See your final accuracy score

**Scoring:**
- Books collected toward total (20 goal)
- Questions answered correctly
- Final accuracy percentage

## 🔄 Managing Lessons

### View All Lessons
- Go to Teacher Dashboard
- Scroll to "Active Lessons" section
- See all your created lessons

### Copy Share Link
- In Teacher Dashboard, click **"📋 Copy Share Link"**
- Link is automatically copied to clipboard

### Delete a Lesson
- In Teacher Dashboard, click **"🗑️ Delete"** on any lesson
- Confirm deletion (cannot be undone)

## 💾 Data Storage

- **Lessons** are stored in your browser's local storage
- **No backend** or server required
- Data persists across sessions
- Each browser/device has separate storage
- To backup lessons: Export browser data or take screenshots

## ⚙️ Customization

### Change Game Settings
Edit `game.js` line 1-10:
```javascript
this.totalBooks = 20;        // Total books to collect
this.totalRounds = 4;        // Number of unique questions
this.gameSpeed = 100;        // Snake speed (lower = faster)
```

### Change Colors
Edit `style.css` top section:
```css
:root {
    --primary-color: #4a90e2;  /* Main blue */
    --success-color: #52c41a;  /* Green */
    --danger-color: #f5222d;   /* Red */
}
```

## 🐛 Troubleshooting

### Game won't load
- Clear browser cache (Ctrl+Shift+Del)
- Try a different browser
- Ensure you're using a modern browser

### Can't find lesson code
- Go back to Teacher Dashboard
- Scroll to "Active Lessons"
- Check the lesson code there
- Copy the share link instead

### Lessons disappeared
- Lessons are stored per browser/device
- Check if you're using a different browser
- Check if you cleared browser data
- Try logging out/in if using cloud sync

### Questions not showing during game
- Make sure lesson was created successfully
- Check that at least 4 questions were added
- Try deleting and recreating the lesson

## 🎓 Tips for Teachers

1. **Test First** - Try a lesson yourself before sharing with students
2. **Keep Questions Clear** - Use simple, unambiguous language
3. **Balance Difficulty** - Mix easy and harder questions
4. **Lesson Length** - Best for 5-15 minute lessons
5. **Engagement** - Celebrate students who complete all rounds!
6. **Review Answers** - Ask students about their wrong answers
7. **Archive Lessons** - Delete old lessons you no longer use

## 📚 Example Lessons

### History Lesson
- Questions about a historical event
- Multiple choice about dates, figures, outcomes

### Math Lesson
- Arithmetic or algebra problems
- Word problems with multiple solutions

### Language Arts
- Vocabulary questions
- Reading comprehension
- Grammar rules

### Science
- Concept understanding
- Process identification
- Data interpretation

## 🔒 Privacy

- **No user accounts** - No personal data collected
- **No backend** - Everything stored locally
- **No tracking** - No analytics or ads
- **Safe for students** - COPPA compliant

## 🚀 Future Features

- ✨ Export student results/scores
- ✨ Time limits per question
- ✨ Image support in questions
- ✨ Difficulty levels
- ✨ Leaderboard/rankings
- ✨ Sound effects
- ✨ Multiple game modes

## 📝 License

MIT License - Feel free to modify and use in your classroom!

## 💬 Support

For issues:
1. Check Troubleshooting section
2. Review code comments
3. Create an issue on GitHub

---

**Made with ❤️ for educators and students!**
