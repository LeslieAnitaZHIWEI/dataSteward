import React, { PureComponent, Suspense, memo } from 'react';
import router from 'umi/router';
import { getDetail } from '@/services/demand';
import { connect } from 'dva';

import { Table, Icon, Upload, Row, Col, Card, Form, Input, Select, Modal, Button } from 'antd';
import style from './style.less';
import CirclePic from './circlePic';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';
import { downloadDemand } from '@/services/demand';
const FormItem = Form.Item;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
  const { form, handleAdd, saveIssue } = props;
  console.log(props, '第一重要');
  function download(file) {
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
    // let formData = new FormData();
    // formData.append("fileName",file.fileName);
    // formData.append("fileUrl",file.fileUrl);
    // fetch('/api/dmp/dsdemand/download', {
    //   method: 'post',
    //   body: formData,
    //   responseType: 'blob',
    //   headers:{
    //     'Authorization':'Bearer ' + localStorage.getItem("ggToken")
    //   }
    // }).then(response=>{
    //   response.json()
    // }).then(res=>{
    //   console.log(res)

    // })
  }
  return (
    <Card style={{ margin: '0 30px', borderRadius: '10px' }}>
      <Form labelAlign="left">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem key={1} wrapperCol={{ span: 13 }} labelCol={{ xxl: 4, md: 6 }} label="客户">
              <span style={{  wordWrap: 'break-word' }}>{props.customer}</span>{' '}
            </FormItem>
          </Col>
          {/* <Col md={4} sm={24}>
            <FormItem
              key={2}
              labelCol={{ span: 10 }}
              label="优先级"
              style={props.priority == 1 ? { color: 'red' } : ''}
            >
              {(function fn() {
                switch (props.priority) {
                  case 1:
                    return '高';
                  case 2:
                    return '中';
                  case 3:
                    return '低';
                }
              })()}
            </FormItem>
          </Col> */}
         <Col md={12} sm={24}>
            <FormItem key={3} labelCol={{ xxl: 7, md: 5 }} label="需求提交时间">
              {props.updateTime}
            </FormItem>
          </Col>
         
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
          <FormItem key={5} label="投放媒体" labelCol={{ xxl: 4, md: 6 }}>
          {props.pushMedia
            ? JSON.parse(props.pushMedia).map((ele, index, arr) => {
                if (index != 0) {
                  return <span key={ele.mediaName}>、{ele.mediaName}</span>;
                } else {
                  return <span key={ele.mediaName}>{ele.mediaName}</span>;
                }
              })
            : ''}
        </FormItem>
            </Col>
            <Col md={12} sm={24}>
            <FormItem
              key={4}
              labelCol={{ span: 5 }}
              style={{ overflow: 'hidden' }}
              wrapperCol={{ span: 18 }}
              label="附件"
            >
              {props.attachment
                ? JSON.parse(props.attachment).map(ele => {
                    console.log(ele, '返回');

                    return (
                      <Button
                        key={ele.fileUrl}
                        title={ele.fileName}
                        onClick={() => download(ele)}
                        type="link"
                      >
                        {ele.fileName}
                      </Button>
                    );
                  })
                : '--'}
            </FormItem>
          </Col>
            </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
          <FormItem
          key={6}
          label="目标用户需求"
          wrapperCol={{ span: 18 }}
          labelCol={{ xxl: 4, md: 6 }}
          style={{ wordWrap: 'break-word' }}
        >
          <span title={props.demandInfo}>{props.demandInfo ? props.demandInfo : '-'}</span>
        </FormItem>
          </Col>
          <Col md={12} sm={24}>
          {props.status > 1 && (
          <FormItem key={7} label="数据反馈" wrapperCol={{ span: 18 }} labelCol={{ xxl: 4, md: 5 }}>
           <span style={{ wordWrap: 'break-word',
    wordBreak: 'normal'}}>{props.feedback ? props.feedback : '-'}</span> 
          </FormItem>
        )}
          </Col>
            </Row>
        
        
        {props.status >= 3 && (
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
           <Col span={6}>
              <FormItem
                key={9}
                label="人群包数量"
                wrapperCol={{ span: 6 }}
                labelCol={{ xxl: 9, md: 14}}
              >
                {props.audiencePackageTotal ? props.audiencePackageTotal : '-'}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                key={9}
                label="数据匹配度"
                wrapperCol={{ span: 6 }}
                labelCol={{ xxl: 9, md: 14 }}
              >
                {props.mateDegree ? props.mateDegree +'%': '-'}
              </FormItem>
            </Col>
            <Col span={12}>
              {/* <FormItem
                key={9}
                label="数据匹配度"
                wrapperCol={{ span: 6 }}
                labelCol={{ xxl: 4, md: 6 }}
              >
                {props.mateDegree ? props.mateDegree + '%' : '-'}
              </FormItem> */}
              <FormItem
                key={9}
                label="覆盖人数"
                wrapperCol={{ span: 18 }}
                labelCol={{ xxl: 4, md: 5 }}
              >
               {props.status >= 3 &&<a href={props.downloadUrl}>{props.coverNum==-1?'--':props.coverNum}</a>}　{props.status >= 3 &&<a href={props.downloadUrl}>点击此处查询（仅限24小时内）</a>}
              

                {/* {props.coverNum ==-1?'计算中':props.coverNum}{props.coverNum ==-1&&<a href={props.downloadUrl}></a>} */}
              </FormItem>
            </Col>
          </Row>
        )}
        {props.status >= 3 && (
          <FormItem
            key={8}
            label="人群包描述"
            wrapperCol={{ span: 21 }}
            labelCol={{ xxl: 2, md: 3 }}
          >
           <div dangerouslySetInnerHTML={{__html:props.audiencePackageInfo ? JSON.parse(JSON.stringify(props.audiencePackageInfo)).split('\n').join('<br>') : '-'}}></div> 
           
          </FormItem>
        )}
        
      </Form>
    </Card>
  );
});

