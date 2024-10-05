"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"
import { PlusCircle, Search } from "lucide-react"
import { useEffect, useState } from "react"

type Chat = {
    id: string
    name: string
    lastMessage?: string
    avatar?: string
    timestamp?: string
}

const mockChats: Chat[] = [
    { id: "1", name: "Alice Smith", lastMessage: "Hey, how's it going?", avatar: "/placeholder.svg?height=40&width=40", timestamp: "5m ago" },
    { id: "2", name: "Bob Johnson", lastMessage: "Can you send me that file?", avatar: "/placeholder.svg?height=40&width=40", timestamp: "2h ago" },
    { id: "3", name: "Carol Williams", lastMessage: "Let's meet tomorrow", avatar: "/placeholder.svg?height=40&width=40", timestamp: "1d ago" },
    { id: "4", name: "David Brown", lastMessage: "Thanks for your help!", avatar: "/placeholder.svg?height=40&width=40", timestamp: "3d ago" },
    { id: "5", name: "Eva Davis", lastMessage: "How about lunch next week?", avatar: "/placeholder.svg?height=40&width=40", timestamp: "1w ago" },
]

export default function HomePage() {
    const [chats, setChats] = useState<Chat[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [myUid, setMyUid] = useState('')

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
        const token = localStorage.getItem('token');
        const myUid = localStorage.getItem('uid');
        if ( myUid) setMyUid(myUid)
        if (token) {
            axios.get('https://api.tkteats.com/api/v1/messages/own-rooms', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log({ roomList: response.data });
                const rooms = response.data.data.data.map((room: any) => {
                    const user = room.user1._id === myUid? room.user2 : room.user1
                    console.log({room,user});
                    
                    return {
                        id: user._id,
                        name: user.name,
                        lastMessage: "",
                        avatar: "",
                        // timestamp: new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                })
                console.log('processed',{rooms});
                setChats(rooms)
                
            })
        }

    }, [])

    const randomPickOne = async () => {
        try {
            const response = await axios.get('https://api.tkteats.com/api/v1/messages/random-pick')
            console.log({ data: response.data });

            const users = response.data.data
            if (users.length < 1) return;
            const randomIndex = Math.floor(Math.random() * users.length);
        // return users[randomIndex];
            window.location.href = `/chat/${users[randomIndex]._id}`;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between py-6 lg:py-8 border-b">
                    <h1 className="text-3xl font-bold">Chats</h1>
                    <Button size="lg" onClick={() => randomPickOne()}>
                        <PlusCircle className="mr-2 h-5 w-5" />
                        New Chat
                    </Button>
                </header>
                <div className="py-6 lg:py-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            className="pl-10 py-6 text-lg"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-grow h-[calc(100vh-240px)]">
                    <div className="space-y-6 pr-4">
                        {
                            filteredChats.length === 0 && <> No contact's found.</>
                        }
                        {filteredChats.map((chat) => (
                            <div key={chat.id} className="flex items-center space-x-6 cursor-pointer hover:bg-muted p-4 rounded-lg transition-colors duration-200"
                                onClick={() => window.location.href = `/chat/${chat.id}`}
                            >
                                <Avatar className="h-14 w-14">
                                    <AvatarImage src={chat.avatar} alt={chat.name} />
                                    <AvatarFallback className="text-lg">{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-baseline">
                                        <h2 className="text-xl font-semibold">{chat.name}</h2>
                                        <span className="text-sm text-muted-foreground">{chat.timestamp}</span>
                                    </div>
                                    <p className="text-base text-muted-foreground truncate mt-1">uid: {chat.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}