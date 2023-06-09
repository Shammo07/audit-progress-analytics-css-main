import Menu from "../components/menu"
import MultiInput from '../components/multiInput'
import {useFieldArray, useForm} from "react-hook-form";
import {useState} from "react";


export default function Dashboard(){
  const [memberId,setMemberId]=useState()
  const { register, control, handleSubmit, reset, trigger, setError } = useForm()
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "teamMember"
  })
  const addTeamMember=()=>{
    console.log(memberId)
    append({memberId,memberName:"Alvin"})
  }

  return (
    <>
      <form onSubmit={handleSubmit(data=>console.log(data))}>
        <input className="text-field w-input" onChange={(e)=>setMemberId(e.target.value)}/>
        <button onClick={addTeamMember}>Add</button>

        {fields.map((field,index) =>(
          <div key={field.id} className={"row"}>

            {/*<input type={"hidden"} {...register(`teamMember.${index}.memberName`)} {...field}/>*/}
            <input type={"hidden"} {...register(`teamMember.${index}.memberId`)} {...field}/>
            <input type={"hidden"} {...register(`teamMember.${index}.memberName`)} {...field}/>
            <p>{field.memberName}</p>

            <button onClick={()=>remove(index)}>X</button>
          </div>
          // <input className="text-field w-input" />
        ))}
      </form>
    </>
  )
}
