import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import About from './compants/about';
import Article from './compants/article';
import Categories from './compants/categories';
import Drafts from './compants/drafts';
import Home from './compants/home';
import Login from './compants/login';
import NewPost from './compants/newPost';
import Profil from './compants/profil';
import Signup from './compants/singup';
import { ThemeProvider } from './compants/theme';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/home', element: <Home /> },
  { path: '/categories', element: <Categories /> },
  { path: '/drafts', element: <Drafts /> },
  { path: '/about', element: <About /> },
  { path: '/article/:slug', element: <Article /> },
  { path: '/login', element: <Login /> },
  { path: '/new-post', element: <NewPost /> },
  { path: '/profile', element: <Profil /> },
  { path: '/profil', element: <Profil /> },
  { path: '/signup', element: <Signup /> },
]);

function App() {
  return (
    <ThemeProvider><div className="App"><RouterProvider router={router} /></div></ThemeProvider>
  );
}

export default App;