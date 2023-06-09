//import React from 'react';
import { useState, useRef, useEffect } from "react";
import EChartsReact from "echarts-for-react";
import { getAnalytics } from "api/analytics";
import completedRevenue from "./Revenue/completedRevenue";
import { handleRefresh } from "lib/auth";

import styles from "../styles/analytics.module.scss";

//calculate ROI
const getROI = (budget, actualCost) => {
  return (((budget - actualCost) / actualCost) * 100).toFixed(0);
};

//(b) top and bottom
const ROI_topAndBottom = () => {
  const [completedJobArr, setCompletedJobArr] = useState([]);
  const [state, setState] = useState("All");
  const [top10, setTop10] = useState([]);
  const [top20, setTop20] = useState([]);
  const [bottom10, setBottom10] = useState([]);
  const [bottom20, setBottom20] = useState([]);

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;

        let completedJobArr = data.filter(
          (data) => data.status === "completed"
        );
        //add property ROI to objects
        //completedJobArr = completedJobArr.map(item => ({ ...item, ROI: getROI(item.revenue, item.actualCosts) }));
        completedJobArr.sort((a, b) => {
          return b.ROI - a.ROI;
        });

        setCompletedJobArr(completedJobArr);
        //get list of top, bottom + set state
        const top10 = completedJobArr.slice(0, 10);
        console.log("🚀 ~ file: ROI.js ~ line 41 ~ .then ~ top10", top10)
        const top20 = completedJobArr.slice(10, 20);
        const bottom10 = completedJobArr.slice(-10);
        console.log("🚀 ~ file: ROI.js ~ line 44 ~ .then ~ bottom10", bottom10)
        const bottom20 = completedJobArr.slice(-20);
        bottom20 = bottom20.slice(0, 10);
        bottom10.sort((a, b) => {
          return b.ROI - a.ROI;
        });
        bottom20.sort((a, b) => {
          return b.ROI - a.ROI;
        });

        setTop10(top10);
        setTop20(top20);
        setBottom10(bottom10);
        setBottom20(bottom20);
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }

  useEffect(() => {
    getJobAnalytics();
  }, []);

  let option = {
    tooltip: {
      trigger: "item",
      formatter: "{c}%",
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
        },
        data: [
          {
            value: bottom10.length,
            name: "bottom10",
          },
          {
            value: bottom20.length,
            name: "bottom20",
          },
          {
            value: top10.length,
            name: "top10",
          },
          {
            value: top20.length,
            name: "top20",
          },
        ],
      },
    ],
  };

  //onclick chart event
  const chartevents = {
    click: (params) => {
      //onclick title
      if (params.componentType === "title") {
        setState("All");
      }

      if (params.data) {
        //onclick sector
        switch (params.data.name) {
          case "bottom10":
            setState("Bottom 10");
            break;
          case "bottom20":
            setState("Bottom 20");
            break;
          case "top10":
            setState("Top 10");
            break;
          case "top20":
            setState("Top 20");
            break;
          default:
            setState("All");
        }
      }
    },
  };

  // let displayArr = [];
  // useEffect(() => {
  //     displayArr = (function () {
  //         switch (state) {
  //             case 'Bottom 10': return bottom10;
  //             case 'Bottom 20': return bottom20;
  //             case 'Top 10': return top10;
  //             case 'Top 20': return top20;
  //             default: return completedJobArr;
  //         }
  //     })()
  // }, [state])

  // let handleClick = () => {
  //     setState("All")
  // };

  return (
    <>
      <h4 className={styles.chartTitle}>
        Top and Bottom{state != "All" && ": " + state + "%"}
      </h4>
      <div className={styles.chartDiv}>
        {/* <h4 className="chartTitle">Top and Bottom</h4> */}
        <EChartsReact option={option} onEvents={chartevents} />
        {/* <button onClick={handleClick}>refresh</button> */}
      </div>
      {state != "All" && (
        <>
          <div className={styles.tableDiv}>
            <table className={styles.tableStyle}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>Client Name</th>
                  <th>Actual Cost</th>
                  <th>Revenue</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {state === "Bottom 10"
                  ? bottom10.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>{item.clientName}</td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : state === "Bottom 20"
                  ? bottom20.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>{item.clientName}</td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : state === "Top 10"
                  ? top10.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>{item.clientName}</td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : top20.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>{item.clientName}</td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

//for (c1), return chart option
function getOption(
  state,
  completedJobArr,
  totalROI,
  groupedData,
  totalGroupedROI,
  nonGroupedCompanyArr,
  totalNonGroupedROI,
  groupedCompanies
) {
  return {
    title: {
      triggerEvent: true,
      // text: completedJobArr.length + '\n' + totalROI + '%',
      text:
        state === "All"
          ? completedJobArr.length + "\n" + totalROI + "%"
          : state === "Grouped"
          ? groupedData.length + "\n" + totalGroupedROI + "%"
          : nonGroupedCompanyArr.length + "\n" + totalNonGroupedROI + "%",
      x: "center",
      top: "150",
      textStyle: {
        fontWeight: "400",
        fontSize: "12",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "# of Companies: {c}",
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
        data: [
          {
            value: groupedCompanies.length,
            name: "# of Grouped Company",
          },
          {
            value: nonGroupedCompanyArr.length,
            name: "# of Non-group Companies",
          },
        ],
      },
    ],
  };
}

//(c1) Grouped vs nonGrouped
const ROI_byGroup = () => {
  const [state, setState] = useState("All");
  const [completedJobArr, setCompletedJobArr] = useState([]);
  const [groupCompanyArr, setGroupedCompanyArr] = useState([]);
  const [nonGroupedCompanyArr, setNonGroupedCompanyArr] = useState([]);
  const [totalROI, setTotalROI] = useState(0);
  const [option, setOption] = useState({});
  const [groupedCompanies, setGroupedCompanies] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [nonGroupedData, setNonGroupedData] = useState([]);
  const [totalGroupedROI, setTotalGroupedROI] = useState(0);
  const [totalNonGroupedROI, setTotalNonGroupedROI] = useState(0);

  function getJobAnalytics() {
    getAnalytics().then((res) => {
        const data = res.data;
        let completedJobArr = data.filter((data) => data.status === "completed");
        //add property ROI to objects
        completedJobArr = completedJobArr.map(item => ({ ...item, ROI: getROI(item.revenue, item.actualCost) }));
        completedJobArr.sort((a, b) => {
          return b.ROI - a.ROI;
        });
  
        setCompletedJobArr(completedJobArr);
  
        //get array of with group company or not
        const groupedCompanyArr = completedJobArr.filter(
          (data) => data.groupCompany != ""
        );
        groupedCompanyArr.sort((a, b) => {
          return a.groupCompany.localeCompare(b.groupCompany);
        });
  
        const nonGroupedCompanyArr = completedJobArr.filter(
          (data) => data.groupCompany === ""
        );
  
        setGroupedCompanyArr(groupCompanyArr);
        setNonGroupedCompanyArr(nonGroupedCompanyArr);
  
        const totalRevenue = completedJobArr.reduce((accumulator, data) => {
          return accumulator + data.revenue;
        }, 0);
        const totalCosts = completedJobArr.reduce((accumulator, data) => {
          return accumulator + data.actualCost;
        }, 0);
        const totalROI = getROI(totalRevenue, totalCosts);
  
        setTotalROI(totalROI);
        //Grouped Data
        //create company arr: [<company1>: [{fileRef: ...}, {...}, {...}], <company2>: Array(2), ...]
        let groupedCompanies = [];
        function groupBy(array, property) {
          var hash = [];
          for (var i = 0; i < array.length; i++) {
            if (!hash[array[i][property]]) {
              hash[array[i][property]] = [];
              groupedCompanies.push(array[i][property]);
            }
            hash[array[i][property]].push(array[i]);
          }
          return hash;
        }
        groupedCompanyArr = groupBy(groupedCompanyArr, "groupCompany");
  
        //groupedData: [[<company1>, <revenue>, <ROI>], [...], ...]
        let groupedData = [];
        let sumRevenue,
          sumActualCost,
          sumROI,
          totalGroupedRevenue,
          totalGroupedCosts;
        sumRevenue =
          sumActualCost =
          sumROI =
          totalGroupedRevenue =
          totalGroupedCosts =
            0;
  
        //find grouped ROI and reveune
        for (let i = 0; i < groupedCompanies.length; i++) {
          //console.log(sumRevenue, sumActualCost, "starting");
          for (
            let j = 0;
            j < groupedCompanyArr[groupedCompanies[i]].length;
            j++
          ) {
            totalGroupedRevenue +=
              groupedCompanyArr[groupedCompanies[i]][j].revenue;
            sumRevenue += groupedCompanyArr[groupedCompanies[i]][j].revenue;
            totalGroupedCosts +=
              groupedCompanyArr[groupedCompanies[i]][j].actualCost;
            sumActualCost += groupedCompanyArr[groupedCompanies[i]][j].actualCost;
          }
          //calculate ROI
          sumROI = getROI(sumRevenue, sumActualCost);
          groupedData.push([groupedCompanies[i], sumRevenue, Number(sumROI)]);
          sumRevenue = sumActualCost = sumROI = 0;
        }
        //sort by ROI
        groupedData.sort(function (a, b) {
          return b[2] - a[2];
        });
        const totalGroupedROI = getROI(totalGroupedRevenue, totalGroupedCosts);
  
        //Non grouped Data
        let totalNonGroupedRevenue = 0;
        let totalNonGroupedCosts = 0;
  
        let nonGroupedData = [];
  
        nonGroupedCompanyArr.map((data) => {
          totalNonGroupedRevenue += data.revenue;
          totalNonGroupedCosts += data.actualCost;
          nonGroupedData.push([data.clientName, data.revenue, data.ROI]);
        });
        nonGroupedData.sort(function (a, b) {
          return b[2] - a[2];
        });
        const totalNonGroupedROI = getROI(
          totalNonGroupedRevenue,
          totalNonGroupedCosts
        );
  
        setGroupedCompanies(groupedCompanies);
        setGroupedCompanyArr(groupedCompanies);
        setGroupedData(groupedData);
        setNonGroupedData(nonGroupedData);
        setTotalGroupedROI(totalGroupedROI);
        setTotalNonGroupedROI(totalNonGroupedROI);
  
        setOption(
          getOption(
            state,
            completedJobArr,
            totalROI,
            groupedData,
            totalGroupedROI,
            nonGroupedCompanyArr,
            totalNonGroupedROI,
            groupedCompanies
          )
        );
      }).catch(async (err)=>{
        if(err.response.status===401)
        handleRefresh(getJobAnalytics);
    })
  }

  useEffect(() => {
    getJobAnalytics()
  }, []);

  //onclick chart event
  const chartevents = {
    click: (params) => {
      //onclick title
      if (params.componentType === "title") {
        setState("All");
      }

      if (params.data) {
        //on click sector
        switch (params.data.name) {
          case "# of Grouped Company":
            setState("Grouped");
            break;
          case "# of Non-group Companies":
            setState("Non-Grouped");
            break;
          default:
            setState("All");
        }
      }
    },
  };

  // let displayArr = (function () {
  //     switch (state) {
  //         case 'Grouped': return groupedData;
  //         case 'Non-Grouped': return nonGroupedData;
  //         default: return completedJobArr;
  //     }
  // })()

  useEffect(() => {
    // console.log(groupedCompanies, "here");
    //update chart when state change
    setOption(
      getOption(
        state,
        completedJobArr,
        totalROI,
        groupedData,
        totalGroupedROI,
        nonGroupedCompanyArr,
        totalNonGroupedROI,
        groupedCompanies
      )
    );
  }, [state]);

  return (
    <>
      <h4 className={styles.chartTitle}>
        Grouped vs Non-Grouped{state != "All" && ": " + state}
      </h4>
      <div className={styles.chartDiv}>
        <EChartsReact option={option} onEvents={chartevents} />
      </div>
      {state != "All" ? (
        <div className={styles.tableDiv}>
          {/* <h4 className="tableTitle">{state} Jobs</h4> */}
          <table className={styles.tableStyle}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Company</th>
                <th>Revenue</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              {state === "Grouped"
                ? groupedData.map((item, index) => (
                    <tr key={index}>
                      <td className={styles.companyName}>{item[0]}</td>
                      <td className={styles.numData}>
                        {item[1]
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>{item[2] + "%"}</td>
                    </tr>
                  ))
                : nonGroupedData.map((item, index) => (
                    <tr key={index}>
                      <td className={styles.companyName}>{item[0]}</td>
                      <td className={styles.numData}>
                        {item[1]
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>{item[2] + "%"}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

//for (a), (c2), (c3)
const ROIRange = (part) => {
  const [state, setState] = useState("All");
  const [jobArr, setJobArr] = useState([]);
  const [totalROI, setTotalROI] = useState(0);
  const [ROIRange1, setROIRange1] = useState([]);
  const [ROIRange2, setROIRange2] = useState([]);
  const [ROIRange3, setROIRange3] = useState([]);
  const [ROIRange4, setROIRange4] = useState([]);
  const [ROIRange5, setROIRange5] = useState([]);
  const [ROIRange6, setROIRange6] = useState([]);
  const [ROIRange7, setROIRange7] = useState([]);
  const [ROIRange8, setROIRange8] = useState([]);

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;
        let jobArr = [];
        let totalROI = 0;
        let totalRevenue, totalCosts, completedJobArr;
        //prepare different data for diff part a, c2, c3
        switch (part) {
          case "a":
            jobArr = data.filter((data) => data.status === "completed");
            //add property ROI to objects.
            jobArr = jobArr.map(item => ({ ...item, ROI: getROI(item.revenue, item.actualCost) }));
          /*   jobArr.sort((a, b) => {
              return b.ROI - a.ROI;
            }); */

            //cal totalROI
            totalRevenue = jobArr.reduce((accumulator, data) => {
              return accumulator + data.revenue;
            }, 0);
            totalCosts = jobArr.reduce((accumulator, data) => {
              return accumulator + data.actualCost;
            }, 0);
            totalROI = getROI(totalRevenue, totalCosts);
            break;

          case "c2":
            //similar to group data in c1
            completedJobArr = data.filter(
              (data) => data.status === "completed"
            );
            const groupedCompanyArr = completedJobArr.filter(
              (data) => data.groupCompany != ""
            );
            //groupedCompanyArr = groupedCompanyArr.map(item => ({ ...item, ROI: getROI(item.revenue, item.actualCost) }));
            groupedCompanyArr.sort((a, b) => {
              return a.groupCompany.localeCompare(b.groupCompany);
            });

            totalRevenue = groupedCompanyArr.reduce((accumulator, data) => {
              return accumulator + data.revenue;
            }, 0);
            totalCosts = groupedCompanyArr.reduce((accumulator, data) => {
              return accumulator + data.actualCost;
            }, 0);
            totalROI = getROI(totalRevenue, totalCosts);

            //create company arr: [<company1>: [{fileRef: ...}, {...}, {...}], <company2>: Array(2), ...]
            let groupedCompanies = [];
            function groupBy(array, property) {
              var hash = [];
              for (var i = 0; i < array.length; i++) {
                if (!hash[array[i][property]]) {
                  hash[array[i][property]] = [];
                  groupedCompanies.push(array[i][property]);
                }
                hash[array[i][property]].push(array[i]);
              }
              return hash;
            }

            groupedCompanyArr = groupBy(groupedCompanyArr, "groupCompany");

            let sumRevenue,
              sumActualCost,
              sumROI,
              totalGroupedRevenue,
              totalGroupedCosts;
            sumRevenue =
              sumActualCost =
              sumROI =
              totalGroupedRevenue =
              totalGroupedCosts =
                0;

            //find grouped ROI and reveune
            for (let i = 0; i < groupedCompanies.length; i++) {
              //console.log(sumRevenue, sumActualCost, "starting");
              for (
                let j = 0;
                j < groupedCompanyArr[groupedCompanies[i]].length;
                j++
              ) {
                totalGroupedRevenue +=
                  groupedCompanyArr[groupedCompanies[i]][j].revenue;
                sumRevenue += groupedCompanyArr[groupedCompanies[i]][j].revenue;
                totalGroupedCosts +=
                  groupedCompanyArr[groupedCompanies[i]][j].actualCost;
                sumActualCost +=
                  groupedCompanyArr[groupedCompanies[i]][j].actualCost;
              }
              //calculate ROI
              sumROI = getROI(sumRevenue, sumActualCost);
              //add groupcompany with data to arr
              jobArr.push({
                clientName: groupedCompanies[i],
                actualCost: sumActualCost,
                revenue: sumRevenue,
                ROI: Number(sumROI),
              });
              sumRevenue = sumActualCost = sumROI = 0;
            }

            jobArr.sort(function (a, b) {
              return b[2] - a[2];
            });
            console.log(jobArr);
            break;
          case "c3":
            completedJobArr = data.filter(
              (data) => data.status === "completed"
            );
            //filter company without groupcompany
            jobArr = completedJobArr.filter((data) => data.groupCompany === "");
            jobArr = jobArr.map(item => ({ ...item, ROI: getROI(item.revenue, item.actualCost) }));

            totalRevenue = jobArr.reduce((accumulator, data) => {
              return accumulator + data.revenue;
            }, 0);
            totalCosts = jobArr.reduce((accumulator, data) => {
              return accumulator + data.actualCost;
            }, 0);
            totalROI = getROI(totalRevenue, totalCosts);
            break;
        }

        setJobArr(jobArr);
        setTotalROI(totalROI);
        console.log("🚀 ~ file: ROI.js ~ line 734 ~ .then ~ jobArr", jobArr); //filter jobArr by ROI
        const ROIRange1 = jobArr.filter((item) => {
          return item.ROI < 0;
        });
        const ROIRange2 = jobArr.filter(
          (item) => item.ROI >= 1 && item.ROI <= 20
        );
        const ROIRange3 = jobArr.filter(
          (item) => item.ROI >= 21 && item.ROI <= 40
        );
        const ROIRange4 = jobArr.filter(
          (item) => item.ROI >= 41 && item.ROI <= 60
        );
        const ROIRange5 = jobArr.filter(
          (item) => item.ROI >= 61 && item.ROI <= 80
        );
        const ROIRange6 = jobArr.filter(
          (item) => item.ROI >= 81 && item.ROI <= 100
        );
        const ROIRange7 = jobArr.filter(
          (item) => item.ROI >= 101 && item.ROI <= 120
        );
        const ROIRange8 = jobArr.filter((item) => item.ROI >= 121);

        ROIRange1.sort((a, b) => {
          return b.ROI - a.ROI;
        });
        ROIRange2.sort((a, b) => {
          return b.ROI - a.ROI;
        });
        ROIRange3.sort((a, b) => {
          return b.ROI - a.ROI;
        });
        ROIRange4.sort((a, b) => {
          return b.ROI - a.ROI;
        });
        ROIRange5.sort((a, b) => {
          return b.ROI - a.ROI;
        });
        ROIRange6.sort((a, b) => {
          return b.ROI - a.ROI;
        });
        ROIRange7.sort((a, b) => {
          return b.ROI - a.ROI;
        });
        ROIRange8.sort((a, b) => {
          return b.ROI - a.ROI;
        });

        setROIRange1(ROIRange1);
        setROIRange2(ROIRange2);
        setROIRange3(ROIRange3);
        setROIRange4(ROIRange4);
        setROIRange5(ROIRange5);
        setROIRange6(ROIRange6);
        setROIRange7(ROIRange7);
        setROIRange8(ROIRange8);
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }

  useEffect(() => {
    getJobAnalytics();
  }, []);

  let option = {
    title: {
      triggerEvent: true,
      text: jobArr.length + "\n" + totalROI + "%",
      x: "center",
      top: "150",
      textStyle: {
        fontWeight: "400",
        fontSize: "12",
      },
    },
    tooltip: {
      trigger: "item",
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
        data: [
          {
            value: ROIRange1.length || "-",
            name: "< 0%",
          },
          {
            value: ROIRange2.length || "-",
            name: "1% - 20%",
          },
          {
            value: ROIRange3.length || "-",
            name: "21% - 40%",
          },
          {
            value: ROIRange4.length || "-",
            name: "41% - 60%",
          },
          {
            value: ROIRange5.length || "-",
            name: "61% - 80%",
          },
          {
            value: ROIRange6.length || "-",
            name: "81% - 100%",
          },
          {
            value: ROIRange7.length || "-",
            name: "101% - 120%",
          },
          {
            value: ROIRange8.length || "-",
            name: "> 120%",
          },
        ],
      },
    ],
  };

  //onclick event
  let chartevents = {
    click: (params) => {
      //onclick titel
      if (params.componentType === "title") {
        setState("All");
      }

      if (params.data) {
        //onclick sector
        switch (params.data.name) {
          case "< 0%":
            setState("below 0");
            break;
          case "1% - 20%":
            setState("1 - 20");
            break;
          case "21% - 40%":
            setState("21 - 40");
            break;
          case "41% - 60%":
            setState("41 - 60");
            break;
          case "61% - 80%":
            setState("61 - 80");
            break;
          case "81% - 100%":
            setState("81 - 100");
            break;
          case "101% - 120%":
            setState("101 - 120");
            break;
          case "> 120%":
            setState("above 120");
            break;
          default:
            setState("All");
        }
      }
    },
  };

  // displayArr = (function () {
  //     switch (state) {
  //         case 'below 0': return ROIRange1;
  //         case '1 - 20': return ROIRange2;
  //         case '21 - 40': return ROIRange3;
  //         case '41 - 60': return ROIRange4;
  //         case '61 - 80': return ROIRange5;
  //         case '81 - 100': return ROIRange6;
  //         case '101 - 120': return ROIRange7;
  //         case 'above 120': return ROIRange8;
  //         default: return JobArr;
  //     }
  // })()

  return (
    <>
      <h4 className={styles.chartTitle}>
        {part === "a"
          ? "Completed Jobs Overview"
          : part === "c2"
          ? "Grouped Companies"
          : "Non-grouped Companies"}
        {state != "All" && ": " + state + "%"}
      </h4>
      <div className={styles.chartDiv}>
        {/* <h4 className="chartTitle">{title}</h4> */}
        <EChartsReact option={option} onEvents={chartevents} />
      </div>

      {state != "All" && (
        <div>
          {/* <h4 className="tableTitle">Jobs: {state}%</h4> */}
          <div className={styles.tableDiv}>
            <table className={styles.tableStyle}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>Client Name</th>
                  <th>Actual Cost</th>
                  <th>Revenue</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {state === "below 0"
                  ? ROIRange1.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : state === "1 - 20"
                  ? ROIRange2.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : state === "21 - 40"
                  ? ROIRange3.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : state === "41 - 60"
                  ? ROIRange4.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : state === "61 - 80"
                  ? ROIRange5.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : state === "81 - 100"
                  ? ROIRange6.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : state === "101 - 120"
                  ? ROIRange7.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : ROIRange8.map((item, index) => {
                      console.log(
                        "🚀 ~ file: ROI.js ~ line 1089 ~ :ROIRange8.map ~ item",
                        item
                      );

                      return (
                        <tr key={index}>
                          <td className={styles.companyName}>
                            {item.clientName}
                          </td>
                          <td className={styles.numData}>
                            {item.actualCost
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className={styles.numData}>
                            {item.revenue
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className={styles.numData}>{item.ROI + "%"}</td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export function Overview() {
  /*(a) overall*/
  return ROIRange("a");
}

export function TopBottom() {
  /*(b) top and bottom*/
  return ROI_topAndBottom();
}

export function ROIByGroup() {
  /*(c1) ROI by group*/
  return ROI_byGroup();
}

export function Grouped() {
  /*(c2) grouped ROI range*/
  return ROIRange("c2");
}

export function NonGrouped() {
  /*(c3) non grouped ROI range*/
  return ROIRange("c3");
}
