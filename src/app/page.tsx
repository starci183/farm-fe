"use client"
import React, { useEffect } from 'react';
import Server from "socket.io-client"
import { Card, RANKS, SUITS } from 'react-playing-cards';
import "react-playing-cards/lib/main.css"
 
export default function Home() {
  // ket noi o client side
  const socket = Server("http://localhost:5001", {
    transports: ["websocket"],
    autoConnect: false,
  });

  const socketRef = React.useRef(socket);

  useEffect(() => { 
    socketRef.current.connect();
    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      // receive pong here
      socketRef.current.on("pong", (data) => { 
        console.log("Received pong:", data);
      });
      // send ping here
      socketRef.current.emit("ping");
    });
  }, [])

  const [joined, setJoined] = React.useState(false);

  const [players, setPlayers] = React.useState<string[]>([]);

  const [name, setName] = React.useState("");

  useEffect(() => {
    socketRef.current.on("joined", () => {
      // cap nhat ds player
      setJoined(true);
    });

    socketRef.current.on("co_nguoi_vao", (newUser: string) => {
      setPlayers([...players, newUser]);
    });

    return () => {
      socketRef.current.off("joined");
      socketRef.current.off("co_nguoi_vao");
    }
  }, [joined, socket, name, players])


  const handleJoin = () => {
    console.log("Joining...");
    socketRef.current.emit("join_room", { name });
  };

  return (
    <div>
      <h1>Welcome to the game</h1>
      <h2>Players:</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>-{player}</li>
        ))}
      </ul>
      <div className='h-10'/>
      {
        !joined ? (
          <div>
          <input type="text" onChange={
            (e) => {
              setName(e.target.value);
            }
          } value={name} 
          placeholder="Enter your name" />
          <button onClick={handleJoin}>Join</button>
        </div>
        ) : (
    <div>
      <Card size={5} rank={RANKS.JACK} suit={SUITS.DIAMONDS} />
      <Card size={5} rank={RANKS.JACK} suit={SUITS.CLUBS} />
      <Card size={5} rank={RANKS.JACK} suit={SUITS.SPADES} />
      <Card size={5} rank={RANKS.JACK} suit={SUITS.HEARTS} />
    </div>
        )
      }
  </div>
  )
}
