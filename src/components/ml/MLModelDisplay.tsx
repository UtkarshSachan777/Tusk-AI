import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TreePine, 
  TrendingUp, 
  Zap, 
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MLModelResult {
  random_forest_score: number;
  lstm_score: number;
  xgboost_score: number;
  ensemble_score: number;
  confidence: number;
  prediction: string;
  model_explanations: { [key: string]: string };
  processing_time_ms: number;
}

interface MLModelDisplayProps {
  result?: MLModelResult;
  isAnalyzing?: boolean;
}

const MLModelDisplay: React.FC<MLModelDisplayProps> = ({ result, isAnalyzing }) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnimationProgress(prev => (prev >= 100 ? 0 : prev + 2));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const models = [
    {
      name: 'Random Forest',
      icon: TreePine,
      score: result?.random_forest_score || 0,
      color: 'from-green-500 to-green-600',
      description: 'Ensemble of decision trees for pattern recognition',
      strengths: ['Rule-based patterns', 'Interpretable decisions', 'Robust to outliers']
    },
    {
      name: 'LSTM Neural Network',
      icon: Brain,
      score: result?.lstm_score || 0,
      color: 'from-blue-500 to-blue-600',
      description: 'Deep learning for sequential pattern analysis',
      strengths: ['Sequential patterns', 'Temporal dependencies', 'Complex relationships']
    },
    {
      name: 'XGBoost',
      icon: Zap,
      score: result?.xgboost_score || 0,
      color: 'from-purple-500 to-purple-600',
      description: 'Gradient boosting for feature interactions',
      strengths: ['Feature interactions', 'High accuracy', 'Handles missing data']
    }
  ];

  const getRiskColor = (score: number) => {
    if (score > 0.7) return 'text-red-500';
    if (score > 0.4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-500';
    if (confidence > 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Model Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model, index) => {
          const ModelIcon = model.icon;
          return (
            <Card key={model.name} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${model.color} text-white`}>
                      <ModelIcon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                  </div>
                  {result && (
                    <Badge className={`${getRiskColor(model.score)}`}>
                      {(model.score * 100).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <Progress 
                    value={isAnalyzing ? animationProgress : (model.score * 100)} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-600">{model.description}</p>
                  <div className="space-y-1">
                    {model.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-xs text-gray-500">
                        <CheckCircle className="h-3 w-3" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              )}
            </Card>
          );
        })}
      </div>

      {/* Ensemble Results */}
      {result && (
        <Card className="border-2 border-tusk-teal/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-tusk-teal" />
              Ensemble Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getRiskColor(result.ensemble_score)}`}>
                  {(result.ensemble_score * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Ensemble Risk Score</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                  {(result.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Model Confidence</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.processing_time_ms}ms
                </div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${
                  result.prediction === 'fraudulent' ? 'text-red-600' :
                  result.prediction === 'suspicious' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {result.prediction.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600">Final Prediction</div>
              </div>
            </div>

            {/* Model Explanations */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Model Explanations</h4>
              {Object.entries(result.model_explanations).map(([model, explanation]) => {
                const modelConfig = models.find(m => m.name.toLowerCase().replace(/\s+/g, '_') === model);
                const ModelIcon = modelConfig?.icon || Brain;
                
                return (
                  <div key={model} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <ModelIcon className="h-4 w-4 mt-1 text-gray-600" />
                      <div>
                        <div className="font-medium text-sm capitalize">
                          {model.replace(/_/g, ' ')}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Status */}
      {isAnalyzing && (
        <Card className="border-tusk-teal/30 bg-tusk-teal/5">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-4 border-tusk-teal border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-medium text-tusk-navy mb-2">
                Advanced ML Analysis in Progress
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Running Random Forest, LSTM Neural Network, and XGBoost models...
              </p>
              <div className="space-y-2">
                {['Feature extraction', 'Pattern recognition', 'Ensemble voting', 'Risk assessment'].map((step, index) => (
                  <div key={step} className="flex items-center justify-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      animationProgress > (index * 25) ? 'bg-tusk-teal animate-pulse' : 'bg-gray-300'
                    }`} />
                    <span className={animationProgress > (index * 25) ? 'text-tusk-navy' : 'text-gray-500'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results State */}
      {!result && !isAnalyzing && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready for ML Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Submit a transaction to see advanced machine learning fraud detection in action.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MLModelDisplay;