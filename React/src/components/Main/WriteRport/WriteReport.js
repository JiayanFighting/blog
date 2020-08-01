import React, { Component } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  Input,
  Layout,
  Menu,
  message,
  List,
  Card,
  Avatar,
  Select,
  DatePicker,
  InputNumber,
  Space,
  Alert,
  Spin
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FieldBinaryOutlined,
  UploadOutlined,
  MailOutlined,
  FileDoneOutlined
} from "@ant-design/icons";
import "antd/dist/antd.css";
import moment from "moment";
import JoinedTeamInfo from "../TeamManagement/JoinedTeamInfo";
import {
  submitReportService,
  submitTemplateService,
  sendEmailService,
  getTemplatesService,
  getReportDetailService,
  updateReportService,
} from "../../../services/reportService.js";
import { getCurSprintListService,createSprintItemService } from "../../../services/sprintService";
import {
  getJoinedTeamsService,
  getCreatedTeamsService,
} from "../../../services/teamService";
import Modal from "../HelperComponents/Modal";
import PhotoDragger from "./PhotoDragger";
import WriteAndViewBoard3 from "../WriteAndViewBoard3/WriteAndViewBoard3";
import { ROOT } from "../../../constants";
import { showError, showSuccess } from "../../../services/notificationService";
import ViewBoard from "./ViewBoard";
import {getReportData} from "../../../services/reportService";
import ReportsInThePast from "./ReportsInThePast";

const { RangePicker } = DatePicker;
const { SubMenu } = Menu;
const { Search } = Input;

//default template for users
let defaultText = `
<img src="https://weekly.omsz.io:3000/7/jiayan.huang@dchdc.net/A05B71F8968B455EA07817D28EB9EA61.png" alt=“upload”  width="60%" height="60%">

### Summary of this week
* 


### Plan for the next week
* 


\`\`\`
    System.out.println("Hello World");
\`\`\`\
`;
/**
 * write-report page
 */
class WriteReport extends Component {
  state = {
    infoPage: false,
    content:
      !this.props.integratedContent || this.props.integratedContent.length === 0
        ? defaultText
        : this.props.integratedContent,
    defaultText: defaultText,
    showSendEmailModal: false,
    showReportInThePastSelectModal: false,
    showSubmitReportModal: false,
    showSubmitTemplateModal: false,
    // remind user to save content
    showRemindSaveModal: false,
    //some selections when entering write report
    // showRoleSelectModal: false,
    // showTeamSelectModal: this.props.teamName, //show team and sprint selection at first
    // showSprintSelectModal: this.props.teamName && this.props.sprintObj, // change to teamName, add a request
    // showTemplateSelectModal: this.props.teamName && this.props.sprintObj,
    showAutoUpdateSprintModal:false,
    //if leader, send email to team email. if memeber, send to lead email
    toEmail: this.props.teamInfo  
      ? this.props.teamInfo.teamEmail
      : "No team selected",   //send email to
    subject: "subject",
    typeToSprints: [], //sprints within a team, mapped with report type: "sprint":sprint,"beginTime":beginTime,"endTime":endTime, "type" :type
    reportType: "default",
    sprint:  0, //selected sprint number, 0 for draft
    sprintObj:  {}, //"sprint":sprint,"beginTime":beginTime,"endTime":endTime, "type" :type
    joinedTeams: [],
    createdTeams: [],
    templates: [], //templates within a team
    oriTemplates: [], //original templates in a team without keyword searching
    currTemplate: null,
    theme: "",
    teamId: -1,
    toTeam:"", //submit report to team(object)
    userEmail: this.props.userInfo.email,
    //update target
    needUpdate: false,
    updateReportId: "",
    isLeader: this.props.role && this.props.role === "leader",
    gotIntegratedContent: this.props.integratedContent && this.props.integratedContent.length !== 0,
    //upcoming sprint and report
    upcomingReport: {}, //.content, .theme, id(reportId), type
    upcomingSprintObj: {}, //sprint(number),
    upcomingTemplate:{},
    //loading
    isLoading:false,
    data: {}
  };

