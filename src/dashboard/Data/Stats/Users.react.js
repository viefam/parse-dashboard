import React, { Component } from "react";
import Field from "components/Field/Field.react";
import Fieldset from "components/Fieldset/Fieldset.react";
import Label from "components/Label/Label.react";
import TextInput from "components/TextInput/TextInput.react";
import styles from "dashboard/Data/Stats/Stats.scss";
import Parse from "parse";

const VN_PHONE_NUMBER_REGEX = /^(\+84)([3|5|7|8|9])([0-9]{8})\b/;

export default class UserStats extends Component {
  constructor() {
    super();

    this.state = {
      response: { results: [] },
      users: [],
      userHavePlants: [],
      userHaveOwnerships: [],
      userHaveFarms: [],
      plantHaveDiary: [],
      fetchingUser: false,
      inProgress: false,
      error: false
    };
  }

  componentDidMount() {
    this.fetchUsers();
    this.fetchUsersCreatedPlant();
    this.fetchUsersHaveOnwership();
    this.fetchUserHasFarms();
    this.fetchPlantsHaveLogDiares();
  }

  fetchUsers() {
    new Parse.Query(Parse.User)
      .limit(Number.MAX_SAFE_INTEGER)
      .find({
        useMasterKey: true
      })
      .then(
        users => {
          this.setState({ users });
        },
        error => {
          console.error("Fetching users", error);
          this.setState({ error: "Unable to fetch the users" });
        }
      );
  }

  fetchUsersCreatedPlant() {
    new Parse.Query("Plant")
      .limit(Number.MAX_SAFE_INTEGER)
      .include("owner")
      .distinct("owner")
      .then(
        userHavePlants => this.setState({ userHavePlants }),
        error => this.setState({ error: "Unable to fetch the plants" })
      );
  }

  fetchUsersHaveOnwership() {
    new Parse.Query("PlantOwnership")
      .limit(Number.MAX_SAFE_INTEGER)
      .include("owner")
      .distinct("owner")
      .then(
        userHaveOwnerships => this.setState({ userHaveOwnerships }),
        error => this.setState({ error: "Unable to fetch the ownership" })
      );
  }

  fetchUserHasFarms() {
    new Parse.Query("Farm")
      .limit(Number.MAX_SAFE_INTEGER)
      .include("owner")
      .distinct("owner")
      .then(
        userHaveFarms => this.setState({ userHaveFarms }),
        error => this.setState({ error: "Unable to fetch the farms" })
      );
  }

  fetchPlantsHaveLogDiares() {
    new Parse.Query("LogPlantDiary")
      .limit(Number.MAX_SAFE_INTEGER)
      .include("plant.owner")
      .find({
        useMasterKey: true
      })
      // .distinct("plant")
      .then(
        plantHaveDiary => this.setState({ plantHaveDiary }),
        error => this.setState({ error: "Unable to fetch the plants" })
      );
  }

  render() {
    const {
      users,
      userHavePlants,
      userHaveOwnerships,
      userHaveFarms,
      plantHaveDiary
    } = this.state;

    const realUsers = users.filter(user =>
      VN_PHONE_NUMBER_REGEX.test(user.get("username"))
    );

    const realUserHavePlants = userHavePlants.filter(u =>
      realUsers.find(r => r.id === u.objectId)
    );

    const usersHaveNoPlant = realUsers.filter(
      u => !realUserHavePlants.find(p => p.objectId === u.id)
    );

    const realUserHaveOwnerships = userHaveOwnerships.filter(u =>
      realUsers.find(r => r.id === u.objectId)
    );

    const realUserNoOwnerships = realUsers.filter(
      u => !realUserHaveOwnerships.find(r => r.objectId === u.id)
    );

    const realUserHaveFarms = userHaveFarms.filter(u =>
      realUsers.find(r => r.id === u.objectId)
    );

    const realUsersLogDiaries = plantHaveDiary
      .filter(p =>
        VN_PHONE_NUMBER_REGEX.test(
          p
            .get("plant")
            .get("owner")
            .get("username")
        )
      )
      .map(p => p.get("plant").get("owner").id);

    const uniqUsersLogDiaries = [...new Set(realUsersLogDiaries)];
    const usersNoLogDiaries = realUsers.filter(
      u => uniqUsersLogDiaries.indexOf(u.id) < 0
    );

    return (
      <div style={{ padding: "120px 0 60px 0" }}>
        <Fieldset legend="User Insight" description="Excluding testing users">
          <Field
            label={<Label text="Total users" />}
            input={<TextInput value={realUsers.length} disabled="true" />}
          ></Field>
          <Field
            label={<Label text="Users have at least one farm" />}
            input={
              <TextInput value={realUserHaveFarms.length} disabled="true" />
            }
          ></Field>
          <Field
            label={<Label text="Users have created at least one plant" />}
            input={
              <TextInput value={realUserHavePlants.length} disabled="true" />
            }
          ></Field>
          <Field
            label={<Label text="Users have never created any plant" />}
            input={
              <TextInput value={usersHaveNoPlant.length} disabled="true" />
            }
          ></Field>
          <Field
            label={<Label text="Users have at least one ownership" />}
            input={
              <TextInput
                value={realUserHaveOwnerships.length}
                disabled="true"
              />
            }
          ></Field>
          <Field
            label={<Label text="Users have no ownership" />}
            input={
              <TextInput value={realUserNoOwnerships.length} disabled="true" />
            }
          ></Field>
          <Field
            label={<Label text="Users have logged at least one diary" />}
            input={
              <TextInput value={uniqUsersLogDiaries.length} disabled="true" />
            }
          ></Field>
          <Field
            label={<Label text="Users have never logged any diary" />}
            input={
              <TextInput value={usersNoLogDiaries.length} disabled="true" />
            }
          ></Field>
        </Fieldset>
      </div>
    );
  }
}
