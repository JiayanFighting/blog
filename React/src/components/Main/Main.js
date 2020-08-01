import React from "react";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "antd/dist/antd.css";
import "../../styles/Main/Main.css";
import {Layout, Menu, Avatar, Row, Col, Badge, Popover, Upload, Button} from "antd";
import TeamManagement from "./TeamManagement/TeamManagement";
import ReportPage from "./ReportManagement/ReportPage";
import WriteReport from "./WriteReport/WriteReport";
import WhitelistPage from "./WhitelistManagement/WhitelistPage";
import { showError } from "../../services/notificationService";
import { parseName } from "../../services/Utils";
import ImgCrop from 'antd-img-crop';
import {
  TeamOutlined,
  SnippetsOutlined,
  EditOutlined,
  LogoutOutlined,
  BugOutlined,
  FileSearchOutlined,
  PlusSquareOutlined,
  LoadingOutlined, PlusOutlined,UploadOutlined
} from "@ant-design/icons";
import { API_ROOT, TOKEN_KEY, ROOT } from "../../constants";
import Modal from "./HelperComponents/Modal";
import { logout } from "../../services/loginService";
import MessageOutlined from "@ant-design/icons/lib/icons/MessageOutlined";
import MessageBox from "./MessageBox/MessageBox";
import Feedback from "../Feedback/Feedback";
import {getSprintService} from "../../services/sprintService";
import {getTeamInfoService} from "../../services/teamService";
import {getMessage} from "../../services/messageService";
import {saveAvatar} from '../../services/photoService';
const { Sider, Content, Header } = Layout;

class Main extends React.Component {
  state = {
    collapsed: false,
    currentTab: "Reports",
    integratedContent: "",
    show: false,
      curReport:[],
      // for user tour
    isTourOpen: false,
    isShowingMore: false,
    sprintObj: {},
    role: "",
    teamInfo: {},
    teamName: "",
    sprint: 0,
    messageCount: 0,
    messageList: [],
    showChangePhotoModal:false,
  };

  componentDidMount() {

    setInterval(this.initMessages, 60000);

    this.initMessages();
  }

  initMessages = () => {
    getMessage().then((res) => {
      let messageCount = 0;
      for (let i = 0; i < res.inboxMessage.length; i++) {
        if (res.inboxMessage[i].status_code === 0) {
          messageCount += 1;
        }
      }
      this.setState({messageCount, messageList: res.inboxMessage})
    }).catch((err) => {
      showError("Failed to get Messages")
    })
  };
  /**
   * set collapse side bar or not
   * @method onCollapse
   * @for Main
   * @param collapsed
   * @return null
   */
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  /**
   * show content per side bar tabs' change
   * @method showMainContent
   * @for Main
   * @param none
   * @return pages needed to be rendered
   */
  showMainContent = () => {
    if (this.state.currentTab === "Team Management") {
      return (
          <TeamManagement
              userInfo={this.props.userInfo}
              onSessionExpired={this.onSessionExpired}
              data-tut="tour_team_inside"
          />
      );
    } else if (this.state.currentTab === "Reports") {
      return (
          <ReportPage
              handleIntegrate={this.handleIntegrate}
              userInfo={this.props.userInfo}
              onSessionExpired={this.onSessionExpired}
              handleUpdate={this.handleUpdate}
              changeTab={this.ch}
          />
      );
    } else if (this.state.currentTab === "Write Report") {
      return (
        <WriteReport
          userInfo={this.props.userInfo}
          integratedContent={this.state.integratedContent}
          clearIntegratedContent={this.clearIntegratedContent}
          onSessionExpired={this.onSessionExpired}
          curReport={this.state.curReport}
          sprintObj={this.state.sprintObj}
          role={this.state.role}
          teamInfo={this.state.teamInfo}
          teamName={this.state.teamName}
          sprint={this.state.sprint}
        />
      );
    } else if (this.state.currentTab === "MessageBox") {
      return (
          <MessageBox
              initMessages={this.initMessages}
              messageList={this.state.messageList}
              onSessionExpired={this.onSessionExpired}
              userInfo={this.props.userInfo}
          />
      );
    } else if (this.state.currentTab === "Feedback") {
      return (
          <Feedback
              onSessionExpired={this.onSessionExpired}
              userInfo={this.props.userInfo}
          />
      );
    }else if (this.state.currentTab === "Whitelist"){
      return (
          <WhitelistPage
              onSessionExpired={this.onSessionExpired}
              userInfo={this.props.userInfo}
          />
      )
    }
  };

