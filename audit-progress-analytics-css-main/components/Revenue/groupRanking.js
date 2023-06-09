import ReactEcharts from "echarts-for-react";
import { useState, useRef, useEffect } from "react";
import { getAnalytics } from "api/analytics";
import styles from "../../styles/revenue.module.scss";
import { handleRefresh } from "lib/auth";
const GroupRanking = () => {
  const [dataArr, setDataArr] = useState([]);
  const [axisArr, setAxisArr] = useState([]);

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;
        //group data same method as ROI part c

        

        const groupedCompanyArr = data.filter(
          (data) => data.groupCompany != ""
        );
        groupedCompanyArr.sort((a, b) => {
          return a.groupCompany.localeCompare(b.groupCompany);
        });

        //split array into subarray of objects by groupCompany
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
        let sumRevenue, totalGroupedRevenue;
        sumRevenue = totalGroupedRevenue = 0;

        //find grouped revenue
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
          }
          groupedData.push({
            client: groupedCompanies[i],
            revenue: sumRevenue,
          });
          sumRevenue = 0;
        }

        groupedData.sort((a, b) => {
          return b.revenue - a.revenue;
        });

        let dataArr = [];
        let axisArr = ["Total Group"];

        dataArr.push(totalGroupedRevenue);

        dataArr = dataArr.concat(groupedData.map((item) => item.revenue));
        axisArr = axisArr.concat(groupedData.map((item) => item.client));
        dataArr.reverse();
        axisArr.reverse();

        setDataArr(dataArr);
        setAxisArr(axisArr);
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }

  useEffect(() => getJobAnalytics(), []);

  let option = {
    // tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {
    //         type: 'shadow'
    //     }
    // },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name:"Revenue",
      nameLocation: "middle",
      nameTextStyle: {
        verticalAlign: "top",
        lineHeight:15
      }
      //boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: "category",
      data: axisArr,
      name:"Group Company",
      nameLocation: "middle",
      nameTextStyle: {
        verticalAlign: "top",
        lineHeight:-250
      }
    },
    series: [
      {
        type: "bar",
        label: {
          show: true,
        },
        data: dataArr,
      },
    ],
  };

  return <ReactEcharts option={option} />;
};

export default GroupRanking;
