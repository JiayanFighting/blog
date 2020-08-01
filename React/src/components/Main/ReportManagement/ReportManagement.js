import React, {Component} from "react";
import 'antd/dist/antd.css';
import { Input, Button, Avatar, Card, List, Col, Row, Popover, Typography } from 'antd';
import { UserOutlined} from '@ant-design/icons';
import {getReportData, sendEmailService, getPeopleToRemindService} from '../../../services/reportService';
import {getCreatedTeamsService} from '../../../services/teamService';
import '../../../styles/Main/ReportManagement/ReportManagement.css';
import Modal from "../HelperComponents/Modal";
import ReportData from "./ReportData";
import moment from 'moment';
import {showError, showSuccess} from "../../../services/notificationService";

const { TextArea } = Input;
const { Meta } = Card;
const { Paragraph } = Typography;
class ReportManagement extends Component {
    state = {
        data: [],
        showSendEmailModal: false,
        recipients: [],
        peopleToRemind: [],
        from: this.props.userInfo.email,
        subject: "",
        content: "",
        createdTeams: [],
        createdTeamsMap: {},
        showSelection: false,
        selectedContent: [],
    };

    componentWillMount() {
        this.initReportMgt();
    }

    initReportMgt = () => {
        let startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        let endDate = moment().format('YYYY-MM-DD');
        endDate = endDate + ' 23:59:59';
        var params = {
            type: undefined, // opt
            userEmail: undefined, // opt
            toEmail: this.props.userInfo.email, // opt , if no userEmail ,required
            beginTime: startDate, // opt
            endTime: endDate, // opt
            offset : 0, // opt ,default 0
            limit : 10 //  opt ,default 10
        };

        this.getReportDataWithKeys(params);

        this.getPeopleToRemind(params);
        getCreatedTeamsService(false).then((res) => {

            let teamNames = [];
            let createdTeamMap = {};
            for (let i = 0; i < res.createdList.length; i++) {
                teamNames.push({value: res.createdList[i].teamName});
                createdTeamMap[res.createdList[i].teamName] = res.createdList[i].id;
            }
            this.setState({createdTeams: teamNames, createdTeamMap: createdTeamMap});
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to show teams you created");
            }
        });
        this.setState({
            data: [],
            showSendEmailModal: false,
            recipients: [],
            peopleToRemind: [],
            from: this.props.userInfo.email,
            subject: "",
            content: "",
            createdTeams: [],
            createdTeamsMap: {},
            showSelection: false,
            selectedContent: []
        })
    };

    setFrom = (e) => {
        let value = e.target.value;
        this.setState({from: value})
    };

    setSubject = (e) => {
        let value = e.target.value;
        this.setState({subject: value})
    };

    setContent = (e) => {
        let value = e.target.value;
        this.setState({content: value})
    };

    onSearchReports = values => {
        let startDate = values.date === undefined ? moment().subtract(7, 'days').format('YYYY-MM-DD') : values.date[0].format('YYYY-MM-DD');
        let endDate = values.date === undefined ? moment().format('YYYY-MM-DD') : values.date[1].format('YYYY-MM-DD');
        endDate = endDate + ' 23:59:59';
        let teamId = this.state.createdTeamMap[values.teamname];
        var params = {
            teamId: teamId === undefined ? values.teamname : teamId,
            type: values.type, // opt
            userEmail: values.fromEmail, // opt
            toEmail: this.props.userInfo.email, // opt , if no userEmail ,required
            beginTime: startDate, // opt
            endTime: endDate, // opt
            offset : 0, // opt ,default 0
            limit : 10, //  opt ,default 10
            sprint: values.sprint
        };
        console.log("get reoirt",params);

        this.getReportDataWithKeys(params);
        this.getPeopleToRemind(params);
        this.setState({selectedContent: [], showSelection: true})
    };

    getReportDataWithKeys = (params) => {
        getReportData(false, params).then((res) => {
            let data = [];
            for (let i = 0; i < res.list.length; i++) {
                let cur = res.list[i];
                cur.key = i;
                data.push(cur)
            }
            console.log("reports data: ");
            console.log(data);
            this.setState({data: data});
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to get reports");
            }
        });
    };





    onSendEmail = () => {
        const {from, recipients, subject, content} = this.state;
        let params = {
            from: from,
            to: recipients[0],
            subject: subject,
            cc: recipients.slice(1),
            content: content
        };
        console.log(params);
        sendEmailService(false, params).then((res) => {
            showSuccess("email sent")
            console.log(res);
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to sendEmail");
            }
        });
        this.setState({showSendEmailModal: false});
    };

    sendSingleEmail = (recipient) => {
        this.setState({recipients: [recipient], showSendEmailModal: true});
    };

    getPeopleToRemind = (params) => {
        getPeopleToRemindService(false, params).then((res) => {
            let peopleToRemind = [];
            for (let i = 0; i < res.peopleToRemind.length; i++) {
                peopleToRemind.push({username: res.peopleToRemind[i].username, userEmail: res.peopleToRemind[i].email});
            }
            this.setState({peopleToRemind: peopleToRemind});
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to show your teammates who have not submitted their reports!");
            }

        })

    };

    sendAllEmails = () => {
        let recipients = [];
        const {peopleToRemind} = this.state;

        for (let i = 0; i < peopleToRemind.length; i++) {
            recipients.push(peopleToRemind[i].userEmail);
        }
        this.setState({recipients: [recipients], showSendEmailModal: true});
    };

    showPeopleToRemind = () => {

        let data = this.state.peopleToRemind;
        return (
            <div style={data.length === 0 ? {"display": "none"} : {}}>
                <h4>List of members who haven't submitted reports :</h4>
                <List
                    grid={{
                        gutter: 16,
                        column:5
                    }}
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 5,
                        size:"small",
                    }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <Card hoverable ={true} size ="small"
                                  onClick= {()=>{this.sendSingleEmail(item.userEmail)}}>
                                {/* <Avatar shape="square" size={64} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                    <UserOutlined style={{width:20}}/>
                                </Avatar> */}
                                <Popover content={<div><p>{item.userEmail}</p></div>} title={item.username}>
                                    <Meta
                                    avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                                    title={item.username}
                                    description={<Paragraph ellipsis={{ rows: 1}}>{item.userEmail}</Paragraph>}
                                    />
                                </Popover>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
            )
    };

    handleCancel = () => {
        this.setState({showSendEmailModal: false});
    };

    integrate = () => {
        this.props.handleIntegrate(this.state.selectedContent);
        this.setState({showSelection: false, IntegrateEnabled: false})
    };

    onRowSelectionChange = (selectedRowKeys, selectedRows) => {
        this.setState({selectedContent: selectedRows});
    };

    onReset = () => {
        this.initReportMgt();
    };

    render() {
        const { recipients, showSendEmailModal, data, createdTeams, showSelection, selectedContent, peopleToRemind } = this.state;
        let IntegrateEnabled = selectedContent.length !== 0;
        let peopleToRemindEnabled = peopleToRemind.length !== 0
        const { userInfo } = this.props;
        return (
            <div>
                <a onClick={this.onReset} >reset</a>
                <ReportData onSearchReports={this.onSearchReports}
                            teamData={createdTeams}
                            role={"Reporter"}
                            roleName={"fromEmail"}
                            data={data}
                            onRowSelectionChange={this.onRowSelectionChange}
                            showSelection={true}
                            userEmail={this.props.userInfo.email}
                            handleUpdate={this.props.handleUpdate}
                />
                <div>

                    <Row  type={"flex"} justify={"center"} align={"top"} style={{'padding': '20px'}}>
                        <Col span={21} >
                            {this.showPeopleToRemind()}
                        </Col>
                    </Row>
                    <Row style={{"margin-bottom":10}}>
                        <Col span={12}>
                            <Button type={"primary"}
                                    onClick={this.sendAllEmails}
                                    data-tut="tour_reportManagement_remind"
                                    disabled={!peopleToRemindEnabled}
                            >
                                Remind All
                            </Button>
                        </Col>

                        <Col span={12}>
                            <Button type={"primary"} disabled={!IntegrateEnabled} onClick={this.integrate} data-tut="tour_reportManagement_aggregate">Aggregate</Button>
                        </Col>
                    </Row>
                </div>
                <Modal show={showSendEmailModal}
                       title={"Send Remind Emails"}
                       showOk={false}
                       showCancel={false}
                       handleCancel={this.handleCancel}
                >
                    <Row style={{margin:10,width:"45vw"}}>
                        <Col span={6}>
                            From:
                        </Col>
                        <Col span={12}>
                            <Input defaultValue={userInfo.email} onChange={this.setFrom} disabled={true}/>
                        </Col>
                    </Row>
                    <Row  style={{margin:10}}>
                        <Col span={6}>
                            To:
                        </Col>
                        <Col span={12}>
                            <Input value={recipients.length === 0 ? "" : recipients[0].join(";")}/>
                        </Col>
                    </Row>
                    <Row  style={{margin:10}}>
                        <Col span={6}>
                            Cc:
                        </Col>
                        <Col span={12}>
                            <Input value={recipients.length === 0 ? "" : (recipients.length > 1 ? recipients.slice(1).toString() : "")}/>
                        </Col>
                    </Row>
                    <Row  style={{margin:10}}>
                        <Col span={6}>
                            Subject:
                        </Col>
                        <Col span={12}>
                            <Input placeholder={"Email Subject"} onChange={this.setSubject} defaultValue={"Report Reminder"}/>
                        </Col>
                    </Row>
                    <Row  style={{margin:10}}>
                        <Col span={6}>
                            Content:
                        </Col>
                        <Col span={12}>
                            <TextArea placeholder={"Message Body"} rows={4} onChange={this.setContent} defaultValue={"Your report has not been submitted yet, please submit it on time!"}/>
                        </Col>
                    </Row>
                    <Button type={"primary"} onClick={this.onSendEmail}>Send Email</Button>
                </Modal>

            </div>
        );
    }
}

export default ReportManagement;