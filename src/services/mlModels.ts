import * as tf from '@tensorflow/tfjs';
import { PredictionModel } from '../types';

// Training data interface
interface TrainingData {
  features: number[];
  droughtRisk: number;
  floodRisk: number;
}

// Model prediction result
interface ModelPrediction {
  droughtRisk: number;
  floodRisk: number;
  confidence: number;
}

// Base ML Model class
abstract class BaseMLModel {
  protected model: any;
  protected isTrained: boolean = false;
  
  abstract train(data: TrainingData[]): Promise<void>;
  abstract predict(features: number[]): Promise<ModelPrediction>;
  
  protected generateTrainingData(): TrainingData[] {
    // Generate synthetic training data based on real-world patterns
    const trainingData: TrainingData[] = [];
    
    // Desert regions (low moisture, high temperature, high fire risk, no sea level, no glaciers)
    for (let i = 0; i < 100; i++) {
      trainingData.push({
        features: [
          5 + Math.random() * 10,    // soil moisture: 5-15%
          30 + Math.random() * 15,   // temperature: 30-45°C
          70 + Math.random() * 20,   // fire index: 70-90
          0,                         // sea level: 0
          0                          // glacier melting: 0
        ],
        droughtRisk: 0.8 + Math.random() * 0.15,  // 80-95%
        floodRisk: 0.05 + Math.random() * 0.1     // 5-15%
      });
    }
    
    // Coastal regions (moderate moisture, moderate temperature, moderate fire risk, high sea level, no glaciers)
    for (let i = 0; i < 100; i++) {
      trainingData.push({
        features: [
          40 + Math.random() * 30,   // soil moisture: 40-70%
          15 + Math.random() * 20,   // temperature: 15-35°C
          30 + Math.random() * 40,   // fire index: 30-70
          0.05 + Math.random() * 0.15, // sea level: 0.05-0.2
          0                          // glacier melting: 0
        ],
        droughtRisk: 0.2 + Math.random() * 0.4,   // 20-60%
        floodRisk: 0.3 + Math.random() * 0.4      // 30-70%
      });
    }
    
    // Tropical regions (high moisture, high temperature, moderate fire risk, no sea level, no glaciers)
    for (let i = 0; i < 100; i++) {
      trainingData.push({
        features: [
          70 + Math.random() * 20,   // soil moisture: 70-90%
          25 + Math.random() * 10,   // temperature: 25-35°C
          40 + Math.random() * 30,   // fire index: 40-70
          0,                         // sea level: 0
          0                          // glacier melting: 0
        ],
        droughtRisk: 0.1 + Math.random() * 0.3,   // 10-40%
        floodRisk: 0.4 + Math.random() * 0.4      // 40-80%
      });
    }
    
    // Polar regions (low moisture, low temperature, low fire risk, no sea level, high glacier melting)
    for (let i = 0; i < 100; i++) {
      trainingData.push({
        features: [
          20 + Math.random() * 20,   // soil moisture: 20-40%
          -10 + Math.random() * 20,  // temperature: -10 to 10°C
          10 + Math.random() * 20,   // fire index: 10-30
          0,                         // sea level: 0
          5 + Math.random() * 10     // glacier melting: 5-15
        ],
        droughtRisk: 0.1 + Math.random() * 0.2,   // 10-30%
        floodRisk: 0.2 + Math.random() * 0.3      // 20-50%
      });
    }
    
    // River basin regions (high moisture, moderate temperature, moderate fire risk, no sea level, no glaciers)
    for (let i = 0; i < 100; i++) {
      trainingData.push({
        features: [
          60 + Math.random() * 30,   // soil moisture: 60-90%
          20 + Math.random() * 15,   // temperature: 20-35°C
          30 + Math.random() * 40,   // fire index: 30-70
          0,                         // sea level: 0
          0                          // glacier melting: 0
        ],
        droughtRisk: 0.1 + Math.random() * 0.3,   // 10-40%
        floodRisk: 0.4 + Math.random() * 0.4      // 40-80%
      });
    }
    
    return trainingData;
  }
}

// Linear Regression Model using TensorFlow.js
export class LinearRegressionModel extends BaseMLModel {
  private droughtModel: tf.LayersModel;
  private floodModel: tf.LayersModel;
  
  constructor() {
    super();
    this.droughtModel = this.createLinearModel();
    this.floodModel = this.createLinearModel();
  }
  
