import { useState, useRef, useEffect } from "react";
import EChartsReact from "echarts-for-react";
import { getAnalytics } from "api/analytics";
import { handleRefresh } from "lib/auth";

import styles from "../../styles/analytics.module.scss";

const TopAndBottom = () => {
  const [completedJobArr, setCompletedJobArr] = useState([]);
  const [option, setOption] = useState({});
  const [state, setState] = useState("All");
  const [top10, setTop10] = useState([]);
  const [top20, setTop20] = useState([]);
  const [bottom10, setBottom10] = useState([]);
  const [bottom20, setBottom20] = useState([]);

  function getInitOption(chartData){
    return {
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
          data:chartData,
        },
      ],
    };
  }

  function getJobAnalytics() {
    let chartData =[]
    getAnalytics()
      .then((res) => {
        const data = res.data;

        let completedJobArr = data.filter(
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
        completedJobArr.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });

        setCompletedJobArr(completedJobArr);

        const top10 = completedJobArr.slice(0, 10);
        const top20 = completedJobArr.slice(10, 20);
        const bottom10 = completedJobArr.slice(-10);
        bottom20 = bottom20.slice(0, 10);
        bottom10.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        bottom20.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });

        setTop10(top10);
        setTop20(top20);
        setBottom10(bottom10);
        setBottom20(bottom20);

        if(bottom10.length>0){
          chartData.push(
            {
              value: bottom10.length,
              name: "bottom10",
            }
          )
        }
        if(bottom20.length>0){
          chartData.push(
            {
              value: bottom20.length,
              name: "bottom20",
            }
          )
        }
        if( top10.length>0){
          chartData.push( {
            value: top10.length,
            name: "top10",
          })
        }
        if( top20.length>0){
          chartData.push( {
            value: top20.length,
            name: "top20",
          })
        }

        setOption(getInitOption(chartData));
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }




  useEffect(() => {
    getJobAnalytics();
  }, []);

 

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
  return (
    <>
  
      <div className={styles.chartDiv}>
      <h4 className={styles.chartTitle}>
        Top and Bottom{state != "All" && ": " + state + "%"}
      </h4>
        {/* <h4 className="chartTitle">Top and Bottom</h4> */}
        <EChartsReact option={option} onEvents={chartevents} />
        {/* <button onClick={handleClick}>refresh</button> */}
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
              {state === "Bottom 10"
                ? bottom10.map((item, index) => (
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
                : state === "Bottom 20"
                ? bottom20.map((item, index) => (
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
                : state === "Top 10"
                ? top10.map((item, index) => (
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
                : state === "Top 20"
                ? top20.map((item, index) => (
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
    </>
  );
};

export default TopAndBottom;
