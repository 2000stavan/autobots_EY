export interface Alert {
  id: string;
  code: string;
  time: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  active: boolean;
}

export interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
  formatValue?: (val: number) => string;
}

export type NavTab = 'Dashboard' | 'Diagnostics' | 'Service' | 'History';