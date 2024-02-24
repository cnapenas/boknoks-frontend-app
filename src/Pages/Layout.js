import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function Layout({isAuthenticated,setIsAuthenticated}) {

    const navigate = useNavigate();

    const logout = async () => {
        console.log('Logging out');
        const response = await fetch('http://localhost:3000/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // This is required for sessions to work
        });
    
        if (response.ok) {
          // If the logout was successful, reload the page
          console.log('Logout successful');
          setIsAuthenticated(false);
          navigate('/');
          window.location.reload();
        } else {
          // Handle any errors
          const errorData = await response.json();
            console.error('Error:', errorData);
          console.error('Logout failed');
        }
    };

    const username = "username";


    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/Home">Home</Link>
                    </li>
                    <li>
                        <Link to="/AddNewProduct">Add New Product</Link>
                    </li>
                    <li>
                        <Link to="/AddProductStock">Add Product Stock</Link>
                    </li>
                    <li>
                        <Link to="/EditProductPrice">Edit Product Price</Link>
                    </li>
                    <li>
                        <Link to="/SearchProduct">Search Product</Link>
                    </li>
                    <li>
                        <Link to="/DeleteProduct">Delete Product</Link>
                    </li>
                </ul>
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <label>Welcome, </label>
                    <label>{username}</label>
                    <button onClick={logout}>Logout</button>
                </div>
            </nav>

            <Outlet />
        </>
    );
}
  
  export default Layout;