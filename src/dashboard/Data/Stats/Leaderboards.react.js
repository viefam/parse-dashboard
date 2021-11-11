import React, { Component } from "react";
import ChromeDropdown from "components/ChromeDropdown/ChromeDropdown.react";
import Option from "components/Dropdown/Option.react";
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
      data: [],
      metric: "users-create-most-plants"
    };

    this.exportCsv = this.exportCsv.bind(this);
    this.renderMetricsDDL = this.renderMetricsDDL.bind(this);
  }

  componentDidMount() {
    const { metric } = this.state;
    this.getUserCreateMostPlant(metric);
  }

  getUserCreateMostPlant(metric) {
    Parse.Cloud.run(
      "getInsights",
      {
        metric,
        limit: 20
      },
      {
        useMasterKey: true
      }
    ).then(data => {
      this.setState({ data });
    });
  }

  handleMetricChange(metric) {
    this.setState({ metric });
    this.getUserCreateMostPlant(metric);
  }

  renderToolbar() {
    const { metric } = this.state;
    let metricType = metric
      .split("-")
      .pop()
      .toUpperCase();

    return (
      <Toolbar section="Insights" subsection={`${metricType} Leaderboards`}>
        {this.renderMetricsDDL()}
      </Toolbar>
    );
  }

  renderMetricsDDL() {
    const metrics = [
      {
        key: "users-create-most-plants",
        value: "Plants"
      },
      {
        key: "users-create-most-diaries",
        value: "Diaries"
      }
    ];
    const options = metrics.map(({ key, name }) => (
      <Option value={key}>{name}</Option>
    ));

    return (
      <div style={{ marginTop: "45px" }}>
        <ChromeDropdown
          placeholder={"Choose a metric"}
          value={this.state.metric}
          onChange={metric => this.handleMetricChange(metric)}
          options={metrics}
          width="160px"
        />
      </div>
    );
  }

  renderHeaders() {
    return [
      <TableHeader key="count" width={10}>
        Count
      </TableHeader>,
      <TableHeader key="displayName" width={30}>
        Display Name
      </TableHeader>,
      <TableHeader key="phone" width={20}>
        Phone
      </TableHeader>,
      <TableHeader key="address" width={40}>
        Address
      </TableHeader>
    ];
  }

  renderRow(data) {
    const columnStyleSuperLarge = { width: "40%", cursor: "pointer" };
    const columnStyleLarge = { width: "30%", cursor: "pointer" };
    const columnStyleMedium = { width: "20%", cursor: "pointer" };
    const columnStyleSmall = { width: "10%", cursor: "pointer" };

    const { count, displayName, phone, address } = data;
    return (
      <tr key={phone}>
        <td style={columnStyleSmall}>{count}</td>
        <td style={columnStyleLarge}>{displayName}</td>
        <td style={columnStyleMedium}>{phone}</td>
        <td style={columnStyleSuperLarge}>{address}</td>
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
      count: item.count,
      displayName: item.user.displayName,
      phone: item.user.phone,
      address: item.user.address
    }));
  }
}
