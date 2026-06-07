import React, { useEffect, useRef} from "react";
import * as faceapi from "face-api.js";

export default function FacialExpression() {
  const videoRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      startVideo();
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error(err));
  };

  async function detectMood() {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

        let _expression ="";
        let mostProbableExpression = 0;

        if(!detections || detections.length === 0){
            console.log("No face detected !");
            return;
        }

        for(const expression of Object.keys(detections[0].expressions)){
            if(detections[0].expressions[expression]> mostProbableExpression){
                mostProbableExpression = detections[0].expressions[expression]
                _expression = expression;
            }
        }

      console.log(_expression);
   

  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Facial Expression Detection</h2>

      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          width="640"
          height="480"
         
        />

        <button onClick={detectMood}>Detect Mood</button>

       
      </div>


    </div>
  );
}
