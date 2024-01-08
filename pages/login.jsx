'use client'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/router'
import Link from "next/link"


const Login= ()=> {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()
    const router = useRouter()
    
    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${process.env.BASE_URL}api/auth/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
        
            let result = await response.json(); 
            
            if(!result.error){
                alert("Loged In")
                localStorage.setItem("token",result.token)
                router.push("/search")
            }else{
                alert("failed")
            }

        } catch (error) {
            // console.error("Error:", error);
            alert("failed")

        }
    }
    return (<div className="w-full h-screen p-2 bg-gray-200 flex flex-col items-center">
          <Link href={"/"} className='m-2 absolute right-0 top-0 h-18 bg-green-700 p-2 rounded shadow text-white '>Home</Link>
        
        <div className="md:w-1/3  h-full flex flex-col justify-center items-center bg-green-200 rounded shadow text-green-900">
            <h3 className="flex justify-center text-3xl font-semibold mt-4 ">Login</h3>
            <form className="   w-full px-4"onSubmit={handleSubmit(onSubmit)} >
                <div className="p-2">
                    <span>User Name</span>
                    <input className="px-4 py-2 w-full rounded shadow" {...register("username",{ required: true })}/>
                    {errors.username && <span>This field is required</span>}

                </div>
                <div className="p-2">
                    <span>Password</span>
                    <input className="px-4 py-2 w-full rounded shadow" {...register("password",{ required: true })}/>
                    {errors.password && <span>This field is required</span>}
                
                </div>
                <div className="p-2 mt-2">
                    <button className="px-4 py-2 w-full bg-green-800 rounded shadow text-white" type="submit">Submit</button>
                </div>
            </form>
        </div>
    </div>)
}

export default Login;