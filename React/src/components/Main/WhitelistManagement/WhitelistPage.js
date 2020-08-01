import React, {Component} from 'react';
import '../../../styles/Main/TeamManagement/TeamManagement.css';
import {Card, Col, Row, Button, Input, List,Space,Form, message,Popconfirm,Avatar,Popover,Typography,Tag} from "antd";
import 'antd/dist/antd.css';
import {DeleteOutlined,UserOutlined,SettingOutlined} from '@ant-design/icons';
import Modal from '../HelperComponents/Modal'
import {getAllWhitelistService,addWhitelistService,deleteWhitelistService,setAdminService,cancelAdminService} from '../../../services/whitelistService';
import {showError, showSuccess} from "../../../services/notificationService";
import { ROOT } from '../../../constants';

const { Meta } = Card;
const { Search } = Input;
const { Paragraph } = Typography;
class WhitelistPage extends Component {

    state={
        showAddMemberPage:false,
        searchUsers:[],
        members:this.props.members,
        users:[],
        columns: [
            {
              title: 'Name',
              dataIndex: 'username',
              key: 'username',
              render: text => <a>{text}</a>,
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Action',
              key: 'action',
              render: (_, record, index)  => (
                <Space size="middle">
                  <a onClick={()=>{this.handleAddMembers(record,index)}}>Add</a>
                </Space>
              ),
            },
          ],
    };

    componentDidMount(){
        console.log("white list page");
        getAllWhitelistService().then((res) => {
            if(res.code === 0) {
                this.setState({
                    users:res.list,
                })
            }else{
                showError(res.msg);
            }
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to search users");
            }
        });
    }
    

    /**
     * delete the user from whitelist
     * @method handleOkDelete
     * @for WhitelistPage
     * @return none
     * handle deleting
     */
    handleOkDelete = (email) => {
        console.log(email);
        if(email === this.props.userInfo.email){
            showError("Can not delete yourself!");
            return;
        }
        deleteWhitelistService(email).then((res) => {
            if(res.code == 0) {
                this.setState({
                    users: this.state.users.filter(item => item.email !== email),
                })
                showSuccess("Successfully Deleted!")
            }else{
                showError(res.msg);
            }
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to delete the user");
            }
        });
      };

    

    /**
     * add user into whitelist
     * @method handleAddUser
     * @param user: user email
     * @for WhitelistPage
     * @return none
     */
    handleAddUser=(values)=>{
        console.log(values);
        addWhitelistService(values.email).then((res) => {
            if(res.code === 0){
                let newUser = {
                    email:values.email
                }
                this.setState({
                    users: [...this.state.users, newUser],
                });      
                showSuccess("Successfully added !")
            }else{
                showError(res.msg);
            }
        }).catch((err) => {
            console.log(err);
            if (err === 302) {
                this.props.onSessionExpired();
            } else {
                showError("Failed to add");
            }
        });
    };

    handleSetAdmin=(user)=>{
        console.log(user.email);
        if(user.email === this.props.userInfo.email){
            showError("Can not manage yourself!");
            return;
        }
        if(user.type === 1) {
            cancelAdminService(user.email).then((res) => {   
                if(res.code === 0){
                    let newUsers = [];
                    this.state.users.forEach((item,index) => {
                        if(item.email === user.email){
                            let newUser = item;
                            newUser.type = 2;
                            // this.state.users.splice(index,1,newUser);
                            newUsers.push(newUser);
                        }else{
                            newUsers.push(item);
                        }
                    });
                    this.setState({users:newUsers})
                    showSuccess("Successfully set !")
                }else{
                    showError(res.msg);
                }
            }).catch((err) => {
                console.log(err);
                if (err === 302) {
                    this.props.onSessionExpired();
                } else {
                    showError("Failed to set");
                }
            });
        }else{
            setAdminService(user.email).then((res) => {   
                if(res.code === 0){
                    let newUsers = [];
                    this.state.users.forEach((item,index) => {
                        if(item.email === user.email){
                            let newUser = item;
                            newUser.type = 1;
                            // this.state.users.splice(index,1,newUser);
                            newUsers.push(newUser);
                        }else{
                            newUsers.push(item);
                        }
                    });
                    this.setState({users:newUsers})
                    showSuccess("Successfully set !")
                }else{
                    showError(res.msg);
                }
            }).catch((err) => {
                console.log(err);
                if (err === 302) {
                    this.props.onSessionExpired();
                } else {
                    showError("Failed to set");
                }
            });
        }
    };

    render() {
        return (
            <div style={{"padding" : "10px",background:"white"}}>
                <div>
                    <Form
                        onFinish={this.handleAddUser}
                        layout="inline"
                        style={{margin:10}}
                    >
                        <Form.Item label="Email" name={"email"}  rules={[{ required: true},{ type: 'email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add to whitelist
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div style={{textAlign:"left"}}>
                    <List
                        grid={{
                            column:2,
                        }}
                        pagination={{
                            onChange: page => {
                            console.log(page);
                            },
                            pageSize: 10,
                            size:"small",
                        }}
                        dataSource={this.state.users}
                        renderItem={item => (
                        <List.Item
                        actions={[
                            <Popconfirm 
                            title={item.type === 1?"Sure to set "+item.username+" as the normal?":
                            "Sure to set "+item.username+" as the administrator?"} 
                            onConfirm={() => this.handleSetAdmin(item)}>
                                {item.type === 1?<a>Set as normal</a>:
                                <a>Set as administrator</a>} 
                            </Popconfirm>,
                            <Popconfirm 
                            title={"Sure to remove "+item.username+" from the whitelist ?"} 
                            onConfirm={() => this.handleOkDelete(item.email)}>
                                <a>delete</a>
                            </Popconfirm>,
                        ]}
                        >
                            <List.Item.Meta
                            avatar={ 
                                item.avatar === null || item.avatar === "" || item.avatar.length === 0?
                                <Avatar size={50} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                    <UserOutlined style={{width:20}}/>
                                </Avatar>
                                :
                                <Avatar size={50} src={ROOT+item.avatar}/>
                            }
                            title={item.type === 1? <div><Tag color={"blue"}>admin</Tag>{item.email}</div>:item.email}
                            description={<Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                                            {item.username}
                                        </Paragraph>}
                            />
                        </List.Item>
                        )}
                    />
                    </div>
            </div>
        );
    }
}

export default WhitelistPage;