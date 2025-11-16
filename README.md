# 🍽️ Meta-Meal Frontend

Frontend application cho Meta-Meal - Nền tảng Quản lý Dinh dưỡng & Kế hoạch Ăn uống Thông minh.

## 📋 Tổng quan

Frontend được xây dựng với React 18 + Vite, cung cấp giao diện người dùng hiện đại, responsive và tối ưu cho trải nghiệm quản lý dinh dưỡng toàn diện.

### ✨ Tính năng chính

- 🏠 **Dashboard**: Tổng quan sức khỏe và dinh dưỡng
- 🍳 **Recipe Management**: Tìm kiếm, tạo, chỉnh sửa công thức nấu ăn
- 🤖 **AI Consultation**: Chat với AI chuyên gia dinh dưỡng (RAG)
- 📅 **Meal Planner**: Lập kế hoạch bữa ăn với drag & drop
- 🎯 **Goals & Progress**: Đặt mục tiêu và theo dõi tiến trình
- 🏆 **Challenges**: Tham gia thử thách dinh dưỡng
- 📝 **Blog & Community**: Chia sẻ công thức và kiến thức
- 💬 **Real-time Chat**: Nhắn tin trực tiếp với Socket.IO
- 👤 **User Profile**: Quản lý thông tin cá nhân
- 💳 **Subscription**: Nâng cấp Premium qua PayPal
- 👑 **Admin Dashboard**: Quản lý hệ thống (Admin only)

## 🏗️ Kiến trúc

```
Front-End/
├── src/
│   ├── apis/                  # API service layer
│   │   ├── auth.js
│   │   ├── recipe.js
│   │   ├── mealplan.js
│   │   ├── challenge.js
│   │   ├── blog.js
│   │   ├── admin.js
│   │   └── ...
│   │
│   ├── components/            # React components
│   │   ├── admin/            # Admin components (21)
│   │   ├── ai/               # AI chat interface (11)
│   │   ├── auth/             # Auth routes & protection
│   │   ├── blog/             # Blog components (11)
│   │   ├── Challenge/        # Challenge system (13)
│   │   ├── MealPlan/         # Meal planning (4)
│   │   ├── Message/          # Real-time chat (5)
│   │   ├── Progress/         # Progress tracking (10)
│   │   ├── Recipe/           # Recipe components (18)
│   │   ├── Notifications/    # Push notifications (2)
│   │   ├── User/             # User profile (6)
│   │   ├── layout/           # Layout components (5)
│   │   └── ...               # Other components
│   │
│   ├── pages/                 # Page components (45 pages)
│   │   ├── Home.jsx
│   │   ├── RecipeDetail.jsx
│   │   ├── AIConsultation.jsx
│   │   ├── MealPlanner.jsx
│   │   ├── ChallengeDetail.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ...
│   │
│   ├── context/               # React Context
│   │   ├── AuthContext.jsx   # Authentication state
│   │   ├── SocketContext.jsx # Socket.IO connection
│   │   ├── ThemeContext.jsx  # Dark/Light mode
│   │   └── useAuth.js        # Auth hooks
│   │
│   ├── routes/                # Route configuration
│   │   └── routes.jsx        # React Router setup
│   │
│   ├── services/              # Frontend services
│   │   ├── emailService.js
│   │   ├── geminiAI.js       # Client-side AI
│   │   └── messageService.js
│   │
│   ├── utils/                 # Utility functions
│   │   ├── constants.js      # API URLs, constants
│   │   ├── apiHelper.js      # Axios instance
│   │   ├── authUtils.js      # Auth helpers
│   │   ├── nutritionHelper.js
│   │   ├── premium.js        # Premium features
│   │   └── utils.js
│   │
│   ├── data/                  # Static data
│   │   ├── challenges.json
│   │   ├── mealData.json
│   │   └── ...
│   │
│   ├── assets/                # Images, icons
│   │   ├── icon.svg
│   │   ├── guest.png
│   │   └── ...
│   │
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
│
├── public/
│   └── vite.svg
│
├── package.json
├── vite.config.js
└── vercel.json                # Vercel deployment
```

## 🛠️ Tech Stack

### Core
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0
- **Routing**: React Router DOM 7.9.3
- **Language**: JavaScript (ES6+)

### UI Libraries
- **CSS Framework**: Tailwind CSS 4.1.14
- **Component Library**: 
  - Ant Design 5.27.4
  - React Bootstrap 5.3.1
  - Bootstrap 5.3.1
- **Icons**: 
  - React Icons 5.5.0
  - Lucide React 0.545.0
  - @iconify/react 6.0.2
- **Animation**: Framer Motion 12.23.24

### State Management
- **Context API**: Auth, Socket, Theme contexts
- **Local Storage**: js-cookie 3.0.5

### Data Visualization
- **Charts**: 
  - Chart.js 4.5.1
  - React Chart.js 2 5.3.0
  - Recharts 3.4.1