  /**
   * show content per side bar tabs' change
   * @method showMainContent
   * @for Main
   * @param selectedContent
   * @return pages needed to be rendered
   */
  handleIntegrate = (selectedContent) => {

    if (selectedContent === undefined || selectedContent.length === 0) {
      showError("Please choose at least one!");
    } else {
      let concatenatedContent = "";
      for (let i = 0; i < selectedContent.length; i++) {
        concatenatedContent +=
            "## " +
            selectedContent[i].theme +
            "(" +
            selectedContent[i].fromName +
            ")\n";
        concatenatedContent += selectedContent[i].content;
        concatenatedContent += "\n";
      }

      let teamId = selectedContent[0].teamId;
      let sprint = selectedContent[0].sprint;
      let type = selectedContent[0].type;
      getSprintService(teamId, sprint, type).then((res) => {
        let sprintObj = res.res;
        console.log("spobj", sprintObj)
        this.setState({
          currentTab: "Write Report",
          integratedContent: concatenatedContent,
          sprintObj:sprintObj
        });
      }).catch((err) => {
        console.log(err);
        if (err === 302) {
          this.props.onSessionExpired();
        } else {
          showError("Failed to send request");
        }
      });

    }
  };

  handleUpdate = (report,sprintObj) => {
     console.log("update processing report: ", report);
     getTeamInfoService(false, report.teamId)
        .then((res) => {
          this.setState({
            teamInfo: res.info,
          });
          if(report.toEmail === this.props.userInfo.userEmail){
            this.setState({
              role:"leader"
            });
          }
          else{
            this.setState({
              role:"member"
            })
          }
           this.setState({
               sprintObj:sprintObj,
               teamName:report.teamName,
               sprint:report.sprint,
               integratedContent:report.content,
               curReport:report,
           });
           this.setState({currentTab:"Write Report"})
           
           console.log("update report state: ", this.state)
        })
        .catch((err) => {
          console.log(err);
          if (err === 302) {
            this.props.onSessionExpired();
          } else {
            showError("Failed to get team info");
          }
        });
  };

  clearIntegratedContent = () => {
    console.log("reached clear");
    this.setState({ integratedContent: "" });
  };

  onSessionExpired = () => {
    this.setState({ show: true });
  };

  handleCancel = () => {
    this.setState({ show: false });
  };

  handleOK = () => {
    localStorage.removeItem(TOKEN_KEY);
    logout()
        .then((res) => {
          console.log(res);
          this.getToken();
          this.handleCancel();
        })
        .catch((err) => {
          showError("Failed to logout");
          console.log(err);
          this.handleCancel();
        });
  };

  testFunc = (e) => {
    localStorage.setItem(TOKEN_KEY, e.data);
    this.onLogin();
  };

  getToken = () => {
    window.open(
        `${API_ROOT}/login/secure/aad`,
        "newwindow",
        "height=500, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no"
    );
    window.addEventListener("message", this.testFunc, false);
  };

  onLogin = () => {
    let userinfo = JSON.parse(localStorage.getItem(TOKEN_KEY));
    this.props.handleLogin(userinfo);
  };

  onPageChange = (e) => {
    console.log(e.key);
    this.setState({ currentTab: e.key });
  };

  toMessages = () => {
    this.setState({ currentTab: "MessageBox" });
  };

  // user helper tour
  openTour = () => {
    this.setState({ isTourOpen: true });
  };

  toggleShowMore = () => {
    this.setState((prevState) => ({
      isShowingMore: !prevState.isShowingMore,
    }));
  };

  closeTour = () => {
    this.setState({ isTourOpen: false });
  };

  disableBody = (target) => disableBodyScroll(target);
  enableBody = (target) => enableBodyScroll(target);

  onChangePhotoModal=()=>{
    this.setState({showChangePhotoModal:true})
  }

  exitChangePhotoModal=()=>{
    this.setState({showChangePhotoModal:false})
  }

  saveAPhoto= (file) => {
    const data = new FormData();
    data.append('photo',file);
    saveAvatar(data).then((res) => {
      console.log("url="+res.url)
      this.props.handleUpdateAvatar(res.url);
    }).catch((err) => console.log(err));
  }

