import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getUserList, setUserVisible } from "../../../api/api1";
import DataTable from "./components/MatTable";

function Users() {
  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(100);
  const [page_num, setPageNum] = useState(1);
  const [sort_column, setSortColumn] = useState("id");
  const [sort_method, setSortMethod] = useState("desc");
  const rows = [
    {
      id: "name",
      disablePadding: false,
      label: "User name",
    },
    // {
    //   id: "email",
    //   disablePadding: false,
    //   label: "User email",
    // },
    // {
    //   id: "worth",
    //   disablePadding: false,
    //   label: "Net worth",
    // },
    // {
    //   id: "owns",
    //   disablePadding: false,
    //   label: "Owns",
    // },
    {
      id: "created_at",
      disablePadding: false,
      label: "Joined date",
    },
    {
      id: "address",
      disablePadding: false,
      label: "User wallet address",
    },
  ];
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await getUserList(0, 100);
    let tempData = [...data];
    for (let i = 0; i < tempData.length; i++) {
      tempData[i].isChecked = false;
    }
    setData(tempData);
  };

  const handleChangeSort = (order, orderBy) => {
    setSortColumn(orderBy);
    setSortMethod(order);
  };

  const handleChangePage = (page) => {
    setPageNum(page);
  };

  const handleChangeSelect = (event, id) => {
    let tempData = [...data];
    tempData[id].isChecked = event.target.checked;
    setData(tempData);
  };

  const handleChangeSelectAll = (event) => {
    let tempData = [...data];
    for (let i = 0; i < tempData.length; i++) {
      tempData[i].isChecked = event.target.checked;
    }
    setData(tempData);
  };

  const handleChangeVisible = async (event, id) => {
    let tempData = [...data];
    let res = await setUserVisible({
      uid: tempData[id].id,
      visible: event.target.checked ? 1 : 0,
    });
    if (res.message === "User visible is set successfully") {
      fetchData();
    }
  };

  return (
    <div>
      <DataTable
        rows={rows}
        data={data}
        totalpage={totalpage}
        page_num={page_num}
        sort_column={sort_column}
        sort_method={sort_method}
        onChangeSort={handleChangeSort}
        onChangePage={handleChangePage}
        onChangeSelect={handleChangeSelect}
        onChangeSelectAll={handleChangeSelectAll}
        onChangeVisible={handleChangeVisible}
      />
    </div>
  );
}

export default Users;
