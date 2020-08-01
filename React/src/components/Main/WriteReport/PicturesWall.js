import React, {Component} from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {savePhoto, getPhotos,deletePhoto} from '../../../services/photoService';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: [],
    };
  }

  componentDidMount(){
    this.getPhotos();
  }

  componentWillReceiveProps(){
    this.getPhotos();
  }

  getPhotos=() => {
    console.log("get photos");
    let teamId = this.props.teamId ? this.props.teamId : -1;
    if (teamId !== -1) {
      console.log("team id: "+teamId)
      getPhotos(teamId)
      .then((res) => {
        console.log("photos: "+res.photos);
        let fileList = [];
        for (let i = 0; i < res.photos.length; i++) {
          fileList.push({
            uid:i,
            name:this.props.teamId+'-'+i+'.png',
            status:'done',
            url: res.photos[i]
          });
        }
        fileList.push({
            uid:-1,
            name:this.props.teamId+'--1.png',
            status:'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        });
        this.setState({fileList:fileList});
        console.log("fileList: " + this.state.fileList[0].originFileObj);
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ fileList }) => {
      const preList = this.state.fileList;
      if (fileList.length - preList.length === 1) {
        const data = new FormData();
        data.append('photo',fileList[fileList.length-1].originFileObj);
        data.append('teamId',this.props.teamId);
        savePhoto(data).then((res) => {
          this.setState({ fileList });
            alert("Photo uploaded");
        }).catch((err) => alert(err));
      }else if (preList.length - fileList.length === 1) {
        //delete one
        let url;
        for (let i = 0; i < preList.length; i++) {
          if (i === preList.length-1) {
            url = preList[preList.length-1].url;
          }
          if (preList[i] !== fileList[i]) {
            url = preList[i].url;
            break;
          }
        }
        deletePhoto(url).then((res) => {
          this.setState({ fileList });
          alert("deleted");
        })
      }
    };
    

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={this.props.teamId}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
