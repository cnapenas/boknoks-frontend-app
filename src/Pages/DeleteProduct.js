import { set } from 'mongoose';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';


const DeleteProduct = () => {

    const [totalQty, setTotalQty] = useState(0);
    
    const [pCode, setPCode] = useState('');
    const [prodList, setProdList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [updatedData, setUpdatedData] = useState({
        productQty: 0
    });
    const [qtyArray, setQtyArray] = useState([]);
    const [priceArray, setPriceArray] = useState([]);
    const [pCodeArray, setPCodeArray] = useState([]);

    const fetchData = async (setProdList) => 
        {
           
           fetch('http://localhost:3001/getProducts', {
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
           setProdList([]);
           });
  
           
        };

    useEffect(() => {
        fetchData(setProdList);
     }, []);

     const handleSelectChange = (event) => {
        const newSelectedIndex = event.target.selectedIndex;
        reloadItems(newSelectedIndex);
     }

     const reloadItems = (selIndex) => {
        fetchData(setProdList);
        setSelectedIndex(selIndex);
        const qtyArray = prodList.map((item, index) => item.productQty);
        const priceArray = prodList.map((item, index) => item.productPrice);
        const pCodeArray = prodList.map((item, index) => item.productCode);
        setPCodeArray(pCodeArray);
        setQtyArray(qtyArray);
        setPriceArray(priceArray);
        setPCode(pCodeArray[selIndex]);
    }


     const deleteProduct = () => {
        console.log("pCode: ", pCode);
      
        fetch(`http://localhost:3001/deleteProduct/${pCode}`, {
        method: "delete",
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
            alert("Product deleted succesfully");
            reloadItems();
         
            
           
        })
        .catch(error => {
        console.error('There was a problem with the fetch operation: ', error);
        });
     }


    return (
        <>
        <h1>Delete Product</h1>
        <hr /> 
            <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                <tbody>
                <tr style={{ border: '1px solid black' }}> 
                    <th style={{ border: '1px solid black' }}>Product Name</th>
                    <th style={{ border: '1px solid black' }}>Qty</th>
                    <th style={{ border: '1px solid black' }}>Price</th>
                    
                    
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
                    <label>{qtyArray.length > selectedIndex ? qtyArray[selectedIndex] : (prodList.length > 0 ? prodList[0].productQty : 'Loading...')}</label>
                    </td>
                   
                    <td style={{ border: '1px solid black' }}>
                    <label>{priceArray.length > selectedIndex ? priceArray[selectedIndex] : (prodList.length > 0 ? prodList[0].productPrice : 'Loading...')} </label>
                    </td>
                </tr>
                </tbody>
            </table>

            <Button variant="primary" style={{ marginTop: '20px' }} onClick={deleteProduct}>
            Delete
            </Button>
      </>
    );
}
export default DeleteProduct;