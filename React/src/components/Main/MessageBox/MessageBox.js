import React, {Component} from "react";
import 'antd/dist/antd.css';
import {Avatar, Card, List, message} from "antd";
import {deleteMessage, sendMessage} from "../../../services/messageService";
import {joinTeamService} from "../../../services/teamService";
import {showError, showSuccess} from "../../../services/notificationService";
import {JOIN_OPERATION, NOTIFICATION_OPERATION} from "../../../constants";
import {parseName} from "../../../services/Utils";

class MessageBox extends Component {

    onAccept = (team, from_email, msgId) => {
        joinTeamService(team.teamId,from_email).then((res) => {
            if(res.code === 0) {
                console.log("Join success!");
                let body = {
                    from_name: this.props.userInfo.username,
                    operation: NOTIFICATION_OPERATION,
                    from_email: this.props.userInfo.email,
                    to_email: from_email,
                    content: "Welcome to " + team.teamName + "!",
                    data: JSON.stringify({})
                };
                sendMessage(body).then((res) => {
                    console.log(res)
                }).catch((err) => {
                    console.log(err);
                    if (err === 302) {
                        this.props.onSessionExpired();
                    } else {
                        showError("Failed to send request");
                    }
                });
                deleteMessage(msgId).then((res) => {
                    this.props.initMessages();
                    console.log("suceess rejected");
                    message.success("Successfully joined");
                }).catch((err) => {
                    showError("can not delete this request")
                });

            }else{
                message.error(res.msg)
            }

            // alert("Successfully joined !")
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to join");
            }
        });
    };

    onReject = (team, from_email, msgId) => {
        deleteMessage(msgId).then((res) => {
            this.props.initMessages();
            let body = {
                from_name: this.props.userInfo.username,
                operation: NOTIFICATION_OPERATION,
                from_email: this.props.userInfo.email,
                to_email: from_email,
                content: "Sorry, your request has been rejected.",
                data: JSON.stringify({})
            };
            sendMessage(body).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err);
                if (err === 302) {
                    this.props.onSessionExpired();
                } else {
                    showError("Failed to send request");
                }
            });
            showSuccess("This request has beed rejected")
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to reject");
            }
        })
    };

    onDeleteMsg = (msgId) => {
        deleteMessage(msgId).then((res) => {
            this.props.initMessages();
            showSuccess("Successfully deleted this message")
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to delete message");
            }
        })
    };

    render() {
        const { messageList } = this.props;

        return (
            <Card>
            <List
                itemLayout="horizontal"
                style={{"text-align": "left"}}
                dataSource={messageList}
                renderItem={item => (
                    <List.Item
                        actions={
                            item.operation === JOIN_OPERATION ?
                                [<a onClick={() => this.onAccept(JSON.parse(item.data), item.from_email, item.id)}>
                                    Accept
                                </a>,
                                <a onClick={() => this.onReject(JSON.parse(item.data), item.from_email, item.id)}>
                                    Reject
                                </a>] :
                                [
                                    <a onClick={() => this.onDeleteMsg(item.id)}>
                                    Delete
                                    </a>
                                ]
                        }
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{parseName(item.from_name)}</Avatar>
                            }
                            title={item.from_email}
                            description={item.content}
                        />
                    </List.Item>
                )}
            />
            </Card>
        );
    }
}
export default MessageBox;