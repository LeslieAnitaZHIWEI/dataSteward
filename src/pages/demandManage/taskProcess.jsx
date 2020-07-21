import React, { PureComponent, Suspense, memo, useEffect } from 'react';
import { router } from 'umi';
import { connect } from 'dva';

import { Table, Icon, Upload, Row, Col, Card, Form, Input, Select, message, Button } from 'antd';
import style from './style.less';
import { process, getDetail } from '@/services/demand';
const FormItem = Form.Item;
const { TextArea } = Input;
import { downloadDemand } from '@/services/demand';


function parseStr(value){
  if(!value){
    return '';
  }
  value=JSON.parse(value)
  var str=''
  value.forEach(ele=>{
    
      str+=ele.tagName+'   '+ele.predictNum+'\n'

    
  })
  return str
}

@connect(({ demand }) => ({
  demandDetail: demand.demandDetail,
}))
@Form.create()
class taskProcess extends PureComponent {
  state = {
    formValues: '',
    issueCheck: false,
    endCek: false,
  };
  download(file) {
    console.log(file);
    downloadDemand({
      ...file,
    }).then(res => {
      const blob = new Blob([res], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.download = file.fileName;
      link.click();
      URL.revokeObjectURL(blob);
      document.body.removeChild(link);
    });
  }
  getForm = saveType => {
    const { form } = this.props;
    const { demandDetail } = this.props;
    var dataList;
    form.validateFields((err, values) => {
     
        console.log(values);
        var device = {
          androidNum: values.androidNum,
          appleNum: values.appleNum,
          otherNum: values.otherNum,
        };
        var gender = {
          femaleNum: values.femaleNum,
          maleNum: values.maleNum,
        };
        var isp = {
          chinaMobileNum: values.chinaMobileNum,
          chinaTelecomNum: values.chinaTelecomNum,
          chinaUnicomNum: values.chinaUnicomNum,
          otherNum: values.otherNumS,
        };
        var insightInfo = {
          device: device,
          gender: gender,
          isp: isp,
        };
        var mediaList = eval(demandDetail.pushMedia).map(ele => {
          return {
            id: ele.id,
            mediaName: ele.mediaName,
            coverNum: values[ele.mediaName],
          };
        });
        dataList = {
          audiencePackageInfo: values.audiencePackageInfo,
          audiencePackageTotal: values.audiencePackageTotal,
          coverNum: values.coverNum,
          downloadUrl: values.downloadUrl,
          feedback: values.feedback,
          id: demandDetail.id,
          mateDegree: values.mateDegree,
          pushMedia: mediaList,
          insightInfo,
          saveType,
        };
      
    });
    return dataList;
  };
  handleAdd = e => {
    console.log(e, 'eeeeeee');

    let saveIssue = false;
    const { issueCheck } = this.state;
    const { demandDetail ,form} = this.props;
    if (e) {
      console.log(e);
      e.preventDefault();
    } else {
      saveIssue = true;
    }
    console.log(saveIssue);
    if (saveIssue) {
      this.setState(
        {
          issueCheck: true,
          endCek: false,
        },
        () => {
          console.log(this.state.issueCheck,'为什么执行')
          // form.validateFields(['feedback'], )
          form.validateFields(['feedback'],{ force: true },err => {
            console.log(err,'？')
            if (!err) {
                console.log('处理4');
                process({
                ...this.getForm(2),
              }).then(res => {
                if(res.code==0){
                  message.success(res.data);
                  router.push('/adjustManage')
                }else{
                  message.warning(res.msg)
                }
              });
            }
          });
        },
      );
    } else {
      if (this.state.issueCheck || this.state.endCek) {
        this.setState(
          {
            issueCheck: false,
            endCek: false,
          },
          () => {
            console.log('处理2');

            process({
              ...this.getForm(1),
            }).then(res => {
              if(res.code==0){
                message.success(res.data);
                router.push('/adjustManage')

              }
            });
          },
        );
      } else {
        console.log('处理1');

        process({
          ...this.getForm(1),
        }).then(res => {
          if(res.code==0){
            message.success(res.data);
            router.push('/adjustManage')

          }
        });
      }
    }
  };
  endTask() {
    this.setState(
      {
        endCek: true,
        issueCheck: false,
      },
      () => {
        this.props.form.validateFields({ force: true },(err, values) => {
          console.log(err,'rrr')
          console.log('处理3');

          if (!err) {
            process({
              ...this.getForm(3),
            }).then(res => {
              if(res.code==0){
                message.success(res.data);
                router.push('/adjustManage')

              }else{
                message.warning(res.msg)
              }
            });
          }
        });
      },
    );
  }
  backAdj = () => {
    router.push('/adjustManage');
  };

  componentWillMount() {
    console.log(this.props, '查看location');
    if (!this.props.demandDetail.id) {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'demand/getDetail',
          payload: this.props.match.params.id,
        });
      }
    }
  }
  componentDidMount() {
    const { form } = this.props;
    const { demandDetail } = this.props;
    console.log(demandDetail, '更新属性');
    // if (demandDetail.id) {
    //   if (demandDetail.insightInfo) {

    //   if (JSON.parse(demandDetail.insightInfo).device) {
    //     console.log('走这里')

    //     form.setFieldsValue({
    //       androidNum: JSON.parse(demandDetail.insightInfo).device.androidNum,
    //       appleNum: JSON.parse(demandDetail.insightInfo).device.appleNum,
    //       otherNum: JSON.parse(demandDetail.insightInfo).device.otherNum,
    //       femaleNum: JSON.parse(demandDetail.insightInfo).gender.femaleNum,
    //       maleNum: JSON.parse(demandDetail.insightInfo).gender.maleNum,
    //       chinaMobileNum: JSON.parse(demandDetail.insightInfo).isp.chinaMobileNum,
    //       chinaTelecomNum: JSON.parse(demandDetail.insightInfo).isp.chinaTelecomNum,
    //       chinaUnicomNum: JSON.parse(demandDetail.insightInfo).isp.chinaUnicomNum,
    //       otherNumS: JSON.parse(demandDetail.insightInfo).isp.otherNum,
    //     });
    //   }
    // }
    //   if (demandDetail.id) {
    //     console.log(demandDetail.mateDegree,'demandDetail.mateDegree')
    //     form.setFieldsValue({
    //       audiencePackageTotal: demandDetail.audiencePackageTotal||'',
    //       audiencePackageInfo: demandDetail.audiencePackageInfo,
    //       feedback: demandDetail.feedback,
    //       mateDegree: demandDetail.mateDegree,
    //     });
    //   }

    //   if (demandDetail.pushMedia) {
    //     var haofan = JSON.parse(demandDetail.pushMedia);
    //     console.log(haofan, '好烦');
    //     haofan.forEach(ele => {
    //       form.setFieldsValue({ [ele.mediaName]: ele.coverNum });
    //     });
    //   }
    // } else {
      console.log('zouzheli')
      getDetail({
        id: this.props.match.params.id,
      }).then(({ data }) => {
        const { form } = this.props;
        console.log(form, data, '!!!!!!!!!');
        if (data.pushMedia) {
          var ddd = JSON.parse(data.pushMedia);
          ddd.forEach(ele => {
            form.setFieldsValue({ [ele.mediaName]: ele.coverNum });
          });
        }
          form.setFieldsValue({
            audiencePackageTotal: data.audiencePackageTotal,
            audiencePackageInfo: data.audiencePackageInfo==''?'标签名称   预估人数'+'\n'+parseStr(data.tag):data.audiencePackageInfo,
            feedback: data.feedback,
            mateDegree: data.mateDegree,
            downloadUrl:data.downloadUrl,
            coverNum:data.coverNum==-1?'':data.coverNum
          });
          if (data.id) {
          console.log('wwwwww',data.audiencePackageTotal)
          form.setFieldsValue({
              audiencePackageTotal: data.audiencePackageTotal||'',
              // audiencePackageInfo: data.audiencePackageInfo,
              feedback: data.feedback,
              mateDegree: data.mateDegree,
            });
          }
      if (data.insightInfo) {
        
        if (JSON.parse(data.insightInfo).device) {
          form.setFieldsValue({
            androidNum: JSON.parse(data.insightInfo).device.androidNum,
            appleNum: JSON.parse(data.insightInfo).device.appleNum,
            otherNum: JSON.parse(data.insightInfo).device.otherNum,
            femaleNum: JSON.parse(data.insightInfo).gender.femaleNum,
            maleNum: JSON.parse(data.insightInfo).gender.maleNum,
            chinaMobileNum: JSON.parse(data.insightInfo).isp.chinaMobileNum,
            chinaTelecomNum: JSON.parse(data.insightInfo).isp.chinaTelecomNum,
            chinaUnicomNum: JSON.parse(data.insightInfo).isp.chinaUnicomNum,
            otherNumS: JSON.parse(data.insightInfo).isp.otherNum,
          });
        }
      }
      });
    // }
  }
  validNumber=(rule, value, callback)=>{
    if(this.state.endCek){
      var reg=/^[+]{0,1}(\d+)$/
    if(!reg.test(value)){
        callback('请输入正整数')
        return
    }
    callback()
    }else{
      callback()

    }
    
  }
  validNumberZero=(rule, value, callback)=>{
    if(this.state.endCek){
    
    if(value<0){
        callback('请输入正数')
        return
    }
    callback()
  }else{
    callback()

  }
  }
  validUrl=(rule, value, callback)=>{
    if(this.state.endCek){
    
    if(value==''){
        callback('请输入下载地址')
        return
    }
    callback()
  }else{
    callback()

  }
  }

  render() {
    const { form } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { demandDetail } = this.props;

    return (
      <div className={style.wrapper}>
        <Row>
          <Col span={2}>
            <div
              style={{
                margin: '20px 30px',
                borderRadius: '10px',
                fontSize: '14px',
                width: '70px',
                fontFamily: 'Microsoft YaHei',
                fontWeight: 700,
                color: 'rgba(51,51,51,1)',
              }}
            >
              用户需求
            </div>
          </Col>
          <Col
            style={{
              margin: '15px 20px',
              // padding: '5px 10px',
              lineHeight: '35px',
              borderRadius: '6px',
              textAlign: 'center',
              color: 'white',
              background: 'rgba(75,130,250,0.8)',
            }}
            xxl={1}
            md={2}
          >
            {(function fn1() {
              switch (demandDetail.status) {
                case 0:
                  return '待发布';
                case 1:
                  return '业务分析';
                case 2:
                  return '计算中';
                case 3:
                  return '已上传';
                default:
                  return '状态';
              }
            })()}
            {/* 已上传 <Icon type="cloud-upload" /> */}
          </Col>
        </Row>
        <Card style={{ margin: '0 30px', borderRadius: '10px' }}>
          <Form onSubmit={this.handleAdd.bind(this)} labelAlign="left">
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem labelCol={{ md: 6, xxl: 4 }} label="来源">
                  <span style={{ wordWrap: 'break-word', marginLeft: '6px' }}>
                    {demandDetail.adAgent ? demandDetail.adAgent : ''}
                  </span>
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem wrapperCol={{span:17}} labelCol={{ md: 4, xxl: 3 }} label="客户">
                  <span style={{ wordWrap: 'break-word' }}>{demandDetail.customer}</span>
                </FormItem>
              </Col>
              
            </Row>

            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
                <FormItem labelCol={{ md: 6, xxl: 4 }} label="需求提交时间">
                  {demandDetail.createTime}
                </FormItem>
              </Col>
            <Col md={12} sm={24}>
                <FormItem labelCol={{ md: 4, xxl: 3 }} label="优先级" style={demandDetail.priority==1?{color:'red'}:''}>
                  {(function fn() {
                    switch (demandDetail.priority) {
                      case 1:
                        return '高';
                      case 2:
                        return '中';
                      case 3:
                        return '低';
                    }
                  })()}
                </FormItem>
              </Col>
              
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem
                  wrapperCol={{ span: 18 }}
                  labelCol={{ md: 6, xxl: 4 }}
                  label="目标用户需求"
                >
                  <span style={{ wordWrap: 'break-word' }}>{demandDetail.demandInfo}</span>
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem  labelCol={{ md: 4, xxl: 3 }} wrapperCol={{ span: 6 }} label="附件">
                  {demandDetail.attachment
                    ? JSON.parse(demandDetail.attachment).map(ele => {

                        return (
                          <div key={ele.fileUrl}>
                            <Button
                              key={ele.fileUrl}
                              onClick={() => this.download(ele)}
                              type="link"
                            >
                              {ele.fileName}
                            </Button>
                          </div>
                        );
                      })
                    : '--'}
                </FormItem>
              </Col>
            </Row>
            <FormItem
              label="数据反馈"
              disabled={demandDetail.status == 2}
              wrapperCol={{ md: 21 }}
              labelCol={{ md: 3, xxl: 2 }}
            >
              {getFieldDecorator('feedback', {
                initialValue: '',
                rules: [
                  {
                    required: this.state.issueCheck,
                    message: '请输入数据反馈',
                  },
                ],
              })(<TextArea style={{ width: '100%' }} rows={6} />)}
            </FormItem>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <FormItem
                  label="人群包个数"
                  wrapperCol={{ sm:10, xxl: 10 }}
                  labelCol={{ sm: 14, xxl: 9 }}
                >
                  {getFieldDecorator('audiencePackageTotal', {
                    initialValue: '',
                    rules: [
                      
                      {
                        validator:this.validNumber
                       }
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>

              <Col md={5} sm={24}>
                <FormItem
                  label="数据匹配度"
                  wrapperCol={{ sm: 12, xxl: 8 }}
                  labelCol={{ sm: 12, xxl: 5 }}
                  className={style.mateDegree}
                >
                  {getFieldDecorator('mateDegree', {
                    initialValue: '',
                    rules: [
                      
                      {
                        validator:this.validNumberZero
                       }
                    ],
                  })(<Input style={{width:'80%'}}/>)}%
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem
                  label="覆盖人数"
                  wrapperCol={{ sm: 12, xxl: 8 }}
                  labelCol={{ sm: 12, xxl: 5 }}
                >
                  {getFieldDecorator('coverNum', {
                    initialValue: '',
                    rules: [
                      {
                        validator:this.validNumber
                        
                      },
                    ],
                  })(<Input style={{width:'80%'}}/>)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  label="下载地址"
                  wrapperCol={{ sm: 16, xxl: 8 }}
                  labelCol={{ sm: 8, xxl: 5 }}
                >
                  {getFieldDecorator('downloadUrl', {
                    initialValue: '',
                    rules: [
                      {
                        validator:this.validUrl
                      },
                    ],
                  })(<Input style={{width:'100%'}}/>)}
                </FormItem>
              </Col>
            </Row>

            <FormItem label="人群包描述" wrapperCol={{ span: 21 }} labelCol={{ md: 3, xxl: 2 }}>
              {getFieldDecorator('audiencePackageInfo', {
                initialValue: '',
              })(<TextArea style={{ width: '100%' }} rows={6} />)}
            </FormItem>
            <Row>
              <Col md={9} xxl={10}>
                <FormItem label="投放媒体" wrapperCol={{ span: 16 }} labelCol={{ md: 8, xxl: 2 }}>
                  <Row className={style.tMedia}>
                    {demandDetail.pushMedia
                      ? eval(demandDetail.pushMedia).map((item, index) => {
                          return (
                            <FormItem
                              key={index}
                              label={item.mediaName}
                              colon={false}
                              wrapperCol={{ span: 16 }}
                              labelCol={{ span: 7 }}
                            >
                              {getFieldDecorator(item.mediaName, {
                                initialValue: '',
                                rules: [
                                
                                  {
                                    validator:this.validNumber
                                   }
                                ],
                              })(<Input style={{ margin: '0 3px 0 0' }} />)}
                              <span>覆盖人数</span>
                            </FormItem>
                          );
                        })
                      : ''}
                    {/* <FormItem label="广点通" colon={false} wrapperCol={{ span: 16 }} labelCol={{ span: 5 }}>
              {getFieldDecorator('gdt',{
                initialValue: '',
              })(<Input  name="gdt"/>)}
              <span style={{marginLeft:'10px'}}>覆盖人数</span> 
              </FormItem>
              <FormItem label="今日头条" colon={false} wrapperCol={{ span: 16 }} labelCol={{ span: 5 }}>
              {getFieldDecorator('jrtt',{
                initialValue: '',
              })(<Input  name="jrtt"/>)}
              <span style={{marginLeft:'10px'}}>覆盖人数</span>
              </FormItem>
              <FormItem label="抖音" colon={false} wrapperCol={{ span: 16 }} labelCol={{ span: 5 }}>
              
              {getFieldDecorator('dy',{
                initialValue: '',
              })(<Input  name="dy"/>)}  
              <span style={{marginLeft:'10px'}}>覆盖人数</span>
              </FormItem> */}
                  </Row>
                </FormItem>
              </Col>

              <Col md={15} xxl={14}>
                <FormItem label="洞察信息" wrapperCol={{ span: 21 }} labelCol={{ span: 3 }}>
                  <Row className={style.tMedia}>
                    <Col md={8}>
                      <FormItem
                        label="男"
                        colon={false}
                        wrapperCol={{ span: 16 }}
                        labelCol={{ span: 5 }}
                      >
                        {getFieldDecorator('maleNum', {
                          initialValue: '',
                          rules: [
                           
                            {
                              validator:this.validNumber
                             }
                          ],
                        })(<Input />)}
                        <span style={{ marginLeft: '10px' }}></span>(人)
                      </FormItem>
                      <FormItem
                        label="女"
                        colon={false}
                        wrapperCol={{ span: 16 }}
                        labelCol={{ span: 5 }}
                      >
                        {getFieldDecorator('femaleNum', {
                          initialValue: '',
                          rules: [
                           
                            {
                              validator:this.validNumber
                             }
                          ],
                        })(<Input />)}
                        <span style={{ marginLeft: '10px' }}></span>(人)
                      </FormItem>
                    </Col>
                    <Col md={8}>
                      <FormItem
                        label="安卓"
                        colon={false}
                        wrapperCol={{ span: 16 }}
                        labelCol={{ span: 5 }}
                      >
                        {getFieldDecorator('androidNum', {
                          initialValue: '',
                          rules: [
                           
                            {
                              validator:this.validNumber
                             }
                          ],
                        })(<Input />)}
                        <span style={{ marginLeft: '10px' }}></span>(人)
                      </FormItem>
                      <FormItem
                        label="苹果"
                        colon={false}
                        wrapperCol={{ span: 16 }}
                        labelCol={{ span: 5 }}
                      >
                        {getFieldDecorator('appleNum', {
                          initialValue: '',
                          rules: [
                          
                            {
                              validator:this.validNumber
                             }
                          ],
                        })(<Input />)}
                        <span style={{ marginLeft: '10px' }}></span>(人)
                      </FormItem>
                      <FormItem
                        label="其他"
                        colon={false}
                        wrapperCol={{ span: 16 }}
                        labelCol={{ span: 5 }}
                      >
                        {getFieldDecorator('otherNum', {
                          initialValue: '',
                          rules: [
                          
                            {
                              validator:this.validNumber
                             }
                          ],
                        })(<Input />)}
                        <span style={{ marginLeft: '10px' }}></span>(人)
                      </FormItem>
                    </Col>
                    <Col md={8}>
                      <FormItem
                        label="移动"
                        colon={false}
                        wrapperCol={{ span: 16 }}
                        labelCol={{ span: 5 }}
                      >
                        {getFieldDecorator('chinaMobileNum', {
                          initialValue: '',
                          rules: [
                            
                            {
                              validator:this.validNumber
                             }
                          ],
                        })(<Input />)}
                        <span style={{ marginLeft: '10px' }}></span>(人)
                      </FormItem>
                      <FormItem
                        label="联通"
                        colon={false}
                        wrapperCol={{ span: 16 }}
                        labelCol={{ span: 5 }}
                      >
                        {getFieldDecorator('chinaUnicomNum', {
                          initialValue: '',
                          rules: [
                            
                            {
                              validator:this.validNumber
                             }
                          ],
                        })(<Input />)}
                        <span style={{ marginLeft: '10px' }}></span>(人)
                      </FormItem>
                      <FormItem
                        label="电信"
                        colon={false}
                        wrapperCol={{ span: 16 }}
                        labelCol={{ span: 5 }}
                      >
                        {getFieldDecorator('chinaTelecomNum', {
                          initialValue: '',
                          rules: [
                            
                            {
                              validator:this.validNumber
                             }
                          ],
                        })(<Input />)}
                        <span style={{ marginLeft: '10px' }}></span>(人)
                      </FormItem>
                      <FormItem
                        label="其他"
                        colon={false}
                        wrapperCol={{ span: 16 }}
                        labelCol={{ span: 5 }}
                      >
                        {getFieldDecorator('otherNumS', {
                          initialValue: '',
                          rules: [
                          
                            {
                              validator:this.validNumber
                             }
                          ],
                        })(<Input />)}
                        <span style={{ marginLeft: '10px' }}></span>(人)
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col style={{ width: '450px', margin: '0 auto', marginTop: '20px' }}>
                <Button size={'large'} htmlType="submit">
                  保存
                </Button>
                <Button
                  size={'large'}
                  onClick={() => this.handleAdd()}
                  type="primary"
                  style={{ marginLeft: '15px' }}
                >
                  保存并反馈
                </Button>
                <Button
                  size={'large'}
                  onClick={() => this.endTask()}
                  style={{ marginLeft: '15px' }}
                >
                  结束任务
                </Button>
                <Button
                  size={'large'}
                  style={{ marginLeft: '15px' }}
                  onClick={() => this.backAdj()}
                >
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
export default taskProcess;
