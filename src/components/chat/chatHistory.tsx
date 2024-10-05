'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"
import { ArrowLeft, MoreVertical, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

type Message = {
  id: string
  content: string
  senderId: string
  timestamp: string
}

type ChatProps = {
  chatId?: string
  chatName?: string
  chatAvatar?: string,
  userId?: string
}

export default function ChatHistory({ chatId = 'default', chatName = 'Unknown', chatAvatar = '/placeholder.svg?height=40&width=40', userId }: ChatProps) {

  const [token, setToken] = useState('');
  const newSocket = useRef<Socket | null>(null)
  const [receiverId, setReceiverId] = useState(userId)
  const [myUid, setMyUid] = useState('')
  const [receiverSocketId, setReceiverSocketId] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    // { id: '1', content: "Hey there! How's it going?", sender: 'other', timestamp: '10:00 AM' },
    // { id: '2', content: "Hi! I'm doing well, thanks. How about you?", sender: 'user', timestamp: '10:02 AM' },
    // { id: '3', content: "I'm great! Just working on some new projects.", sender: 'other', timestamp: '10:05 AM' },
    // { id: '4', content: "That sounds interesting! What kind of projects?", sender: 'user', timestamp: '10:07 AM' },
    // { id: '5', content: "Mostly web development stuff. I'm learning React and Next.js.", sender: 'other', timestamp: '10:10 AM' },
  ])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setToken(token)
    const myUid = localStorage.getItem('uid')
    if (myUid) setMyUid(myUid)
  }, [])

  useEffect(() => {
    if (token) {
      newSocket.current = io('https://api.tkteats.com', {
        auth: {
          token,
          AppName: 'vite-react',
        }
      })
    }
  }, [token, receiverId]);

  useEffect(() => {
    if (token && receiverId) {
      axios.get(`https://api.tkteats.com/api/v1/messages//history-by-uid/${receiverId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log({ data: response.data });
        const messages = response.data.data.messages.map((message:any) => {
          return{
            id: message._id,
            content: message.content,
            senderId: message.senderId._id,
            timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        })

        setMessages(messages)
      })
      .catch(error => {
        console.log(error);
      })
    }
  }, [token,receiverId])

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const payload = { receiverId, content: newMessage };
        const response = await axios.post('https://api.tkteats.com/api/v1/messages/send', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log({ response });
        const data = response.data.data
        const message: Message = {
          id: data._id,
          content: data.content,
          senderId: myUid,
          timestamp: new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        console.log({ message });
        setMessages([...messages, message])
        // newSocket.current?.emit('send-message', {message, receiverId:receiverSocketId});
      } catch (error) {
        console.log(error);
      }
    }
    setNewMessage("")
  }


  // console.log({ newSocket: newSocket.current });
  // console.log({ newMessage });

  newSocket.current?.on('new-message', (data: any) => {
    console.log('new message', data);
    const message: Message = {
      id: data._id,
      content: data.content,
      senderId: data.senderId,
      timestamp: new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages([...messages, message])
  });


  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col h-full">
        <header className="flex items-center justify-between py-6 lg:py-8 border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Avatar className="h-12 w-12">
              <AvatarImage src={chatAvatar} alt={chatName} />
              <AvatarFallback>{chatName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{chatName}</h2>
              <p className="text-sm text-muted-foreground">
                token: <input type="text" name="token" id="token" value={token} readOnly />
              </p>
              <p className="text-sm text-muted-foreground">
                receiverId: {userId}
              </p>
              <p className="text-sm text-muted-foreground">
                My socket id: {newSocket.current?.id ? newSocket.current?.id : 'Not connected'}
              </p>
              {/* <p className="text-sm text-muted-foreground">
                receiver socket id: <input type="text" name="receiverSocketId" id="receiverSocketId" onChange={(e) => setReceiverSocketId(e.target.value)} />
              </p> */}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-6 w-6" />
          </Button>
        </header>
        <ScrollArea className="flex-grow py-6 lg:py-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === myUid ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.senderId === myUid ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-4`}>
                  <p className="text-base">{message.content}</p>
                  <span className="text-xs opacity-50 mt-2 block">{message.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="py-6 lg:py-8">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-4">
            <Input
              className="flex-grow text-lg py-6 px-4"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit" size="lg" className="px-6">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}