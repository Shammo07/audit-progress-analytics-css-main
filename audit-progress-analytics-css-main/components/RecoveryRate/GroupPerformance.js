import { useState, useRef, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { getAnalytics } from "api/analytics";
import { handleRefresh } from "lib/auth";
import { getRR } from "lib/recoveryRate";

import styles from "../../styles/analytics.module.scss";

function getInitOption(chartData, groupCompanies) {
  return {
    tooltip: {
      trigger: "item",
    },
    title: {
      triggerEvent: true,
      text: groupCompanies.length,
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
        data: overChartData,
      },
    ],
  };
}

const GroupPerformance = () => {
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
  const [displayArr, setDisplayArr] = useState([]);
  const [groupCompanyArr, setGroupedCompanyArr] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [belowChartData, setBelowChartData] = useState([]);
  const [overChartData, setOverChartData] = useState([]);

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;
        let chartData = [];
        let belowChartData = [];
        let overChartData = [];

        //prepare data (filter by status and range, sort) + set state
        const completedJobArr = data.filter(
          (data) => data.status === "completed"
        );

        setCompletedArr(completedJobArr);

        const groupedCompanyArr = completedJobArr.filter(
          (data) => data.groupCompany != ""
        );

        groupedCompanyArr.sort((a, b) => {
          return a.groupCompany.localeCompare(b.groupCompany);
        });

        setGroupedCompanyArr(groupedCompanyArr);

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
        console.log("🚀 ~ file: GroupPerformance.js ~ line 210 ~ .then ~ groupedCompanyArr", groupedCompanyArr)
        setGroupedCompanyArr(groupedCompanyArr);

        let groupedData = [];
        let sumRevenue = 0;
        let sumActualCost = 0;
        let sumBudgetCost = 0;
        let sumBudgetRR = 0;
        let sumActualRR = 0;
        let sumDifference = 0;

        for (let i = 0; i < groupedCompanies.length; +i++) {
          for (
            let j = 0;
            j < groupedCompanyArr[groupedCompanies[i]].length;
            j++
          ) {
            sumRevenue += groupedCompanyArr[groupedCompanies[i]][j].revenue;
            sumActualCost +=
              groupedCompanyArr[groupedCompanies[i]][j].actualCost;
            sumBudgetCost +=
              groupedCompanyArr[groupedCompanies[i]][j].budgetCost;

          }
          sumBudgetRR = (sumRevenue/sumBudgetCost)*100
          sumActualRR = (sumRevenue/sumActualCost)*100
          console.log("🚀 ~ file: GroupPerformance.js ~ line 235 ~ .then ~ sumActualRR", sumActualRR)
          sumDifference = sumActualRR - sumBudgetRR;
          groupedData.push({
            groupCompany: groupedCompanies[i],
            revenue:sumRevenue,
            budgetCost: sumBudgetCost,
            actualCost: sumActualCost,
            budgetRecoveryRate: sumBudgetRR,
            recoveryRate: sumActualRR,
            difference: sumDifference,
          });
          sumActualRR =
            sumRevenue =
            sumActualCost =
            sumBudgetCost =
            sumBudgetRR =
            sumDifference =
              0;
        }

        const meetBudget = groupedData.filter(
          (item) => item.difference >= -6 && item.difference <= 6
        );
        const overBudget = groupedData.filter((item) => item.difference > 6);
        const belowBudget = groupedData.filter((item) => item.difference < -6);

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
        const overRange3 = overBudget.filter((item) => item.difference > 20);
        const belowRange1 = belowBudget.filter(
          (item) => item.difference >= -10
        );
        const belowRange2 = belowBudget.filter(
          (item) => item.difference >= -20 && item.difference < -10
        );
        const belowRange3 = belowBudget.filter((item) => item.difference < -20);

        if (belowRange1.length > 0) {
          belowChartData.push({
            value: belowRange1.length,
            name: "7% - 10%",
            groupId: "belowRange1",
          });
        }
        if (belowRange2.length > 0) {
          belowChartData.push({
            value: belowRange2.length,
            name: "11% - 20%",
            groupId: "belowRange2",
          });
        }
        if (belowRange3.length > 0) {
          belowChartData.push({
            value: belowRange3.length,
            name: "> 20%",
            groupId: "belowRange3",
          });
        }

        if (overRange1.length > 0) {
          overChartData.push({
            value: overRange1.length,
            name: "7% - 10%",
            groupId: "overRange1",
          });
        }
        if (overRange2.length > 0) {
          overChartData.push({
            value: overRange2.length,
            name: "11% - 20%",
            groupId: "overRange2",
          });
        }
        if (overRange3.length > 0) {
          overChartData.push({
            value: overRange3.length,
            name: "> 20%",
            groupId: "overRange3",
          });
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

        setMeetBudget(meetBudget);
        setOverBudget(overBudget);
        setBelowBudget(belowBudget);
        setOverRange1(overRange1);
        setOverRange2(overRange2);
        setOverRange3(overRange3);
        setBelowRange1(belowRange1);
        setBelowRange2(belowRange2);
        setBelowRange3(belowRange3);
        setChartData(chartData);
        setBelowChartData(belowChartData);
        setOverChartData(overChartData);

      

        setOption(getInitOption(chartData, groupedCompanies));
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }
  useEffect(() => {
    getJobAnalytics();
  }, []);

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
      setOption(getInitOption(chartData, groupCompanyArr));
    } else if (state === "Over Budget") {
      setOption(getOverOption(overChartData));
    }
    // setDisplayArr(getDisplayArr(state, meetBudget, belowBudget, overBudget, belowRange1, belowRange2, belowRange3, overRange1, overRange2, overRange3))
  }, [state]);

  return (
    <div>
      <div className={styles.chartDiv}>
        <h4 className={styles.chartTitle}>
          Recovery Rate Performance of Group Companies on Completed Jobs{" "}
          {state != "All" && ": " + state}
        </h4>
        <ReactEcharts option={option} onEvents={chartevents} />
      </div>
      {state != "All" && (
        <div className={styles.tableDiv}>
          <table className={styles.tableStyle}>
            <thead>
              <tr id="tableHeader" className={styles.tableHeader}>
                <th>Group Company</th>
                <th>Budget Costs</th>
                <th>Actual Costs</th>
                <th>Agreed Revenue</th>
                <th>Budget Recovery Rate</th>
                <th>Actual Recovery Rate</th>
                <th>+/-</th>
              </tr>
            </thead>
            <tbody>
              {state === "Meet Budget"
                ? meetBudget.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>

                      {/* <td>{item.difference}</td> */}
                    </tr>
                  ))
                : state === "Below Budget"
                ? belowBudget.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>
                    </tr>
                  ))
                : state === "Over Budget"
                ? overBudget.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>
                    </tr>
                  ))
                : state === "Below 7 - 10%"
                ? belowRange1.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>
                    </tr>
                  ))
                : state === "Below 11 - 20%"
                ? belowRange2.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>
                    </tr>
                  ))
                : state === "Below >20%"
                ? belowRange3.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>
                    </tr>
                  ))
                : state === "Over 7 - 10%"
                ? overRange1.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>
                    </tr>
                  ))
                : state === "Over 11 - 20%"
                ? overRange2.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>
                    </tr>
                  ))
                : state === "Over >20%"
                ? overRange3.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>
                    </tr>
                  ))
                : groupCompanyArr.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>{item.actualCost.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                      <td className={styles.numData}>
                        {item.revenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate.toFixed(0)}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                      <td className={styles.numData}>{item.difference.toFixed(0)}%</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GroupPerformance;
