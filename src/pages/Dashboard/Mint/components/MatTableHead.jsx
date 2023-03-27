import PropTypes from "prop-types";
import React from "react";
import {
  Checkbox,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";

function MatTableHead(props) {
  const { rows, order, orderBy, checkAll, onRequestSort, onChangeSelectAll } =
    props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className="app-border-table app-bg-dark">
        {
          <TableCell>
            <Checkbox onChange={(event) => onChangeSelectAll(event)} />
          </TableCell>
        }
        {rows.map((row) => (
          <TableCell
            className="material-table__cell material-table__cell--sort material-table__cell-right material-text-align"
            key={row.id}
            align={"left"}
            padding={row.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
              className="material-table__sort-label"
              dir="ltr"
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
        {<TableCell align={"right"}>Show/Hide</TableCell>}
      </TableRow>
    </TableHead>
  );
}

export default MatTableHead;
