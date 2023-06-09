import React from 'react';
import { useState } from 'react';
import styles from "../styles/analytics.module.scss"
import CompletedRecoveryRate from '../components/RecoveryRate/completedRecoveryRate';
import TopBottom from '../components/RecoveryRate/topAndBottom'
import Performance from '../components/RecoveryRate/Performance'
import GroupAndNonGroup from '@/components/RecoveryRate/GroupAndNonGroup';
import GroupPerformance from '@/components/RecoveryRate/GroupPerformance';
import NonGroupPerformance from '@/components/RecoveryRate/NonGroupPerformance';
import GroupRanking from '@/components/RecoveryRate/groupRanking';
import NonGroupRanking from '@/components/RecoveryRate/nonGroupRanking';

export default function RecoveryRate (){
    const [active, setActive] = useState("CompletedRecoveryRate");



    const setCompleted = () => {
        setActive("CompletedRecoveryRate");
    }

    const setPerformance = () => {
        setActive("Performance");
    }

    const setGroup = () => {
        setActive("GroupAndNonGroup");
    }

    const setTopBottom = () => {
        setActive("TopBottom");
    }

    const setGroupPerformance = () =>{
        setActive("GroupPerformance")
    }

    const setNonGroupPerformance = () =>{
        setActive("NonGroupPerformance")
    }

    const setGroupRanking = () => {
        setActive("GroupRanking")
    }

    const setNonGroupRanking = () => {
        setActive("NonGroupRanking")
    }


    const Page = () => {
        switch (active) {
            case "RevenueOverview": return null;
            case "CompletedRecoveryRate": return <CompletedRecoveryRate/>;
            case "Performance": return <Performance/>;
            case "TopBottom": return <TopBottom/>;
            case "GroupAndNonGroup": return <GroupAndNonGroup/>;
            case "GroupPerformance" : return <GroupPerformance/>;
            case "NonGroupPerformance":return <NonGroupPerformance/>
            case "GroupRanking":return <GroupRanking/>
            case "NonGroupRanking":return <NonGroupRanking/>
        }
    }

    return(
        <>
            <div className={styles.analytics}>
                <ul className={styles.navbar}>
                <li><a onClick={setTopBottom} className={active === "TopBottom" && styles.active}>Top and Bottom</a></li>
                    <li><a onClick={setCompleted} className={active === "CompletedRecoveryRate" && styles.active}>Completed Jobs</a></li>
                    <li><a onClick={setPerformance} className={active === "Performance" && styles.active}>Performance</a></li>
                    <li><a onClick={setGroup} className={active === "GroupAndNonGroup" && styles.active}>Group And Non-Group</a></li>
                    <li><a onClick={setGroupPerformance} className={active === "GroupPerformance" && styles.active}>Group Performance</a></li>
                    <li><a onClick={setNonGroupPerformance} className={active === "NonGroupPerformance" && styles.active}>Non Group Performance</a></li>
                    <li><a onClick={setGroupRanking} className={active === "GroupRanking" && styles.active}>Group Ranking</a></li>
                    <li><a onClick={setNonGroupRanking} className={active === "NonGroupRanking" && styles.active}>Non Group Ranking</a></li>
                </ul>

                <Page />

            </div>
        </>
    )
}