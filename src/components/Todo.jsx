import React from "react";

const Todo = ()=>{
    const [inputVal, setInputVal] = React.useState("")
    const [loding,setLoding] = React.useState(false)
    const [error,setError] = React.useState(false)
    const [todos,setTodos] = React.useState([]);
    const [page,setPage] = React.useState(1)
    const [totalItem, setTotalItem] = React.useState(0)

    React.useEffect(()=>{
        fetchAndUpdataData()
    },[page])

    const fetchAndUpdataData = ()=>{
        setLoding(true)
        fetch(`http://localhost:8000/posts?_page=${page}&_limit=3`)
        .then((res)=>{
           let totalCount = res.headers.get("X-Total-Count")
           setTotalItem(+totalCount)
            return res.json()
        })
        .then((res)=>setTodos(res))
        .catch((err)=>setError(true))
        .finally(()=>setLoding(false))
    }

const addTodo = ()=>{
    const payload = {
        title:inputVal,
        status:false
    }
    const dataPost = JSON.stringify(payload)
    fetch(`http://localhost:8000/posts`,{
        method :"post",
        body : dataPost,
        headers : {
         "content-type": "application/json",
        },
    }).then(()=>{
        fetchAndUpdataData()
        setInputVal("")
    })

}

    return (<div>
       <input type="text" placeholder="Add Your Todo" onChange={(e)=>setInputVal(e.target.value)} value={inputVal}/>
       <button onClick={addTodo}>Add todo</button>
       <hr />
       {loding ? (<div>Loding...</div>) : error ? (<h3>Somthing went wrong</h3>) : (todos.map((todo) =>  <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around"
      }} key={todo.id}> <h3>{todo.title}</h3> <h3>{todo.status ? "Completed" : "Not Completed"}</h3>
       
       </div> ) 
        

       )}

       <button onClick={()=>setPage(page-1)} disabled = {page === 1}>prev</button>
       <button onClick={()=>setPage(page+1)} disabled={page === Math.ceil(totalItem/3)}>Next</button>
    </div>)
}

export {Todo}