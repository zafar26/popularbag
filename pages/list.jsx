'use client'
// import {
//     useQuery,
//     useQueryClient,
//   } from '@tanstack/react-query'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react';

// function useBooks() {
//     return useQuery({
//         queryKey: ['books'],
//         queryFn: async () => {
            
//         },
//     })
// }
const List= ()=> {
    // const queryClient = useQueryClient()
    // const { status, data, error, isFetching } = useBooks()
    const router = useRouter()
    const[data, setData] = useState([])
  
    useEffect(()=>{
        if(data.length < 1){
            fetch(`${process.env.BASE_URL}api/books/user`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
                })
                .then(r=>r.json())
                .then(r=>{
                    if(r.books.length >0){
                        setData(r.books)
                    }
                })
                .catch(err=>console.log(err))
        }
        
    })
    const unPublish = async(e) =>{
        try {
            const response = await fetch(`${process.env.BASE_URL}api/books/unpublish/${e.target.id}`, {
              method: "PUT", 
              headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
              },
            });
        
            let result = await response.json(); 
            if(result.error){
                alert("Failed to Unpublish")
            }
            alert("Unpublished")
            router.reload()
            
        } catch (error) {
            // console.error("Error:", error);
            alert("Failed to Unpublish")
          }
    }
    return (<div className="w-full h-screen p-2 bg-gray-200 flex flex-col items-center">
        
          <Link href={"/"} className='m-2 absolute right-0 top-0 h-18 bg-green-700 p-2 rounded shadow text-white '>Home</Link>
        <div className="md:w-1/2  h-full flex flex-col justify-start items-center bg-green-200 rounded shadow text-green-900">
            <h3 className="flex justify-center text-3xl font-semibold mt-4 ">My Books</h3>
           
            <div className="overflow-auto w-full h-full px-8 py-2">
                {/* All Books */}
                <div className="w-full h-full bg-gray-100 p-4">
                    {
                            //Data
                            data && data.length > 0 && data.map(d=>    
                                <div className={`w-full h-24 p-2 my-2 flex justify-between rounded shadow text-white ${d.is_published? "bg-green-900 ":" bg-red-900 " } `} key={d._id}>
                                    <div className="w-full ">
                                            <p className="font-light"><span className='font-light'>Author :</span> {d.author}</p>
                                        
                                            <p className="font-bold"><span className='font-light'>Title :</span> {d.title}</p>
                                        
                                            <p className=""><span className='font-light'>Description :</span>{d.description}</p>
                                    </div>
                                    {
                                        d.is_published &&
                                            <div className="">
                                                <button className="bg-red-900 p-2 rounded shadow text-white" id={d._id} onClick={unPublish}>Un Publish</button>
                                            </div>
                                    }
                                </div>
                            )
                    }  
                </div>
            </div>
        </div>
        
    </div>)
}

export default List;