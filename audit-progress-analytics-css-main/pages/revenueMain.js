import React from 'react';
import { useState } from 'react';

import CompletedRevenue from '../components/Revenue/completedRevenue';
import GroupRanking from '../components/Revenue/groupRanking';
import RevenueOverview from '../components/Revenue/RevenueOverall';
import TopAndBottom from '../components/Revenue/topAndBottom';
import WIPRevenue from '../components/Revenue/WIPRevenue';

import styles from "../styles/analytics.module.scss"

export default function Revenue() {
    const [active, setActive] = useState("RevenueOverview");

    const setOverview = () => {
        setActive("RevenueOverview");
    }

    const setCompleted = () => {
        setActive("CompletedRevenue");
    }

    const setWIP = () => {
        setActive("WIPRevenue");
    }

    const setGroup = () => {
        setActive("GroupRanking");
    }

    const setTopBottom = () => {
        setActive("TopBottom");
    }

    const Page = () => {
        switch (active) {
            case "RevenueOverview": return <RevenueOverview />;
            case "CompletedRevenue": return <CompletedRevenue />;
            case "WIPRevenue": return <WIPRevenue />;
            case "TopBottom": return <TopAndBottom />;
            case "GroupRanking": return <GroupRanking />;
        }
    }

    return (
        <>
            <div className={styles.analytics}>
                <ul className={styles.navbar}>
                <li><a onClick={setTopBottom} className={active === "TopBottom" && styles.active}>Top and Bottom</a></li>
                <li><a onClick={setGroup} className={active === "GroupRanking" && styles.active}>Group Ranking</a></li>
                    <li><a onClick={setOverview} className={active === "RevenueOverview" && styles.active}>Overview</a></li>
                    <li><a onClick={setCompleted} className={active === "CompletedRevenue" && styles.active}>Completed Jobs</a></li>
                    <li><a onClick={setWIP} className={active === "WIPRevenue" && styles.active}>WIP Jobs</a></li>
                    {/* <li><a onClick={setGroup} className={active === "GroupRanking" && styles.active}>Group Ranking</a></li>
                    <li><a onClick={setTopBottom} className={active === "TopBottom" && styles.active}>Top and Bottom</a></li> */}
                </ul>

                <Page />

            </div>

        </>
    )

}

    
