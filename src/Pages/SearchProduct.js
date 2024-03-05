import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';

const  SearchProduct = () => {      

    const [prodList, setProdList] = useState([]);
    const [pCode, setPCode] = useState(' ');
    const [pName, setPName] = useState(' ');


    const fetchData = useCallback ((pCode, pName,setProdList)  => 
    {
     
        if (!pName || pName.trim() === '') {
            setPName('empty');
        }
        if (!pCode || pCode.trim() === '') {
            setPCode('empty');
        }
        console.log("pCode: ", pCode);
        console.log("pName: ", pName);
        fetch(process.env.REACT_APP_BACKEND_URL+`/getProductWithProductCodeAndName/${pCode}/${pName}`, {
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
              console.log("prodList: ", prodList);
           }
    
        })
        .catch(error => {
        console.error('There was a problem with the fetch operation: ', error);
        setProdList([]);
        });
        
     }, []);

     useEffect(() => {
        fetchData(pCode, pName, setProdList);
      }, [fetchData, pCode, pName, setProdList]);

    const productCodeEntered = (event) => {
        setPCode(event.target.value);
        fetchData(pCode, pName, setProdList);
    }   

    const productNameEntered = (event) => {
        setPName(event.target.value);
        fetchData(pCode, pName, setProdList);
    }

    const handleBlurPName = (event) => {
        console.log('Input field lost focus');
        // Your code here
        setPName(event.target.value);
        fetchData(pCode, pName, setProdList);
    }
    
    const handleKeyPressPName = (event) => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed');
            // Your code here
            setPName(event.target.value);
            fetchData(pCode, pName, setProdList);
        }
    }

    const handleBlurPCode = (event) => {
        console.log('Input field lost focus');
        // Your code here
        setPCode(event.target.value);
        if (pName === '') {
            setPName('x');
        }
        fetchData(pCode, pName, setProdList);
    }
    
    const handleKeyPressPCode = (event) => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed');
            // Your code here
            setPCode(event.target.value);
            fetchData(pCode, pName, setProdList);
        }
    }


  return (
    <>
         <h1>Search Product</h1>
         <hr />
         <div>
            <div className="input-group">
                <label htmlFor="myTextField2">Enter Product Name: </label>
                <input id="myTextField2" type="text" placeholder="Enter text here"  onChange={productNameEntered} onBlur={handleBlurPName} onKeyPress={handleKeyPressPName} />
            </div>
            <div className="input-group">
                <label htmlFor="myTextField1">Enter Product Code: </label>
                <input id="myTextField1" type="text" placeholder="Enter text here"  onChange={productCodeEntered} onBlur={handleBlurPCode} onKeyPress={handleKeyPressPCode}/>
            </div>
         {prodList.length > 0 && (
            <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
               <tr style={{ border: '1px solid black' }}> 
               
                  <th style={{ border: '1px solid black' }}>Product Code</th>
                  <th style={{ border: '1px solid black' }}>Product Name</th>
                  <th style={{ border: '1px solid black' }}>Product Qty</th>
                  <th style={{ border: '1px solid black' }}>Product Price</th>
               </tr>
               {prodList.map(item=> (
                  <tr style={{ border: '1px solid black' }}>
                    
                     <td style={{ border: '1px solid black' }}>{item.productCode}</td>
                     <td style={{ border: '1px solid black' }}>{item.productName}</td>
                     <td style={{ border: '1px solid black' }}>{item.productQty}</td>
                     <td style={{ border: '1px solid black' }}>{item.productPrice}</td>
                  </tr>
               ))}
            </table>
         )}
         </div>
      </>
  );
}

export default SearchProduct;