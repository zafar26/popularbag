'use client'
import { discordLog } from "@/utils/helper";
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react";
import { useForm } from "react-hook-form"
import ClipLoader from "react-spinners/ClipLoader";


const Publish= ()=> {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    
    const onSubmit = async(data) => {
        setLoader(true)
        try {
            const response = await fetch(`${process.env.BASE_URL}api/books/publish`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")

              },
              body: JSON.stringify(data),
            });
        
            let result = await response.json(); 
            
            if(result.error){
                alert("failed")
            }else{
                alert("Published")
                router.push("/")
            }
            setLoader(false)

        } catch (error) {
            discordLog("logger",
                `Error: Failed to Add with a message "${error.message}"`,
            )
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
    return (<div className="w-full h-screen p-2 bg-gray-200 flex flex-col items-center">
                <Link href={"/"} className='m-2 absolute right-0 top-0 h-18 bg-green-700 p-2 rounded shadow text-white '>Home</Link>

        <div className="md:w-1/3  h-full flex flex-col justify-center items-center bg-green-200 rounded shadow text-green-900">
            <h3 className="flex justify-center text-3xl font-semibold mt-4 ">Publish a book</h3>
            <form className="   w-full px-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="p-2">
                    <span>Title</span>
                    <input className="px-4 py-2 w-full rounded shadow" {...register("title",{ required: true })}/>
                    {errors.title && <span>This field is required</span>}
                </div>
                <div className="p-2">
                    <span>Author</span>
                    <input className="px-4 py-2 w-full rounded shadow" {...register("author")}/>
                </div>
                <div className="p-2">
                    <span>Description</span>
                    <textarea rows="4" cols="50" name="comment" form="usrform" className="px-4 py-2 w-full rounded shadow" {...register("description")} placeholder="Enter Description"/>

                </div>
                
                <div className="p-2 mt-2">
                    <button type="submit" className="px-4 py-2 w-full bg-green-800 rounded shadow text-white">Submit</button>
                </div>
            </form>
        </div>
    </div>)
}

export default Publish;