### Real-time
- **WebSocket**: Socket.IO Client 4.8.1

### Drag & Drop
- **Library**: @dnd-kit (core, sortable, utilities)

### HTTP Client
- **Axios**: 1.12.2 (API requests)

### Authentication
- **Google OAuth**: @react-oauth/google 0.12.2
- **Google Auth Library**: 10.5.0

### AI Integration
- **Gemini AI**: @google/generative-ai 0.24.1

### Email
- **EmailJS**: @emailjs/browser 4.4.1

### Markdown
- **React Markdown**: 10.1.0
- **Remark GFM**: 4.0.1 (GitHub Flavored Markdown)

### Development Tools
- **Linter**: ESLint 9.36.0
- **PostCSS**: Autoprefixer, Tailwind

## 🚀 Quick Start

### 1. Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Backend server running (http://localhost:7860)

### 2. Installation

```bash
# Navigate to frontend directory
cd Front-End

# Install dependencies
npm install
```

### 3. Configuration

Cập nhật file `src/utils/constants.js`:

```javascript
// Development
export const baseUrl = "http://localhost:7860";

// Production
// export const baseUrl = "https://toan215-meta-meal.hf.space";

// Google OAuth Client ID
export const GOOGLE_CLIENT_ID = "your_google_client_id.apps.googleusercontent.com";

// API endpoints
export const apiUrls = {
  // ... (đã có sẵn trong file)
};
```

### 4. Run Development Server

```bash
npm run dev
```

Application sẽ chạy tại: `http://localhost:5173`

### 5. Build for Production

```bash
# Build
npm run build

# Preview production build
npm run preview
```

## 📡 API Integration

### Axios Instance (`utils/apiHelper.js`)

```javascript
import axios from 'axios';
import { baseUrl } from './constants';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Services Example (`apis/recipe.js`)

```javascript
import apiClient from '../utils/apiHelper';
import { apiUrls } from '../utils/constants';

export const getAllRecipes = async (params) => {
  const response = await apiClient.get(apiUrls.getAllRecipes, { params });
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await apiClient.get(`${apiUrls.getRecipeById}/${id}`);
  return response.data;
};

export const createRecipe = async (formData) => {
  const response = await apiClient.post(apiUrls.createRecipe, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
```

## 🔐 Authentication Flow

### AuthContext (`context/AuthContext.jsx`)

```javascript
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getCurrentUser } from '../apis/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data.user);
    } catch (error) {
      Cookies.remove('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    Cookies.set('token', token, { expires: 7 });
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Protected Routes (`components/auth/ProtectedRoute.jsx`)

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};
```

## 🔌 Real-time Features (Socket.IO)

### SocketContext (`context/SocketContext.jsx`)

```javascript
import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { baseUrl } from '../utils/constants';
import { useAuth } from './useAuth';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(baseUrl);
      
      newSocket.on('connect', () => {
        console.log('Socket connected');
        newSocket.emit('join', user._id);
      });

      newSocket.on('activeUsersUpdate', (users) => {
        setActiveUsers(users);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
```

### Usage in Components

```javascript
import { useContext } from 'react';
import { SocketContext } from '../../context/SocketContext';

function MessageComponent() {
  const { socket } = useContext(SocketContext);

  const sendMessage = (message) => {
    socket.emit('sendMessage', message);
  };

  useEffect(() => {
    socket?.on('receiveMessage', (newMessage) => {
      // Handle incoming message
    });
  }, [socket]);

  return <div>...</div>;
}
```

## 🎨 Styling

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        secondary: '#3b82f6',
      },
    },
  },
  plugins: [],
}
```

### Global Styles (`index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-color: #10b981;
  --secondary-color: #3b82f6;
  --text-color: #1f2937;
  --bg-color: #ffffff;
}

[data-theme="dark"] {
  --text-color: #f9fafb;
  --bg-color: #1f2937;
}
```

## 🧭 Routing Structure

```javascript
// routes/routes.jsx
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/recipes', element: <RecipeList /> },
  { path: '/recipes/:id', element: <RecipeDetail /> },
  { path: '/blogs', element: <BlogList /> },
  { path: '/challenges', element: <ChallengeList /> },

  // Protected routes
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: '/ai-consultation',
    element: <ProtectedRoute><AIConsultation /></ProtectedRoute>
  },
  {
    path: '/meal-planner',
    element: <ProtectedRoute><MealPlanner /></ProtectedRoute>
  },
  {
    path: '/progress',
    element: <ProtectedRoute><ProgressTracking /></ProtectedRoute>
  },

  // Admin routes
  {
    path: '/admin/*',
    element: <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
  },
]);

export default router;
```

## 🤖 AI Features

### AI Chat Component (`pages/AIConsultation.jsx`)

```javascript
import { useState, useEffect } from 'react';
import { chatWithAI, getConversations } from '../apis/ai';

