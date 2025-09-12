import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Bell, 
  X, 
  Eye, 
  Clock,
  MapPin,
  CreditCard,
  Brain,
  Zap,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AlertData {
  id: string;
  alert_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  is_dismissed: boolean;
  metadata?: {
    transaction_id?: string;
    ensemble_score?: number;
    model_scores?: {
      random_forest: number;
      lstm: number;
      xgboost: number;
    };
    risk_factors?: string[];
    recommended_actions?: string[];
    confidence?: number;
    amount?: number;
    merchant?: string;
    location?: string;
  };
}

const RealTimeAlertSystem = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertStats, setAlertStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    resolved: 0
  });
  const { toast } = useToast();

  // Real-time alert subscription
  useEffect(() => {
    let channel: any;

    if (isMonitoring) {
      channel = supabase
        .channel('real-time-alerts')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'real_time_alerts'
          },
          (payload) => {
            const newAlert = payload.new as AlertData;
            setAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep last 20 alerts
            
            // Update stats
            setAlertStats(prev => ({
              ...prev,
              total: prev.total + 1,
              [newAlert.severity]: prev[newAlert.severity] + 1
            }));

            // Show toast for critical alerts
            if (newAlert.severity === 'critical') {
              toast({
                title: "🚨 Critical Fraud Alert",
                description: newAlert.title,
                variant: "destructive"
              });
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [isMonitoring, toast]);

  // Load existing alerts
  useEffect(() => {
    if (isMonitoring) {
      loadAlerts();
    }
  }, [isMonitoring]);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('real_time_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setAlerts((data || []).map(alert => ({
        ...alert,
        severity: alert.severity as 'critical' | 'high' | 'medium' | 'low',
        metadata: alert.metadata as AlertData['metadata']
      })));
      
      // Calculate stats
      const stats = (data || []).reduce((acc, alert) => {
        acc.total++;
        acc[alert.severity]++;
        if (alert.is_dismissed) acc.resolved++;
        return acc;
      }, {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        resolved: 0
      });
      
      setAlertStats(stats);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      await supabase
        .from('real_time_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      );
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      await supabase
        .from('real_time_alerts')
        .update({ is_dismissed: true })
        .eq('id', alertId);

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      setAlertStats(prev => ({ ...prev, resolved: prev.resolved + 1 }));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      case 'high': return <Shield className="h-5 w-5" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      case 'low': return <Eye className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-tusk-teal" />
              Real-Time Alert System
              {isMonitoring && (
                <div className="flex items-center gap-2 ml-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600">Live</span>
                </div>
              )}
            </CardTitle>
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? "destructive" : "default"}
              className="bg-tusk-teal hover:bg-tusk-accent text-black"
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Alert Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: 'Total', value: alertStats.total, color: 'text-blue-600' },
              { label: 'Critical', value: alertStats.critical, color: 'text-red-600' },
              { label: 'High', value: alertStats.high, color: 'text-orange-600' },
              { label: 'Medium', value: alertStats.medium, color: 'text-yellow-600' },
              { label: 'Low', value: alertStats.low, color: 'text-blue-600' },
              { label: 'Resolved', value: alertStats.resolved, color: 'text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Live Fraud Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {isMonitoring ? (
                <div className="space-y-2">
                  <Shield className="h-12 w-12 mx-auto text-gray-300" />
                  <p>No alerts detected. System is monitoring...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Bell className="h-12 w-12 mx-auto text-gray-300" />
                  <p>Start monitoring to see real-time fraud alerts</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {!alert.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <AlertDescription className="text-sm mb-2">
                          {alert.message}
                        </AlertDescription>

                        {alert.metadata && (
                          <div className="space-y-2">
                            {/* Transaction Details */}
                            {alert.metadata.transaction_id && (
                              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-3 w-3" />
                                  <span>ID: {alert.metadata.transaction_id}</span>
                                </div>
                                {alert.metadata.amount && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-mono">${alert.metadata.amount.toLocaleString()}</span>
                                  </div>
                                )}
                                {alert.metadata.merchant && (
                                  <div className="flex items-center gap-1">
                                    <span>{alert.metadata.merchant}</span>
                                  </div>
                                )}
                                {alert.metadata.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{alert.metadata.location}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* ML Model Scores */}
                            {alert.metadata.model_scores && (
                              <div className="bg-gray-50 p-2 rounded text-xs">
                                <div className="font-medium mb-1">ML Model Scores:</div>
                                <div className="grid grid-cols-3 gap-2">
                                  <span>RF: {(alert.metadata.model_scores.random_forest * 100).toFixed(1)}%</span>
                                  <span>LSTM: {(alert.metadata.model_scores.lstm * 100).toFixed(1)}%</span>
                                  <span>XGB: {(alert.metadata.model_scores.xgboost * 100).toFixed(1)}%</span>
                                </div>
                              </div>
                            )}

                            {/* Risk Factors */}
                            {alert.metadata.risk_factors && alert.metadata.risk_factors.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {alert.metadata.risk_factors.slice(0, 3).map((factor, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {factor}
                                  </Badge>
                                ))}
                                {alert.metadata.risk_factors.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{alert.metadata.risk_factors.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(alert.created_at).toLocaleTimeString()}</span>
                          {alert.metadata?.confidence && (
                            <span className="ml-2">
                              Confidence: {(alert.metadata.confidence * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-2">
                      {!alert.is_read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(alert.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAlertSystem;