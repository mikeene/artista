import { Bell, Heart, MessageCircle, UserPlus, AtSign, Check } from 'lucide-react';
import { useNotificationStore, useAuthStore } from '@/store';
import { cn, timeAgo } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import type { NotificationType } from '@/types';

const ICONS: Record<NotificationType, React.ReactNode> = {
  like:    <Heart className="w-3.5 h-3.5 text-red-400" />,
  comment: <MessageCircle className="w-3.5 h-3.5 text-blue-400" />,
  follow:  <UserPlus className="w-3.5 h-3.5 text-green-400" />,
  mention: <AtSign className="w-3.5 h-3.5 text-violet" />,
  message: <MessageCircle className="w-3.5 h-3.5 text-gold" />,
};

const TYPE_LABELS: Record<NotificationType, string> = {
  like:    'liked your artwork',
  comment: 'commented on your artwork',
  follow:  'started following you',
  mention: 'mentioned you',
  message: 'sent you a message',
};

export default function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();
  const { user } = useAuthStore();

  // Only show notifications for the current real user
  const myNotifications = notifications.filter(n => n.toUserId === user?.id || n.toUserId === 'current');

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-20 lg:pt-24">

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="section-label">Inbox</div>
            <h1 className="font-serif font-bold text-2xl lg:text-3xl text-ink tracking-tight">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 text-sm font-sans font-medium text-terracotta">
                  {unreadCount} new
                </span>
              )}
            </h1>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-medium text-ink/60 hover:text-terracotta transition-colors">
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {myNotifications.length === 0 ? (
          <div className="text-center py-24">
            <Bell className="w-12 h-12 text-ink/20 mx-auto mb-4" />
            <p className="font-serif text-2xl text-ink/30 mb-2">All caught up!</p>
            <p className="text-sm text-ink/40">
              When someone likes, comments on, or follows you — it'll show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {myNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200',
                  notif.read ? 'hover:bg-warm' : 'bg-terracotta/5 hover:bg-terracotta/8 border border-terracotta/10'
                )}
              >
                <div className="relative flex-shrink-0">
                  <Avatar user={notif.fromUser} size="md" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-[var(--border)]">
                    {ICONS[notif.type]}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink leading-snug">
                    <span className="font-semibold">{notif.fromUser.displayName}</span>
                    {' '}{notif.message ?? TYPE_LABELS[notif.type]}
                    {notif.post && (
                      <span className="text-ink/60"> — <em className="font-medium text-ink not-italic">{notif.post.title}</em></span>
                    )}
                  </p>
                  <p className="text-xs text-ink/40 mt-1">{timeAgo(notif.createdAt)}</p>
                </div>
                {notif.post && (
                  <div className={cn('w-12 h-12 rounded-lg overflow-hidden flex-shrink-0', notif.post.imageUrl)} />
                )}
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-terracotta flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
