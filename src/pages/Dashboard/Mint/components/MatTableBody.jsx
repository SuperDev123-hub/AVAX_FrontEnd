import PropTypes from "prop-types";
import React from "react";
import { Checkbox, TableBody, TableRow, TableCell } from "@material-ui/core";
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
                  {row.id === "track_name" ? (
                    <Nft>
                      <img src={`${IPFS_PREFIX}${item["image_url"]}`}></img>
                      {item[row.id]}
                    </Nft>
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

const Nft = styled.div`
  img {
    width: 35px;
    height: 40px;
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid #d8d8d8;
  }
`;

export default MatTableBody;