  // get user's information after rendering
  componentDidMount() {
    let userEmail = { userEmail: this.state.userEmail };
    getJoinedTeamsService(false, userEmail)
      .then((res) => {
        this.setState({ joinedTeams: res.joinedList });
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to show joined teams");
        }
      });
    getCreatedTeamsService(false, userEmail)
      .then((res) => {
        this.setState({ createdTeams: res.createdList });
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to show joined teams");
        }
      });
      console.log("write reports props: ", this.props);
      if (this.props.teamInfo && Object.keys(this.props.teamInfo).length > 0) {
        this.setState({toTeam:this.props.teamInfo})
      }
      if (this.props.sprintObj && Object.keys(this.props.sprintObj).length > 0) {
        this.setState({sprintObj:this.props.sprintObj,
        sprint:this.props.sprintObj.sprint});
      }
      if (this.props.currReport && Object.keys(this.props.currReport).length > 0) {
        this.setState({content:this.props.currReport.content})
      }
  }

  //when component unmount
  componentWillUnmount() {
    if (this.state.sprint !== 0) {
      this.submitReport(this.state.content);
    }
    this.props.clearIntegratedContent();
  }


  //common function for handling click event
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };

  /**
   * close modal by modal name
   * @param modalName: enter a modal name to close it
   */
  exitModal = (modalName) => {
    this.setState({
      [modalName]: false,
    });
  };

  /**
   * show modal by modal name
   * @param modalName: enter a modal name to show it
   */
  showModal = (modalName) => {
    if (modalName === "showSubmitReportModal") {
      console.log("check");
      if (!this.state.teamId || this.state.teamId === -1) {
        message.error("please select a team");
        return;
      }
      if (!this.state.theme || this.state.theme === "") {
        message.error("please enter the title");
        return;
      }
    }
    this.setState({
      [modalName]: true,
    });
  };

  /**
   * This function is for child component to update props's state
   * For example, in WriteAndViewBoard, you can change props's content by calling onChange={this.props.setContent(content)}
   * @param content
   */
  setContent = (content) => {
    this.setState({ content: content });
  };

  // set default content you want
  setDefaultContent = (content) => {
    this.setState({ defaultContent: content });
  };

  /**
   * change theme of current report or template
   * @param theme
   */
  setTheme = (theme) => {
    this.setState({ theme: theme });
  };

  /**
   * Update state by selecting a team in team list
   * @param teamInfo
   */
  selectTeam = async (teamInfo, isLeader) => {
    if (!teamInfo) {
      showError("no team selected!");
    }
    //auto save previous work
    if (this.state.toTeam && this.state.sprint !== 0) {
      this.submitReport(this.state.content);
    }
    this.setState({
      toEmail: isLeader ? teamInfo.teamEmail : teamInfo.leadEmail,
      teamId: teamInfo.id,
      toTeam: teamInfo,
      isLeader: isLeader,
    });
    this.setState({ sprintObj: {}, sprint: 0 });
    this.getTemplatesInTeam(teamInfo.id);
    await getCurSprintListService(teamInfo.id)
      .then((res) => {
        let typeToSprints = new Map();
        console.log("sprints: " + res.curList);
        for (let i = 0; i < res.curList.length; i++) {
          let type = res.curList[i].type;
          let sprint = res.curList[i].sprint;
          let beginTime = moment(res.curList[i].beginTime).format("YYYY-MM-DD");
          let endTime = moment(res.curList[i].endTime).format("YYYY-MM-DD");
          if (!typeToSprints.has(type)) {
            typeToSprints.set(type, []);
          }
          typeToSprints
            .get(type)
            .push({
              sprint: sprint,
              beginTime: beginTime,
              endTime: endTime,
              type: type,
            });
        }
        this.setState({ typeToSprints: typeToSprints });
        console.log("team selected: " + this.state.typeToSprints);
        // if (this.state.typeToSprints && Array.from(this.state.typeToSprints.keys()).length > 0) this.showModal("showSprintSelectModal");
        //           else {
        //             message.error("Sorry but there is no sprint in this team");
        //           }
      })
      .catch((err) => {
        console.log("get sprints err: " + err);
      });
  };

  // submit report to team leader
  submitReport = (content) => {
    this.setState({isLoading:true});
    if (this.state.sprint === 0) {
      showError("You must select a sprint");
      return;
    }
    let teamId = this.state.teamId;
    if (!teamId || teamId === -1) {
      return;
    }
    let email = this.state.userEmail;
    let curr_report = {
      fromEmail: email,
      toEmail: this.state.toTeam.leadEmail,
      content: content,
      type: this.state.reportType ? this.state.reportType : "default",
      theme: this.state.theme,
      teamId: teamId,
      sprint: this.state.sprint,
    };
    if (
      this.state.needUpdate === true &&
      this.state.updateReportId !== "" &&
      this.state.updateReportId !== undefined
    ) {
      curr_report.id = this.state.updateReportId;
      updateReportService(curr_report)
        .then((res) => {
          console.log("update res: ",res);
          showSuccess("Previous work saved!");
          this.exitModal("showSubmitReportModal");
          this.setState({gotIntegratedContent:false});
          // this.clearIntegratedContentAndResetContent();
          this.setState({isLoading:false});
        })
        .catch((err) => {
          console.log(err);
          if (err === 302) {
            this.props.onSessionExpired();
          } else {
            showError("Failed to save because no spint selected");
          }
          this.setState({isLoading:false});
        });
    } else {
      submitReportService(false, curr_report)
        .then((res) => {
          showSuccess("Previous work saved!");
          this.exitModal("showSubmitReportModal");
          console.log("submit res: ",res);
          this.setState({ updateReportId: res.id, needUpdate: true,gotIntegratedContent:false });
          this.setState({isLoading:false});
        })
        .catch((err) => {
          console.log(err);
          if (err === 302) {
            this.props.onSessionExpired();
          } else {
            showError("Failed to save because no spint selected");
          }
          this.setState({isLoading:false});
        });
    }
  };

  // //update state content once the user selecting a template
  // onTemplatesSelect = (template) => {
  //   this.setState({ content: template.content, currTemplate: template });
  // };

  clearIntegratedContentAndResetContent = () => {
    this.props.clearIntegratedContent();
    this.setState({ content: this.state.defaultText });
  };

  submitTemplate = (content, theme) => {
    let curr_template = {
      creatorEmail: this.state.userEmail,
      content: content,
      type: this.state.reportType ? this.state.reportType : "default",
      theme: theme,
      teamId: this.state.teamId,
    };
    submitTemplateService(false, curr_template)
      .then((res) => {
        showSuccess("Saved Successfully");
        this.exitModal("showSubmitTemplateModal");
        this.getTemplatesInTeam(this.state.teamId);
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to save template");
        }
      });
  };

  //search templates
  searchTemplates = (input) => {
    let templates = this.state.oriTemplates;
    let newTemplates = [];
    for (let i = 0; i < templates.length; i++) {
      if (
        templates[i].theme.toUpperCase().indexOf(input.toUpperCase()) !== -1
      ) {
        newTemplates.push(templates[i]);
      }
    }
    this.setState({ templates: newTemplates });
  };

  // get templates within a team
  getTemplatesInTeam = (teamId) => {
    getTemplatesService(false, teamId)
      .then((res) => {
        this.setState({
          templates: res.templates,
          oriTemplates: res.templates,
        });
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to show templates");
        }
      });
  };

  selectTemplate = (template) => {
    if (template.content !== this.state.content) {
      this.setState({
        upcomingReport: template,
        upcomingSprintObj: this.state.sprintObj,
        upcomingTemplate:template
      });
      this.showModal("showAcceptUpcomingModal");
    }
  };

  //insert a url into content
  insertPhotoUrl = (url) => {
    let content = this.state.content;
    // for example: <img src="https://weekly.omsz.io:3000/5/yixuan.zhang@dchdc.net/FAD75E474ECD4270BEC36C497961564E.png" alt=“upload”  width="100%">
    // when sending email, convert to base64
    content =
      '<img src="' +
      ROOT +
      url +
      '" alt="image uploaded at:'+ ROOT+url +'" width="50%"/> \n' +
      content;
    this.setState({ content: content });
  };

  //send email
  sendEmail = (values) => {
    this.setState({isLoading:true});
    let from = this.state.userEmail;
    let to = values.to;
    let subject = values.subject;
    let cc = values.cc;
    let content = this.state.content;
    let email = {
      from: from,
      to: to,
      subject: subject,
      cc: cc,
      content: content,
    };
    sendEmailService(false, email)
      .then((res) => {
        if (res.code === 500) {
          showError("Email oversize, please within 4MB");
          this.setState({isLoading:false});
          return;
        }
        showSuccess("Successfully sent");
        this.setState({isLoading:false});
        this.exitModal("showSendEmailModal");
        // update sprint
        if(this.state.gotIntegratedContent && this.state.isLeader) {
          // this.state.sprintObj
          this.setState({
            showAutoUpdateSprintModal:true,
          })
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({isLoading:false});
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Email oversize, please within 4MB");
        }
      });
  };

  callback = () => {
    this.setState({ infoPage: false });
  };

  //handle menu close
  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  };

  changeSprint = (sprintObj, type) => {
    console.log(sprintObj);
    console.log(type);
    // whether update
    let upcomingParams = {
      teamId: this.state.teamId,
      sprint: sprintObj.sprint,
      type: type,
      fromEmail: this.state.userEmail,
    };
    //
    let previousParams = {
      teamId: this.state.teamId,
      sprint: this.state.sprintObj.sprint,
      type: this.state.sprintObj.type,
      fromEmail: this.state.userEmail,
    };
    getReportDetailService(upcomingParams)
      .then((res) => {
        console.log("params change sprint: " + upcomingParams);
        console.log("change sprint res: " + res.code);
        if (res.code !== -1) {
          //change content from saved report, need to tell user to save current and content will be overwritten
          this.setState({
            upcomingReport: res,
            upcomingSprintObj: sprintObj,
          });
          //check previous one whether need save
          getReportDetailService(previousParams).then((previousRes) => {
            if (
              previousRes.code === -1 &&
              this.state.content === this.state.defaultText
            ) {
              //not found
              this.setState({
                content: res.content,
                theme: res.theme,
                needUpdate: true,
                updateReportId: res.id,
                sprintObj: sprintObj,
                sprint: sprintObj.sprint,
                reportType: sprintObj.type,
              });
              return;
            }
            //same content as old version, not show save modal
            if (
              previousRes.code !== -1 &&
              previousRes.content === this.state.content
            ) {
              this.setState({
                content: res.content,
                theme: res.theme,
                needUpdate: true,
                updateReportId: res.id,
                sprintObj: sprintObj,
                sprint: sprintObj.sprint,
                reportType: sprintObj.type,
              });
              return;
            } 
            else {
              if (this.state.sprint === 0) this.showModal("showRemindSaveModal");
              else {
                this.confirmChange();
              }
            }
          });
        } else {
          this.setState({
            needUpdate: false,
            updateReportId: "",
            sprintObj: sprintObj,
            sprint: sprintObj.sprint,
            reportType: type,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to get the detail");
        }
      });
  };

  //accept upcoming content
  confirmChange = () => {
    let upcomingReport = this.state.upcomingReport;
    let upcomingSprintObj = this.state.upcomingSprintObj;
    let upcomingTemplate = this.state.upcomingTemplate;
    //save old one
    this.submitReport(this.state.content);
    console.log("confirm change",upcomingReport);
    this.setState({
      content: upcomingReport.content,
      theme: upcomingReport.theme,
      needUpdate: true,
      updateReportId: upcomingReport.id,
      sprintObj: upcomingSprintObj,
      sprint: upcomingSprintObj.sprint,
      reportType: upcomingSprintObj.type,
      currTemplate:upcomingTemplate,
    });
  };

  handleAddSprint = (values) => {
    let type = values.type === undefined ? this.state.sprintObj.type : values.type;
    let sprint = values.sprint === undefined ? this.state.sprintObj.sprint+1:values.sprint;
    let beginTime;
    let endTime;
    if(values.date === undefined){
      //defalut
      beginTime = moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days').format('YYYY-MM-DD');
      endTime = moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(7, 'days').format('YYYY-MM-DD');
      if(type === "daily"){
        beginTime = moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days').format('YYYY-MM-DD')
        endTime = moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days').format('YYYY-MM-DD')
      }else if(type === "monthly"){
        beginTime = moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days')
        endTime = moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(30,'days')
      }
    }else{
      beginTime = values.date[0].format('YYYY-MM-DD');
      endTime = values.date[1].format('YYYY-MM-DD');
    }
    
    
    let sprintItem = {
        teamId:this.state.toTeam.id,
        type:type,
        sprint:sprint,
        beginTime: beginTime,
        endTime: endTime,
    };
    console.log(sprintItem);
    createSprintItemService(sprintItem).then((res) => {
        if(res.code === 0){
            message.success("Successfully !");
            this.exitModal("showAutoUpdateSprintModal")
        }else{
            message.error("Failed! This sprint have existed! Have a change or go to team management page to update!")
        }
    }).catch((err) => {
        console.log(err);
    });
  };

  onShowReportsInThePastClicked = () => {
    const {teamId, sprint} = this.state;
    // if (teamId === -1) {
    //   showError("Please select a team")
    //   return;
    // }
    // if (sprint === 0) {
    //   showError("Please select a sprint")
    //   return;
    // }
    var params = {
      fromEmail: this.props.userInfo.email, // opt , if no userEmail ,required
      offset : 0, // opt ,default 0
      limit : 10, //  opt ,default 10
    };
    this.getReportDataWithKeys(params);

  };

  getReportDataWithKeys = (params) => {
    getReportData(false, params).then((res) => {
      console.log(res)
      let data = [];
      for (let i = 0; i < res.list.length; i++) {
        let cur = res.list[i];
        cur.key = i;
        data.push(cur)
      }
      console.log("hostory data: ");
      console.log(data);
      this.setState({data: data, showReportInThePastSelectModal: true});
    }).catch((err) => {
      console.log(err);
      this.exitModal("showReportInThePastSelectModal")
      console.log(err);
      if (err === 302) {
        this.props.onSessionExpired();
      } else {
        showError("Failed to get history");
      }
      this.setState({showReportInThePastSelectModal: true})
    });
  };

  handleReplace = (record) => {
    this.setState({content: record.content, showReportInThePastSelectModal: false, theme: record.theme})

  };

  render() {
    const { infoPage, data } = this.state;

    //form css
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    return (
      <Layout>
        {/* <div style={infoPage ? {} : { display: "none" }}>
          <JoinedTeamInfo
            teamInfo={this.state.teamInfo}
            callback={this.callback}
          />
        </div> */}

        <div style={!infoPage ? {} : { display: "none" }}>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
            triggerSubMenuAction="click"
          >
            {/* submenu for selecting team */}
            <SubMenu
              icon={<TeamOutlined />}
              // disabled={true}
              data-tut="tour_writeReport_selectTeam"
              title={
                (!this.state.toTeam
                  ? "Select Your Team" :
                  (this.state.isLeader ? "Leader of: " : "Member of: ") +
                    this.state.toTeam.teamName +
                    "(" +
                    this.state.toTeam.leadEmail +
                    ")")
              }
            >
              <Menu.ItemGroup title="Member of:">
                {this.state.joinedTeams.map((teamInfo, index) => {
                  return (
                    <Menu.Item
                      key={"joinedTeam" + index}
                      onClick={() => {
                        this.selectTeam(teamInfo, false);
                      }}
                    >
                      {teamInfo.teamName + " (" + teamInfo.leadEmail + ")"}
                    </Menu.Item>
                  );
                })}
              </Menu.ItemGroup>
              <Menu.ItemGroup title="Leader of:">
                {this.state.createdTeams.map((teamInfo, index) => {
                  return (
                    <Menu.Item
                      key={"createdTeam" + index}
                      onClick={() => {
                        this.selectTeam(teamInfo, true);
                      }}
                    >
                      {teamInfo.teamName + " (" + teamInfo.leadEmail + ")"}
                    </Menu.Item>
                  );
                })}
              </Menu.ItemGroup>
            </SubMenu>

            {/* Select a type and sprint within a team */}
            <SubMenu
              disabled={!this.state.toTeam}
              icon={<FieldBinaryOutlined />}
              data-tut="tour_writeReport_selectSprint"
              title={
                this.state.sprint === 0
                  ? "Select a Sprint"
                  : "Sprint: " + this.state.reportType + " " + this.state.sprint
              }
            >
              {Array.from(this.state.typeToSprints.keys()).map(
                (type, index) => {
                  return (
                    <Menu.ItemGroup title={type} key={"type" + type}>
                      {this.state.typeToSprints
                        .get(type)
                        .map((sprintObj, index) => {
                          return (
                            <Menu.Item
                              key={"sprint" + type + index}
                              onClick={() => this.changeSprint(sprintObj, type)}
                            >
                              {sprintObj.sprint +
                                " (" +
                                sprintObj.beginTime +
                                " - " +
                                sprintObj.endTime +
                                ")"}
                            </Menu.Item>
                          );
                        })}
                    </Menu.ItemGroup>
                  );
                }
              )}
            </SubMenu>
            {/* for template select within a team */}
            <SubMenu
              disabled={!this.state.toTeam || this.state.sprint === 0}
              icon={<FileTextOutlined />}
              data-tut="tour_writeReport_selectTemplate"
              title={
                  "Template"
              }
            >
              <Menu.ItemGroup>
                {/* search templates */}
                <Menu.Item>
                  <Search
                    placeholder="search templates"
                    onSearch={(value) => this.searchTemplates(value)}
                    style={{ width: 200 }}
                  />
                </Menu.Item>
                {this.state.templates.map((template, index) => {
                  return (
                    <Menu.Item
                      key={"template" + index}
                      onClick={() => {
                        this.selectTemplate(template)
                      }}
                    >
                      {template.theme}
                    </Menu.Item>
                  );
                })}
                {/* <Pagination size="small" defaultCurrent={1} total={2} pageSize={1}  pageSizeOptions={2}/> */}
              </Menu.ItemGroup>
            </SubMenu>

            {/* menu for insert photos */}

            <SubMenu
              disabled={!this.state.toTeam || this.state.sprint === 0}
              icon={<FileImageOutlined />}
              triggerSubMenuAction="click"
              title="Insert Image"
              data-tut="tour_writeReport_insertImage"
            >
              <PhotoDragger
                teamId={this.state.teamId}
                insertPhotoUrl={this.insertPhotoUrl}
              ></PhotoDragger>
            </SubMenu>


            <Menu.Item style={{float:"right"}} disabled={true}>
              <Button
                shape="round"
                icon={<UploadOutlined />}
                data-tut="tour_writeReport_submit"
                disabled={this.state.teamId === -1}
                onClick={() => this.showModal("showSubmitReportModal")}
              >
                {this.state.needUpdate ? "Update" : "Submit"}
              </Button>
            </Menu.Item>
            <Menu.Item disabled={true} style={{float:"right"}}>
              <Button
                  shape="round"
                  icon={<FileDoneOutlined />}
                  onClick={this.onShowReportsInThePastClicked}
              >
                Past Reports
              </Button>
            </Menu.Item>
            <Menu.Item
              style={{float:"right"}}
              disabled={true}
            >
              <Button
                shape="round"
                icon={<MailOutlined />}
                data-tut="tour_writeReport_email"
                onClick={() => this.showModal("showSendEmailModal")}
                disabled = {!this.state.toTeam || this.state.sprint === 0}
              >
                Send Email
              </Button>
            </Menu.Item>
          </Menu>
        {this.state.toTeam && this.state.sprint !== 0 ? <WriteAndViewBoard3
            setContent={this.setContent.bind(this)}
            setDefaultContent={this.setDefaultContent.bind(this)}
            setTheme={this.setTheme.bind(this)}
            content={this.state.content}
            defaultText={defaultText}
            theme={this.state.theme}
          ></WriteAndViewBoard3> : 
          <Alert
          message="You must select a team and sprint first"
          type="warning"
        />}
          
        </div>
        {/* modal for showing history */}
        <div>
          <Modal
              show={this.state.showReportInThePastSelectModal}
              handleCancel={() => this.exitModal("showReportInThePastSelectModal")}
              handleOk={() => this.exitModal("showReportInThePastSelectModal")}
              showOk={false}
              showCancel={false}
              okMessage={"Confirm Submit"}
              cancelMessage={"Cancel"}
              cancelBtnType={""}
              okBtnType={"primary"}
              title={"Select a report to replace the current content"}
          >
            <ReportsInThePast data={data} handleReplace={this.handleReplace}/>
          </Modal>
        </div>
        {/* modal for submit report */}
        <div>
          <Modal
            show={this.state.showSubmitReportModal}
            handleCancel={() => this.exitModal("showSubmitReportModal")}
            handleOk={() => this.submitReport(this.state.content)}
            okMessage={
              this.state.needUpdate ? "Confirm Update" : "Confirm Submit"
            }
            cancelMessage={"Cancel"}
            cancelBtnType={""}
            okBtnType={"primary"}
            title="Confirm submit the report"
          >
        
            <div style={{ textAlign: "left" }}>
              <h4>
                <Row>
                  <Col span={6}>To Team : </Col>
                  <Col span={18}>
                    {this.state.toTeam
                      ? this.state.toTeam.teamName
                      : "please select a team"}
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Report Type : </Col>
                  <Col span={18}>{this.state.reportType} </Col>
                </Row>
                <Row>
                  <Col span={6}> Sprint : </Col>
                  <Col span={18}>
                    {this.state.sprint !== 0 ? this.state.sprint : "draft"}
                  </Col>
                </Row>
                <Row >
                  <Col span={6}> Title : </Col>
                  <Col span={18}>{this.state.theme} </Col>
                </Row>
                
              </h4>
            </div>
            <Spin tip="Loading..." spinning={this.state.isLoading}>
            <Row style={{ width: "50vw" }}>
              <ViewBoard content={this.state.content} />
            </Row>
            </Spin>
          </Modal>
        </div>

        {/* modal for send email */}
        
        <div>
        
          <Modal
            show={this.state.showSendEmailModal}
            handleCancel={() => this.exitModal("showSendEmailModal")}
            handleOk={() => this.sendEmail(this.state.content)}
            showOk={false}
            showCancel={false}
            okMessage={"Confirm Submit"}
            cancelMessage={"Cancel"}
            cancelBtnType={""}
            okBtnType={"primary"}
            title={
              "Send Email to " +
              (this.state.toTeam ? this.state.toTeam.teamName : "") +
              (this.state.sprint !== 0
                ? " (Sprint " +
                  this.state.sprintObj.sprint +
                  ": " +
                  this.state.sprintObj.beginTime +
                  " - " +
                  this.state.sprintObj.endTime +
                  ")"
                : "draft")
            }
          >
            <Spin tip="Loading..." spinning={this.state.isLoading}>
            <Form
              style={{ width: "50vw" }}
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.sendEmail}
              onFinishFailed={() => alert("failed")}
            >
              <Form.Item
                label="To"
                name="to"
                initialValue={this.state.toEmail}
                rules={[
                  { required: true, message: "Please input the recipient!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Subject"
                name="subject"
                initialValue={this.state.theme}
                rules={[
                  { required: true, message: "Please input the Subject!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Cc"
                name="cc"
                rules={[{ required: false, message: "Please input your Cc!" }]}
                initialValue={this.state.toTeam?this.state.toTeam.ccList:''}
              >
                <Input placeholder="example1@example.com; example2@example.com"/>
              </Form.Item>

              <Row>
                <Col offset={3} span={18}>
                  <ViewBoard content={this.state.content} height={"48vh"} />
                </Col>
              </Row>

              <Form.Item {...tailLayout}>
                <Button
                  onClick={() => this.exitModal("showSendEmailModal")}
                  style={{ "margin-right": 10 }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Send Email
                </Button>
              </Form.Item>
            </Form>
            </Spin>
          </Modal>
          
        </div>


        {/* modal for select role*/}
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

        {/* Modal for remind user for upcoming content, back, accept upcoming or overwrite*/}
        <Modal
          show={this.state.showRemindSaveModal}
          handleCancel={() => {
            this.exitModal("showRemindSaveModal");
            this.showModal("showSprintSelectModal");
          }}
          handleOk={() => {
            let upcomingSprintObj = this.state.upcomingSprintObj;
            let upcomingReport = this.state.upcomingReport;
            this.setState({sprint:upcomingSprintObj.sprint,sprintObj:upcomingSprintObj,reportType:upcomingSprintObj.type,needUpdate:true,
            updateReportId:upcomingReport.id});
            this.exitModal("showRemindSaveModal");
          }}
          handleClickMid = {() => {
            console.log("upcoming content: ");
            let upcomingReport = this.state.upcomingReport;
            let upcomingSprintObj = this.state.upcomingSprintObj;
            console.log(this.state.upcomingReport);
            this.setState({
              content:upcomingReport.content,
              sprintObj:upcomingSprintObj,
              sprint:upcomingSprintObj.sprint
            });
            console.log(this.state.content);
            this.exitModal("showRemindSaveModal");
          }}
          showMidButton = {true}
          okMessage={"Overwrite previous"}
          cancelMessage={"Back"}
          midMessage={"Use previous"}
          cancelBtnType={""}
          okBtnType={"primary"}
          title={"Already submitted a report for this sprint"}
        >
          <Row
            type={"flex"}
            justify={"center"}
            align={"top"}
            style={{ padding: "12px" }}
          >
            <div className="site-card-wrapper">
              <Row style={{width:"80vw"}}>
                <Col span={12}>
                  <Card
                    title={
                      "Current work"
                    }
                    bordered={false}
                  >
                    <ViewBoard
                      disabled={true}
                      content={this.state.content}
                    ></ViewBoard>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title={
                      "Previous content: (" +
                      this.state.upcomingSprintObj.type +
                      "-" +
                      this.state.upcomingSprintObj.sprint +
                      ")"
                    }
                    bordered={false}
                  >
                    <ViewBoard
                      disabled={true}
                      content={this.state.upcomingReport.content}
                    ></ViewBoard>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Modal>
        

        {/* Modal for remind user for upcoming content, back or accept upcoming*/}
        <Modal
          show={this.state.showAcceptUpcomingModal}
          handleCancel={() => {
            this.exitModal("showAcceptUpcomingModal");
          }}
          handleOk={() => {
            console.log("upcoming templates: ");
            let upcomingReport = this.state.upcomingReport;
            console.log(this.state.upcomingReport);
            this.setState({
              content:upcomingReport.content,
            });
            console.log(this.state.content);
            this.exitModal("showAcceptUpcomingModal");
          }}
          okMessage={"Accept upcoming content"}
          cancelMessage={"Back"}
          cancelBtnType={""}
          okBtnType={"primary"}
          title={"Accept upcoming content?"}
        >
          <Row
            type={"flex"}
            justify={"center"}
            align={"top"}
            style={{ padding: "12px" }}
            data-tut="tour_team_join_info"
          >
            <div className="site-card-wrapper">
              <Row gutter={16}>
                <Col span={12}>
                  <Card
                    title={
                      "Current work"
                    }
                    bordered={false}
                  >
                    <ViewBoard
                      disabled={true}
                      content={this.state.content}
                    ></ViewBoard>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title={
                      "Previous content: (" +
                      this.state.upcomingSprintObj.type +
                      "-" +
                      this.state.upcomingSprintObj.sprint +
                      ")"
                    }
                    bordered={false}
                  >
                    <ViewBoard
                      disabled={true}
                      content={this.state.upcomingReport.content}
                    ></ViewBoard>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Modal>


        {/* Modal for renew a sprint */}
        <Modal
          show={this.state.showAutoUpdateSprintModal}
          handleCancel={() => {
            this.exitModal("showAutoUpdateSprintModal");
          }}
          showOk={false}
          showCancel={false}
          title={"Create a New Sprint"}
        >
          <div>
          <Row type={"flex"} justify={"center"} align={"top"} style={{width:600}}>
              <Col span={24}>
              <Form
                  onFinish={this.handleAddSprint}
                  // onFinishFailed={this.onFinishFailed}
                  labelCol={ {span: 8} }
                  wrapperCol={ {span: 12} }
                  name="nest-messages" 
                  style={{margin:10}}
              >
                  <Form.Item  name="sprint" label="Sprint" rules={[{ type: 'number', min: 1 }]}
                  initialValue={this.state.sprintObj?this.state.sprintObj.sprint+1:1}
                  >
                      <InputNumber/>
                  </Form.Item>
                  <Form.Item name="type" label="Type">
                    <Select defaultValue={this.state.sprintObj?this.state.sprintObj.type:"weekly"} 
                    style={{"min-width" : "100px"}}
                    onChange={(e)=>this.changeUpdateSprintType(e)}
                    >
                        <Select.Option value="weekly">weekly</Select.Option>
                        <Select.Option value="monthly">monthly</Select.Option>
                        <Select.Option value="daily">daily</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Date Range" name="date" >
                      <RangePicker defaultValue={
                        ()=>{
                          if (this.state.sprintObj==={}) {
                            return [moment(), moment().add(7,'days')]
                          }else if (this.state.sprintObj.type === "daily") {
                            return [moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days'),
                             moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days')]
                          }else if (this.state.sprintObj.type === "monthly") {
                            return [moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days'),
                             moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(30,'days')]
                          }else{
                            return [moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days'),
                             moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(7,'days')]
                          }
                        }
                        } />
                  </Form.Item>
                  {/* <Form.Item label="Date Range" name="date" >
                      <RangePicker defaultValue={
                        this.state.sprintObj==={}?[moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(1,'days'), moment(this.state.sprintObj.endTime, 'YYYY-MM-DD').add(7,'days')]:[moment(), moment().add(7,'days')]} />
                  </Form.Item> */}
                  <Form.Item wrapperCol={{ span:8, offset: 8 }}>
                      <Space size={100}>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                          <Button onClick={()=>this.exitModal("showAutoUpdateSprintModal")}>
                          Cancel
                      </Button>
                      </Space>
                  </Form.Item>
              </Form>
              </Col>
            </Row>
          </div>
        </Modal>

      </Layout>
    );
  }

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
                            this.state.templates.length > 0
                            && !this.state.gotIntegratedContent
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

export default WriteReport;
