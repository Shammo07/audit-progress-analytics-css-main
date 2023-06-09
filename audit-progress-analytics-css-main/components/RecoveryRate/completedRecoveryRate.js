import { handleRefresh } from "lib/auth";
import { useState, useRef, useEffect } from "react";
import EChartsReact from "echarts-for-react";
import { getAnalytics } from "api/analytics";
import styles from "../../styles/analytics.module.scss";
import ReactEcharts from "echarts-for-react";

function getInitOption(chartData,completedJobArr,totalRecoveryRate) {
  console.log("in init");
  return {
    tooltip: {
      trigger: "item",
    },
    title: {
      triggerEvent: true,
      text:completedJobArr.length+'\n'+totalRecoveryRate.toFixed(0)+"%",
      // text: "AAAAAAAAAAAAAa",
      x: "center",
      top: '150',
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

const CompletedRecoveryRate = () => {
  const [option, setOption] = useState({});
  const [completedJobArr, setCompletedArr] = useState([]);
  const [below40, setBelow40] = useState([]);
  const [range40To60, setRange40To60] = useState([]);
  const [range61To80, setRange61To80] = useState([]);
  const [range81To99, setRange81To99] = useState([]);
  const [equal100, setEqual100] = useState([]);
  const [range101To120, setRange101To120] = useState([]);
  const [range121To140, setRange121To140] = useState([]);
  const [range141To160, setRange141To160] = useState([]);
  const [above160, setAbove160] = useState([]);
  const [state, setState] = useState("All");

  function getJobAnalytics() {
    let chartData = [];
    let totalRecoveryRate = 0
    let totalRevenue = 0
    let totalActualCost = 0
    getAnalytics()
      .then((res) => {
        const data = res.data;

        const completedJobArr = data.filter(
          (data) => data.status === "completed"
        );
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

        setCompletedArr(completedJobArr);

  

        const below40 = completedJobArr.filter(
          (item) => item.recoveryRate < 40
        );
        const range40To60 = completedJobArr.filter(
          (item) => item.recoveryRate > 40 && item.recoveryRate <= 60
        );
        const range61To80 = completedJobArr.filter(
          (item) => item.recoveryRate > 60 && item.recoveryRate <= 80
        );
        const range81To99 = completedJobArr.filter(
          (item) => item.recoveryRate > 80 && item.recoveryRate <= 99
        );
        const equal100 = completedJobArr.filter(
          (item) => item.recoveryRate == 100
        );
        const range101To120 = completedJobArr.filter(
          (item) => item.recoveryRate > 100 && item.recoveryRate <= 120
        );
        const range121To140 = completedJobArr.filter(
          (item) => item.recoveryRate > 120 && item.recoveryRate <= 140
        );
        const range141To160 = completedJobArr.filter(
          (item) => item.recoveryRate > 140 && item.recoveryRate <= 160
        );
        const above160 = completedJobArr.filter(
          (item) => item.recoveryRate > 160
        );

        below40.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        range40To60.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        range61To80.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        range81To99.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        equal100.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        range101To120.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        range121To140.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        range141To160.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        above160.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });

        completedJobArr.map((item)=>{
           totalRevenue += item.revenue 
           totalActualCost+=item.actualCost
        })
        totalRecoveryRate = (totalRevenue/totalActualCost)*100

        

        setBelow40(below40);
        setRange40To60(range40To60);
        setRange61To80(range61To80);
        setRange81To99(range81To99);
        setEqual100(equal100);
        setRange101To120(range101To120);
        setRange121To140(range121To140);
        setRange141To160(range141To160);
        setAbove160(above160);

        if (below40.length > 0) {
          chartData.push({
            value: below40.length,
            name: "<40%",
            groupId: "below40",
          });
        }
        if (range40To60.length > 0) {
          chartData.push({
            value: range40To60.length,
            name: "41%-60%",
            groupId: "range40To60",
          });
        }
        if (range61To80.length > 0) {
          chartData.push({
            value: range61To80.length,
            name: "61%-80%",
            groupId: "range61To80",
          });
        }
        if (range81To99.length > 0) {
          chartData.push({
            value: range81To99.length,
            name: "81%-99%",
            groupId: "range81To99",
          });
        }
        if (equal100.length > 0) {
          chartData.push({
            value: equal100.length,
            name: "100%",
            groupId: "equal100",
          });
        }
        if (range101To120.length > 0) {
          chartData.push({
            value: range101To120.length,
            name: "101&-120%",
            groupId: "range101To120",
          });
        }
        if (range121To140.length > 0) {
          chartData.push({
            value: range121To140.length,
            name: "121&-140%",
            groupId: "range121To140",
          });
        }
        if (range141To160.length > 0) {
          chartData.push({
            value: range141To160.length,
            name: "141&-160%",
            groupId: "range141To160",
          });
        }
        if (above160.length > 0) {
          chartData.push({
            value: above160.length,
            name: ">160%",
            groupId: "above160",
          });
        }

        setOption(getInitOption(chartData,completedJobArr,totalRecoveryRate));
      })
      .catch(async (err) => {
        console.log(
          "🚀 ~ file: CompletedRecoveryRate.js ~ line 67 ~ getJobAnalytics ~ err",
          err
        );
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }

  useEffect(() => {
    getJobAnalytics();
  }, []);

  const chartevents = {
    click: (params) => {
      if (params.componentType === "title") {
        setState("All");
      }

      if (params.data) {
        switch (params.data.groupId) {
          case "below40":
            setState("below40");
            break;
          case "range40To60":
            setState("range40To60");
            break;
          case "range61To80":
            setState("range61To80");
            break;
          case "range81To99":
            setState("range81To99");
            break;
          case "equal100":
            setState("equal100");
            break;
          case "range101To120":
            setState("range101To120");
            break;
          case "range121To140":
            setState("range121To140");
            break;
          case "range141To160":
            setState("range141To160");
            break;
          case "above160":
            setState("above160");
            break;
        }
      }
    },
  };

  return (
    <div>

      <div className={styles.chartDiv}>
      <h4 className={styles.chartTitle}>
          Recovery Rate on Completed Jobs
      </h4>
        <ReactEcharts option={option} onEvents={chartevents} />
      </div>
      {state != "All" && (
        <div className={styles.tableDiv}>
          <table className={styles.tableStyle}>
            <thead>
              <tr id="tableHeader" className={styles.tableHeader}>
                <th>File Reference</th>
                <th>Client</th>
                <th>Group Company</th>
                <th>Budget Cost</th>
                <th>Actual Cost</th>
                <th>Revenue</th>
                <th>Budget Recovery Rate</th>
                <th>Actual Recovery Rate</th>
              </tr>
            </thead>
            <tbody>
              {state === "below40"
                ? below40.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.fileReference}
                      </td>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>{item.revenue}</td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                    </tr>
                  ))
                : state === "range40To60"
                ? range40To60.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.fileReference}
                      </td>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>{item.revenue}</td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                    </tr>
                  ))
                : state === "range61To80"
                ? range61To80.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.fileReference}
                      </td>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>{item.revenue}</td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                    </tr>
                  ))
                : state === "range81To99"
                ? range81To99.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.fileReference}
                      </td>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>{item.revenue}</td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                    </tr>
                  ))
                : state === "equal100"
                ? equal100.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.fileReference}
                      </td>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>{item.revenue}</td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                    </tr>
                  ))
                : state === "range101To120"
                ? range101To120.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.fileReference}
                      </td>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>{item.revenue}</td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                    </tr>
                  ))
                : state === "range121To140"
                ? range121To140.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.fileReference}
                      </td>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>{item.revenue}</td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                    </tr>
                  ))
                : state === "range141To160"
                ? range141To160.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.fileReference}
                      </td>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>{item.revenue}</td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                    </tr>
                  ))
                : state === "above160"
                ? above160.map((item, index) => (
                    <tr id="data" key={index}>
                      <td className={styles.companyName}>
                        {item.fileReference}
                      </td>
                      <td className={styles.companyName}>{item.clientName}</td>
                      <td className={styles.companyName}>
                        {item.groupCompany}
                      </td>
                      <td className={styles.numData}>{item.budgetCost}</td>
                      <td className={styles.numData}>{item.actualCost}</td>
                      <td className={styles.numData}>{item.revenue}</td>
                      <td className={styles.numData}>
                        {item.budgetRecoveryRate}%
                      </td>
                      <td className={styles.numData}>{item.recoveryRate}%</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletedRecoveryRate;
