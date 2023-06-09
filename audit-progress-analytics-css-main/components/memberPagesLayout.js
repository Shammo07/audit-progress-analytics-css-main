import React from "react";
import Menu from "./menu";
import Head from "next/head";


export default function MemberPagesLayout({children, pageName}){
  return (<>
    <Head>
        <title>Job Progress Management System</title>
    </Head>
    <div className={"layout"}>
      <Menu activeName={pageName}/>
   
      <main className={"main"}>
       {/* <header className={"header"}>{pageName}</header>  */}
        {children}

        <footer className={"footer"}> © {new Date().getFullYear()} PerformVE Limited. All rights reserved. | Room 18, Unit 109B-113, 1/F, Enterprise Place (5W), No. 5 Science Park West Avenue, Hong Kong Science Park</footer>
      </main>
      
    </div>
      
       </>
  )
}
