
import './App.css';
import React from 'react';
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import AddNewProduct from './Pages/AddNewProduct';
import NoPage from './Pages/NoPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddProductStock from './Pages/AddProductStock';
import EditProductPrice from './Pages/EditProductPrice';
import SearchProduct from './Pages/SearchProduct';
import DeleteProduct from './Pages/DeleteProduct';
import LoginForm from './Pages/Login'; 
import { useState } from 'react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);


  return (
    
    <BrowserRouter>
      <Routes>
      <Route index="/" element={<LoginForm setIsAuthenticated = {setIsAuthenticated} />} /> {/* Add this line */}
      <Route path="/" element={<Layout setIsAuthenticated = {setIsAuthenticated} />}>
          <Route path ="home" element={<Home />} />
          <Route path="addnewproduct" element={<AddNewProduct />} />
          <Route path="addproductstock" element={<AddProductStock />} />
          <Route path="editproductprice" element={<EditProductPrice />} />
          <Route path="searchproduct" element={<SearchProduct />} />
          <Route path="deleteproduct" element={<DeleteProduct />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


