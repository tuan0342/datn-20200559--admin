import React, { useState, useEffect } from "react";
import { Select, Card, Layout } from "antd";
import ReactECharts from "echarts-for-react";
import { axiosPrivate } from "../../api/axios";

const { Option } = Select;
const { Header, Content } = Layout;

const YearAnalysis = () => {
  const [type, setType] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(type);
  }, [type]);

  const fetchData = async (type) => {
    try {
      const { userToken, user } = JSON.parse(localStorage.getItem("user_data"));
      const response = await axiosPrivate.get(`story/analysis/year/${type}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getOptions = () => {
    return {
      title: {
        text: "Số lượt xem trong năm",
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
        data: data.map((item) => `Năm ${item.year}`),
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
      </Header>

      <Content style={{ padding: "50px" }}>
        <Card title="Biểu đồ lượt xem">
          <ReactECharts option={getOptions()} />
        </Card>
      </Content>
    </Layout>
  );
};

export default YearAnalysis;
