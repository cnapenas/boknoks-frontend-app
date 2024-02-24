// Scanner.js
import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga'; // Assuming you're using Quagga for barcode scanning

export default function Scanner({ onDetected }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            Quagga.init({
              inputStream: {
                type: 'LiveStream',
                constraints: {
                  width: 640,
                  height: 480,
                  facingMode: 'environment' // or user
                }
              },
              locator: {
                patchSize: 'medium',
                halfSample: true
              },
              numOfWorkers: 4,
              decoder: {
                readers: ['code_128_reader'] // or any other barcode type
              },
              locate: true
            }, function(err) {
              if (err) {
                return console.log(err);
              }
              Quagga.start();
            });

            Quagga.onDetected((data) => {
              onDetected(data.codeResult.code);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return <video ref={videoRef} autoPlay />;
}