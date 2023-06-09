import ReactEcharts from "echarts-for-react";
import { useState, useRef, useEffect } from "react";
import { getAnalytics } from "api/analytics";
//import Image from "../public/img/resetIcon.png"
import styles from "../../styles/analytics.module.scss";
import LoadingBlock from "@/components/loadingBlock";
import { handleRefresh } from "lib/auth";

//return init option
function getInitOption(chartData,totalRecoveryRate,completedJobArr) {
  console.log("🚀 ~ file: Performance.js ~ line 11 ~ getInitOption ~ chartData", chartData)
  console.log("in init");
  return {
    tooltip: {
      trigger: "item",
    },
    title: {
      triggerEvent: true,
      text:completedJobArr.length+"\n"+totalRecoveryRate.toFixed(0)+"%",
      // text: "AAAAAAAAAAAAAa",
      x: "center",
      top: "150",
      textStyle: {
        fontWeight: "400",
        fontSize: "12",
        rich: {
          a: {
            width: 60,
            height: 60,
            //"red"
            backgroundColor: {
              //image: Image
              image: "../public/img/resetIcon.png",
            },
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        radius: ["30%", "62%"],
        center: ["50%", "55%"],
        itemStyle: {
          borderWidth: 3,
          borderType: "solid",
          borderColor: "#FFFFFF",
        },
        label: {
          show: true,
        },
        data: chartData,
      },
    ],
  };
}

//return chart option of below chart
function getBelowOption(belowChartData) {
  return {
    tooltip: {
      trigger: "item",
    },
    title: {
      triggerEvent: true,
      text: "{a|}",
      // text: "AAAAAAAAAAAAAa",
      x: "center",
      top: "130",
      textStyle: {
        fontWeight: "400",
        fontSize: "12",
        rich: {
          a: {
            width: 60,
            height: 60,
            //"red"
            backgroundColor: {
              //image: Image
              image: "../public/img/resetIcon.png",
            },
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        radius: ["30%", "62%"],
        center: ["50%", "55%"],
        itemStyle: {
          borderWidth: 3,
          borderType: "solid",
          borderColor: "#FFFFFF",
        },
        label: {
          show: true,
          position: "outside",
        },
        color: "#91cc75",
        data: belowChartData,
      },
    ],
  };
}

function getOverOption(overChartData) {
  return {
    tooltip: {
      trigger: "item",
    },
    title: {
      triggerEvent: true,
      text: "{a|}",
      // text: "AAAAAAAAAAAAAa",
      x: "center",
      top: "130",
      textStyle: {
        fontWeight: "400",
        fontSize: "12",
        rich: {
          a: {
            width: 60,
            height: 60,
            //"red"
            backgroundColor: {
              //image: Image
              image: "../public/img/resetIcon.png",
            },
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        radius: ["30%", "62%"],
        center: ["50%", "55%"],
        itemStyle: {
          borderWidth: 3,
          borderType: "solid",
          borderColor: "#FFFFFF",
        },
        label: {
          show: true,
          position: "outside",
        },
        color: "#fac858",
        data:overChartData,
      },
    ],
  };
}

//getDisplayArr failed
// function getDisplayArr(state, meetBudget, belowBudget, overBudget, belowRange1, belowRange2, belowRange3, overRange1, overRange2, overRange3) {
//     console.log(meetBudget, "ere")
//     switch (state) {
//         case 'Meet Budget': return meetBudget;
//         case 'Below Budget': return belowBudget;
//         case 'Over Budget': return overBudget;
//         case 'Below: 6% - 15%': return belowRange1;
//         case 'Below: 16% - 25%': return belowRange2;
//         case 'Below: >25%': return belowRange3;
//         case 'Over: 6% - 15%': return overRange1;
//         case 'Over: 16% - 25%': return overRange2;
//         case 'Over: >25%': return overRange3;
//         // default: return completedJobArr;
//     }
// }

const UnitsANDCostsPerformance = () => {
  const [option, setOption] = useState({});
  const [completedJobArr, setCompletedArr] = useState([]);
  const [meetBudget, setMeetBudget] = useState([]);
  const [overBudget, setOverBudget] = useState([]);
  const [belowBudget, setBelowBudget] = useState([]);
  const [overRange1, setOverRange1] = useState([]);
  const [overRange2, setOverRange2] = useState([]);
  const [overRange3, setOverRange3] = useState([]);
  const [belowRange1, setBelowRange1] = useState([]);
  const [belowRange2, setBelowRange2] = useState([]);
  const [belowRange3, setBelowRange3] = useState([]);
  const [state, setState] = useState("All");
  const [chartData, setChartData] = useState([])
  const [belowChartData,setBelowChartData] = useState([])
  const [overChartData,setOverChartData] = useState([])
  const [displayArr, setDisplayArr] = useState([]);
  const [totalRecoveryRate , setTotalRecoveryRate] = useState(0)

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;
        let chartData= [];
        let belowChartData = []
        let overChartData = []
        let totalRecoveryRate = 0;
        let totalRevenue = 0
        let totalActualCost = 0

        //prepare data (filter by status and range, sort) + set state
        const completedJobArr = data.filter(
          (data) => data.status === "completed"
        );

        //calculate percentage of over/below budget and add property difference to object
        completedJobArr = data.filter((data) => data.status === "completed");
        completedJobArr = completedJobArr.map((item) => {
          return {
            ...item,
            recoveryRate: ((item.revenue / item.actualCost)*100).toFixed(0),
          };
        });
        completedJobArr = completedJobArr.map((item) => {
          return {
            ...item,
            budgetRecoveryRate: ((item.revenue / item.budgetCost)*100).toFixed(0),
          };
        });
        completedJobArr = completedJobArr.map((item) => ({
          ...item,
          difference: (
           ( item.revenue / item.actualCost)*100 -
            (item.revenue / item.budgetCost)*100
          ).toFixed(0),
        }));
        setCompletedArr(completedJobArr);


        const meetBudget = completedJobArr.filter(
          (item) => item.difference >= -6 && item.difference <= 6
        );
        const overBudget = completedJobArr.filter(
          (item) => item.difference > 6
        );
        console.log("🚀 ~ file: Performance.js ~ line 265 ~ .then ~ overBudget", overBudget)
        const belowBudget = completedJobArr.filter(
          (item) => item.difference < -6
        );
        console.log("🚀 ~ file: Performance.js ~ line 268 ~ .then ~ belowBudget", belowBudget)

        if (meetBudget.length > 0) {
          chartData.push({
            value: meetBudget.length,
            name: "Meet Budget",
            groupId: "meetBudget",
          });
        }
         if (belowBudget.length > 0) {
          chartData.push({
            value: belowBudget.length,
            name: "Below Budget",
            groupId: "belowBudget",
          });
        }
         if (overBudget.length > 0) {
          chartData.push({
            value: overBudget.length,
            name: "Over Budget",
            groupId: "overBudget",
          });
        }

       

        const overRange1 = overBudget.filter((item) => item.difference <= 10);
        const overRange2 = overBudget.filter(
          (item) => item.difference <= 20 && item.difference > 10
        );
        const overRange3 = overBudget.filter((item) => item.difference >20);
        const belowRange1 = belowBudget.filter(
          (item) => item.difference >= -10
        );
        const belowRange2 = belowBudget.filter(
          (item) => item.difference >= -20 && item.difference < -10
        );
        const belowRange3 = belowBudget.filter(
          (item) => item.difference < -20
        );


        if(belowRange1.length>0){
          belowChartData.push(
            {
              value: belowRange1.length,
              name: "7% - 10%",
              groupId: "belowRange1",
            }
          )
        }
        if(belowRange2.length>0){
          belowChartData.push(
            {
              value: belowRange2.length,
              name: "11% - 20%",
              groupId: "belowRange2",
            }
          )
        }
        if(belowRange3.length>0){
          belowChartData.push(
            {
              value: belowRange3.length,
              name: "> 20%",
              groupId: "belowRange3",
            }
          )
        }

        if(overRange1.length>0){
          overChartData.push(
            {
              value: overRange1.length,
              name: "7% - 10%",
              groupId: "overRange1",
            }
          )
        }
        if(overRange2.length>0){
          overChartData.push(
            {
              value: overRange2.length,
              name: "11% - 20%",
              groupId: "overRange2",
            }
          )
        }
        if(overRange3.length>0){
          overChartData.push(
            {
              value: overRange3.length,
              name: "> 20%",
              groupId: "overRange3",
            }
          )
        }


        meetBudget.sort((a, b) => {
          return b.difference - a.difference;
        });
        belowBudget.sort((a, b) => {
          return b.difference - a.difference;
        });
        overBudget.sort((a, b) => {
          return b.difference - a.difference;
        });
        overRange1.sort((a, b) => {
          return b.difference - a.difference;
        });
        overRange2.sort((a, b) => {
          return b.difference - a.difference;
        });
        overRange3.sort((a, b) => {
          return b.difference - a.difference;
        });
        belowRange1.sort((a, b) => {
          return b.difference - a.difference;
        });
        belowRange2.sort((a, b) => {
          return b.difference - a.difference;
        });
        belowRange3.sort((a, b) => {
          return b.difference - a.difference;
        });



        completedJobArr.map((item)=>{
          totalRevenue += item.revenue 
          totalActualCost+=item.actualCost
        })

        totalRecoveryRate = (totalRevenue/totalActualCost)*100

        setMeetBudget(meetBudget);
        setOverBudget(overBudget);
        setBelowBudget(belowBudget);
        setOverRange1(overRange1);
        setOverRange2(overRange2);
        setOverRange3(overRange3);
        setBelowRange1(belowRange1);
        setBelowRange2(belowRange2);
        setBelowRange3(belowRange3);
        setChartData(chartData)
        setTotalRecoveryRate(totalRecoveryRate)
        setBelowChartData(belowChartData)
        setOverChartData(overChartData)

        setOption(getInitOption(chartData,totalRecoveryRate,completedJobArr));
        // setDisplayArr(getDisplayArr(state, meetBudget, belowBudget, overBudget, belowRange1, belowRange2, belowRange3, overRange1, overRange2, overRange3));
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }

  useEffect(() => {
    getJobAnalytics();
  }, []);

  //on click event of chart
  const chartevents = {
    click: (params) => {
      //on click title
      if (params.componentType === "title") {
        setState("All");
      }

      if (params.data)
        //on click sector
        switch (params.data.groupId) {
          case "meetBudget":
            setState("Meet Budget");
            break;
          case "belowBudget":
            setState("Below Budget");
            break;
          case "overBudget":
            setState("Over Budget");
            break;
          case "belowRange1":
            setState("Below 7 - 10%");
            break;
          case "belowRange2":
            setState("Below 11 - 20%");
            break;
          case "belowRange3":
            setState("Below >20%");
            break;
          case "overRange1":
            setState("Over 7 - 10%");
            break;
          case "overRange2":
            setState("Over 11 - 20%");
            break;
          case "overRange3":
            setState("Over >20%");
            break;
        }
    },
  };

  useEffect(() => {
    console.log("useEffect");
    if (state === "Below Budget") {
      //change chart to below chart
      setOption(getBelowOption(belowChartData));
    } else if (state === "All") {
      //change to init chart
      setOption(getInitOption(chartData,totalRecoveryRate,completedJobArr));
    } else if (state === "Over Budget") {
      setOption(getOverOption(overChartData));
    }
    // setDisplayArr(getDisplayArr(state, meetBudget, belowBudget, overBudget, belowRange1, belowRange2, belowRange3, overRange1, overRange2, overRange3))
  }, [state]);

  // let temp = (function () {
  //     switch (state) {
  //         case 'Meet Budget': return meetBudget;
  //         case 'Below Budget': return belowBudget;
  //         case 'Over Budget': return overBudget;
  //         case 'Below: 6% - 15%': return belowRange1;
  //         case 'Below: 16% - 25%': return belowRange2;
  //         case 'Below: >25%': return belowRange3;
  //         case 'Over: 6% - 15%': return overRange1;
  //         case 'Over: 16% - 25%': return overRange2;
  //         case 'Over: >25%': return overRange3;
  //         default: return completedJobArr;
  //     }
  // })()
  // setDisplayArr(temp);
  // console.log(displayArr, "displayArr");
  // console.log(state, "state");

  return (
    <div>
      <div className={styles.chartDiv}>
      <h4 className={styles.chartTitle}>
        Recovery Rate Performance on Completed Jobs{state != "All" && ": " + state}
      </h4>
        <ReactEcharts option={option} onEvents={chartevents} />
      </div>
      {state != "All" && (
        <div className={styles.tableDiv}>
          {/* <h4 className="tableTitle">{state}</h4> */}
          <table className={styles.tableStyle}>
            <thead>
              <tr id="tableHeader" className={styles.tableHeader}>
                <th>Company Name</th>
                <th>Budget Costs</th>
                <th>Actual Costs</th>
                <th>Agreed Revenue</th>
                <th>Budget Recovery Rate</th>
                <th>Actual Recovery Rate</th>
                <th>+/-</th>
                {/* <th>difference</th> */}
              </tr>
            </thead>
            <tbody>
              {/* {displayArr.map(item =>
                                <tr id="data">
                                    <td className="companyName">{item.client}</td>
                                    <td className="numData">{item.budgetUnits}</td>
                                    <td className="numData">{item.actualUnits}</td>
                                    <td className="numData">{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            )} */}
              {state === "Meet Budget"
                ? meetBudget.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>

                      {/* <td>{item.difference}</td> */}
                    </tr>
                  ))
                : state === "Below Budget"
                ? belowBudget.map((item, index) => (
                    <tr id="data" key={index}>
                   <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>
                    </tr>
                  ))
                : state === "Over Budget"
                ? overBudget.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>
                    </tr>
                  ))
                : state === "Below 7 - 10%"
                ? belowRange1.map((item, index) => (
                    <tr id="data" key={index}>
                    <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>
                    </tr>
                  ))
                : state === "Below 11 - 20%"
                ? belowRange2.map((item, index) => (
                    <tr id="data" key={index}>
                   <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>
                    </tr>
                  ))
                : state === "Below >20%"
                ? belowRange3.map((item, index) => (
                    <tr id="data" key={index}>
                   <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>
                    </tr>
                  ))
                : state === "Over 7 - 10%"
                ? overRange1.map((item, index) => (
                    <tr id="data" key={index}>
                    <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>
                    </tr>
                  ))
                : state === "Over 11 - 20%"
                ? overRange2.map((item, index) => (
                    <tr id="data" key={index}>
               <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>
                    </tr>
                  ))
                : state === "Over >20%"
                ? overRange3.map((item, index) => (
                    <tr id="data" key={index}>
                 <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>
                    </tr>
                  ))
                : completedJobArr.map((item, index) => (
                    <tr id="data" key={index}>
                <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                      <td className={styles.numData}>{item.difference}%</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UnitsANDCostsPerformance;
