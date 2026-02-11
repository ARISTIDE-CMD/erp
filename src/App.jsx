import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { appRoutes } from './route.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
