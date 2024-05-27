import React, { useState, useEffect } from "react";
import { Select, Card, Layout } from "antd";
import ReactECharts from "echarts-for-react";
import { axiosPrivate } from "../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";

registerLocale("vi", vi);
setDefaultLocale("vi");

const { Option } = Select;
const { Header, Content } = Layout;

const WeekAnalysis = () => {
  const [type, setType] = useState(1);
  const [year, setYear] = useState(new Date());
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(type, year.getFullYear());
  }, [type, year]);

  const fetchData = async (type, year) => {
    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const response = await axiosPrivate.get(
        `story/analysis/week/${type}/${year}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getOptions = () => {
    return {
      title: {
        text: "Số lượt xem trong tuần",
        textStyle: {
          fontFamily: "Roboto, sans-serif",
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => `Tuần ${item.week}`),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Lượt xem",
          type: "line",
          data: data.map((item) => item.view),
        },
      ],
    };
  };

  const inputStyle = {
    height: "30px",
    padding: "4px 11px",
    fontSize: "14px",
    boxSizing: "border-box",
    borderRadius: "2px",
    border: "1px solid #d9d9d9",
    boxSizing: "border-box",
  };

  return (
    <Layout>
      <Header style={{ background: "white" }}>
        <Select
          defaultValue={type}
          style={{ width: 150, marginRight: 10 }}
          onChange={(value) => setType(value)}
        >
          <Option value={1}>Truyện Tranh</Option>
          <Option value={2}>Truyện Chữ</Option>
          <Option value={3}>Audio</Option>
        </Select>
        <DatePicker
          selected={year}
          onChange={(date) => setYear(date)}
          showYearPicker
          dateFormat="yyyy"
          locale="vi"
          yearItemNumber={10}
          popperPlacement="bottom-start"
          customInput={<input style={inputStyle} />}
        />
      </Header>

      <Content style={{ padding: "50px" }}>
        <Card title="Biểu đồ lượt xem">
          <ReactECharts option={getOptions()} />
        </Card>
      </Content>
    </Layout>
  );
};

export default WeekAnalysis;