  // 预览
  onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };



  render() {
    let username = this.props.userInfo.username;
    let userEmail = this.props.userInfo.email;
    console.log(this.props.userInfo);
    //tour
    const { isTourOpen, messageCount } = this.state;
    const accentColor = "#5cb7b7";
    let title = (
        <div>
          {this.props.userInfo.avatar === undefined || this.props.userInfo.avatar.length === 0?
            <Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
              {parseName(username)}
            </Avatar>
            :
            <Avatar src={ROOT+this.props.userInfo.avatar}/>
          }
          <span style={{marginLeft: "10px"}}>
            <span>{username}</span>
          </span>
        </div>
    );
    let content = (
      <div>
        <div style={{"overflow": "auto"}}>
          {/* <a onClick={this.onChangePhotoModal}>
            Update avatar Modal
          </a> */}
          <ImgCrop rotate>
              <Upload
                listType="text"
                // fileList={fileList}
                onChange={(info)=>{
                  const{status}  = info.file;
                  if (status !== 'uploading') {
                      this.saveAPhoto(info.file.originFileObj);
                  }
              }}
                onPreview={this.onPreview}
                name={this.props.userInfo.userEmail+".jpg"}
                showUploadList={false}
              >
                {/* {fileList.length < 5 && '+ Upload'} */}
                <a>Update avatar </a>
                {/* <Button>
                  <UploadOutlined /> Upload
                </Button> */}
              </Upload>
            </ImgCrop>
        </div>
        <div style={{"overflow": "auto"}}>
          <a href="#" className="logout" onClick={this.props.handleLogout}>
            <LogoutOutlined /> Logout
          </a>
        </div>
      </div>
    );
    return (
        <Layout style={{ minHeight: "100vh" }}>
          {/* user tour */}
          <Tour
              onRequestClose={this.closeTour}
              steps={this.tourConfig}
              isOpen={isTourOpen}
              maskClassName="mask"
              className="helper"
              rounded={5}
              accentColor={accentColor}
              onAfterOpen={this.disableBody}
              onBeforeClose={this.enableBody}
          />
          {/*<Sider theme={"light"} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>*/}
          <header style={{"position": "fixed", "top": 0}}>
            <span className="logo">
              <img className="icon" src={require('../../styles/Main/logo.ico')}/>
              <span>&nbsp;Microsoft</span>
              <span className={"header-space"}>Statusly</span>
            </span>

            <span className="avatar">
              <Popover placement="bottomRight" title={title} content={content} trigger="hover">
              {this.props.userInfo.avatar === undefined || this.props.userInfo.avatar.length === 0?
                <Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
                  {parseName(username)}
                </Avatar>
                :
                <Avatar src={ROOT+this.props.userInfo.avatar}/>
              }
              </Popover>

            </span>

            <span className="message">
              <a href="#" onClick={this.toMessages}>
                <Badge count={messageCount}>
                  <MessageOutlined className={"message-icon"}/>
                </Badge>
              </a>
            </span>
          </header>
          <Layout style={{"margin-top": "50px"}}>
          <Sider
              theme={"light"}
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
              }}
          >

            <Menu
                defaultSelectedKeys={["Reports"]}
                selectedKeys={[this.state.currentTab]}
                mode="inline"
            >
              <Menu.Item
                  key="Reports"
                  icon={<SnippetsOutlined />}
                  onClick={this.onPageChange}
                  data-tut="tour_reports"
              >
                Reports
              </Menu.Item>
              <Menu.Item
                  key="Write Report"
                  icon={<EditOutlined />}
                  onClick={this.onPageChange}
                  data-tut="tour_writeReport"
              >
                Write Report
              </Menu.Item>

              {/* <Badge counts={this.state.counts} showZero={false}> */}
              {/*<Menu.Item*/}
              {/*    key="MessageBox"*/}
              {/*    icon={<MessageOutlined />}*/}
              {/*    onClick={this.onPageChange}*/}
              {/*    data-tut="tour_message"*/}
              {/*>*/}
              {/*  Message*/}
              {/*</Menu.Item>*/}

              <Menu.Item
                  key="Team Management"
                  icon={<TeamOutlined />}
                  onClick={this.onPageChange}
                  data-tut="tour_team"
              >
                Team Management
              </Menu.Item>

              {/* </Badge> */}
              {this.props.userInfo.type===1?
                  <Menu.Item
                      key="Whitelist"
                      icon={<PlusSquareOutlined />}
                      onClick={this.onPageChange}
                      data-tut="tour_message"
                  >
                    Allowlist
                  </Menu.Item>:''}
              <Menu.Item
                  key="Feedback"
                  icon={<BugOutlined />}
                  onClick={this.onPageChange}
                  data-tut="tour_feedback"
              >
                Feedback
              </Menu.Item>
              <Menu.Item
                  key="userGuide"
                  icon={<FileSearchOutlined />}
                  onClick={this.openTour}
                  data-tut="tour_userGuide"
              >
                User Guide
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout" style={this.state.collapsed ? {marginLeft: "80px"} : {marginLeft: "200px"}}>
            <Content style={{ overflow: 'initial' }}>
              {this.showMainContent()}
            </Content>
          </Layout>
          </Layout>
          <Modal
              show={this.state.show}
              handleOk={this.handleOK}
              handleCancel={this.handleCancel}
              okMessage={"Sign in"}
              cancelMessage={"Cancel"}
              title="Session expired..."
          >
            <p>
              Please sign in again
            </p>
          </Modal>

          <Modal
              show={this.state.showChangePhotoModal}
              handleCancel={this.exitChangePhotoModal}
              cancelMessage={"Cancel"}
              showOk={false}
              showCancel={false}
              title="Upload your photo"
          >
            <div style={{width:"50vw"}}>
              <div>
                {this.props.userInfo.avatar===undefined || this.props.userInfo.avatar==="" || this.props.userInfo.avatar.length===0?
                  <Avatar size={150} style={{ color: "#f56a00", backgroundColor: "#fde3cf"}}>
                    {parseName(username)}
                  </Avatar>
                  :
                  <Avatar size={150} src={ROOT+this.props.userInfo.avatar}/>
                }
              </div>
            <ImgCrop rotate>
              <Upload
                listType="text"
                // fileList={fileList}
                onChange={(info)=>{
                  const{status}  = info.file;
                  if (status !== 'uploading') {
                      console.log("upload",info.file, info.fileList);
                      this.saveAPhoto(info.file.originFileObj); //linking image
                      // this.insertInline(info.file);
                  }
              }}
                onPreview={this.onPreview}
                name={this.props.userInfo.userEmail+".jpg"}
                showUploadList={false}
              >
                {/* {fileList.length < 5 && '+ Upload'} */}
                <Button>
                  <UploadOutlined /> Upload
                </Button>
              </Upload>
            </ImgCrop>
            </div>
          </Modal>
        </Layout>
    );
  }
  //for user guide config, if you want to add more, just add a data-tut contribute.
  tourConfig = [
    //welcome new user
    {
      selector: '[data-tut="tour_home"]',
      content: `Welcome! Please give us one minute to help you get familiar with Statusly`,
      action: () => {
        if (this.state.currentTab !== "Home") {
          this.setState({ currentTab: "Home" });
        }
      },
    },

    //user guide for team
    {
      selector: '[data-tut="tour_team"]',
      content: `Create or join a team`,
      action: () => {
        if (this.state.currentTab !== "Team Management") {
          this.setState({ currentTab: "Team Management" });
        }
      },
    },
    // {
    //   selector: '[data-tut="tour_team_join"]',
    //   content: `Search and join a team`,
    //   action: () => {
    //     if (this.state.currentTab !== "Team Management") {
    //       this.setState({ currentTab: "Team Management" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_team_join_info"]',
    //   content: `Click a team you joined to view information, or leave the team`,
    //   action: () => {
    //     if (this.state.currentTab !== "Team Management") {
    //       this.setState({ currentTab: "Team Management" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_team_create"]',
    //   content: `Create a team`,
    //   action: () => {
    //     if (this.state.currentTab !== "Team Management") {
    //       this.setState({ currentTab: "Team Management" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_team_create_info"]',
    //   content: `Click a team you created to view information manage members, sprints or templates`,
    //   action: () => {
    //     if (this.state.currentTab !== "Team Management") {
    //       this.setState({ currentTab: "Team Management" });
    //     }
    //   },
    // },

    //user guide for write report page
    {
      selector: '[data-tut="tour_writeReport"]',
      content: `Write your report here or send report by email here, please join a team before wrting`,
      action: () => {
        if (this.state.currentTab !== "Write Report") {
          this.setState({ currentTab: "Write Report" });
        }
      },
    },
    // user guide for write report page
    // {
    //   selector: '[data-tut="tour_writeReport_selectTeam"]',
    //   content: `Select a team to submit report`,
    //   action: () => {
    //     if (this.state.currentTab !== "Write Report") {
    //       this.setState({ currentTab: "Write Report" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_writeReport_selectSprint"]',
    //   content: `Select a sprint in of some type`,
    //   action: () => {
    //     if (this.state.currentTab !== "Write Report") {
    //       this.setState({ currentTab: "Write Report" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_writeReport_selectTemplate"]',
    //   content: `Select a template created by team leader`,
    //   action: () => {
    //     if (this.state.currentTab !== "Write Report") {
    //       this.setState({ currentTab: "Write Report" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_writeReport_insertImage"]',
    //   content: `Insert a image into your report`,
    //   action: () => {
    //     if (this.state.currentTab !== "Write Report") {
    //       this.setState({ currentTab: "Write Report" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_writeReport_submit"]',
    //   content: `Submit your report when you finish`,
    //   action: () => {
    //     if (this.state.currentTab !== "Write Report") {
    //       this.setState({ currentTab: "Write Report" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_writeReport_email"]',
    //   content: `Email your report out`,
    //   action: () => {
    //     if (this.state.currentTab !== "Write Report") {
    //       this.setState({ currentTab: "Write Report" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_writeAndViewBoard_writeAndViewBoard"]',
    //   content: `Write and view your report here, please write in markdown`,
    //   action: () => {
    //     if (this.state.currentTab !== "Write Report") {
    //       this.setState({ currentTab: "Write Report" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_writeAndViewBoard_fullScreen"]',
    //   content: `Enjoy writing by entering full screen`,
    //   action: () => {
    //     if (this.state.currentTab !== "Write Report") {
    //       this.setState({ currentTab: "Write Report" });
    //     }
    //   },
    // },
    //user guide for reports
    {
      selector: '[data-tut="tour_reports"]',
      content: `Manage and aggregate the reports in your team, or review your report history`,
      action: () => {
        if (this.state.currentTab !== "Reports") {
          this.setState({ currentTab: "Reports" });
        }
      },
    },
    // {
    //   selector: '[data-tut="tour_reports_reportManagement"]',
    //   content: `Manage reports as a team leader`,
    //   action: () => {
    //     if (this.state.currentTab !== "Reports") {
    //       this.setState({ currentTab: "Reports" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_reportData_search"]',
    //   content: `Search reports in your team by time, reporter, tyoe or date range`,
    //   action: () => {
    //     if (this.state.currentTab !== "Reports") {
    //       this.setState({ currentTab: "Reports" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_reportManagement_remind"]',
    //   content: `Remind team members to submit report`,
    //   action: () => {
    //     if (this.state.currentTab !== "Reports") {
    //       this.setState({ currentTab: "Reports" });
    //     }
    //   },
    // },
    // {
    //   selector: '[data-tut="tour_reportManagement_aggregate"]',
    //   content: `Aggregate some reports into one report`,
    //   action: () => {
    //     if (this.state.currentTab !== "Reports") {
    //       this.setState({ currentTab: "Reports" });
    //     }
    //   },
    // },
    //   {
    //     selector: '[data-tut="tour_reportHistory"]',
    //     content: `Review your report history`,
    //     action: () => {
    //       if (this.state.currentTab !== "Reports") {
    //           this.setState({currentTab:"Reports"})
    //       }
    //       }
    //   },
    {
      selector: '[data-tut="tour_message"]',
      content: `This is a message box, which helps you handle joining request or give you some acknowlegement for some actions`,
      action: () => {
        if (this.state.currentTab !== "Message") {
          this.setState({ currentTab: "Message" });
        }
      },
    },
    {
      selector: '[data-tut="tour_feedback"]',
      content: `Keep in mind that whenever you meet some bugs or issues, please send us a feedback`,
      action: () => {
        if (this.state.currentTab !== "Feedback") {
          this.setState({ currentTab: "Feedback" });
        }
      },
    },

    //user guide
    {
      selector: '[data-tut="tour_userGuide"]',
      content: `Keep in mind that whenever you meet some bugs or issues, please send us a feedback`,
    },
  ];
}

export default Main;
