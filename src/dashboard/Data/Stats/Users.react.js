import React, { Component } from "react";
import Field from "components/Field/Field.react";
import Fieldset from "components/Fieldset/Fieldset.react";
import Label from "components/Label/Label.react";
import TextInput from "components/TextInput/TextInput.react";
import Button from "components/Button/Button.react";
import styles from "dashboard/Data/Stats/Stats.scss";
import Parse from "parse";

const VN_PHONE_NUMBER_REGEX = /^(\+84)([3|5|7|8|9])([0-9]{8})\b/;

export default class UserStats extends Component {
  constructor() {
    super();

    this.state = {
      response: { results: [] },
      users: [],
      createdPlantUsers: [],
      notCreatedPlantUsers: [],
      createdFarmUsers: [],
      notCreatedFarmUsers: [],
      haveOwnershipUsers: [],
      notHaveOwnershipUsers: [],
      missedUsers: [],
      fetchingUser: false,
      inProgress: false,
      error: false
    };
  }

  componentDidMount() {
    this.getUserInsight();
  }

  getUserInsight() {
    new Parse.Query(Parse.User)
      .limit(Number.MAX_SAFE_INTEGER)
      .matches("username", /^(\+84)([3|5|7|8|9])([0-9]{8})\b/)
      .find({
        useMasterKey: true
      })
      .then(users => {
        this.setState({ users });
        new Parse.Query("Plant")
          .containedIn("owner", users)
          .distinct("owner")
          .then(createdPlantUserPointers => {
            const createdPlantUsers = users.filter(user =>
              createdPlantUserPointers.some(
                pointer => pointer.objectId === user.id
              )
            );
            this.setState({ createdPlantUsers });
            const notCreatedPlantUsers = users.filter(
              user => !createdPlantUsers.includes(user)
            );
            this.setState({ notCreatedPlantUsers });
          });

        new Parse.Query("Farm")
          .containedIn("owner", users)
          .distinct("owner")
          .then(createdFarmUserPointers => {
            const createdFarmUsers = users.filter(user =>
              createdFarmUserPointers.some(
                pointer => pointer.objectId === user.id
              )
            );
            this.setState({ createdFarmUsers });

            const notCreatedFarmUsers = users.filter(
              user => !createdFarmUsers.includes(user)
            );
            this.setState({ notCreatedFarmUsers });
          });

        new Parse.Query("PlantOwnership")
          .containedIn("owner", users)
          .distinct("owner")
          .then(haveOwnershipUserPointers => {
            const haveOwnershipUsers = users.filter(user =>
              haveOwnershipUserPointers.some(
                pointer => pointer.objectId === user.id
              )
            );
            this.setState({ haveOwnershipUsers });

            const notHaveOwnershipUsers = users.filter(
              user => !haveOwnershipUsers.includes(user)
            );
            this.setState({ notHaveOwnershipUsers });
          });

        new Parse.Query("OTPHistory")
          .notContainedIn(
            "phoneNumber",
            users.map(user => user.get("username"))
          )
          .greaterThan("createdAt", new Date("2021", "8", "8"))
          .distinct("phoneNumber")
          .then(mUsers => {
            const missedUsers = mUsers.filter(user =>
              VN_PHONE_NUMBER_REGEX.test(user)
            );
            this.setState({ missedUsers });
            console.log("Missed users", missedUsers);
          });
      });
  }

  filterRealuser(user) {
    return VN_PHONE_NUMBER_REGEX.test(user.get("username"));
  }

  render() {
    const {
      users,
      createdPlantUsers,
      notCreatedPlantUsers,
      createdFarmUsers,
      notCreatedFarmUsers,
      haveOwnershipUsers,
      notHaveOwnershipUsers,
      missedUsers
    } = this.state;

    return (
      <div style={{ padding: "30px 0 60px 0" }}>
        <Fieldset legend="User Insight" description="Excluding testing users">
          <Field
            label={<Label text="Total users" />}
            input={<Button value={users.length.toString()} color="blue" />}
          ></Field>
          <Field
            label={<Label text="Users have at least one farm" />}
            input={
              <Button value={createdFarmUsers.length.toString()} color="blue" />
            }
          ></Field>
          <Field
            label={<Label text="Users have never created any farm" />}
            input={
              <Button
                value={notCreatedFarmUsers.length.toString()}
                color="blue"
              />
            }
          ></Field>
          <Field
            label={<Label text="Users have created at least one plant" />}
            input={
              <Button
                value={createdPlantUsers.length.toString()}
                color="blue"
              />
            }
          ></Field>
          <Field
            label={<Label text="Users have never created any plant" />}
            input={
              <Button
                value={notCreatedPlantUsers.length.toString()}
                color="blue"
              />
            }
          ></Field>
          <Field
            label={<Label text="Users have at least one ownership" />}
            input={
              <Button
                value={haveOwnershipUsers.length.toString()}
                color="blue"
              />
            }
          ></Field>
          <Field
            label={
              <Label text="Users have never been assigned any ownership" />
            }
            input={
              <Button
                value={notHaveOwnershipUsers.length.toString()}
                color="blue"
              />
            }
          ></Field>
          {/* <Field
            label={<Label text="Missed Users" />}
            input={
              <Button value={missedUsers.length.toString()} color="blue" />
            }
          ></Field> */}
        </Fieldset>
      </div>
    );
  }
}
