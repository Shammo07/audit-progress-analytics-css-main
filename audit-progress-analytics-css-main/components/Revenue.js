//import data from "../../data.json";
import ReactEcharts from 'echarts-for-react';
import { useState, useRef, useEffect } from 'react';
import { getAnalytics } from "api/analytics";
import { handleRefresh } from "lib/auth";

import { useRouter } from "next/router";
import {getAllJob, getOwnJob} from "@/lib/job";
import { setCookie, getCookie } from "lib/cookie";
import {refreshOnServer} from "lib/auth";
import { InferGetServerSidePropsType } from 'next';

import styles from "../styles/analytics.module.scss"

//return chart option
function getOptions(state, totalRevenue, completedJobArr, completedRevenue, WIPJobArr, WIPRevenue) {
  return {
    width: "100%",
    title: {
      triggerEvent: true,
      text: (state === "All" ? (WIPJobArr.length + completedJobArr.length) + '\n $' + totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : state === "Completed" ? completedJobArr.length + '\n $' + completedRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : WIPJobArr.length + '\n $' + WIPRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
      x: 'center',
      name: 'title',
      top: '150',
      textStyle: {
        fontWeight: '400',
        fontSize: '12'
      }
    },
    tooltip: {
      trigger: 'item',
    },
    series: [{
      type: 'pie',
      radius: ['30%', '62%'],
      center: ['50%', '55%'],
      itemStyle: {
        borderWidth: 3,
        borderType: 'solid',
        borderColor: '#FFFFFF',
      },
      label: {
        show: true,
        //overflow: "break"
      },
      data: [
        {
          value: completedJobArr.length,
          name: '# of completed jobs',
          groupId: 'completed'
        },
        {
          value: WIPJobArr.length,
          name: '# of WIP jobs',
          groupId: 'WIP'
        }
      ],
    }]
  };
}

const AgreedRevenueOverview = (props) => {
  const [option, setOption] = useState({});
  // const [displayArr, setDisplayArr] = useState([])
  const [completedJobArr, setCompletedJobArr] = useState([])
  const [WIPJobArr, setWIPJobArr] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [completedRevenue, setCompletedRevenue] = useState(0)
  const [WIPRevenue, setWIPRevenue] = useState(0)
  const [state, setState] = useState("All");

  // const jobArray = props.jobArray;
  // console.log(jobArray, "jobArr");
  // const router = useRouter();
  // if (props.expire) {
  //   router.push("/logout");
  //   return <Loading />;
  // } else if (!props.authorized) {
  //   return <Error statusCode={403} />;
  // }

  function getJobAnalytics() {
    getAnalytics()
    .then((res) => {
   
      const data = res.data;

    
      //get list and revenue of completed and WIP job + set state
      const completedJobArr = data.filter(data => data.status === "completed");
      const WIPJobArr = data.filter(data => data.status === "WIP");

      console.log(completedJobArr, "job arr");
      completedJobArr.sort((a, b) => { return b.revenue - a.revenue; });
      WIPJobArr.sort((a, b) => { return b.revenue - a.revenue; });

      setCompletedJobArr(completedJobArr)
      setWIPJobArr(WIPJobArr)

      const totalRevenue = data.reduce((accumulator, data) => { return accumulator + data.revenue; }, 0)
      const completedRevenue = completedJobArr.reduce((accumulator, data) => { return accumulator + data.revenue; }, 0)
      const WIPRevenue = WIPJobArr.reduce((accumulator, data) => { return accumulator + data.revenue; }, 0)

      setTotalRevenue(totalRevenue)
      setCompletedRevenue(completedRevenue)
      setWIPRevenue(WIPRevenue)

      setOption(getOptions(state, totalRevenue, completedJobArr, completedRevenue, WIPJobArr, WIPRevenue, data1))

      // output arr
      // setDisplayArr(state === "Completed" ? completedJobArr : WIPJobArr);
    }).catch(async (err)=>{
      if(err.response.status===401)
      handleRefresh(getJobAnalytics);
  })

  }



  
  useEffect(() => {
    getJobAnalytics() 
  }, [])

  //on click event of chart
  const chartevents = {
    'click': (params) => {
      //if on click title (text in middle)
      if (params.componentType === 'title') {
        setState("All");
      }
      if (params.data) {
        //if the sector clicked have groupId of "completed" or "WIP"
        if (params.data.groupId === 'completed') {
          setState("Completed");
          //console.log("just changed to", state);
        }
        else if (params.data.groupId === 'WIP') {
          setState("WIP");
        }
      }
    }
  }

  

  
  //when state change update chart option (title will change)
  useEffect(() => {
    //console.log("changing state to", state);
    setOption(getOptions(state, totalRevenue, completedJobArr, completedRevenue, WIPJobArr, WIPRevenue));
  }, [state]);

  return (
    <div className={styles.revenue}>
  <h4 className={styles.chartTitle}>Agreed Revenue Overview {state === "Completed" ? ": Completed Jobs" : state === "WIP" ? ": WIP Jobs" : ""}</h4>
      <div className={styles.chartDiv}>
        
        <ReactEcharts option={option} onEvents={chartevents} className={styles.chart} />
      </div>

      {state != "All" &&
        <div className={styles.tableDiv}>
          {/* <h4 className="tableTitle">{state} Jobs</h4> */}
          <table className={styles.tableStyle}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Company</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {state === "Completed" ?
                completedJobArr.map((item,index )=> (
                  <tr key={index}>
                    <td className={styles.companyName}>{item.clientName}</td>
                    <td className={styles.numData}>{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  </tr>
                )) :
                WIPJobArr.map((item,index ) => (
                  <tr key={index}>
                    <td className={styles.companyName}>{item.clientName}</td>
                    <td className={styles.numData}>{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          
        </div>}
    </div>
    
    );
}

export default AgreedRevenueOverview;

// export async function getServerSideProps(context) {
//   console.log("hihi");

//   let authorized = false;
//   let expire = false;
//   let canViewJobList = false;
//   let canViewOwnJob = false;
//   let access_token;
  
//   let result;
//   let jobResult;
//   let jobArray;
//   let accessRight = false;
  
//   const jwt = getCookie("JWT", context.req);
//   console.log(jwt, "jwt");
//   let user
//   try{
//     user=jsonwebtoken.verify(jwt, process.env.JWT_SECRET);
//   }catch (e){
//     access_token = refreshOnServer(context.req);
//     if(access_token){
//       user=jsonwebtoken.verify(access_token, process.env.JWT_SECRET);
//     }else if(access_token===undefined){
//       //expire = true;
//       jobArray = [];
//       user=null
//     }
//   }
  
//   // if(user){
//   //   canViewJobList = user.userRight[0].canViewJobList;
//   //   canViewOwnJob = user.userRight[0].canViewOwnJob;
//   //   console.log(canViewJobList, canViewOwnJob, "here");
//   //   if (canViewJobList && canViewOwnJob) {
//   //     //jobResult = await getAnalytics();
//       jobResult = await getAllJob(user);
//     // } else if (canViewJobList) {
//     //   jobResult = await getAllJob(user);
//     // } else if (canViewOwnJob) {
//     //   jobResult = await getOwnJob(user);
//     // }

//     jobArray = jobResult;
   
//   // }else{
//   //   jobArray = [];
//   //   authorized = false;
//   // }

//   // if (canViewJobList || canViewOwnJob) authorized = true;

//   jobArray=JSON.parse(JSON.stringify(jobArray))

//   return {
//     props: {
//       // authorized,
//       // expire,
//       jobArray,
//     },
//   };
// }

