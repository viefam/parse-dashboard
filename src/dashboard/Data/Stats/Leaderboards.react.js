import React, { Component } from "react";
import Field from "components/Field/Field.react";
import Fieldset from "components/Fieldset/Fieldset.react";
import Label from "components/Label/Label.react";
import TextInput from "components/TextInput/TextInput.react";
import Button from "components/Button/Button.react";
import EmptyState from "components/EmptyState/EmptyState.react";
import Toolbar from "components/Toolbar/Toolbar.react";
import SidebarAction from "components/Sidebar/SidebarAction";
import TableView from "dashboard/TableView.react";
import TableHeader from "components/Table/TableHeader.react";
import ExportCsv, { DowloadCsv } from "./CsvUtils";

import Parse from "parse";

export default class LeaderBoardsStats extends TableView {
  constructor() {
    super();
    this.action = new SidebarAction("Change metrics", () => {});

    this.state = {
      response: { results: [] },
      data: []
    };

    this.exportCsv = this.exportCsv.bind(this);
  }

  componentDidMount() {
    this.getUserCreateMostPlant();
  }

  getUserCreateMostPlant() {
    Parse.Cloud.run(
      "getInsights",
      {
        metric: "users-create-most-plants"
      },
      {
        useMasterKey: true
      }
    ).then(data => {
      console.log("Users", data);
      this.setState({ data });
    });
  }

  renderToolbar() {
    return (
      <Toolbar section="Insights" subsection="Leaderboards">
        <Button
          color="white"
          value="Change metrics"
          onClick={this.showMetrics.bind(this)}
        />
      </Toolbar>
    );
  }

  renderHeaders() {
    return [
      <TableHeader key="count" width={15}>
        Count
      </TableHeader>,
      <TableHeader key="displayName" width={30}>
        Display Name
      </TableHeader>,
      <TableHeader key="phone" width={30}>
        Phone
      </TableHeader>,
      <TableHeader key="address" width={15}>
        Address
      </TableHeader>
    ];
  }

  renderRow(data) {
    const columnStyleLarge = { width: "30%", cursor: "pointer" };
    const columnStyleSmall = { width: "15%", cursor: "pointer" };

    const { count, displayName, phone, address } = data;
    return (
      <tr key={phone}>
        <td style={columnStyleSmall}>{count}</td>
        <td style={columnStyleLarge}>{displayName}</td>
        <td style={columnStyleLarge}>{phone}</td>
        <td style={columnStyleSmall}>{address}</td>
      </tr>
    );
  }

  renderEmpty() {
    return (
      <EmptyState
        title="Dynamically configure your app"
        description="Set up parameters that let you control the appearance or behavior of your app."
      />
    );
  }

  exportCsv(data, fileName = "data") {
    const csv = ExportCsv({ data });
    DowloadCsv(csv, fileName);
  }

  showMetrics() {}

  tableData() {
    const { data } = this.state;
    if (!data) {
      return data;
    }

    return data.map(item => ({
      count: item.plantCount,
      displayName: item.owner.displayName,
      phone: item.owner.phone,
      address: item.address
    }));
  }
}
