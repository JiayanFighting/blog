import React, { Component } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  Input,
  Layout,
  message,
  PageHeader
} from "antd";
import "antd/dist/antd.css";
import '../../styles/Main/ReportManagement/ReportPage.css';
import {SendFeedbackEmailService} from '../../services/FeedbackService';

const { TextArea } = Input;

class Feedback extends Component {
    state={
        infoPage: false
    }

    onFinish = values => {

        var params = {
            subject:values.subject,
            cc:values.cc,
            content:values.content
        };
        console.log("feedback subject: " + values.subject);
        SendFeedbackEmailService(params).then((res) => {
            message.success("feedback successfully sent");
        }).catch((err) => {
            message.error("err: "+err);
        })
    }

    render(){
        const { infoPage } = this.state;

    //form css
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };
        return (
            <div className="card-container">
              <PageHeader
    className="site-page-header"
    title="Feedback"
    subTitle="Email us any feedback or bugs, thanks!"
  />
            <Layout>
        <div style={infoPage ? {} : { display: "none" }}>
        </div>
        <Row>
            <Col span={4}></Col>
            <Col span={16}>
            <Form
              style={{ width: 600 }}
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
              onFinishFailed={() => alert("failed")}
            >
              <Form.Item
                label="Subject"
                name="subject"
                rules={[
                  { required: true, message: "Please input the Subject!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Content"
                name="content"
                rules={[{ required: false, message: "Please input your content!" }]}
              >
              <TextArea
                rows={18}
              />
              </Form.Item>

              <Form.Item {...tailLayout}></Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Send
                </Button>
              </Form.Item>
            </Form>
            </Col>
            <Col span={4}></Col>
            </Row>
            </Layout>
            </div>
        );
    }
}

export default Feedback;