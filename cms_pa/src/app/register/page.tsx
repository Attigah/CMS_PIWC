"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter} from "next/navigation";

const Register = () => {
    const [error, setError] = useState("");
    const router = useRouter();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
      };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const FirstName = e.target[0].value;
        const LastName = e.target[1].value;
        const email = e.target[2].value;
        const password = e.target[3].value;

        if (!isValidEmail(email)) {
            setError("Email is invalid");
            return;
          }
      
          if (!password || password.length < 8) {
            setError("Password is invalid");
            return;
          }
        
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                "content-Type": "application/json"
                },
                body: JSON.stringify({
                    FirstName,
                    LastName,
                    email,
                    password
                })
            })
            if(res.status === 400){
                setError("This email is already registered");
            }
            if(res.status === 201) {
                setError("");
                router.push("/login");
            }
        } catch(error) {
            setError("Error, try again");
            console.log(error);
        }


    };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-[#212121] p-8 rounded shadow-md w-96">
            <h1 className="text-4xl text-center font-semibold mb-8">Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text"
                    className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                    placeholder="FirstName"
                    required
                    />

                <input type="text"
                    className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                    placeholder="LastName"
                    required
                    />

                    <input type="text"
                    className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                    placeholder="Email"
                    required
                    />

                <input
                type="password"
                className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
                placeholder="Password"
                required
                />

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    {" "}
                    Register
                </button>
                <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
            </form>
            <div className="text-center text-gray-500 mt-4">- OR -</div>

            <Link 
            className="block text-center text-blue-500 hover:underline mt-2"
            href="/login">


            Login with an existing
            </Link>
        </div>
    </div>
  )
}

export default Register