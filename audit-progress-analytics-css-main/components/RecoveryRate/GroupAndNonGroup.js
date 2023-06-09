import { useState, useRef, useEffect } from "react";
import EChartsReact from "echarts-for-react";
import { getAnalytics } from "api/analytics";
import { handleRefresh } from "lib/auth";
import { getRR } from "lib/recoveryRate";

import styles from "../../styles/analytics.module.scss";
import { set } from "@mongoosejs/double";

const GroupAndNonGroup = () => {
  const [state, setState] = useState(" ");
  const [option, setOption] = useState({});
  const [completedJobArr, setCompletedJobArr] = useState([]);
  const [groupCompanyArr, setGroupedCompanyArr] = useState([]);
  const [nonGroupedCompanyArr, setNonGroupedCompanyArr] = useState([]);
  const [groupedCompanies, setGroupedCompanies] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [nonGroupedData, setNonGroupedData] = useState([]);
  const [totalGroupedRR, setTotalGroupedRR] = useState(0);
  const [totalNonGroupedRR, setTotalNonGroupedRR] = useState(0);

  function getOption(
    state,
    completedJobArr,
    totalRecoveryRate,
    groupedData,
    totalGroupedRR,
    nonGroupedCompanyArr,
    totalNonGroupedRR,
    groupedCompanies
  ) {
    return {
      title: {
        triggerEvent: true,
        // text: completedJobArr.length + '\n' + totalROI + '%',
        text: completedJobArr.length + "\n" + totalRecoveryRate + "%",
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

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;
        let totalRecoveryRate = 0;
        let totalRevenue = 0;
        let totalActualCost = 0;

        let completedJobArr = data.filter(
          (data) => data.status === "completed"
        );
        completedJobArr = completedJobArr.map((item) => {
          return {
            ...item,
            recoveryRate: getRR(item.revenue, item.actualCost),
          };
        });
        completedJobArr = completedJobArr.map((item) => {
          return {
            ...item,
            budgetRecoveryRate: getRR(item.revenue, item.budgetCost),
          };
        });
        completedJobArr.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        setCompletedJobArr(completedJobArr);

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

        completedJobArr.map((item) => {
          totalRevenue += item.revenue;
          totalActualCost += item.actualCost;
        });

        totalRecoveryRate = getRR(totalRevenue, totalActualCost);

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

        let groupedData = [];
        let sumRevenue,
          sumActualCost,
          sumRR,
          totalGroupedRevenue,
          totalGroupedCosts;
        sumRevenue =
          sumActualCost =
          sumRR =
          totalGroupedRevenue =
          totalGroupedCosts =
            0;
        //find grouped RR and reveune
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
          //calculate RR
          sumRR = getRR(sumRevenue,sumActualCost)
          groupedData.push([groupedCompanies[i], sumRevenue, sumRR]);
          sumRevenue = sumActualCost = sumRR = 0;
        }
        //sort by RR
        groupedData.sort(function (a, b) {
          return b[2] - a[2];
        });

        const totalGroupedRR = getRR(totalGroupedRevenue, totalGroupedCosts);

        //Non grouped Data
        let totalNonGroupedRevenue = 0;
        let totalNonGroupedCosts = 0;

        let nonGroupedData = [];

        nonGroupedCompanyArr.map((data) => {
          totalNonGroupedRevenue += data.revenue;
          totalNonGroupedCosts += data.actualCost;
          nonGroupedData.push([
            data.clientName,
            data.revenue,
            data.recoveryRate,
          ]);
        });
        nonGroupedData.sort(function (a, b) {
          return b[2] - a[2];
        });
        const totalNonGroupedRR = getRR(
          totalNonGroupedRevenue,
          totalNonGroupedCosts
        );

        setGroupedCompanies(groupedCompanies);
        setGroupedCompanyArr(groupedCompanies);
        setGroupedData(groupedData);
        setNonGroupedData(nonGroupedData);
        setTotalGroupedRR(totalGroupedRR);
        setTotalNonGroupedRR(totalNonGroupedRR);

        setOption(
          getOption(
            state,
            completedJobArr,
            totalRecoveryRate,
            groupedData,
            totalGroupedRR,
            nonGroupedCompanyArr,
            totalNonGroupedRR,
            groupedCompanies
          )
        );
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }
  useEffect(() => {
    getJobAnalytics();
  }, []);

  const chartEvents = {
    click: (params) => {
      if (params.componentType === "title") {
        setState("All");
      }
      if (params.data) {
        switch (params.data.name) {
          case "# of Grouped Company":
            setState("Grouped");
            break;
          case "# of Non-group Companies":
            setState("Non-Grouped");
            break;
          default:
            setState(" ");
        }
      }
    },
  };
  return (
    <>
      <div className={styles.chartDiv}>
        <h4 className={styles.chartTitle}>
          Grouped vs Non-Grouped{state != "All" && ": " + state}
        </h4>
        <EChartsReact option={option} onEvents={chartEvents} />
      </div>
      {state != " " && (
        <div className={styles.tableDiv}>
          <table className={styles.tableStyle}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Company</th>
                <th>Recovery Rate</th>
              </tr>
            </thead>
            <tbody>
              {state === "All" &&
                completedJobArr.map((item, index) => (
                  <tr id="data" key={index}>
                    <td className={styles.companyName}>{item.clientName}</td>
                    <td className={styles.numData}>{item.recoveryRate.toFixed(0)}%</td>
                  </tr>
                ))}
              {state === "Grouped" &&
                groupedData.map((item, index) => (
                  <tr id="data" key={index}>
                    <td className={styles.companyName}>{item[0]}</td>
                    <td className={styles.numData}>{item[2]}%</td>
                  </tr>
                ))}
              {state === "Non-Grouped" &&
                nonGroupedData.map((item, index) => (
                  <tr id="data" key={index}>
                    <td className={styles.companyName}>{item[0]}</td>
                    <td className={styles.numData}>{item[2]}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default GroupAndNonGroup;
