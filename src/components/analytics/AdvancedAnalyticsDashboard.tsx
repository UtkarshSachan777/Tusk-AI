import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Target, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ModelPerformance {
  model_name: string;
  accuracy: number;
  precision_score: number;
  recall: number;
  f1_score: number;
  training_date: string;
}

interface AnalyticsData {
  hourly_detections: Array<{ hour: string; fraudulent: number; suspicious: number; legitimate: number }>;
  model_performance: ModelPerformance[];
  risk_distribution: Array<{ range: string; count: number; value: number }>;
  detection_trends: Array<{ date: string; accuracy: number; alerts: number; processing_time: number }>;
  threat_categories: Array<{ category: string; count: number; severity: number }>;
}

const AdvancedAnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    hourly_detections: [],
    model_performance: [],
    risk_distribution: [],
    detection_trends: [],
    threat_categories: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    transactions_processed: 15647,
    threats_detected: 247,
    current_accuracy: 97.3,
    avg_processing_time: 42,
    models_active: 3,
    false_positive_rate: 0.8
  });

  useEffect(() => {
    loadAnalyticsData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        transactions_processed: prev.transactions_processed + Math.floor(Math.random() * 5),
        threats_detected: prev.threats_detected + (Math.random() > 0.9 ? 1 : 0),
        current_accuracy: 97.3 + (Math.random() * 0.4 - 0.2),
        avg_processing_time: 42 + Math.floor(Math.random() * 10 - 5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Load model performance data
      const { data: modelData } = await supabase
        .from('ml_model_performance')
        .select('*')
        .eq('is_active', true)
        .order('training_date', { ascending: false });

      // Generate mock analytics data (in a real system, this would come from the database)
      const mockData: AnalyticsData = {
        hourly_detections: [
          { hour: '00:00', fraudulent: 5, suspicious: 12, legitimate: 143 },
          { hour: '03:00', fraudulent: 8, suspicious: 18, legitimate: 89 },
          { hour: '06:00', fraudulent: 3, suspicious: 15, legitimate: 234 },
          { hour: '09:00', fraudulent: 12, suspicious: 28, legitimate: 456 },
          { hour: '12:00', fraudulent: 15, suspicious: 35, legitimate: 678 },
          { hour: '15:00', fraudulent: 18, suspicious: 42, legitimate: 567 },
          { hour: '18:00', fraudulent: 22, suspicious: 38, legitimate: 445 },
          { hour: '21:00', fraudulent: 14, suspicious: 25, legitimate: 289 }
        ],
        model_performance: modelData || [
          { model_name: 'Random Forest', accuracy: 0.947, precision_score: 0.923, recall: 0.891, f1_score: 0.907, training_date: '2024-01-15' },
          { model_name: 'LSTM', accuracy: 0.934, precision_score: 0.901, recall: 0.945, f1_score: 0.922, training_date: '2024-01-14' },
          { model_name: 'XGBoost', accuracy: 0.956, precision_score: 0.941, recall: 0.929, f1_score: 0.935, training_date: '2024-01-16' }
        ],
        risk_distribution: [
          { range: '0-20%', count: 12847, value: 15 },
          { range: '21-40%', count: 2134, value: 30 },
          { range: '41-60%', count: 856, value: 50 },
          { range: '61-80%', count: 423, value: 70 },
          { range: '81-100%', count: 187, value: 90 }
        ],
        detection_trends: [
          { date: 'Jan 10', accuracy: 94.2, alerts: 23, processing_time: 45 },
          { date: 'Jan 11', accuracy: 95.1, alerts: 19, processing_time: 43 },
          { date: 'Jan 12', accuracy: 96.8, alerts: 31, processing_time: 41 },
          { date: 'Jan 13', accuracy: 97.2, alerts: 27, processing_time: 39 },
          { date: 'Jan 14', accuracy: 97.6, alerts: 24, processing_time: 42 },
          { date: 'Jan 15', accuracy: 97.3, alerts: 29, processing_time: 38 },
          { date: 'Jan 16', accuracy: 97.8, alerts: 22, processing_time: 40 }
        ],
        threat_categories: [
          { category: 'High Amount Transactions', count: 45, severity: 8 },
          { category: 'Card Not Present', count: 32, severity: 6 },
          { category: 'Velocity Anomalies', count: 28, severity: 7 },
          { category: 'Geographic Risk', count: 18, severity: 5 },
          { category: 'Behavioral Patterns', count: 23, severity: 6 },
          { category: 'Device Fingerprinting', count: 15, severity: 4 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const colors = ['#2CA6A4', '#2F6690', '#0A2342', '#A4BAB7', '#E63946', '#F4A261'];

  return (
    <div className="space-y-6">
      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[
          { 
            icon: Database, 
            label: 'Transactions Processed', 
            value: realTimeStats.transactions_processed.toLocaleString(),
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          { 
            icon: Shield, 
            label: 'Threats Detected', 
            value: realTimeStats.threats_detected.toString(),
            color: 'text-red-600',
            bg: 'bg-red-50'
          },
          { 
            icon: Target, 
            label: 'Current Accuracy', 
            value: `${realTimeStats.current_accuracy.toFixed(1)}%`,
            color: 'text-green-600',
            bg: 'bg-green-50'
          },
          { 
            icon: Clock, 
            label: 'Avg Processing Time', 
            value: `${realTimeStats.avg_processing_time}ms`,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
          },
          { 
            icon: Brain, 
            label: 'Models Active', 
            value: realTimeStats.models_active.toString(),
            color: 'text-tusk-teal',
            bg: 'bg-tusk-teal/10'
          },
          { 
            icon: AlertTriangle, 
            label: 'False Positive Rate', 
            value: `${realTimeStats.false_positive_rate}%`,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
          }
        ].map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <Card key={index} className={`${stat.bg} border-0`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <StatIcon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="detection" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="detection">Detection Analytics</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="detection" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Detection Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Detection Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.hourly_detections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="legitimate"
                        stackId="1"
                        stroke="#2CA6A4"
                        fill="#2CA6A4"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="suspicious"
                        stackId="1"
                        stroke="#F4A261"
                        fill="#F4A261"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="fraudulent"
                        stackId="1"
                        stroke="#E63946"
                        fill="#E63946"
                        fillOpacity={0.8}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.risk_distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {analyticsData.risk_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>ML Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={analyticsData.model_performance.map(model => ({
                      model: model.model_name,
                      Accuracy: model.accuracy * 100,
                      Precision: model.precision_score * 100,
                      Recall: model.recall * 100,
                      F1Score: model.f1_score * 100
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="model" />
                      <PolarRadiusAxis angle={90} domain={[85, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="Accuracy"
                        stroke="#2CA6A4"
                        fill="#2CA6A4"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Model Metrics Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Model Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.model_performance.map((model, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{model.model_name}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          {(model.accuracy * 100).toFixed(1)}% Accuracy
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Precision:</span>
                          <div className="font-medium">{(model.precision_score * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Recall:</span>
                          <div className="font-medium">{(model.recall * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">F1 Score:</span>
                          <div className="font-medium">{(model.f1_score * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Threat Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Threat Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.threat_categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {analyticsData.threat_categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {analyticsData.threat_categories.map((threat, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span>{threat.category}</span>
                      </div>
                      <Badge variant="outline">{threat.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Severity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Threat Severity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.threat_categories}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="severity" fill="#E63946" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Detection Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Detection Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analyticsData.detection_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="alerts" fill="#F4A261" />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#2CA6A4" 
                      strokeWidth={3}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="processing_time" 
                      stroke="#2F6690" 
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;