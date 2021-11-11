/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import CategoryList from "components/CategoryList/CategoryList.react";
import DashboardView from "dashboard/DashboardView.react";
import React from "react";

export default class Stats extends DashboardView {
  constructor() {
    super();
    this.section = "Core";
    this.subsection = "Statistics";
  }

  renderSidebar() {
    const { path } = this.props.match;
    const current = path.substr(path.lastIndexOf("/") + 1, path.length - 1);
    return (
      <CategoryList
        current={current}
        linkPrefix={"stats/"}
        categories={[
          { name: "Users", id: "users" },
          { name: "Leaderboards", id: "leaderboards" },
          { name: "Diaries", id: "diaries" },
          { name: "Logs", id: "logs" }
        ]}
      />
    );
  }

  renderContent() {
    const child = React.Children.only(this.props.children);
    return React.cloneElement(child, { ...child.props });
  }
}
