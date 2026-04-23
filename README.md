# ⚡ PromptRaid ⚡

> "Two AI prompts enter. One emerges victorious. Watch them battle visually in real-time."

**PromptRaid** is a high-energy, Neo-Brutalist AI prompt battle arena. Pitting two creative prompts against each other in a head-to-head clash, a real-time Gemini AI judge evaluates the contenders based on creativity, clarity, and impact—delivering aggressive wrestling-style commentary, retro 8-bit sound effects, and dramatic scoring animations to crown the ultimate winner.

Built for hackathons and endless fun.

---

## 🚀 Features

- **⚔️ 1v1 Prompt Battles:** Dual input panels side-by-side for head-to-head prompt warfare.
- **🤖 Real-time AI Judge:** Powered by Google's Gemini Flash model, it scores prompts out of 100 on Creativity, Clarity, and Impact, and delivers savage commentary.
- **🎨 Neo-Brutalist Design:** Bold colors (Hot Red, Vivid Yellow, Soft Violet), thick black borders, hard offset shadows, and aggressive typography (Space Grotesk).
- **🎬 Cinematic Animations:** A 3D rolling text intro, mechanical push-down button physics, and animated score bars using Framer Motion.
- **🎵 Retro 8-bit Audio:** Custom Web Audio API implementation featuring chiptune battle idle music, countdown beeps, clash crashes, and victory fanfares.
- **📱 Fully Responsive:** The arena scales perfectly from desktop to mobile screens.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (v4)
- **Animations:** Motion (`motion/react`)
- **Icons:** Lucide React
- **AI Integration:** `@google/genai` (using `gemini-3-flash-preview`)
- **Audio:** Native HTML5 Web Audio API

---

## 💻 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/PromptRaid.git
   cd PromptRaid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: You can get a free API key from [Google AI Studio](https://aistudio.google.com/))*

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Play!**
   Open your browser and navigate to `http://localhost:3000` (or the port provided by Vite).

---

## 👨‍💻 Built By

**Aditya**
- GitHub: [@adimestry](https://github.com/adimestry)
- Instagram: [@aditya_mestry_x007](https://www.instagram.com/aditya_mestry_x007/)

**Dhruv**
- GitHub: [@dhruvkasar](https://github.com/dhruvkasar)
- Instagram: [@dhruvvkasar](https://www.instagram.com/dhruvvkasar/)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
