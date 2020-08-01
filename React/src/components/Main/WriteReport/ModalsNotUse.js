{/* modal for select role*/}

    //some selections when entering write report
    // showRoleSelectModal: false,
    // showTeamSelectModal: this.props.teamName, //show team and sprint selection at first
    // showSprintSelectModal: this.props.teamName && this.props.sprintObj, // change to teamName, add a request
    // showTemplateSelectModal: this.props.teamName && this.props.sprintObj,
    
<Modal
show={this.state.showRoleSelectModal}
handleCancel={() => this.exitModal("showRoleSelectModal")}
handleOk={() => this.exitModal("showRoleSelectModal")}
okMessage={"Confirm Submit"}
showOk={false}
showCancel={false}
cancelMessage={"Cancel"}
cancelBtnType={""}
okBtnType={"primary"}
title={"Write report as a Team Lead or a Team Member?"}
>
<Row
  type={"flex"}
  justify={"center"}
  align={"top"}
  style={{ padding: "20px" }}
  data-tut="tour_team_join_info"
>
  <Col style={{margin:"10px",padding:"auto"}}>
    <Button
    type="primary"
    size = "large"
      onClick={() => {
        this.setState({ isLeader: true});
        if (this.state.createdTeams && this.state.createdTeams.length>0) this.showModal("showTeamSelectModal");
        else {
          message.error("Please create a team first");
        }
        this.exitModal("showRoleSelectModal");
      }}
    >
      I'm a Team Leader
    </Button>
  </Col>
  <Col style={{margin:"10px" ,padding:"auto"}}>
    <Button
    type="primary"
    size = "large"
      onClick={() => {
        this.setState({ isLeader: false });
        if (this.state.joinedTeams && this.state.joinedTeams.length>0) this.showModal("showTeamSelectModal");
        else {
          message.error("Please join a team first");
        }
        this.exitModal("showRoleSelectModal");
      }}
    >
      I'm a Team Member
    </Button>
  </Col>
</Row>
</Modal>

{/* modal for select team*/}
<Modal
show={this.state.showTeamSelectModal}
handleCancel={() => this.exitModal("showTeamSelectModal")}
handleOk={() => this.exitModal("showTeamSelectModal")}
showOk={false}
showCancel={false}
okMessage={"Confirm Submit"}
cancelMessage={"Cancel"}
cancelBtnType={""}
okBtnType={"primary"}
title={"Select a Team"}
>
<Row
  type={"flex"}
  justify={"center"}
  align={"top"}
  style={{ padding: "20px" }}
  data-tut="tour_team_join_info"
>
  {this.state.isLeader
    ? this.showTeams("created", this.state.createdTeams)
    : this.showTeams("joined", this.state.joinedTeams)}
</Row>
</Modal>

{/* modal for select sprint*/}
<Modal
show={this.state.showSprintSelectModal}
handleCancel={() => this.exitModal("showSprintSelectModal")}
handleOk={() => this.exitModal("showSprintSelectModal")}
showOk={false}
showCancel={false}
okMessage={"Confirm Submit"}
cancelMessage={"Cancel"}
cancelBtnType={""}
okBtnType={"primary"}
title={"Select a Sprint"}
>
<Row
  type={"flex"}
  justify={"center"}
  align={"top"}
  style={{ padding: "12px" }}
  data-tut="tour_team_join_info"
>
  {this.showSprints()}
</Row>
</Modal>

{/* Modal for select template */}
<Modal
show={this.state.showTemplateSelectModal}
handleCancel={() => this.exitModal("showTemplateSelectModal")}
handleOk={() => this.exitModal("showTemplateSelectModal")}
showOk={false}
showCancel={false}
okMessage={"Confirm Submit"}
cancelMessage={"Cancel"}
cancelBtnType={""}
okBtnType={"primary"}
title={"Want to use a template in your group?"}
>
<Row
  type={"flex"}
  justify={"center"}
  align={"top"}
  style={{ padding: "12px" }}
  data-tut="tour_team_join_info"
>
  {this.showTemplates()}
</Row>
</Modal>



  //show templates
  showTemplates = () => {
    return [
      <div>
        <Search
          placeholder="search templates"
          onSearch={(value) => this.searchTemplates(value)}
          style={{ width: 200 }}
        />
        <List
          grid={{
            gutter: 16,
          }}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 4,
            size: "small",
          }}
          dataSource={this.state.templates}
          renderItem={(template) => (
            <List.Item>
              <Card
                title={template.theme}
                hoverable={true}
                size="small"
                onClick={() => {
                  this.selectTemplate(template);
                  this.exitModal("showTemplateSelectModal");
                }}
              >
                <Avatar
                  shape="square"
                  size={64}
                  style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                >
                  <UserOutlined style={{ width: 20 }} />
                </Avatar>
              </Card>
            </List.Item>
          )}
        />
      </div>,
    ];
  };

  //show sprints witnin a team
  showSprints = () => {
    if (!this.state.typeToSprints || this.state.typeToSprints.length === 0) {
      return;
    }
    return (
      <div>
        {Array.from(this.state.typeToSprints.keys()).map((type, index) => {
          return (
            <div>
              <Row
                type={"flex"}
                justify={"center"}
                align={"top"}
                style={{ padding: "8px" }}
              >
                {type}
              </Row>
              <Row
                type={"flex"}
                justify={"center"}
                align={"top"}
                style={{ padding: "12px" }}
                data-tut="tour_team_join_info"
              >
                <List
                  grid={{
                    gutter: 16,
                  }}
                  pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 4,
                    size: "small",
                  }}
                  dataSource={this.state.typeToSprints.get(type)}
                  renderItem={(sprintObj) => (
                    <List.Item>
                      <Card
                        title={sprintObj.sprint}
                        hoverable={true}
                        size="small"
                        onClick={() => {
                          this.changeSprint(sprintObj, type);
                          this.exitModal("showSprintSelectModal");
                          if (
                            this.state.templates &&
                            this.state.templates.length > 0 &&
                            !this.state.gotIntegratedContent
                          )
                            this.showModal("showTemplateSelectModal");
                        }}
                      >
                        {sprintObj.endTime}
                      </Card>
                    </List.Item>
                  )}
                />
              </Row>
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * display teams as cards list
   * @method showTeams
   * @param type: created team or joined team
   * @param teams: all teams information
   * @for TeamManagement
   * @return none
   */
  showTeams = (type, teams) => {
    return [
      <div>
        <List
          grid={{
            gutter: 16,
          }}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 4,
            size: "small",
          }}
          dataSource={teams}
          renderItem={(teamInfo) => (
            <List.Item>
              <Card
                title={teamInfo.teamName}
                hoverable={true}
                size="small"
                onClick={() => {
                  this.selectTeam(teamInfo, this.state.isLeader);
                  this.exitModal("showTeamSelectModal");
                  // if (this.state.typeToSprints && Array.from(this.state.typeToSprints.keys()).length > 0) this.showModal("showSprintSelectModal");
                  // else {
                  //   message.error("Sorry but there is no sprint in this team");
                  // }
                }}
              >
                <Avatar
                  shape="square"
                  size={64}
                  style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                >
                  <UserOutlined style={{ width: 20 }} />
                </Avatar>
              </Card>
            </List.Item>
          )}
        />
      </div>,
    ];
  };
}
