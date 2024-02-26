
import React, { useEffect, useState } from 'react';
import { Button ,Table} from 'react-bootstrap';

const BuyProduct = () => {

    const [prodList, setProdList] = useState([]);
    const [totalQty, setTotalQty] = useState(0);
    
    const [pCode, setPCode] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [updatedData, setUpdatedData] = useState({
        productQty: 0
    });
    const [qtyArray, setQtyArray] = useState([]);
    const [pCodeArray, setPCodeArray] = useState([]);

    // const [modal, setModal] = useState(false);
    // const [scanSuccess, setScanSuccess] = useState(false);
    // const [scanCode, setScanCode] = useState('');
    // const [results, setResults] = useState(null);

    const handleSelectChange = (event) => {
        const newSelectedIndex = event.target.selectedIndex;
        setSelectedIndex(newSelectedIndex);
        const qtyArray = prodList.map((item, index) => item.productQty);
        const pCodeArray = prodList.map((item, index) => item.productCode);
        setPCodeArray(pCodeArray);
        setQtyArray(qtyArray);
        setPCode(pCodeArray[newSelectedIndex]);
        setUpdatedData({ productQty: qtyArray[newSelectedIndex] + Number(totalQty) });
        
       
    }

    const addQtyChange = (event) => {
        setTotalQty (qtyArray.length > selectedIndex ? ( Number(qtyArray[selectedIndex]) + Number(event.target.value)) : (prodList.length > 0 ? (prodList[0].productQty + Number(event.target.value)) : 0))
        //setTotalQty(event.target.value);
    };


    const addToCart = () => {

        
    };


    const updateProdQty = () => {
    
    console.log(pCode);
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

  return (
    <>
    <h1>Buy Product</h1>
    <hr /> 
        <Table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <tbody>
            <tr style={{ border: '1px solid black' }}> 
                <th style={{ border: '1px solid black' }}>Product Name</th>
 
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
                
                
            </tr>
            </tbody>
        </Table>

        <Button variant="primary" style={{ marginTop: '20px' }} onClick={updateProdQty}>
        Add To Cart
        </Button>

        <Table striped bordered hover style={{ marginTop: '20px' }}>
        <thead>
            <tr style={{ border: '1px solid black' }}>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Sub Total</th>
            </tr>
        </thead>
        <tbody>
            {prodList.map(item => { 
                return (
                <tr style={{ border: '1px solid black' }}>
                    <td style={{ border: '1px solid black', wordWrap: 'break-word' }}>{item.productCode}</td>
                    <td style={{ border: '1px solid black', wordWrap: 'break-word' }}>{item.productName}</td>
                    <td style={{ border: '1px solid black', wordWrap: 'break-word' }}>{item.productQty}</td>
                    <td style={{ border: '1px solid black', wordWrap: 'break-word' }}>{item.productPrice}</td>
                </tr>
                );
            })}
        </tbody>
        </Table>
        {/* <Button variant="secondary" style={{ marginTop: '20px' }} onClick={toggle}>Scan Barcode</Button> */}

        <div>
  
    
        {/* <Modal show={modal} onHide={toggle}>
        <Modal.Header closeButton="true" />
        <Modal.Body>
            <Scanner handleScan={onDetected} />
        </Modal.Body>
        </Modal> */}
  </div>
  </>
  );
}
export default BuyProduct;