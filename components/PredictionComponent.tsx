import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PredictionComponent({ prediction } : any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prediction:</Text>
      {prediction.map((p : any, index: any) => (
        <Text key={index} style={styles.predictionText}>{`${p.className}: ${p.probability.toFixed(2)}`}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  predictionText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
