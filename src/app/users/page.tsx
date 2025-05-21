"use client"
import { useEffect, useState } from "react";
import axios from "axios";

const Page = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users, setUsers] = useState<Array<any>>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await axios.get("http://localhost:5000/users");
            console.log(response.data);
            setUsers(response.data);
            } catch (error) {
            console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }
    ,[])
  return (
    <div>
      <h1>Users</h1>
      <p>List of users</p>
        <ul>
            {users.map((user, index) => (
            <li key={index}>{user.name}</li>
            ))}
        </ul>
    </div>
  );
}

export default Page;