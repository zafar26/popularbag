'use client'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/router'
import Link from "next/link"
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";
import { signIn, signOut, useSession } from 'next-auth/react';
import { discordLog } from "@/utils/helper";


const Login= ()=> {
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    
    const onSubmit = async (data) => {
        setLoader(true)
        if(session.user){
            data.username = session.user.email
        }
        try {
            const response = await fetch(`${process.env.BASE_URL}api/auth/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
        
            let result = await response.json(); 
            
            if(result.token){
                alert("Loged In")
                localStorage.setItem("token",result.token)
                router.push("/search")
            }else{
                alert("failed")
            }
            setLoader(false)
            
        } catch (error) {
            setLoader(false)
            discordLog("logger",
                `Error: On Login with a message "${error.message}"`,
            )
            // console.error("Error:", error);
            alert("failed")

        }
    }

    if(loader){    
        return <div className='w-screen h-screen bg-white flex justify-center items-center'>
            <ClipLoader
            color={"#4F6F52"}
            loading={loader}
            size={90}
            aria-label="Loading Spinner"
            data-testid="loader"
            />
            </div>
    }
    let expiryDate = new Date(session&& session.expires? session.expires:'');
    let todaysDate = new Date();
    if(( session) && (expiryDate < todaysDate)){
        // console.log("Expired")
        signOut()

    } 
    return (<div className="w-full h-screen p-2 bg-gray-200 flex flex-col items-center">
          <Link href={"/"} className='m-2 absolute right-0 top-0 h-18 bg-green-700 p-2 rounded shadow text-white '>Home</Link>
        
        <div className="md:w-1/3  h-full flex flex-col justify-center items-center bg-green-200 rounded shadow text-green-900">
            <h3 className="flex justify-center text-3xl font-semibold mt-4 ">Login</h3>
            <form className="   w-full px-4"onSubmit={handleSubmit(onSubmit)} >
                    
                {session && session.user 
                ?
                <div className="mt-4 flex justify-center text-center">
                        <p className=" ">Welcome, <br /> {session&&  session.user.name}!</p>
                    {/* <button onClick={() => signOut()}>Sign out</button> */}
                </div>
                : 
                <div className="p-2">
                    <span>User Name</span>
                    <input className="px-4 py-2 w-full rounded shadow"  {...register("username",{ required: true })}/>
                    {errors.username && <span>This field is required</span>}

                </div>}
                <div className="p-2">
                    <span>Password</span>
                    <input type="password" className="px-4 py-2 w-full rounded shadow" {...register("password",{ required: true })}/>
                    {errors.password && <span>This field is required</span>}
                
                </div>
                <div className="p-2 mt-2">
                    <button className="px-4 py-2 w-full bg-green-800 rounded shadow text-white" type="submit">Submit</button>
                </div>
            </form>
            or
            <Link href="/signup" className="p-4 bg-gray-100 rounded shadow">Create an Account</Link>
        
            <div>
            {!session && (
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      ) }

            </div>
        </div>
    </div>)
}

export default Login;