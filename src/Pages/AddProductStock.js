
import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Scanner from './Scanner';


const AddProductStock = () => {
    
    const [totalQty, setTotalQty] = useState(0);
    
    const [pCode, setPCode] = useState('');
    const [prodList, setProdList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [updatedData, setUpdatedData] = useState({
        productQty: 0
    });
    const [qtyArray, setQtyArray] = useState([]);
    const [pCodeArray, setPCodeArray] = useState([]);

    const [modal, setModal] = useState(false);
    const [scanSuccess, setScanSuccess] = useState(false);
    const [scanCode, setScanCode] = useState('');
    const [results, setResults] = useState(null);
    const inputRef = useRef();

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
    

    const handleSelectChange = (event) => {
        fetchData();
        
        const newSelectedIndex = event.target.selectedIndex;
        setSelectedIndex(newSelectedIndex);
        const qtyArray = prodList.map((item, index) => item.productQty);
        const pCodeArray = prodList.map((item, index) => item.productCode);
        setPCodeArray(pCodeArray);
        setQtyArray(qtyArray);
        setPCode(pCodeArray[newSelectedIndex]);
        setTotalQty(qtyArray[newSelectedIndex] + Number (inputRef.current.value));
        setUpdatedData({productQty: Number(totalQty) });
    
       
    }

    const addQtyChange = (event) => {
       
        const newTotalQty = qtyArray.length > selectedIndex 
        ? Number(qtyArray[selectedIndex]) + Number(event.target.value)
        : prodList.length > 0 
            ? prodList[0].productQty + Number(event.target.value) 
            : 0;

        setTotalQty(newTotalQty);
        console.log(qtyArray[selectedIndex]);
        console.log(event.target.value);
        console.log(newTotalQty);

        setUpdatedData({ productQty: newTotalQty });
      };

    const toggle = () => {
        setModal(prevModal => !prevModal);
        setScanSuccess(false);
    }
      
    const onDetected = (result) => {
        setModal(false);
        setScanCode(result ? result.codeResult.code : '');
        setScanSuccess(!!result);
        setResults(result);
        //alert("Barcode detected: " + result.codeResult.format);
        const productIndex = prodList.findIndex(item => item.productCode === scanCode);
        setSelectedIndex(productIndex);
    }

    useEffect(() => {
        if (prodList.length > 0) {
          setQtyArray(prodList.map((item, index) => item.productQty));
          setPCodeArray(prodList.map((item, index) => item.productCode));
        }
      }, [prodList]);

      useEffect(() => {
        if (pCodeArray.length > 0) {
          setPCode(pCodeArray[selectedIndex]);
        }
      }, [pCodeArray]);

      useEffect(() => {
        if (totalQty > 0) {
          setUpdatedData({ productQty: totalQty });
        }
      },    [totalQty]);

   
      useEffect(() => {
      
      fetchData();
   }, []);


   const updateProdQty = () => {

       
    console.log(pCode);
    console.log(updatedData);
   
    fetch(process.env.REACT_APP_BACKEND_URL+`/updateDataQty/${pCode}`, {
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
        <h1>Add Product Qty</h1>
        <hr /> 
            <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                <tbody>
                <tr style={{ border: '1px solid black' }}> 
                    <th style={{ border: '1px solid black' }}>Product Name</th>
                    <th style={{ border: '1px solid black' }}>Current Qty</th>
                    <th style={{ border: '1px solid black' }}>Added Qty</th>
                    <th style={{ border: '1px solid black' }}>Total Qty</th>
                    
                </tr>
                <tr style={{ border: '1px solid black' }}>
                    <td style={{ border: '1px solid black' }}>
                    <select onChange={handleSelectChange} value={prodList[selectedIndex]?.productName}>
                   
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
                   
                    <input type="text" placeholder="Enter text here" onChange={addQtyChange} ref={inputRef} />
                   
                    </td>
                    <td style={{ border: '1px solid black' }}>
                    <label>{totalQty>0?totalQty: qtyArray.length > selectedIndex ? ( Number(qtyArray[selectedIndex]) + Number(totalQty)) : (prodList.length > 0 ? prodList[0].productQty : 'Loading...')} </label>
                    </td>
                </tr>
                </tbody>
            </table>

            <Button variant="primary" style={{ marginTop: '20px' }} onClick={updateProdQty}>
            Submit
            </Button>
            <Button variant="secondary" style={{ marginTop: '20px' }} onClick={toggle}>Scan Barcode</Button>

            <div>
      
        
            <Modal show={modal} onHide={toggle}>
            <Modal.Header closeButton="true" />
            <Modal.Body>
                <Scanner handleScan={onDetected} />
            </Modal.Body>
            </Modal>
      </div>
      </>
    );
};

export default AddProductStock;
