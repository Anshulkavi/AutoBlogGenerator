# 🧠 Auto Blog Generator

An AI-powered web application that generates SEO-friendly blogs automatically using Gemini AI and Hugging Face, complete with intelligently matched images. Built with **FastAPI + React**, this tool helps you write, preview, and manage blog posts instantly with a ChatGPT-like experience.

---

## 🚀 Features

- ✍️ **Auto Blog Generation** with just a topic  
- 📄 **Markdown-formatted Content**  
- 🖼️ **Auto Image Matching** (or Google Images fallback)  
- 📚 **Blog History** sidebar with persistent storage  
- 🧠 **Modern UI** inspired by ChatGPT  
- 🔁 Refresh-safe sidebar state & history  
- 💡 **Manual + trending topic support** (future feature)

---

## 🛠 Tech Stack

| Frontend | Backend | AI/ML | Other |
|----------|---------|-------|-------|
| React + Vite | FastAPI | Gemini 1.5 Flash | Tailwind CSS |
| React Markdown | Pydantic | Hugging Face / Replicate | Dotenv |

---

## 📸 Screenshots

> Coming soon — you can add your own UI screenshots here.

---

## ⚙️ Setup Instructions

### 1. 📦 Clone the repository

```bash
git clone https://github.com/your-username/auto-blog-generator.git
cd auto-blog-generator
```

---

### 2. 🧪 Backend (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate    # On Windows
source venv/bin/activate # On macOS/Linux

pip install -r requirements.txt
```

#### Create `.env` in `backend/`:

```
GOOGLE_API_KEY=your_google_gemini_api_key
REPLICATE_API_TOKEN=your_replicate_token (optional if not used)
```

#### Run FastAPI server:
```bash
uvicorn app.main:app --reload
```

---

### 3. 🎨 Frontend (React + Vite)

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| POST   | `/api/generate_blog` | Generate a blog + image |

Request Body:
```json
{
  "topic": "Your blog topic here"
}
```

---

## 📁 Project Structure

```
auto-blog-generator/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
├── README.md
├── .gitignore
```

---

## ✨ Future Plans

- 🔍 Fetch trending blog topics from Google News/Reddit
- 🧠 Use OpenAI or Claude as fallback model
- 📤 Auto-publish blogs to Medium/WordPress via API
- 📈 Integrate Google Search Console for SEO tracking
- 🌗 Dark mode and mobile-friendly UI

---

## 🙌 Credits

- [Gemini by Google](https://ai.google.dev/)
- [Hugging Face Inference API](https://huggingface.co/inference-api)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)

---

## 📄 License

MIT License. Free to use, modify, and deploy ✨

---

## 🌟 Star this repo if you find it helpful!