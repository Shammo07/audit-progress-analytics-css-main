//import data from "../../../data.json";
import ReactEcharts from 'echarts-for-react';
import { useState, useRef, useEffect } from 'react';
import { getAnalytics } from "api/analytics";
import { handleRefresh } from "lib/auth";

import styles from '../../styles/revenue.module.scss';

const RevenueOverview = () => {
    const [data, getData] = useState([]);
    const [state, setState] = useState("All");
    //switch array for bar chart
    const [chosen, setChosen] = useState([]);
    const [completedJobArr, setCompletedJobArr] = useState([]);
    const [WIPJobArr, setWIPJobArr] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [completedRevenue, setCompletedRevenue] = useState(0);
    const [WIPRevenue, setWIPRevenue] = useState(0);
    const [range1, setRange1] = useState([]);
    const [range2, setRange2] = useState([]);
    const [range3, setRange3] = useState([]);
    const [range4, setRange4] = useState([]);
    const [range5, setRange5] = useState([]);
    const [range6, setRange6] = useState([]);
    const [range7, setRange7] = useState([]);

    function getJobAnalytics() {
        getAnalytics()
        .then((res) => {
            const data = res.data;
            const completedJobArr = data.filter(data => data.status === "completed");
            const WIPJobArr = data.filter(data => data.status === "WIP");

            completedJobArr.sort((a, b) => { return b.revenue - a.revenue; });
            WIPJobArr.sort((a, b) => { return b.revenue - a.revenue; });

            setCompletedJobArr(completedJobArr);
            setWIPJobArr(WIPJobArr);
            //default show bar chart of YTD
            setChosen(data);
            getData(data);

            let totalRevenue = data.reduce((accumulator, data) => { return accumulator + data.revenue; }, 0);
            let completedRevenue = completedJobArr.reduce((accumulator, data) => { return accumulator + data.revenue; }, 0);
            let WIPRevenue = WIPJobArr.reduce((accumulator, data) => { return accumulator + data.revenue; }, 0);

            setTotalRevenue(totalRevenue);
            setCompletedRevenue(completedRevenue);
            setWIPRevenue(WIPRevenue);
        }).catch(async (err)=>{
            if(err.response.status===401)
            handleRefresh(getJobAnalytics);
        })
    }


    useEffect(() => {
        getJobAnalytics()
    }, [])

    //WIP chart
    let WIPchart = {
        width: "100%",
        title: {
            triggerEvent: true,
            // text: data.length + '\n $' + totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            text: "$" + WIPRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            x: 'center',
            name: 'title',
            top: '70',
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
            radius: ['25%', '45%'],
            center: ['50%', '55%'],
            itemStyle: {
                borderWidth: 3,
                borderType: 'solid',
                borderColor: '#FFFFFF',
            },
            label: {
                show: true,
                position: "center",
                //overflow: "break"
            },
            data: [
                {
                    value: WIPJobArr.length,
                    name: "WIP",
                    selected: true,

                },
                {
                    value: completedJobArr.length,
                    itemStyle: { color: 'white' },
                    selected: false
                }
            ],
        }]
    };

    //completed chart
    let completedchart = {
        width: "100%",
        title: {
            triggerEvent: true,
            // text: data.length + '\n $' + totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            text: "$" + completedRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            x: 'center',
            name: 'title',
            top: '70',
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
            radius: ['25%', '45%'],
            center: ['50%', '55%'],
            itemStyle: {
                borderWidth: 3,
                borderType: 'solid',
                borderColor: '#FFFFFF',
            },
            label: {
                show: true,
                position: "center",
                //overflow: "break"
            },
            data: [
                {
                    value: WIPJobArr.length,
                    itemStyle: { color: 'white' }
                },
                {
                    value: completedJobArr.length,
                    name: "Done"

                }
            ],
        }]
    };

    //YTD chart
    let YTDchart = {
        width: "100%",
        title: {
            triggerEvent: true,
            // text: data.length + '\n $' + totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            text: "$" + totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            x: 'center',
            name: 'title',
            top: '70',
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
            radius: ['25%', '45%'],
            center: ['50%', '55%'],
            itemStyle: {
                borderWidth: 3,
                borderType: 'solid',
                borderColor: '#FFFFFF',
            },
            label: {
                show: true,
                position: "center",
                //overflow: "break"
            },
            data: [
                {
                    value: data.length,
                    name: "YTD"
                }
            ],
        }]
    };

    //bar chart
    let barchart = {
        width: "90%",
        height: "50%",
        // tooltip: {
        //     trigger: 'item',
        // },
       
        xAxis: {
            type: 'category',
            data: ['<50,000', '51,000 - 100,000', '100,001 - 200,000', '200,001 - 300,000', '300,001 - 400,000', '400,001 - 500,000', '>500,000'],
            axisLabel: { rotate: 45 },
            
        },
        yAxis: {
            type: 'value',
            //     // data: [20, 40, 60, 80, 100, 120]
        },
        series: [{
            type: 'bar',

            label: {
                show: true
            },
            data: [range1.length, range2.length, range3.length, range4.length, range5.length, range6.length, range7.length],
        }]
    };

    //onclick bar chart events
    const barEvents = {
        'click': (params) => {
            if (params.data) {
                switch (params.dataIndex) {
                    //onclick bar
                    case 0: setState("50000"); break;
                    case 1: setState("100000"); break;
                    case 2: setState("200000"); break;
                    case 3: setState("300000"); break;
                    case 4: setState("400000"); break;
                    case 5: setState("500000"); break;
                    case 6: setState("600000"); break;
                }
            }
            //output arr
            // setDisplayArr(state === "Completed" ? completedJobArr : WIPJobArr);
        }
    };

    //onclick complete chart
    const completedEvents = {
        'click': (params) => {
            setChosen(completedJobArr);
        }
    }

    const WIPEvents = {
        'click': (params) => {
            setChosen(WIPJobArr);
        }
    }

    const AllEvents = {
        'click': (params) => {
            setChosen(data);
        }
    }

    useEffect(() => {
        //when chosen arr change filter it by revenue
        let Range1 = chosen.filter(data => data.revenue <= 50000);
        let Range2 = chosen.filter(data => data.revenue >= 50001 && data.revenue <= 100000);
        let Range3 = chosen.filter(data => data.revenue >= 100001 && data.revenue <= 200000);
        let Range4 = chosen.filter(data => data.revenue >= 200001 && data.revenue <= 300000);
        let Range5 = chosen.filter(data => data.revenue >= 300001 && data.revenue <= 400000);
        let Range6 = chosen.filter(data => data.revenue >= 400001 && data.revenue <= 500000);
        let Range7 = chosen.filter(data => data.revenue > 500000);

        Range1.sort((a, b) => { return b.revenue - a.revenue; });
        Range2.sort((a, b) => { return b.revenue - a.revenue; });
        Range3.sort((a, b) => { return b.revenue - a.revenue; });
        Range4.sort((a, b) => { return b.revenue - a.revenue; });
        Range5.sort((a, b) => { return b.revenue - a.revenue; });
        Range6.sort((a, b) => { return b.revenue - a.revenue; });
        Range7.sort((a, b) => { return b.revenue - a.revenue; });


        setRange1(Range1);
        setRange2(Range2);
        setRange3(Range3);
        setRange4(Range4);
        setRange5(Range5);
        setRange6(Range6);
        setRange7(Range7);
    }, [chosen])

    // let displayArr = []
    // (function () {
    //     switch (state) {
    //         case '50000': return range1;
    //         case '100000': return range2;
    //         case '200000': return range3;
    //         case '300000': return range4;
    //         case '400000': return range5;
    //         case '500000': return range6;
    //         case '600000': return range7;
    //         default: return completedJobArr;
    //     }
    // })()

    return (
        <div className={styles.analytics}>
            <div className={styles.pieCharts}>
            <div className={styles.chartDiv}>
                <ReactEcharts option={WIPchart} className={styles.chart} onEvents={WIPEvents} />
            </div>
            <div className={styles.chartDiv}>
                <ReactEcharts option={completedchart} className={styles.chart} onEvents={completedEvents} />
            </div>
            <div className={styles.chartDiv}>
                <ReactEcharts option={YTDchart} className={styles.chart} onEvents={AllEvents} />
            </div>
            </div>
            <ReactEcharts option={barchart} className={styles.barChart} onEvents={barEvents} />

            <div className={styles.table}>
                {state != "All" &&
                    <div className={styles.tableDiv}>
                        {/* <h4 className={styles.tableTitle}>{state}</h4> */}
                        <table className={styles.tableStyle}>
                            <thead>
                                <tr className={styles.tableHeader}>
                                    <th>Company Name</th>
                                    <th>Agreed Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {displayArr.map(item =>
                                    <tr>
                                        <td className="companyName">{item.client}</td>
                                        <td className="numData">{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                )} */}
                                {state === "50000" ?
                                    range1.map((item,index) =>
                                        <tr key={index}>
                                            <td className={styles.companyName}>{item.clientName}</td>
                                            <td className={styles.numData}>{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        </tr>
                                    ) :
                                    state === "100000" ?
                                        range2.map((item,index)  =>
                                            <tr key={index}>
                                                <td className={styles.companyName}>{item.clientName}</td>
                                                <td className={styles.numData}>{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ) :
                                        state === "200000" ?
                                            range3.map((item,index)  =>
                                                <tr key={index}>
                                                    <td className={styles.companyName}>{item.clientName}</td>
                                                    <td className={styles.numData}>{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                </tr>
                                            ) :
                                            state === "300000" ?
                                                range4.map((item,index)  =>
                                                    <tr key={index}>
                                                        <td className={styles.companyName}>{item.clientName}</td>
                                                        <td className={styles.numData}>{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                    </tr>
                                                ) :
                                                state === "400000" ?
                                                    range5.map((item,index)  =>
                                                        <tr key={index}>
                                                            <td className={styles.companyName}>{item.clientName}</td>
                                                            <td className={styles.numData}>{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                        </tr>
                                                    ) :
                                                    state === "500000" ?
                                                        range6.map((item,index)  =>
                                                            <tr key={index}>
                                                                <td className={styles.companyName}>{item.clientName}</td>
                                                                <td className={styles.numData}>{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                            </tr>
                                                        ) :
                                                        range7.map((item,index)  =>
                                                            <tr key={index}>
                                                                <td className={styles.companyName}>{item.clientName}</td>
                                                                <td className={styles.numData}>{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                            </tr>
                                                        )
                                }
                            </tbody>
                        </table>
                    </div>}
            </div>
        </div>);
}


export default RevenueOverview;

