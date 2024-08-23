import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

export default function useTensorFlow() {
  const [cucumberModel, setCucumberModel] = useState(null);
  const [pumpkinModel, setPumpkinModel] = useState(null);
  const [isTfReady, setIsTfReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      console.log('Initializing TensorFlow.js...');
      await tf.ready();
      console.log('TensorFlow.js is ready.');

      await tf.env().set('IS_REACT_NATIVE', true);
      console.log('Environment set for React Native.');

      try {
        console.log('Loading cucumber model...');
        const cucumberModel = await tf.loadLayersModel(
          bundleResourceIO(
            require('../models/cucumber_model/model.json'),
            [
              require('../models/cucumber_model/group1-shard1of4.bin'),
              require('../models/cucumber_model/group1-shard2of4.bin'),
              require('../models/cucumber_model/group1-shard3of4.bin'),
              require('../models/cucumber_model/group1-shard4of4.bin'),
            ]
          )
        );
        setCucumberModel({ classifyImage: classifyImage(cucumberModel) } as any);
        console.log('Cucumber model loaded successfully.');
      } catch (error) {
        console.error('Failed to load cucumber model:', error);
      }

      try {
        console.log('Loading pumpkin model...');
        const pumpkinModel = await tf.loadLayersModel(
          bundleResourceIO(
            require('../models/pumpkin_model/model.json'),
            [
              require('../models/pumpkin_model/group1-shard1of4.bin'),
              require('../models/pumpkin_model/group1-shard2of4.bin'),
              require('../models/pumpkin_model/group1-shard3of4.bin'),
              require('../models/pumpkin_model/group1-shard4of4.bin'),
            ]
          )
        );
        setPumpkinModel({ classifyImage: classifyImage(pumpkinModel) } as any);
        console.log('Pumpkin model loaded successfully.');
      } catch (error) {
        console.error('Failed to load pumpkin model:', error);
      }

      setIsTfReady(true);
      console.log('Models are fully loaded, and TensorFlow is ready.');
    };

    loadModels();
  }, []);

  const classifyImage = (model) => async (uri) => {
    console.log('Classifying image...');
    try {
      const response = await fetch(uri);
      console.log('Image fetched');
      const imageData = await response.blob();
      console.log('Blob created', imageData);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageArrayBuffer = event.target.result;
        console.log('Array buffer created');
        const imageTensor = await tf.browser.fromPixels(imageArrayBuffer).resizeBilinear([224, 224]);
        console.log('Tensor created', imageTensor.shape);
        const normalizedImage = await imageTensor.div(tf.scalar(255)).expandDims(0);
        console.log('Image normalized');
        const prediction = await model.predict(normalizedImage);
        console.log('Prediction made', prediction);
        return prediction;
      };
      reader.readAsArrayBuffer(imageData);
    } catch (error) {
      console.error('Error during image classification:', error);
      return null;
    }
  };

  return { cucumberModel, pumpkinModel, isTfReady };
}