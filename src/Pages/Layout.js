
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import { useEffect } from 'react';
import { useState } from 'react';


function Layout({isAuthenticated,setIsAuthenticated}) {

    const navigate = useNavigate();
    const location = useLocation();
    const { usr } = useContext(UserContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || usr);
  

     // Store usrnme in localStorage whenever it changes
     useEffect(() => {
        if (usr) {
            console.log('Storing user in localStorage: ' + usr.username);
            localStorage.setItem('user', JSON.stringify(usr));
            setUser(usr);
        }

        
    }, [usr]);

    const logout = async () => {
        console.log('Logging out');
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/logout', {
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

    // Retrieve username from localStorage
    
    console.log('User: ' + user.username);
    console.log('User type: ' + user.userType)


    return (
        <>
            <nav className='"navbar"'>
                <div className='user-info'>
                    <label>Welcome, </label>
                    <label>{user.username}</label>
                    <button onClick={logout}>Logout</button>
                </div>
                <ul className='nav-links'>
                    <li>
                        <Link to="/Home">Home</Link>
                    </li>
                    <li>
                        <Link to="/AddNewProduct">Add New Product</Link>
                    </li>
                    <li>
                        <Link to="/AddProductStock">Add Product Stock</Link>
                    </li>
                    {user.userType === 'admin' && (
                        <>
                    <li>
                        <Link to="/EditProductPrice">Edit Product Price</Link>
                    </li>
                    <li>
                        <Link to="/SearchProduct">Search Product</Link>
                    </li>
                    <li>
                        <Link to="/DeleteProduct">Delete Product</Link>
                    </li>
                    <li>
                        <Link to="/SalesReport">Sales Report</Link>
                    </li>
                    </>
                    )
                    }
                    <li>
                        <Link to="/BuyProduct">Buy</Link>
                    </li>
                   
                </ul>
               
            </nav>

            <Outlet />
        </>
    );
}
  
  export default Layout;