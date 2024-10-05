import ChatHistory from "@/components/chat/chatHistory";

export default async function ChatHistoryPage({ params }: { params: { userId: string } }) {
    console.log(params);

    const data = await fetch(`https://api.tkteats.com/api/v1/users/${params.userId}`);
    const response = await data.json();
    const user = response.data.uid;

    return (
        <>
            <ChatHistory userId={params.userId} chatName={user?.name ?? undefined} chatAvatar={user?.profileImage ?? undefined}/>
        </>
    )
}