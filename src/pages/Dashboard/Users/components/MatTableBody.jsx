import PropTypes from "prop-types";
import React from "react";
import { Checkbox, TableBody, TableRow, TableCell } from "@material-ui/core";
import { Avatar } from "@mui/material";
import { Switch } from "@material-ui/core";
import styled from "styled-components";
import { IPFS_PREFIX } from "../../../../utils/constant";

function MatTableBody(props) {
  const { rows, data, onChangeSelect, onChangeVisible } = props;

  return (
    <TableBody>
      {data.map((item, i) => {
        return (
          <TableRow
            className="material-table__row app-border-table"
            role="checkbox"
            tabIndex={-1}
            key={i}
          >
            {
              <TableCell key={i}>
                <Checkbox
                  checked={item.isChecked || false}
                  onChange={(event) => onChangeSelect(event, i)}
                />
              </TableCell>
            }
            {rows.map((row, j) => {
              return (
                <TableCell
                  key={j}
                  align={"left"}
                  padding={row.disablePadding ? "none" : "normal"}
                  className="material-table__cell material-table__cell-right material-text-align"
                >
                  {row.id === "name" ? (
                    <UserAvatar>
                      <Avatar
                        src={`${IPFS_PREFIX}${item["avatar"]}`}
                        className="avatar"
                      />
                      {`${item["firstname"]} ${item["lastname"]}`}
                    </UserAvatar>
                  ) : (
                    item[row.id]
                  )}
                </TableCell>
              );
            })}
            {
              <TableCell key={i} align={"right"}>
                <Switch
                  checked={item["visible"] === 1 ? true : false}
                  onChange={(event) => onChangeVisible(event, i)}
                />
              </TableCell>
            }
          </TableRow>
        );
      })}
    </TableBody>
  );
}

const UserAvatar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .MuiAvatar-root {
    margin-right: 10px;
  }
`;

export default MatTableBody;