class Basic extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log(this.props, '很重要');
  }
  render() {
    const data = JSON.parse(this.props.pushMedia);
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.source(data).transform({
      type: 'sort',

      callback(a, b) {
        // 排序依据，和原生js的排序callback一致
        return a.coverNum - b.coverNum > 0;
      },
    });
    return (
      <Card style={{ margin: '20px 30px 0 0', borderRadius: '10px' }}>
        <div style={{ color: '#333333', fontWeight: 'bold', marginLeft: '20px' }}>媒介覆盖</div>
        <Chart height={250} data={dv} forceFit>
          <Coord transpose />
          <Axis
            name="mediaName"
            label={{
              offset: 12,
              textStyle: {
                fontSize: '14', // 文本大小
                fontWeight: 'bold', // 文本粗细c
                color: '#333333',
              },
            }}
            line={{
              lineWidth: 0,
            }}
            tickLine={{
              lineWidth: 0,
            }}
          />
          <Axis name="coverNum" />
          <Tooltip />
          <Geom
            type="interval"
            size="10"
            color={[
              'mediaName',
              mediaName => {
                //some code
                console.log(mediaName);
                switch (mediaName) {
                  case '广点通':
                    return '#FF9F24';
                  case '今日头条':
                    return '#2674FD';
                  case '抖音':
                    return '#69D668';
                }
              },
            ]}
            position="mediaName*coverNum"
          />
        </Chart>
      </Card>
    );
  }
}

const ChartCard = memo(props => {
  var data1 = [];
  var data2 = [];
  var data3 = [];
  var title1 = '';
  var title2 = '';
  var title3 = '';
  if (props.insightInfo) {
    const insightInfo = JSON.parse(props.insightInfo);
    data1 = [
      {
        item: '男',
        count: insightInfo.gender.maleNum || 0,
      },
      {
        item: '女',
        count: insightInfo.gender.femaleNum || 0,
      },
    ];
    title1 = '性别';
    data2 = [
      {
        item: '安卓',
        count: insightInfo.device.androidNum || 0,
      },
      {
        item: '苹果',
        count: insightInfo.device.appleNum || 0,
      },
      {
        item: '其他',
        count: insightInfo.device.otherNum || 0,
      },
    ];
    title2 = '系统';
    data3 = [
      {
        item: '移动',
        count: insightInfo.isp.chinaMobileNum || 0,
      },
      {
        item: '联通',
        count: insightInfo.isp.chinaUnicomNum || 0,
      },
      {
        item: '电信',
        count: insightInfo.isp.chinaTelecomNum || 0,
      },
      {
        item: '未知',
        count: insightInfo.isp.otherNum || 0,
      },
    ];
    title3 = '运营商';
  }
  console.log(data2, '22');
  return (
    <Row>
      {props.status == 3 && (
        <Col span="13">
          <Card style={{ margin: '20px 30px', borderRadius: '10px' }}>
            <div style={{ color: '#333333', fontWeight: 'bold', marginLeft: '20px' }}>数据统计</div>

            <Row>
              <Col span="8">
                <CirclePic data={data1} title={title1} />
              </Col>
              <Col span="8">
                <CirclePic data={data2} title={title2} />
              </Col>
              <Col span="8">
                <CirclePic data={data3} title={title3} />
              </Col>
            </Row>
          </Card>
        </Col>
      )}
      {props.status == 3 && (
        <Col span="11">
          <Basic {...props} />
        </Col>
      )}
    </Row>
  );
});
@connect(({ demand }) => ({
  demandDetail: demand.demandDetail,
}))
class addDemand extends PureComponent {
  constructor(props) {
    super(props);
    console.log(props, '老大');
  }

  handleAdd() {}
  saveIssue() {}
  back() {
    router.push('/adjustManage');
  }
  componentWillMount() {
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
  render() {
    const parentMethods = {
      handleAdd: this.handleAdd,
      saveIssue: this.saveIssue,
    };
    const { demandDetail } = this.props;
    console.log(demandDetail, '有没');
    return (
      <div>
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
              padding: '5px 10px',
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
        <CreateForm {...parentMethods} {...demandDetail} />
        <ChartCard {...demandDetail} />
        <Row>
          <Button
            size={'large'}
            style={{ width: '140px', margin: '0 auto', display: 'block', marginTop: '20px' }}
            onClick={() => this.back()}
          >
            返回
          </Button>
        </Row>
      </div>
    );
  }
}
export default addDemand;
