# FlowMate: Your On-the-Go Learning & Productivity Hub

## Make every commute count

### FlowMate Onboarding Screen

<img src="https://github.com/user-attachments/assets/369bdd75-eb9d-4fc8-91a5-2dedd50fec02" width="400" />

## 💡 Inspiration
We created FlowMate to solve a common problem: using commute time effectively. Many people spend hours a week in transit that could be used for personal growth. The goal of FlowMate is to transform this idle time into a productive learning and wellness experience. By integrating bite-sized educational content, mindfulness exercises, and a gamified community system, FlowMate helps users achieve their personal and professional goals one commute at a time.

## ✨ Features
* **Personalized Onboarding**: A user-friendly setup process to tailor content recommendations based on individual goals and age.
* **Adaptive Content Library**: A diverse library of podcasts, meditations, and learning lessons. The content is filtered based on the user's age and interests, ensuring a relevant and engaging experience.
* **Gamified Learning**: Motivate yourself with a daily streak and point system. Complete tasks, listen to lessons, and earn points to level up and unlock badges.
* **Community & Leaderboard**: Connect with like-minded individuals in interest-based communities. Share progress, chat, and compete on a global leaderboard to foster a sense of friendly competition.
* **Interactive AI Assistant**: An integrated AI chatbot powered by the **Gemini API** provides on-demand support. Ask for study tips, explanations on complex topics, or personalized learning path suggestions.
* **Generative Audio Player**: The core of FlowMate. It uses the **Gemini API's Text-to-Speech (TTS) functionality** to generate and play audio content for any article or lesson. This feature makes learning truly hands-free.
* **Dark & Light Mode**: A sleek, modern user interface with a pitch-dark mode to reduce eye strain, especially during early morning or late-night commutes.

## ⚙️ Technology Stack
* **Frontend**: React.js with a component-based architecture for a dynamic and responsive user interface.
* **Styling**: Tailwind CSS for a utility-first approach to rapid and consistent UI design.
* **Icons**: [Lucide React](https://lucide.dev/) for a clean, customizable icon set.
* **Backend & AI**: Google's **Gemini API** for AI chat and Text-to-Speech generation.
* **State Management**: React's `useState` and `useEffect` hooks for simple, effective state management.

## 🚀 How to Run the Project
1.  Clone the repository:
    ```bash
    git clone [Your Repository URL]
    ```
2.  Navigate to the project directory:
    ```bash
    cd flowmate
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Add your Gemini API key to the code. You can find the placeholder in the `App.jsx` file:
    ```javascript
    // App.jsx
    const apiKey = "YOUR_GEMINI_API_KEY";
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```
6.  Open your browser and navigate to `http://localhost:5173` to see the app in action!


## 🔮 Future Enhancements
* Integrate user-specific analytics to track progress and identify learning patterns.
* Add notifications and reminders to maintain streaks and encourage daily use.
* Expand the content library with more categories and personalized tracks.
* Implement a full backend to save user data, streaks, and points across sessions.
