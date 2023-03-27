import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Table } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import MatTableHead from "./MatTableHead";
import MatTableBody from "./MatTableBody";

function MatTable(props) {
  const {
    rows,
    data,
    totalpage,
    page_num,
    sort_column,
    sort_method,
    onChangeSort,
    onChangePage,
    onChangeSelect,
    onChangeSelectAll,
    onChangeVisible,
  } = props;

  const [order, setOrder] = useState(sort_method);
  const [orderBy, setOrderBy] = useState(sort_column);
  const [page, setPage] = useState(page_num);

  useEffect(() => {
    setOrder(sort_method);
  }, [sort_method]);

  useEffect(() => {
    setOrderBy(sort_column);
  }, [sort_column]);

  useEffect(() => {
    setPage(page_num);
  }, [page_num]);

  const handleRequestSort = (event, property) => {
    const tmpOrderBy = property;
    let tmpOrder = "desc";

    if (orderBy === property && order === "desc") {
      tmpOrder = "asc";
    }

    onChangeSort(tmpOrder, tmpOrderBy);
  };

  const handleChangePage = (event, page) => {
    onChangePage(page);
  };

  return (
    <div>
      <div className="material-table__wrap">
        <Table className="material-table">
          <MatTableHead
            rows={rows}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            onChangeSelectAll={onChangeSelectAll}
          />
          <MatTableBody
            rows={rows}
            data={data}
            onChangeSelect={onChangeSelect}
            onChangeVisible={onChangeVisible}
          />
        </Table>
      </div>
      <div className="d-flex justify-content-end mt-2">
        <Pagination
          count={totalpage}
          color="primary"
          page={page}
          onChange={handleChangePage}
        />
      </div>
    </div>
  );
}

export default MatTable;
