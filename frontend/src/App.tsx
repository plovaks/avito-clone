import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import FormPage from './pages/FormPage/FormPage'
import ItemPage from './pages/ItemPage/ItemPage'
import ListPage from './pages/ListPage/ListPage'
import './App.css'


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/list" replace/>}/>
        <Route path="/form" element={<FormPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
