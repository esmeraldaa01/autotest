import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data from "../assests/data";
import "./result.css";
import { Card } from "antd";
import { Button } from "antd";
import { Modal } from "antd";
import {  CaretRightOutlined } from "@ant-design/icons";
import {Doughnut} from "react-chartjs-2";


const Result = ({authorised}) => {
  const [result, setResult] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [history, setHistory] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if(authorised.quiz === false){
      navigate(`/`)
    }
  })
  useEffect(() => {
    const result = localStorage.getItem("scores");
    const quizResult = JSON.parse(result);
    setResult(quizResult);
  }, []);

  useEffect(() => {
    const quizHis = localStorage.getItem("quizResult");
    const quizHistory = JSON.parse(quizHis);
    setHistory(quizHistory);
  }, []);

  const  getTrueCount = () => {
    let count = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i].isCorrect === true) {
        count++;
      }
    }
    return count;
  }

  const  getTrueCount1 = () => {
    let count = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i].isCorrect === false) {
        count++;
      }
    }
    return count;
  }


  const data = {
    datasets: [{
      data: [getTrueCount(), getTrueCount1()],
      backgroundColor:[
        'green',
        'red'
      ]
    },
    ],
    labels: [
      'Correct',
      'Wrong'
    ],
  };

  const handleClickRestart = () => {
    navigate("/quiz");
  };

  const showModal = () => {
    setIsModalVisible(true);
    if(result === data.length) setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  return (
    <div className="container-res">
      <Card className="card" bordered={false}>
        <p className="result-header">
          You score {result} of {data.length}
        </p>
   <div className='chart'>
        <Doughnut  data={data}/>
   </div>
        <div className="buttons">
          <Button className="back-btn" onClick={handleClickRestart}>
            <CaretRightOutlined />
            Back to quiz
          </Button>
          <Button className='history' type="danger" onClick={showModal}>
            View History
          </Button>
        </div>
        <Modal
          title="Quiz history"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}>

          {history?.map((question) => {
            const color =  question.isCorrect ? "green" : "red";
            return (
              <div>
                {question.isCorrect === false && (
                  <div>
                    <p style={{ color: `${color}` }} className="title">
                      {question.title}
                    </p>
                    <div className="horizontal">
                      <label>Your choice : </label>
                      <p>{question.choices.join(",")}</p>
                    </div>
                    <div className="horizontal">
                      <label>Correct Answer : </label>
                      <p className="correct-answer" style={{ color: "green" }}>
                        {question.answer.join(",")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Modal>
      </Card>
    </div>

  );
};
export default Result;