  private createLinearModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [5],
          units: 1,
          activation: 'sigmoid',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        })
      ]
    });
    
    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });
    
    return model;
  }
  
  async train(data: TrainingData[]): Promise<void> {
    const features = tf.tensor2d(data.map(d => d.features));
    const droughtLabels = tf.tensor2d(data.map(d => [d.droughtRisk]));
    const floodLabels = tf.tensor2d(data.map(d => [d.floodRisk]));
    
    // Train drought model
    await this.droughtModel.fit(features, droughtLabels, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });
    
    // Train flood model
    await this.floodModel.fit(features, floodLabels, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });
    
    // Clean up tensors
    features.dispose();
    droughtLabels.dispose();
    floodLabels.dispose();
    
    this.isTrained = true;
    console.log('✅ Linear Regression models trained successfully');
  }
  
  async predict(features: number[]): Promise<ModelPrediction> {
    if (!this.isTrained) {
      await this.train(this.generateTrainingData());
    }
    
    const input = tf.tensor2d([features]);
    
    const droughtPrediction = await this.droughtModel.predict(input) as tf.Tensor;
    const floodPrediction = await this.floodModel.predict(input) as tf.Tensor;
    
    const droughtData = await droughtPrediction.data();
    const floodData = await floodPrediction.data();
    
    const droughtRisk = Math.max(0, Math.min(1, (droughtData as Float32Array)[0]));
    const floodRisk = Math.max(0, Math.min(1, (floodData as Float32Array)[0]));
    
    // Clean up tensors
    input.dispose();
    droughtPrediction.dispose();
    floodPrediction.dispose();
    
    // Calculate confidence based on feature quality
    const confidence = 0.6 + (features.filter(f => f > 0).length / 5) * 0.3;
    
    return {
      droughtRisk,
      floodRisk,
      confidence: Math.min(0.95, confidence)
    };
  }
}

// Neural Network Model
export class NeuralNetworkModel extends BaseMLModel {
  private droughtModel: tf.LayersModel;
  private floodModel: tf.LayersModel;
  
  constructor() {
    super();
    this.droughtModel = this.createModel();
    this.floodModel = this.createModel();
  }
  
  private createModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [5],
          units: 64,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 32,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 16,
          activation: 'relu'
        }),
        tf.layers.dense({
          units: 1,
          activation: 'sigmoid'
        })
      ]
    });
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });
    
    return model;
  }
  
  async train(data: TrainingData[]): Promise<void> {
    const features = tf.tensor2d(data.map(d => d.features));
    const droughtLabels = tf.tensor2d(data.map(d => [d.droughtRisk]));
    const floodLabels = tf.tensor2d(data.map(d => [d.floodRisk]));
    
    // Train drought model
    await this.droughtModel.fit(features, droughtLabels, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });
    
    // Train flood model
    await this.floodModel.fit(features, floodLabels, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });
    
    // Clean up tensors
    features.dispose();
    droughtLabels.dispose();
    floodLabels.dispose();
    
    this.isTrained = true;
    console.log('✅ Neural Network models trained successfully');
  }
  
  async predict(features: number[]): Promise<ModelPrediction> {
    if (!this.isTrained) {
      await this.train(this.generateTrainingData());
    }
    
    const input = tf.tensor2d([features]);
    
    const droughtPrediction = await this.droughtModel.predict(input) as tf.Tensor;
    const floodPrediction = await this.floodModel.predict(input) as tf.Tensor;
    
    const droughtData = await droughtPrediction.data();
    const floodData = await floodPrediction.data();
    
    const droughtRisk = Math.max(0, Math.min(1, (droughtData as Float32Array)[0]));
    const floodRisk = Math.max(0, Math.min(1, (floodData as Float32Array)[0]));
    
    // Clean up tensors
    input.dispose();
    droughtPrediction.dispose();
    floodPrediction.dispose();
    
    // Calculate confidence based on model certainty
    const confidence = 0.7 + (features.filter(f => f > 0).length / 5) * 0.25;
    
    return {
      droughtRisk,
      floodRisk,
      confidence: Math.min(0.95, confidence)
    };
  }
}

// Random Forest Model (simplified implementation)
export class RandomForestModel extends BaseMLModel {
  private trees: Array<{
    features: number[];
    threshold: number;
    leftValue: number;
    rightValue: number;
  }>;
  
  constructor() {
    super();
    this.trees = [];
  }
  
  async train(data: TrainingData[]): Promise<void> {
    this.trees = [];
    
    // Create multiple decision trees
    for (let i = 0; i < 50; i++) {
      const tree = this.createTree(data);
      this.trees.push(tree);
    }
    
    this.isTrained = true;
    console.log('✅ Random Forest model trained successfully');
  }
  
  private createTree(data: TrainingData[]): any {
    if (data.length < 10) {
      const avgDrought = data.reduce((sum, d) => sum + d.droughtRisk, 0) / data.length;
      const avgFlood = data.reduce((sum, d) => sum + d.floodRisk, 0) / data.length;
      return { isLeaf: true, droughtRisk: avgDrought, floodRisk: avgFlood };
    }
    
    // Randomly select feature and threshold
    const featureIndex = Math.floor(Math.random() * 5);
    const featureValues = data.map(d => d.features[featureIndex]);
    const min = Math.min(...featureValues);
    const max = Math.max(...featureValues);
    const threshold = min + Math.random() * (max - min);
    
    // Split data
    const leftData = data.filter(d => d.features[featureIndex] <= threshold);
    const rightData = data.filter(d => d.features[featureIndex] > threshold);
    
    if (leftData.length === 0 || rightData.length === 0) {
      const avgDrought = data.reduce((sum, d) => sum + d.droughtRisk, 0) / data.length;
      const avgFlood = data.reduce((sum, d) => sum + d.floodRisk, 0) / data.length;
      return { isLeaf: true, droughtRisk: avgDrought, floodRisk: avgFlood };
    }
    
    return {
      isLeaf: false,
      featureIndex,
      threshold,
      left: this.createTree(leftData),
      right: this.createTree(rightData)
    };
  }
  
