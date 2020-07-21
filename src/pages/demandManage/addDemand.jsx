import React, { PureComponent, Suspense } from 'react';
import router from 'umi/router';
import { getDspushmedia ,isAdMaster} from '@/services/demand';
import { connect } from 'dva';

import { Table, Layout, Upload, Row, Col, Card, Form, Input, Select, Modal, Button } from 'antd';
import style from './style.less';
import { notification, message } from 'antd';
const FormItem = Form.Item;
import SearchSelect from './searchSelect.js';
const { TextArea } = Input;
import { addDsdemand, getDetail } from '@/services/demand';
import moment from 'moment';

@connect(({user}) => {
  return { 
    currentUser:user.currentUser
  };
})
@Form.create()
class addDemand extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log(this.props,'prop')
    this.setState({
      changeMedia: false,
    });
    getDspushmedia({
      name: '',
    }).then(({ data }) => {
      let obj = {};
      data.forEach(ele => {
        obj[ele.name] = ele.id;
      });
      this.setState({
        mediaList: obj,
      });
    });
  }
  componentDidMount() {
    const { form } = this.props;
    const { row } = this.props.location;
    this.setState({
      customerNo:false
    })
    if (row) {
      console.log(row, '编辑');
      console.log(eval(row.pushMedia), '编辑');
      let pushMedia = eval(row.pushMedia).map(item => item.mediaName);
      this.setState({
        changeMedia: true,
      });
      console.log(pushMedia);
      form.setFieldsValue({
        customer: row.customer,
        demandInfo: row.demandInfo,
        priority: row.priority.toString(),
        pushMedia,
      });
      let arr = [];
      if (eval(row.attachment)) {
        eval(row.attachment).forEach(item => {
          arr.push({
            uid: item.fileName,
            name: item.fileName,
            fileName: item.fileName,
            fileUrl: item.fileUrl,
          });
        });
      }
      console.log(arr, 'FFlistFFlistFFlist');
      this.setState(
        {
          FFlist: arr,
          fileList: arr,
        },
        () => {
          console.log(this.state, 'steddddd');
        },
      );

      this.setState({
        title: '编辑需求',
      });
    } else {
      this.setState({
        title: '添加需求',
      });
    }
    isAdMaster().then(({data})=>{
      console.log('isAdMaster',data)
      if(data.isAdMaster){
        form.setFieldsValue({
          customer: data.name,
         
        });
        this.setState({
          customerNo:true
        })
      }
    })
  }
  state = {
    fileList: [],
    title: '添加需求',
    changeMedia: false,
    mediaList: {},
    FFlist: [],
    arrrrr: [
      {
        uid: '1',
        name: 'bbb',
      },
    ],
    customerNo:false
  };
  back() {
    console.log('??');
    router.push('/demandManage');
  }
  saveSubmit(){
    const { form } = this.props;
    const { fileList } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const { row,tagDto } = this.props.location;
        let pushMedia = values.pushMedia;
        pushMedia = pushMedia.map(item => ({
          id: this.state.mediaList[item],
          mediaName: item,
        }));
        var dto={
          ...values,
              pushMedia,
              saveAndPublish:true,
              attachment: fileList,
            
          tagList:tagDto
        }
        if(row){
          dto.id=row.id
          addDsdemand(dto).then(res => {
            if (res.code == 0) {
              message.success('修改成功');
              router.push({ pathname: '/demandManage', remark: 'update' });
            }
          })
        }else{
          addDsdemand(dto).then(res => {
            if (res.code == 0) {
                message.success('新增成功');
              
              router.push({ pathname: '/demandManage', remark: 'update' });
            }
          })
        }

      }
    })
  }
  handleSubmit(e) {
    console.log(e, 'eeeeeee');
    const { form } = this.props;
    const { fileList } = this.state;
    let saveAndPublish = false;
    if (e) {
      console.log(e);
      e.preventDefault();

    } else {
      saveAndPublish = true;
    }
    form.validateFields((err, values) => {
      if (!err) {
        const { row } = this.props.location;

        console.log('Received values of form: ', values);
        let pushMedia = values.pushMedia;
        pushMedia = pushMedia.map(item => ({
          id: this.state.mediaList[item],
          mediaName: item,
        }));
        if(e){
          if (row) {
            
            addDsdemand({
              ...values,
              pushMedia,
              saveAndPublish,
              attachment: fileList,
              id: row.id,
            })
              .then(res => {
                console.log(res, '新增');
                if (res.code == 0) {
                  message.success('修改成功');
                  router.push({ pathname: '/demandManage', remark: 'update' });
                }
                this.props.dispatch({
                  type: 'demand/deleteAll'
                  
                })
              })
              .catch(res => {
                console.log(res, '错误');
              });
          } else {
           
            addDsdemand({
              ...values,
              pushMedia,
              saveAndPublish,
              attachment: fileList,
            })
              .then(res => {
                console.log(res, '新增');
                if (res.code == 0) {
                  message.success('新增成功');
                  router.push({ pathname: '/demandManage', remark: 'update' });
                }
                this.props.dispatch({
                  type: 'demand/deleteAll'
                  
                })
              })
              .catch(res => {
                console.log(res, '错误');
              });
          }
         
                      
          
        }else{
          if (row) {
            this.props.dispatch({
              type:'demand/setDemandSaveOrUpdateDTO',
              payload: {
                ...values,
                pushMedia,
                saveAndPublish,
                attachment: fileList,
                id: row.id,
              }
            })
            
            
          } else {
            this.props.dispatch({
              type:'demand/setDemandSaveOrUpdateDTO',
              payload: {
                ...values,
                pushMedia,
                saveAndPublish,
                attachment: fileList,
              }
            })
            
          }
         
                      
                        router.push('/chooseTag')
          
        }
        
                    
         
      }
    });
  }
  // handleSubmit(){
  //   const {form} = this.props
  //   form.validateFields((err, values) => {
  //           if (!err) {
  //             router.push('/chooseTag')

  //           }
  //         })

  // }
  uploadChange = file => {
    console.log(this);
    console.log(file, 'FFlist');
    this.setFileList(file);
  };
  handleAdd() {}
  saveIssue() {}
  setFileList = payload => {
    let arr = [];
    payload.fileList.forEach(item => {
      console.log(item);
      if (item.fileName) {
        arr.push({
          fileName: item.fileName,
          fileUrl: item.fileUrl,
        });
      }
      if (item.response) {
        if (item.response.code == 1) {
        } else {
          arr.push({
            fileName: item.response.data.fileName,
            fileUrl: item.response.data.fileUrl,
          });
        }
      }
    });
    this.setState(
      {
        fileList: arr,
      },
      () => {
        console.log(this.state, 'state');
      },
    );
  };
  render() {
    const { form } = this.props;
    const { row } = this.props.location;
    var arr = [];

    if (row) {
      if (eval(row.attachment)) {
        eval(row.attachment).forEach(item => {
          arr.push({
            uid: item.fileName,
            name: item.fileName,
            fileName: item.fileName,
            fileUrl: item.fileUrl,
          });
        });
      }
    }
    return (
      <div>
        <div
          style={{ lineHeight: '25px', height: '40px', fontWeight: '700', verticalAlign: 'top' }}
        >
          {this.state.title}
        </div>
        <Card style={{ borderRadius: '10px' }}>
          <Form onSubmit={this.handleSubmit.bind(this)} labelAlign="left">
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem
                  className={style.labelW}
                  labelCol={{ md: 6, xxl: 4 }}
                  wrapperCol={{ md: 18, xxl: 20 }}
                  label="客户"
                >
                  {form.getFieldDecorator('customer', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入客户名' }],
                  })(<Input disabled={this.state.customerNo} style={{ width: '70%' }} />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem labelCol={{ xxl: 8, md: 13 }} label="需求提交时间">
                  <span>{moment().format('YYYY-MM-DD')}</span>
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem labelCol={{ span: 6 }} label="优先级">
                  {form.getFieldDecorator('priority', {
                    initialValue: '2',
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(
                    <Select style={{ width: 140 }}>
                      <Option value="2">中</Option>
                      <Option value="1">高</Option>

                      <Option value="3">低</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            {/* <FormItem labelCol={{ md: 3,xxl:2 }} label="客户">
              {form.getFieldDecorator('customer', {
                initialValue: '',

              })(<Input style={{ width: '70%' }} placeholder="请输入" />)}
            </FormItem>
            <FormItem labelCol={{ md: 3,xxl:2 }} label="需求提交时间">
              <span>{moment().format('YYYY-MM-DD')}</span>
            </FormItem>
            <FormItem labelCol={{ md: 3,xxl:2 }} label="优先级">
              {form.getFieldDecorator('priority', {
                initialValue: '2',
              })(
                <Select style={{ width: 140 }}>
                  <Option value="2">中</Option>
                  <Option value="1">高</Option>

                  <Option value="3">低</Option>
                </Select>,
              )}
            </FormItem> */}
            <FormItem label="投放媒体" wrapperCol={{ md: 8, xxl: 4 }} labelCol={{ md: 3, xxl: 2 }}>
              {form.getFieldDecorator('pushMedia', {
                initialValue: [],
                rules: [{ required: true, message: '请选择投放媒体' }],
              })(<SearchSelect changeMedia={this.state.changeMedia} />)}
            </FormItem>
            <FormItem label="目标需求用户" wrapperCol={{ span: 21 }} labelCol={{ md: 3, xxl: 2 }}>
              {form.getFieldDecorator('demandInfo', {
                initialValue: '',
                rules: [{ required: true, message: '请输入目标需求用户' }],
              })(<TextArea rows={6} />)}
            </FormItem>
            <FormItem label="附件" wrapperCol={{ span: 21 }} labelCol={{ md: 3, xxl: 2 }}>
              {}
              <Upload
                defaultFileList={arr}
                onChange={this.uploadChange}
                action="/dmp/dsdemand/upload"
                headers={{ Authorization: 'Bearer ' + window.localStorage.getItem('ggToken') }}
              >
                <Button type="primary">点击上传</Button>
                　只允许上传.xls,.xlsx,doc,docx,.pdf,txt格式文件，文件不超过 10m
              </Upload>
            </FormItem>
            <Row type="flex" justify="center">
              <Col xxl={3}>
              {(this.props.location.tagDto) && <Button size={'large'} type="primary"   onClick={() => this.saveSubmit()}>
              保存并提交
           </Button>}
                <Button size={'large'} style={{ marginLeft: '15px' }} htmlType="submit">
                保存
           </Button>
               {!this.props.location.add && <Button
                  size={'large'}
                  onClick={() => this.handleSubmit()}
                  type="primary"
                  style={{ marginLeft: '15px' }}
                >
                  下一步
                </Button>} 
                <Button size={'large'} onClick={() => this.back()} style={{ marginLeft: '15px' }}>
                  返回
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}
export default addDemand;
