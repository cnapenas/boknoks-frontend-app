// Scanner.js
import React, { useEffect, useRef } from 'react';
import Quagga from '@ericblade/quagga2'; // ES6


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
                type: 'VideoStream',
                constraints: {
                  width: 640,
                  height: 480,
                  facingMode: 'environment',
                  focusMode: "continuous",
                  aspectRatio: {min: 1, max: 2}
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
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return <video ref={videoRef} autoPlay />;
}