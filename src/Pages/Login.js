import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';




const LoginForm = ({isAuthenticated,setIsAuthenticated}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);



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
        setIsLoading(true);
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/loginv2', {
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
            const usrnme = data.user;
            const { setUsrnme } =userContext;
            setUsrnme(usrnme);
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
    } finally {
        setIsLoading(false);
    }

   
}

const handleRegister = async (event) => {
       
    event.preventDefault();
    try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/register', {
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



// return (
//     <div>
//       {isAuthenticated ? (navigate('/Home')) : (
//         <form>
//           <label>
//             Username:
//             <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//           </label>
//           <label>
//             Password:
//             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//           </label>
//           <button type="button" onClick={handleLogin}>Log in</button>
//           <button type="button" onClick={handleRegister}>Register</button>
//         </form>
//       )}
//     </div>
//   );

return (
  <div className="container">
     <Modal show={isLoading} dialogClassName="centered-modal">
        <Modal.Header />
        <Modal.Body className="text-center">
        Loading.....
        </Modal.Body>
    </Modal>
    {isAuthenticated ? (navigate('/Home')) : (

    <form className="form-signin">
      <h2 className="form-signin-heading">Please sign in</h2>
      <label htmlFor="inputUsername" className="sr-only">Username</label>
      <input type="text" id="inputUsername" className="form-control" placeholder="Username" required autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
      <label htmlFor="inputPassword" className="sr-only">Password</label>
      <input type="password" id="inputPassword" className="form-control" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-lg btn-primary btn-block" style={{ marginTop: '20px' }} type="button" onClick={handleLogin}>Log in</button>
      <button className="btn btn-lg btn-secondary btn-block" style={{ marginTop: '20px' }} type="button" onClick={handleRegister}>Register</button>
    </form>
  )}
</div>
);
}

export default LoginForm;