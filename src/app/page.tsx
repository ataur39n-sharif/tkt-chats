import LoginPage from '@/components/auth/login';
import TestPart from './testComponent';


export default function Home() {

  // useEffect(() => {
  //   if (token) {
  //     newSocket.current = io('https://api.tkteats.com', {
  //       auth: {
  //         token,
  //         AppName: 'vite-react',
  //       }
  //     })
  //   }
  // }, [token]);

  // useEffect(() => {
  //   if (token) {
  //     axios.get('https://api.tkteats.com/api/v1/messages/own-rooms', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     }).then(response => {
  //       console.log({ roomList: response.data });
  //     })
  //   }

  //   // axios.get('https://api.tkteats.com/api/v1/messages', )

  // }, [token])

  // console.log({ newSocket: newSocket.current });
  // const disconnect = () => {
  //   newSocket.current.disconnect()
  //   console.log('after disconnect=>', newSocket.current);
  // }

  // newSocket.current?.on('new-message', (data) => {
  //   console.log('new message', data);
  // })

  // const sendMessage = async () => {
  //   const payload = { receiverId, content: message };
  //   const data = await axios.post('https://api.tkteats.com/api/v1/messages/send', payload, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     }
  //   });
  //   console.log({ data });
  // }


  return (
    // <div>
    //   {/* <button
    //     onClick={() => newSocket?.current?.active ? disconnect() : newSocket.connect()}
    //   >
    //     {newSocket.current.active ? 'Connected' : 'Disconnected'}
    //   </button> */}
    //   <button
    //     onClick={() => console.log(newSocket.current?.connected)}
    //   >
    //     click here
    //   </button>
    //   <div>
    //     <label htmlFor="token">Token: </label>
    //     <input type="text" name='token' id='message' onChange={(e) => setToken(e.target.value)} required />
    //     <br />
    //     <label htmlFor="roomId">room id</label>
    //     <input type="text" name="roomId" id="roomId" onChange={(e) => setRoomId(e.target.value)} required />
    //     <button onClick={() => newSocket.current?.emit('joinRoom', roomId)}>
    //       join room
    //     </button>
    //     <br />
    //     <label htmlFor="receiverId">receiver uid: </label>
    //     <input type="text" name="receiverId" id="receiverId" onChange={(e) => setReceiverId(e.target.value)} required />
    //     <br />
    //     <label htmlFor="message">message: </label>
    //     <input type="text" name="message" id="message" onChange={(e) => setMessage(e.target.value)} required />
    //   </div>
    //   <button
    //     onClick={() => sendMessage()}
    //   >
    //     send message
    //   </button>
    // </div>
    <div>
      <LoginPage />
      <TestPart />
    </div>
  );
}
