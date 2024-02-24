import React, { useEffect, useState } from 'react';


const Home = () => {
   const [prodList, setProdList] = useState([]);
   

   useEffect(() => {
      const fetchData = async () => {
        


         fetch(process.env.REACT_APP_BACKEND_URL+'/getProducts', {
         method: "get",
         headers: {
            'Content-Type': 'application/json'
         }
         })
         .then(response => {
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
            return response.json();
         })
         .then(data => {
         // Your code here
       
            if (data) {
               console.log("Data retrieved succesfully");
               
               setProdList( data);
            }
     
         })
         .catch(error => {
         console.error('There was a problem with the fetch operation: ', error);
         });

         
      };

      

      fetchData();
   }, []);

   return (
      <>
         <h1>Products</h1>
         <hr />
         {prodList.length > 0 && (
            <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ border: '1px solid black' }}> 
                     <th style={{ border: '1px solid black' }}>Product Code</th>
                     <th style={{ border: '1px solid black' }}>Product Name</th>
                     <th style={{ border: '1px solid black' }}>Product Qty</th>
                     <th style={{ border: '1px solid black' }}>Product Price</th>
                  </tr>
               </thead>
               <tbody>
                  {prodList.map(item => { 
                      
                     return (
                     <tr style={{ border: '1px solid black' }}>
                        <td style={{ border: '1px solid black' }}>{item.productCode}</td>
                        <td style={{ border: '1px solid black' }}>{item.productName}</td>
                        <td style={{ border: '1px solid black' }}>{item.productQty}</td>
                        <td style={{ border: '1px solid black' }}>{item.productPrice}</td>
                     </tr>
                  );
                      } )}
               </tbody>
            </table>
         )}
      </>
   );
};




export default Home;


