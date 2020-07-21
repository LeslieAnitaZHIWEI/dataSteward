import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip ,Card} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import img1 from '../../assets/01@2x.png'
import img2 from '../../assets/02@2x.png'
import img3 from '../../assets/03@2x.png'
import img4 from '../../assets/04@2x.png'
import {getStatistics} from '@/services/demand'
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  // style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, unreadMessageTotal,executingTaskTotal,dataMatching,audiencePackageTotal }) => (
  <Row>
    <Col {...topColResponsiveProps}>
      <div className={styles.colFour}>
        <img src={img1}></img>
        <div style={{position:'absolute',top:'30%',left:'20%'}}>
          <div className={styles.fourTit}>
            人群包总数
          </div>
          <div className={styles.fourNum}>
            {audiencePackageTotal}
          </div>
        </div>
      </div>
    </Col>

    <Col {...topColResponsiveProps}>
      <div className={styles.colFour}>
      <img src={img2}></img>
      <div style={{position:'absolute',top:'30%',left:'20%'}}>
      <div className={styles.fourTit}>
            执行中任务
          </div>
          <div className={styles.fourNum}>
            {executingTaskTotal}
          </div>
          </div>

      </div>
    </Col>
    <Col {...topColResponsiveProps}>
      <div  className={styles.colFour}>
        <img src={img3}></img>
        <div style={{position:'absolute',top:'30%',left:'20%'}}>
        <div className={styles.fourTit}>
            数据总匹配度
          </div>
          <div className={styles.fourNum}>
{dataMatching}%
          </div></div>
      </div>
    </Col>
    <Col {...topColResponsiveProps}>
      <div className={styles.colFour}>
      <img src={img4}></img>
      <div style={{position:'absolute',top:'30%',left:'20%'}}>
      <div className={styles.fourTit}>
            未读消息
          </div>
          <div className={styles.fourNum}>
            {unreadMessageTotal}
          </div></div>
      </div>
    </Col>
  </Row>
));

export default IntroduceRow;
