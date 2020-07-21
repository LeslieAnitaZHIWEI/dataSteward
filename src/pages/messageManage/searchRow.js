import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, visitData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={"Total Sales" }
        action={
          <Tooltip
            title={"Introduce"}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={() => 126560}
        footer={
          <Field
            label={"Daily Sales" }
            value={`￥${12423}`}
          />
        }
        contentHeight={46}
      >
                <MiniArea color="#975FE4" data={visitData} />

      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={"Visits" }
        action={
          <Tooltip
            title={"Introduce"}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={8846}
        footer={
          <Field
            label={"Daily Visits"}
            value={1234}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={"Payments"}
        action={
          <Tooltip
            title={"Introduce"}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={6560}
        footer={
          <Field
            label={
              "Conversion Rate"
              
            }
            value="60%"
          />
        }
        contentHeight={46}
      >
        <MiniBar data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title={
          "Operational Effect"
          
        }
        action={
          <Tooltip
            title={"Introduce"}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total="78%"
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            
          </div>
        }
        contentHeight={46}
      >
        <MiniProgress
          percent={78}
          strokeWidth={8}
          target={80}
          targetLabel={`${
            ': '
          }80%`}
          color="#13C2C2"
        />
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
