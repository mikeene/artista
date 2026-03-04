import { useState, useEffect, useRef } from 'react';
import { Send, Search, ArrowLeft, MessageCircle } from 'lucide-react';
import { useChatStore, useAuthStore } from '@/store';
import { cn, timeAgo } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';

export default function Messages() {
  const { user } = useAuthStore();
  const { chats, activeChat, messages, setActiveChat, sendMessage } = useChatStore();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(c => c.id === activeChat);
  const chatMessages = activeChat ? (messages[activeChat] ?? []) : [];
  const otherUser = currentChat?.participants.find(p => p.id !== user?.id);

  // Filter out mock chats for real users — only show chats they're actually in
  const myChats = chats.filter(c =>
    c.participants.some(p => p.id === user?.id || p.id === 'current')
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeChat || !user) return;
    sendMessage(activeChat, input.trim(), user);
    setInput('');
  }

  const filteredChats = myChats.filter(c => {
    if (!query) return true;
    const other = c.participants.find(p => p.id !== user?.id);
    return other?.displayName.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen pt-16 pb-16 md:pb-0">
      <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex">

        {/* ── Chat list ── */}
        <div className={cn(
          'w-full md:w-80 flex-shrink-0 border-r border-[var(--border)] flex flex-col',
          activeChat ? 'hidden md:flex' : 'flex'
        )}>
          <div className="p-4 border-b border-[var(--border)]">
            <h1 className="font-serif font-bold text-xl text-ink mb-3">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input className="input pl-9 py-2 text-sm" placeholder="Search conversations…" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageCircle className="w-10 h-10 text-ink/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-ink/40">No messages yet</p>
                <p className="text-xs text-ink/30 mt-1">Visit an artist's profile and send them a message</p>
              </div>
            ) : (
              filteredChats.map(chat => {
                const other = chat.participants.find(p => p.id !== user?.id);
                const isActive = activeChat === chat.id;
                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150 border-b border-[var(--border)]',
                      isActive ? 'bg-terracotta/5' : 'hover:bg-warm'
                    )}
                  >
                    <div className="relative">
                      <Avatar user={other} size="md" />
                      {chat.unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-ink truncate">{other?.displayName}</p>
                        <span className="text-[10px] text-ink/40 flex-shrink-0 ml-2">
                          {chat.lastMessage && timeAgo(chat.lastMessage.createdAt)}
                        </span>
                      </div>
                      {chat.lastMessage && (
                        <p className={cn('text-xs truncate mt-0.5', chat.unreadCount > 0 ? 'text-ink/80 font-medium' : 'text-ink/50')}>
                          {chat.lastMessage.senderId === user?.id ? 'You: ' : ''}
                          {chat.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Chat thread ── */}
        {activeChat && otherUser ? (
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] bg-warm flex-shrink-0">
              <button onClick={() => setActiveChat(null)} className="md:hidden p-1.5 rounded-lg hover:bg-black/5 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Avatar user={otherUser} size="sm" />
              <div>
                <p className="text-sm font-semibold text-ink">{otherUser.displayName}</p>
                <p className="text-xs text-ink/50">{otherUser.artInterests?.[0]} · {otherUser.location}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Avatar user={otherUser} size="xl" className="mx-auto mb-3" />
                  <p className="font-serif font-bold text-lg text-ink">{otherUser.displayName}</p>
                  <p className="text-sm text-ink/50 mt-1">Start the conversation ✨</p>
                </div>
              ) : (
                chatMessages.map(msg => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={cn('flex gap-2', isMe && 'flex-row-reverse')}>
                      {!isMe && <Avatar user={msg.sender} size="xs" className="mt-1 flex-shrink-0" />}
                      <div className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                        isMe ? 'bg-terracotta text-white rounded-tr-sm' : 'bg-warm border border-[var(--border)] text-ink rounded-tl-sm'
                      )}>
                        <p>{msg.content}</p>
                        <p className={cn('text-[10px] mt-1', isMe ? 'text-white/60' : 'text-ink/40')}>
                          {timeAgo(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border)] bg-warm flex-shrink-0">
              <input
                className="input flex-1 py-2.5 text-sm"
                placeholder={`Message ${otherUser.displayName}…`}
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 flex items-center justify-center bg-terracotta text-white rounded-lg hover:bg-ink transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                <Send className="w-7 h-7 text-terracotta" />
              </div>
              <p className="font-serif font-bold text-xl text-ink mb-2">Your messages</p>
              <p className="text-sm text-ink/50">Select a conversation or visit an artist's profile to start one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
