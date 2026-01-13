import { useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { 
  Bell, 
  CheckCircle, 
  CheckCheck, 
  Clock, 
  Info, 
  AlertCircle,
  XCircle
} from "lucide-react";

export default function Notifications() {
  const { notifications, markAllRead } = useNotification();

  useEffect(() => {
    markAllRead();
  }, []);

  const getNotificationIcon = (type) => {
    const icons = {
      info: <Info className="w-4 h-4 text-blue-500" />,
      success: <CheckCircle className="w-4 h-4 text-green-500" />,
      warning: <AlertCircle className="w-4 h-4 text-yellow-500" />,
      error: <XCircle className="w-4 h-4 text-red-500" />,
      default: <Bell className="w-4 h-4 text-gray-500" />
    };
    return icons[type] || icons.default;
  };

  const getNotificationType = (message) => {
    // You can implement logic based on message content or add type to notification object
    if (message.toLowerCase().includes('success') || message.toLowerCase().includes('completed')) 
      return 'success';
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) 
      return 'error';
    if (message.toLowerCase().includes('warning') || message.toLowerCase().includes('attention')) 
      return 'warning';
    return 'info';
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 bg-white rounded-xl shadow-sm border">
                <Bell className="w-6 h-6 text-gray-700" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-500 text-sm">
                {notifications.length === 0 
                  ? 'No notifications yet'
                  : `${notifications.length} total • ${unreadCount} unread`
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              ${unreadCount > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You don't have any notifications right now. When you do, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const type = getNotificationType(notification.message);
                
                return (
                  <div
                    key={notification.id}
                    className={`
                      flex items-start gap-4 p-4 transition-all duration-200
                      ${notification.read 
                        ? 'bg-white hover:bg-gray-50' 
                        : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500'
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                      ${notification.read ? 'bg-gray-100' : 'bg-white shadow-sm'}
                    `}>
                      {getNotificationIcon(type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`
                        text-sm leading-relaxed
                        ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}
                      `}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTime(notification.time)}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full
                            ${type === 'success' ? 'bg-green-100 text-green-800' :
                              type === 'error' ? 'bg-red-100 text-red-800' :
                              type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'}
                          `}>
                            {type}
                          </span>
                          
                          {!notification.read && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              Unread
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                      {notification.read ? (
                        <CheckCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {notifications.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                {unreadCount} unread
              </span>
              <span className="flex items-center gap-1">
                <CheckCheck className="w-3 h-3" />
                {notifications.length - unreadCount} read
              </span>
            </div>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Back to top ↑
            </button>
          </div>
        )}
      </div>
    </div>
  );
}