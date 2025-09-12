
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FraudDashboard from '@/components/fraudDetection/FraudDashboard';
import FraudFeatures from '@/components/fraudDetection/FraudFeatures';
import LiveFraudDemo from '@/components/fraudDetection/LiveFraudDemo';
import RealTimeFraudMonitor from '@/components/realtime/RealTimeFraudMonitor';
import IntelligentAssistant from '@/components/ai/IntelligentAssistant';
import BiometricsDemo from '@/components/biometrics/BiometricsDemo';
import MLModelDisplay from '@/components/ml/MLModelDisplay';
import RealTimeAlertSystem from '@/components/alerts/RealTimeAlertSystem';
import AdvancedAnalyticsDashboard from '@/components/analytics/AdvancedAnalyticsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Brain, TrendingUp, Zap, Eye, Target, Clock } from 'lucide-react';

const FraudDetection = () => {
  const [activeAnalysis, setActiveAnalysis] = useState(false);
  const [detectionStats, setDetectionStats] = useState({
    threatsBlocked: 1247,
    accuracy: 99.7,
    avgResponseTime: 47,
    falsePositives: 0.3
  });

  const startLiveAnalysis = () => {
    setActiveAnalysis(true);
    // Simulate live updates
    const interval = setInterval(() => {
      setDetectionStats(prev => ({
        ...prev,
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        avgResponseTime: 45 + Math.floor(Math.random() * 10)
      }));
    }, 2000);

    setTimeout(() => {
      clearInterval(interval);
      setActiveAnalysis(false);
    }, 15000);
  };

  return (
    <Layout>
      <div className="bg-tusk-navy text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-tusk-teal" />
              <h1 className="text-4xl font-bold">Enterprise Fraud Prevention Platform</h1>
            </div>
            <p className="text-xl text-tusk-lightBlue mb-6">
              Comprehensive B2B fraud detection and prevention for fintech companies and banks. 
              Real-time AI analysis, behavioral biometrics, and intelligent alerting system.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={startLiveAnalysis}
                disabled={activeAnalysis}
                className="bg-tusk-teal text-black hover:bg-tusk-accent flex items-center gap-2"
              >
                {activeAnalysis ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Live Analysis Running
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Start Live Demo
                  </>
                )}
              </Button>
              <Button variant="outline" className="border-tusk-teal text-tusk-teal hover:bg-tusk-teal hover:text-black">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <section className="py-12 bg-tusk-darkNavy">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { 
                icon: Shield, 
                label: "Threats Blocked Today", 
                value: detectionStats.threatsBlocked.toLocaleString(),
                color: "text-green-400" 
              },
              { 
                icon: Target, 
                label: "Detection Accuracy", 
                value: `${detectionStats.accuracy}%`,
                color: "text-tusk-teal" 
              },
              { 
                icon: Clock, 
                label: "Avg Response Time", 
                value: `${detectionStats.avgResponseTime}ms`,
                color: "text-blue-400" 
              },
              { 
                icon: TrendingUp, 
                label: "False Positive Rate", 
                value: `${detectionStats.falsePositives}%`,
                color: "text-yellow-400" 
              }
            ].map((stat, index) => (
              <Card key={index} className="bg-black/30 border-tusk-teal/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-tusk-lightBlue text-sm mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Algorithm Explanation */}
          <Card className="bg-black/30 border-tusk-teal/20 backdrop-blur-sm mb-12">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-tusk-teal" />
                AI Detection Algorithms in Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Neural Network Analysis",
                    description: "Deep learning models trained on millions of transaction patterns",
                    status: activeAnalysis ? "Processing..." : "Ready"
                  },
                  {
                    name: "Behavioral Analytics",
                    description: "User behavior pattern recognition and anomaly detection",
                    status: activeAnalysis ? "Analyzing..." : "Standby"
                  },
                  {
                    name: "Real-time Scoring",
                    description: "Instant risk assessment using ensemble learning methods",
                    status: activeAnalysis ? "Scoring..." : "Online"
                  }
                ].map((algorithm, index) => (
                  <div key={index} className="p-4 bg-tusk-darkNavy/50 rounded-lg border border-tusk-teal/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{algorithm.name}</h4>
                      <Badge className={`${
                        activeAnalysis ? 'bg-green-500/20 text-green-400' : 'bg-tusk-teal/20 text-tusk-teal'
                      }`}>
                        {algorithm.status}
                      </Badge>
                    </div>
                    <p className="text-tusk-lightBlue text-sm">{algorithm.description}</p>
                    {activeAnalysis && (
                      <div className="mt-2 h-1 bg-tusk-darkNavy rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-tusk-teal to-tusk-accent animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="monitor" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 max-w-full mx-auto text-xs">
            <TabsTrigger value="monitor">Real-Time</TabsTrigger>
            <TabsTrigger value="demo">ML Demo</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="assistant">AI Chat</TabsTrigger>
            <TabsTrigger value="biometrics">Biometrics</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monitor" className="mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-tusk-navy mb-2">Real-Time Fraud Monitoring</h2>
                <p className="text-tusk-blue">
                  Live fraud detection with ensemble AI models, real-time alerts, and automated response capabilities.
                </p>
              </div>
              <RealTimeFraudMonitor />
            </div>
          </TabsContent>
          
          <TabsContent value="demo" className="mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-tusk-navy mb-2">Advanced ML Transaction Analysis</h2>
                <p className="text-tusk-blue">
                  Test transaction analysis with Random Forest, LSTM Neural Networks, and XGBoost models.
                </p>
              </div>
              <LiveFraudDemo />
            </div>
          </TabsContent>
          
          <TabsContent value="models" className="mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-tusk-navy mb-2">ML Model Performance</h2>
                <p className="text-tusk-blue">
                  Real-time performance metrics for Random Forest, LSTM, and XGBoost fraud detection models.
                </p>
              </div>
              <MLModelDisplay />
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-tusk-navy mb-2">Real-Time Alert System</h2>
                <p className="text-tusk-blue">
                  Advanced alerting system with severity-based classification and automated response protocols.
                </p>
              </div>
              <RealTimeAlertSystem />
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-tusk-navy mb-2">Advanced Analytics Dashboard</h2>
                <p className="text-tusk-blue">
                  Comprehensive fraud detection analytics with ML model insights, threat intelligence, and performance trends.
                </p>
              </div>
              <AdvancedAnalyticsDashboard />
            </div>
          </TabsContent>
          
          <TabsContent value="assistant" className="mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-tusk-navy mb-2">AI Banking Assistant</h2>
                <p className="text-tusk-blue">
                  Intelligent conversational AI for fraud reporting, transaction queries, and banking assistance.
                </p>
              </div>
              <IntelligentAssistant />
            </div>
          </TabsContent>
          
          <TabsContent value="biometrics" className="mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-tusk-navy mb-2">Behavioral Biometrics</h2>
                <p className="text-tusk-blue">
                  Advanced user authentication through keystroke dynamics, mouse patterns, and device fingerprinting.
                </p>
              </div>
              <BiometricsDemo />
            </div>
          </TabsContent>
          
          
          <TabsContent value="features" className="mt-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-tusk-navy mb-2">Platform Features</h2>
                <p className="text-tusk-blue">
                  Complete fraud prevention ecosystem designed for enterprise fintech and banking operations.
                </p>
              </div>
              <FraudFeatures />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FraudDetection;