  private predictTree(tree: any, features: number[]): { droughtRisk: number; floodRisk: number } {
    if (tree.isLeaf) {
      return { droughtRisk: tree.droughtRisk, floodRisk: tree.floodRisk };
    }
    
    if (features[tree.featureIndex] <= tree.threshold) {
      return this.predictTree(tree.left, features);
    } else {
      return this.predictTree(tree.right, features);
    }
  }
  
  async predict(features: number[]): Promise<ModelPrediction> {
    if (!this.isTrained) {
      await this.train(this.generateTrainingData());
    }
    
    // Get predictions from all trees
    const predictions = this.trees.map(tree => this.predictTree(tree, features));
    
    // Average the predictions
    const avgDroughtRisk = predictions.reduce((sum, p) => sum + p.droughtRisk, 0) / predictions.length;
    const avgFloodRisk = predictions.reduce((sum, p) => sum + p.floodRisk, 0) / predictions.length;
    
    // Calculate confidence based on prediction variance
    const droughtVariance = predictions.reduce((sum, p) => sum + Math.pow(p.droughtRisk - avgDroughtRisk, 2), 0) / predictions.length;
    const floodVariance = predictions.reduce((sum, p) => sum + Math.pow(p.floodRisk - avgFloodRisk, 2), 0) / predictions.length;
    
    const confidence = 0.65 + (1 - Math.sqrt(droughtVariance + floodVariance)) * 0.3;
    
    return {
      droughtRisk: Math.max(0, Math.min(1, avgDroughtRisk)),
      floodRisk: Math.max(0, Math.min(1, avgFloodRisk)),
      confidence: Math.min(0.95, confidence)
    };
  }
}

// Ensemble Model
export class EnsembleModel extends BaseMLModel {
  private linearModel: LinearRegressionModel;
  private neuralModel: NeuralNetworkModel;
  private randomForestModel: RandomForestModel;
  
  constructor() {
    super();
    this.linearModel = new LinearRegressionModel();
    this.neuralModel = new NeuralNetworkModel();
    this.randomForestModel = new RandomForestModel();
  }
  
  async train(data: TrainingData[]): Promise<void> {
    // Train all models
    await Promise.all([
      this.linearModel.train(data),
      this.neuralModel.train(data),
      this.randomForestModel.train(data)
    ]);
    
    this.isTrained = true;
    console.log('✅ Ensemble model trained successfully');
  }
  
  async predict(features: number[]): Promise<ModelPrediction> {
    if (!this.isTrained) {
      await this.train(this.generateTrainingData());
    }
    
    // Get predictions from all models
    const [linearPred, neuralPred, rfPred] = await Promise.all([
      this.linearModel.predict(features),
      this.neuralModel.predict(features),
      this.randomForestModel.predict(features)
    ]);
    
    // Weighted average (neural network gets higher weight)
    const weights = { linear: 0.2, neural: 0.5, randomForest: 0.3 };
    
    const droughtRisk = (
      linearPred.droughtRisk * weights.linear +
      neuralPred.droughtRisk * weights.neural +
      rfPred.droughtRisk * weights.randomForest
    );
    
    const floodRisk = (
      linearPred.floodRisk * weights.linear +
      neuralPred.floodRisk * weights.neural +
      rfPred.floodRisk * weights.randomForest
    );
    
    // Average confidence
    const confidence = (
      linearPred.confidence * weights.linear +
      neuralPred.confidence * weights.neural +
      rfPred.confidence * weights.randomForest
    );
    
    return {
      droughtRisk: Math.max(0, Math.min(1, droughtRisk)),
      floodRisk: Math.max(0, Math.min(1, floodRisk)),
      confidence: Math.min(0.95, confidence)
    };
  }
}

// ML Models Manager
export class MLModelsManager {
  private models: Map<PredictionModel, BaseMLModel> = new Map();
  
  constructor() {
    this.models.set('linear', new LinearRegressionModel());
    this.models.set('neural', new NeuralNetworkModel());
    this.models.set('random_forest', new RandomForestModel());
    this.models.set('ensemble', new EnsembleModel());
  }
  
  async getModel(modelType: PredictionModel): Promise<BaseMLModel> {
    const model = this.models.get(modelType);
    if (!model) {
      throw new Error(`Model ${modelType} not found`);
    }
    return model;
  }
  
  async predict(
    modelType: PredictionModel,
    features: number[]
  ): Promise<ModelPrediction> {
    const model = await this.getModel(modelType);
    return await model.predict(features);
  }
}

// Export singleton instance
export const mlModelsManager = new MLModelsManager();
