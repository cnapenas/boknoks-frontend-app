

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';

const EditProductPrice = () => {

    const [newPrice, setNewPrice] = useState(0);
    
    const [pCode, setPCode] = useState('');
    const [prodList, setProdList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [updatedData, setUpdatedData] = useState({
        productPrice: 0
    });
    const [priceArray, setPriceArray] = useState([]);
    const [pCodeArray, setPCodeArray] = useState([]);
    

    const handleSelectChange = (event) => {
        const newSelectedIndex = event.target.selectedIndex;
        setSelectedIndex(newSelectedIndex);
        const priceArray = prodList.map((item, index) => item.productPrice);
        const pCodeArray = prodList.map((item, index) => item.productCode);
        setPCodeArray(pCodeArray);
        setPriceArray(priceArray);
        setPCode(pCodeArray[newSelectedIndex]);
        
        
        
       
    }

    const addPriceChange = (event) => {
        
        setNewPrice(event.target.value);

        setUpdatedData({ productPrice: event.target.value});
      };



   useEffect(() => {
      const fetchData = async () => 
      {
         
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

         // result = await result.json();
         // console.warn(result);
         // if (result) {
         //    alert("Data saved succesfully");
         //    setProdList(result);
         // }

         
      };

      

      fetchData();
   }, []);


   const updateProdPrice= () => {
       
    console.log(updatedData);
    fetch(process.env.REACT_APP_BACKEND_URL+'/updateDataPrice/${pCode}', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => 
        {   console.log(data)
            alert("Data saved succesfully");
        }
    )
    .catch((error) => {
        console.log("pcode" + pCode);
        console.error('Error:', error);
    });

        // result = await result.json();
        // console.warn(result);
        // if (result) {
        //    alert("Data saved succesfully");
        //    setProdList(result);
        // }
    };
    
    return (

        <>
        <h1>Edit Product Price</h1>
        <hr /> 
            <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                <tbody>
                <tr style={{ border: '1px solid black' }}> 
                    <th style={{ border: '1px solid black' }}>Product Name</th>
                    <th style={{ border: '1px solid black' }}>Current Price</th>
                    <th style={{ border: '1px solid black' }}>New Price</th>
                    
                    
                </tr>
                <tr style={{ border: '1px solid black' }}>
                    <td style={{ border: '1px solid black' }}>
                    <select onChange={handleSelectChange} >
                   
                    {prodList.map((item, index) => (
                        <option key={index} value={item.productName}>
                            {item.productName}
                            
                        </option>
                        ))}
                      
                    </select>
                    </td>
                    
                    <td style={{ border: '1px solid black' }}>
                    <label>{priceArray.length > selectedIndex ? priceArray[selectedIndex] : (prodList.length > 0 ? prodList[0].productPrice : 'Loading...')}</label>
                    </td>
                    <td style={{ border: '1px solid black' }}>
                    <input type="text" placeholder="Enter text here" value={newPrice} onChange={addPriceChange} />
                    </td>
                   
                </tr>
                </tbody>
            </table>

            <Button variant="primary" style={{ marginTop: '20px' }} onClick={updateProdPrice}>
            Submit
            </Button>
      </>
    );
  };
  
  export default EditProductPrice;