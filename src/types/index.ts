// Define AlertItem interface
export interface AlertItem {
  id: string;
  alertid: string;
  time: string; // Date string format
  category: string;
  header: string;
  text: string;
  ttlseconds: string;
  redwebno: string;
  title: string;
}

export interface AlertResponse {
  date: string;
  status: number;
  items: AlertItem[];
}
