import { padding } from "@mui/system"

const styles = {
    table: {
        fontFamily: "arial, sans-serif",
        borderCollapse: "collapse",
        width: "100%"
    },
    unitHeader:{
        textAlign:"center",
        backgroundColor:"rgba(48, 4, 170, 0.15)",
        fontWeight:"bold"
    },
 
    vl:{
        borderLeft:" 3px solid",
        borderLeftColor:" black",
        height: "100%",
    },
    row: {
        display: "flex"
    },
    row2: {
        display: "flex",
        marginTop:"7px",
    },
    row3: {
        display: "flex",
        marginTop:"-2px",
        marginBottom :"13px",
    },

    column:{
        padding: "5px",
        whiteSpace:"nowrap",
    },
    column2: {
        padding: "2px",
        marginLeft:"15px",
    },
    column3:{
        padding: "5px",
        width:"20%"
    },

    date: {
        "overflowX" : "scroll",
        "box-sizing": "border-box",
        flex: "30%",
        padding: "5px",

    },
    smallBox: {
        width: "50px",
        height:"20px",
    },
    middleBox:{
        width:'80px',
        height:"20px",
    },
    textField:{
            width:"50px",
            height:"20px",
    },
    activityName:{
        width:"80%",
    },
    alertSnackBar:{
        backgroundColor: "red",
        color:"white",
    },
    fieldSet:{
        marginTop: "10px",
    }
}

export {
    styles
}