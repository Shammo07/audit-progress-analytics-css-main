import classnames from "classnames";
import { getUser,getSuperAdmin } from "../api/user";
import { getLogo,getCompanyName } from "@/api/company";
import React, { useState, useRef, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from "@mui/icons-material/Close"
import Link from 'next/link'
import { handleRefresh, refreshOnServer } from "@/lib/auth";
import { getCompanySetting } from "@/lib/company";

function useOutsideClickListener(ref,setMenuOpen) {
  useEffect(() => {
    function closeMenuIfOpened(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", closeMenuIfOpened);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", closeMenuIfOpened);
    };
  }, [ref]);
}

export default function Menu({ activeName }, props) {
  const [menuOpen,setMenuOpen] =useState(false)
  const wrapperRef= useRef(null);
  useOutsideClickListener(wrapperRef,setMenuOpen)

  const routes = [

    {
      name:"Analytics",
      url:"/analyticsMain",
      isActive: false,
    }, 
    {
      name: "Logout",
      url: "/logout",
      isActive: false,
    },

  ];

  const activeItem = routes.find((item) => item.name === activeName);
  if (activeItem) {
    activeItem.isActive = true;
  } /*else {
    routes[0].isActive = true;
  }*/
  const [userData, setUserData] = useState([]);
  const [logo,setLogo] = useState(null)
  const [companyName,setCompanyName] = useState(null)
  const [isSuperAdmin,setIsSuperAdmin] = useState(false)

  useEffect(() => {
    const userRight = getUser()
    setUserData(userRight[0])

    const newLogo = getLogo()
    console.log("🚀 ~ file: menu.js:107 ~ useEffect ~ newLogo", newLogo)
    setLogo(newLogo)

    const newCompanyName = getCompanyName()
    console.log("🚀 ~ file: menu.js:111 ~ useEffect ~ newCompanyName", newCompanyName)
    setCompanyName(newCompanyName)

    const superAdmin = getSuperAdmin()
    console.log("🚀 ~ file: menu.js:113 ~ useEffect ~ superAdmin", superAdmin)
    setIsSuperAdmin(superAdmin)

  }, []);

  const linkItems = routes.map((item) => {
      return (
        <div className="menuitem" key={item.url}>
          <Link
            href={item.url}
          >
            <div onClick={()=>setMenuOpen(false)} className={classnames("link-block", "w-inline-block", {
              active: item.isActive,
            })}>
              <h4 className={classnames("link-text", { active: item.isActive })}>
                {item.name}
              </h4>
            </div>
          </Link>
        </div>
      );
  });


  return (
    <nav className="menu" ref={wrapperRef}>
      <div className="menutop">
        <div className="logo">
          <img
            src={logo!=undefined?"https://jobprogress.s3.us-east-2.amazonaws.com/"+logo:"/img/favicon.ico"}
            width="180"
            height="50"
            alt="company logo"
          />
    {/*       <h3 className="company-name">{companyName!=undefined?companyName:"PerformVE"}</h3> */}
        </div>
        <div className={"menuButton"}>
          {!menuOpen?
            <MenuIcon sx={{color: "white" }} onClick={()=> setMenuOpen(true)}/>:
            <CloseIcon sx={{color: "white" }} onClick={()=> setMenuOpen(false)}/>}
        </div>
      </div>
      <div className={classnames("menuItems",{show:menuOpen})}>
        {linkItems}
      </div>
    </nav>
  );
}

/* export async function getServerSideProps(context) {
  const jwt = getCookie("JWT", context.req);
  let accessRight;
  let result;
  let user;
  try {
    user = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);
  } catch (error) {
    access_token = refreshOnServer(context.req);

    if (access_token) {
      user = jsonwebtoken.verify(access_token, process.env.JWT_SECRET);
    } else if (access_token === undefined) {

    }

    if(user){
      result =  await getCompanySetting(user)
      console.log("🚀 ~ file: menu.js:168 ~ getServerSideProps ~ result", result)
    }

  }



  return{
  props:{

  }
}
} */
