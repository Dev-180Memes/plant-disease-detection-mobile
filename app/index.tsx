import React, { useState } from 'react'
import { View, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CameraComponent from '@/components/CameraComponent';
import PredictionComponent from '@/components/PredictionComponent';
import useTensorFlow from '@/hooks/useTensorflow';

const App = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<string>('cucumber');

  const { cucumberModel, pumpkinModel, isTfReady } = useTensorFlow();

  const handleImageCaptured = async (uri: string) => {
    setImageUri(uri);
  }

  const handlePrediction = async () => {
    console.log('Image URI:', imageUri);
    console.log('TensorFlow Ready:', isTfReady);
    if (isTfReady && imageUri) {
      let result = null;
      console.log('Selected Plant:', selectedPlant);
      if (selectedPlant === 'cucumber') {
        result = await cucumberModel.classifyImage(imageUri);
      } else if (selectedPlant === 'pumpkin') {
        result = await pumpkinModel.classifyImage(imageUri);
      }
      console.log('Prediction Result:', result);
      setPrediction(result);
    } else {
      console.log('Conditions not met for prediction');
    }
  };

  return (
    <View style={styles.container}>
        <Picker
          selectedValue={selectedPlant}
          onValueChange={(itemValue) => setSelectedPlant(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          <Picker.Item label="Cucumber" value="cucumber" />
          <Picker.Item label="Pumpkin" value="pumpkin" />
        </Picker>

        <CameraComponent onImageCaptured={handleImageCaptured} />
        {imageUri && <Button title="Analyze Image" onPress={handlePrediction} />}
        {prediction && <PredictionComponent prediction={prediction} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default App;
