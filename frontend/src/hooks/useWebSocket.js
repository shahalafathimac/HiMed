import { useEffect, useRef, useState, useCallback } from 'react';
import useAuthStore from '../store/useAuthStore';

export function useWebSocket(onNotification) {
  const { isAuthenticated } = useAuthStore();
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const onNotificationRef = useRef(onNotification);

  onNotificationRef.current = onNotification;

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${protocol}://${window.location.host}/ws/notifications/`;

    ws.current = new WebSocket(url);

    ws.current.onopen = () => setIsConnected(true);

    ws.current.onclose = () => setIsConnected(false);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onNotificationRef.current) {
          onNotificationRef.current(data);
        }
      } catch (e) {
        console.error('WebSocket message parse error:', e);
      }
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      setIsConnected(false);
    };
  }, [isAuthenticated, connect]);

  return { isConnected };
}

export default useWebSocket;
