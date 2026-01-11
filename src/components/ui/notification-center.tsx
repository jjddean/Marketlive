import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'shipment' | 'payment' | 'document' | 'system' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  useEffect(() => {
    // Mock initial notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Shipment Delayed',
        message: 'SH-2024-145 has been delayed due to port congestion. New ETA: Aug 6, 2024',
        type: 'shipment',
        priority: 'high',
        timestamp: '2024-08-01T14:30:00Z',
        read: false,
        actionUrl: '/shipments/SH-2024-145',
        actionText: 'View Details'
      },
      {
        id: '2',
        title: 'Payment Received',
        message: 'Payment of £12,450 received for invoice INV-2024-089',
        type: 'payment',
        priority: 'medium',
        timestamp: '2024-08-01T13:15:00Z',
        read: false,
        actionUrl: '/payments/INV-2024-089',
        actionText: 'View Invoice'
      },
      {
        id: '3',
        title: 'Document Required',
        message: 'Commercial invoice needed for SH-2024-156 customs clearance',
        type: 'document',
        priority: 'urgent',
        timestamp: '2024-08-01T12:45:00Z',
        read: false,
        actionUrl: '/compliance/SH-2024-156',
        actionText: 'Upload Document'
      },
      {
        id: '4',
        title: 'Customs Cleared',
        message: 'SH-2024-132 has successfully cleared customs in Hamburg',
        type: 'shipment',
        priority: 'low',
        timestamp: '2024-08-01T11:20:00Z',
        read: true,
        actionUrl: '/shipments/SH-2024-132',
        actionText: 'Track Shipment'
      },
      {
        id: '5',
        title: 'System Maintenance',
        message: 'Scheduled maintenance window: Aug 3, 2024 02:00-04:00 UTC',
        type: 'system',
        priority: 'medium',
        timestamp: '2024-08-01T10:00:00Z',
        read: true
      }
    ];

    setNotifications(mockNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: 'Live Update',
          message: `Shipment SH-2024-${Math.floor(Math.random() * 999)} location updated`,
          type: 'shipment',
          priority: 'low',
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: '/shipments',
          actionText: 'View Shipments'
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'urgent':
        return notification.priority === 'urgent';
      default:
        return true;
    }
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shipment': return '🚢';
      case 'payment': return '💰';
      case 'document': return '📄';
      case 'system': return '⚙️';
      case 'alert': return '⚠️';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("relative", className)}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v3.5" />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'urgent', label: 'Urgent', count: urgentCount }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-md transition-colors",
                    filter === tab.key
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-3 border-b border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="w-full"
              >
                Mark All as Read
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <p>No notifications</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 border-l-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                    getPriorityColor(notification.priority),
                    !notification.read && "bg-blue-50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "text-sm font-medium",
                          !notification.read ? "text-gray-900" : "text-gray-600"
                        )}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                      {notification.actionUrl && (
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            {notification.actionText || 'View'}
                          </Button>
                        </div>
                      )}
                    </div>

                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <Button variant="outline" className="w-full" size="sm">
              View All Notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
