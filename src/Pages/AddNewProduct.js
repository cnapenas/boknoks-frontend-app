
import React from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import Scanner from './Scanner';
import { useEffect } from 'react';
import { useRef } from 'react';



export default function AddNewProduct() {
        const [productCode, setProductCode] = useState("");
        const [productName, setProductName] = useState("");
        const [productQty, setProductQty] = useState("");
        const [productPrice, setProductPrice] = useState("");
        const [showScanner, setShowScanner] = useState(false);
        const [modal, setModal] = useState(false);
        const [scanSuccess, setScanSuccess] = useState(false);
        const [scanCode, setScanCode] = useState('');
        const [results, setResults] = useState(null);
        const formRef = useRef(null);

        useEffect(() => {
          formRef.current.scrollIntoView({ behavior: 'smooth' });
        }, []);


        useEffect(() => {
          if (scanSuccess) {
            setProductCode(scanCode);
          }
        }, [scanSuccess, scanCode]);

       
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
        }
  
        const addProd = async (e) => {
        e.preventDefault();

        const transactionDate = new Date();
        const transactionType = "add";
       
        let result = await fetch(
          process.env.REACT_APP_BACKEND_URL+'/addnewproduct', {
              method: "post",
              body: JSON.stringify({productCode, productName, productQty, productPrice, transactionDate, transactionType }),
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          result = await result.json();
          console.warn(result);
          if (result) {
              alert("Data saved succesfully");
   
              setProductCode("");
              setProductName("");
              setProductPrice(0);
              setProductQty(0);
          }
        }

        

  return (
    <div className="App">
      <header className="App-header">
        <h1>AddProduct</h1>
        <Form onSubmit={addProd} ref={formRef}> 
          
            <Form.Group controlId="productCode">
                <Form.Label>Product Code</Form.Label>
                <Form.Control type="text" placeholder="Product Code"
                value={productCode} onChange={(e) => setProductCode(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="text" placeholder="Product Name" 
                value={productName} onChange={(e) => setProductName(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="productQty">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" placeholder="Quantity" 
                value={productQty} onChange={(e) => setProductQty(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="productPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" placeholder="Price"
                value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
            </Form.Group>
            <br></br>
            <Button variant="primary" type="submit">
             Submit
            </Button>
            
            <Button variant="secondary" onClick={toggle}>Scan Barcode</Button>
        </Form>
        <div>
      
        
        <Modal show={modal} onHide={toggle}>
          <Modal.Header closeButton="true" />
          <Modal.Body>
            <Scanner handleScan={onDetected} />
          </Modal.Body>
        </Modal>
      </div>
      </header>
    </div>
  );
  }