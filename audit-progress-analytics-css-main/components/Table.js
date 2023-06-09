import React, { useState, useRef, useEffect, Component } from "react";
import TableCell from "@mui/material/TableCell";
import {
  Grid,
  Table,
  TableHeaderRow,
  Toolbar,
  SearchPanel,
  TableBandHeader,
  TableFilterRow,
} from "@devexpress/dx-react-grid-material-ui";
import {
  SortingState,
  IntegratedSorting,
  SearchState,
  FilteringState,
  IntegratedFiltering,
  DataTypeProvider,
} from "@devexpress/dx-react-grid";
import Select from "react-select";

const options = [
  { value: "WIP", label: "WIP" },
  { value: "completed", label: "completed" },
];

const UnitsFilterCell = ({ filter, onFilter }) => (
  <TableCell sx={{ width: "100%", p: 1 }}>
    <Select
      options={options}
      name={"status"}
      value={options.value}
      onChange={(e) => onFilter(e.value ? { value: e.value } : null)}
    />
  </TableCell>
);

const FilterCell = (props) => {
  const { column } = props;
  if (column.name === "status") {
    return <UnitsFilterCell {...props} />;
  }
  return <TableFilterRow.Cell {...props} />;
};

const ButtonTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={htmlFormatter}
    {...props}
  />
);

const handleDelete = (id) =>{
  console.log(id)
}

const htmlFormatter = ({ value }) => (
    <button className="submit-button w-button" onClick={() =>handleDelete(value)}>
      Delete
    </button>
);
export default function JobTable(props) {
  const columns = [
    { name: "fileReference", title: "File Reference" },
    { name: "status", title: "Status" },
    { name: "clientName", title: "Client" },
    { name: "groupCompany", title: "Group Company" },
    { name: "teamMember", title: "Participating Staff" },
    { name: "teamLead", title: "Team Leader" },
    { name: "teamDirector", title: "Team Director" },
    { name: "budgetUnit", title: "Budget" },
    { name: "actualUnit", title: "Actual" },
    { name: "budgetCost", title: "Budget" },
    { name: "actualCost", title: "Actual" },
    { name: "revenue", title: "Revenue" },
    { name: "preparedBy", title: "By" },
    { name: "delete", title: "Delete" },
  ];
  const [tableColumnExtensions] = useState([
    { columnName: "status" },
    { columnName: "fileReference", width: "10%" },
    { columnName: "groupCompany", width: "10%" },
    { columnName: "teamMember", width: "10%" },
    { columnName: "teamLead", width: "10%" },
    { columnName: "teamDirector", width: "10%" },
    { columnName: "revenue", width: "8%" },
  ]);
  const [columnBands] = useState([
    {
      title: "Units",

      children: [{ columnName: "budgetUnit" }, { columnName: "actualUnit" }],
    },
    {
      title: "Costs",

      children: [{ columnName: "budgetCost" }, { columnName: "actualCost" }],
    },
    {
      title: "Prepared",

      children: [{ columnName: "preparedBy" }],
    },
  ]);
  const [deleteColumns] = useState(['delete']);



  return (
    <div>
      <Grid rows={props} columns={columns}>

        <SortingState
          defaultSorting={[{ columnName: "fileReference", direction: "asc" }]}
        />
        <SearchState />
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
        <IntegratedSorting />

        <Table columnExtensions={tableColumnExtensions} />
        <ButtonTypeProvider
          for={deleteColumns}
        />
        <TableHeaderRow showSortingControls />
        <TableBandHeader columnBands={columnBands} />
        <TableFilterRow cellComponent={FilterCell} />
        <Toolbar />
        <SearchPanel />
      </Grid>
    </div>
  );
}
