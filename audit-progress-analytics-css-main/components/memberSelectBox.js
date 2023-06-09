export default function MemberSelectBox({staff,userInfo,handleChange}){
    const staffList = [userInfo.name];
    for(let s of staff)
        if(!staffList.includes(s.name))
            staffList.push(s.name);
    return(
            <select id={"staffName"} defaultValue={''} style={{background: "inherit"}} onChange={handleChange}>
                {staffList.map((staff, i)=>{
                    return (<option key={i} value={staff}>{staff}</option>);
                })}
            </select>
    );
}