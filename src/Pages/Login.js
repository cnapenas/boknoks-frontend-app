import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';




const LoginForm = ({isAuthenticated,setIsAuthenticated}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();



const handleLogin = async (event) => {
   
    event.preventDefault();
    // try {
    //     const response = await fetch('http://localhost:3000/login', {
    //     method: "post",
    //     headers: {
    //        'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ username, password })
    //     });
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
       
    //     // If login is successful, set isAuthenticated to true and navigate to the home page
    //     setIsAuthenticated(true);
    //     // If login is successful, navigate to the home page
    //     navigate('/Home');
    // } catch (error) {
    //   // Handle error here
    //   console.log(error);
    // }

    try {
        const response = await fetch('http://localhost:3000/loginv2', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
        } else {
            // handle successful response...
            const data = await response.json();
            console.log('Login successful json' + data);
            console.log('Login successful user' + data.user);
            setIsAuthenticated(true);
            navigate('/Home');
        }
    
        // handle response...
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            console.log('Cannot connect to the server. Please check if the server is running.');
        } else {
            console.log(error);
        }
    }

   
}

const handleRegister = async (event) => {
       
    event.preventDefault();
    try {
            const response = await fetch('http://localhost:3000/register', {
            method: "post",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
       }
       const data = await response.json();
       console.log(data);
       alert("User registered successfully");
    } catch (error) {
      // Handle error here
      alert(error);
      console.log(error);
    }

    
}



return (
    <div>
      {isAuthenticated ? (navigate('/Home')) : (
        <form>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="button" onClick={handleLogin}>Log in</button>
          <button type="button" onClick={handleRegister}>Register</button>
        </form>
      )}
    </div>
  );
}

export default LoginForm;