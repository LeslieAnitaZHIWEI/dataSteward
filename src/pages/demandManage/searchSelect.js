import { Select } from 'antd';
import querystring from 'querystring';
import { getDspushmedia } from '@/services/demand';

const { Option } = Select;

let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    const str = querystring.encode({
      code: 'utf-8',
      q: value,
    });
    // jsonp(`https://suggest.taobao.com/sug?${str}`)
    //   .then(response => response.json())
    //   .then(d => {
    //     if (currentValue === value) {
    //       const { result } = d;
    //       const data = [];
    //       result.forEach(r => {
    //         data.push({
    //           value: r[0],
    //           text: r[0],
    //         });
    //       });
    //       callback(data);
    //     }
    //   });
    getDspushmedia({
      name: value,
    }).then(({ data }) => {
      console.log(data, '远程搜索');
      const d = [];
      data.forEach(r => {
        d.push({
          value: r.name,
          text: r.name,
        });
      });
      callback(d);
      console.log(d, '远程搜索');
    });
  }

  timeout = setTimeout(fake, 300);
}

class searchSelect extends React.Component {
  state = {
    data: [],
    value: undefined,
  };

  handleSearch = value => {
    if (value) {
      console.log('会搜索吗');
      fetch(value, data => this.setState({ data }));
    } else {
      // this.setState({ data: [] });
      fetch('', data => this.setState({ data }));

    }
  };

  handleChange = value => {
    this.setState({ value });
    this.props.onChange(value);
  };
  componentWillReceiveProps(nextProps) {
    console.log(nextProps, '能否改变看你啦');
    if (nextProps.changeMedia && nextProps.value.length != 0) {
      this.setState({
        value: nextProps.value,
      });
    }
    // this.handleSearch(nextProps.value)
  }
  componentWillMount() {
    getDspushmedia({
      name: '',
    }).then(({ data }) => {
      console.log(data, '远程搜索');
      var arr=data.map(ele=>({
        key:ele.id,
        value:ele.name,
        text:ele.name
      }))
      this.setState({
        data:arr
      });
    })
  }
  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        showSearch
        mode="multiple"
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
  }
}

export default searchSelect;
