// Scanner.js
import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga'; // Assuming you're using Quagga for barcode scanning

export default function Scanner({ onDetected }) {
  const videoRef = useRef(null);

//   
useEffect(() => {
    var backCamID = null;
    

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
  
            navigator.mediaDevices.enumerateDevices()
              .then(function(devices) {
                var videoDeviceId = '';
                devices.forEach(function(device) {

                    if( device.kind == "videoinput" && device.label.match(/back/) !== null ){
                        backCamID = device.deviceId;
                      }
                  if (device.kind === 'videoinput') {
                    videoDeviceId = device.deviceId;
                  }
                  
                });

                if( backCamID === null){
                    backCamID = videoDeviceId;
                    }
  
                Quagga.init({
                  inputStream: {
                    type: 'LiveStream',
                    constraints: {
                      width: 640,
                      height: 480,
                      // facingMode: 'user',
                      deviceId: backCamID // Use specific video input device
                    }
                  },
                  locator: {
                    patchSize: 'medium',
                    halfSample: true
                  },
                  numOfWorkers: 4,
                  decoder: {
                    readers: ['code_128_reader', 'ean_reader', 'upc_reader', 'ean_8_reader','code_39_reader','code_39_vin_reader','codabar_reader',
                    'upc_e_reader', 'i2of5_reader','2of5_reader','code_93_reader'] // or any other barcode type
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
              })
              .catch(function(err) {
                console.log(err.name + ": " + err.message);
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