function AIConsultation() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await chatWithAI({
        message,
        conversationId,
      });

      setConversation([...conversation, 
        { role: 'user', content: message },
        { role: 'ai', content: response.response }
      ]);
      
      setConversationId(response.conversationId);
      setMessage('');
    } catch (error) {
      console.error('AI Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Chat UI */}
    </div>
  );
}
```

## 📊 State Management Patterns

### Custom Hooks Example

```javascript
// hooks/useRecipes.js
import { useState, useEffect } from 'react';
import { getAllRecipes } from '../apis/recipe';

export const useRecipes = (filters) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes(filters);
      setRecipes(data.recipes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { recipes, loading, error, refetch: fetchRecipes };
};
```

## 📱 Responsive Design

```javascript
// Responsive component example
function RecipeCard({ recipe }) {
  return (
    <div className="
      w-full
      sm:w-1/2
      md:w-1/3
      lg:w-1/4
      p-4
    ">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold">{recipe.title}</h3>
          <p className="text-sm text-gray-600">{recipe.description}</p>
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Performance Optimization

### Code Splitting

```javascript
import { lazy, Suspense } from 'react';

const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}
```

### Image Optimization

```javascript
// Using Cloudinary transformations
const optimizeImage = (url, width = 400) => {
  if (!url) return '/placeholder.png';
  if (url.includes('cloudinary')) {
    return url.replace('/upload/', `/upload/w_${width},c_scale,f_auto,q_auto/`);
  }
  return url;
};
```

### Memoization

```javascript
import { useMemo, useCallback } from 'react';

function RecipeList({ recipes }) {
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => r.verified);
  }, [recipes]);

  const handleLike = useCallback((id) => {
    // Handle like
  }, []);

  return filteredRecipes.map(recipe => (
    <RecipeCard 
      key={recipe._id} 
      recipe={recipe} 
      onLike={handleLike}
    />
  ));
}
```

## 🚀 Deployment

### Vercel Deployment

```json
// vercel.json
{
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

### Build Optimization

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['antd', 'react-bootstrap'],
          'chart-vendor': ['chart.js', 'recharts'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:7860',
        changeOrigin: true,
      }
    }
  }
});
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Run tests (if configured)
npm test
```

## 📂 Key Components Overview

### Admin Dashboard
- **UserManagement**: Quản lý users
- **SystemStats**: Thống kê hệ thống
- **RecipeManagement**: Duyệt recipes
- **BlogManagement**: Quản lý blogs
- **FeedbackViewer**: Xem feedback

### AI Consultation
- **ChatInterface**: Giao diện chat
- **MessageBubble**: Tin nhắn
- **ConversationHistory**: Lịch sử hội thoại
- **RecipeSuggestions**: Gợi ý công thức từ AI

### Recipe Components
- **RecipeCard**: Card hiển thị recipe
- **RecipeDetail**: Chi tiết recipe
- **RecipeForm**: Form tạo/sửa recipe
- **IngredientList**: Danh sách nguyên liệu
- **NutritionInfo**: Thông tin dinh dưỡng

### Meal Planner
- **Calendar**: Lịch meal plan
- **DragDropMeal**: Drag & drop meals
- **MealSlot**: Slot cho món ăn
- **NutritionSummary**: Tổng dinh dưỡng

### Progress Tracking
- **WeightChart**: Biểu đồ cân nặng
- **NutritionChart**: Biểu đồ dinh dưỡng
- **GoalProgress**: Tiến độ mục tiêu
- **StatCard**: Card thống kê

## 🔧 Environment Variables

Không cần file `.env` riêng, tất cả config trong `src/utils/constants.js`:

```javascript
// Development
export const baseUrl = "http://localhost:7860";

// Production
// export const baseUrl = "https://toan215-meta-meal.hf.space";

export const GOOGLE_CLIENT_ID = "your_client_id";
```

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Common Issues

### 1. CORS Error
```bash
# Backend cần enable CORS cho frontend URL
# Check server.js trong Backend
```

### 2. Socket Connection Failed
```bash
# Check backend Socket.IO server đang chạy
# Verify baseUrl trong constants.js
```

### 3. Google OAuth Error
```bash
# Verify GOOGLE_CLIENT_ID
# Check authorized origins in Google Console
```

### 4. Build Errors
```bash
# Clear cache
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf .vite
```

## 🤝 Contributing

Xem [CONTRIBUTING.md](../CONTRIBUTING.md) để biết thêm chi tiết.

## 📄 License

MIT License - xem [LICENSE](../LICENSE)

## 📞 Support

- Email: support@metameal.com
- GitHub Issues: [Report Issue](https://github.com/yourusername/meta-meal/issues)
- Documentation: [Full Docs](../docs/README.md)

---

<div align="center">

**Made with ❤️ by Meta-Meal Team**

[⬆ Back to top](#-meta-meal-frontend)

</div>