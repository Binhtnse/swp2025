import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Card,
  Form,
  Radio,
  Button,
  Spin,
  message,
  Divider,
  Progress,
} from "antd";

const { Title, Paragraph } = Typography;

interface Option {
  id: number;
  optionText: string;
  createdAt: string | null;
  updatedAt: string | null;
}

interface Question {
  surveyId: number;
  questionId: number;
  questionText: string;
  typeQuestion: "CHOOSE_OPTION" | "FREE_TEXT"; // Add more types as needed
  listOption: Option[];
}

interface SurveyResponse {
  questionId: number;
  answer: string | number;
}

const SurveyDetailScreen: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [surveyTitle, setSurveyTitle] = useState<string>("");

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://14.225.207.207:8080/api/survey/get-data-survey?surveyId=${surveyId}`
        );

        if (response.data && response.data.length > 0) {
          setQuestions(response.data);

          // You might want to fetch the survey title from another API
          // For now, we'll use a placeholder or extract from URL
          setSurveyTitle(`Survey #${surveyId}`);
        } else {
          message.error("Không tìm thấy dữ liệu khảo sát.");
          navigate("/surveys");
        }
      } catch (error) {
        console.error("Failed to fetch survey details:", error);
        message.error("Không thể tải chi tiết khảo sát. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) {
      fetchSurveyDetails();
    }
  }, [surveyId, navigate]);

  const handleNextQuestion = () => {
    form.validateFields().then((values) => {
      // Save the response
      const questionId = questions[currentQuestion].questionId;
      const answer = values[`question_${questionId}`];

      // Update responses
      setResponses((prev) => {
        const existingResponseIndex = prev.findIndex(
          (r) => r.questionId === questionId
        );
        if (existingResponseIndex >= 0) {
          const newResponses = [...prev];
          newResponses[existingResponseIndex] = { questionId, answer };
          return newResponses;
        }
        return [...prev, { questionId, answer }];
      });

      // Move to next question or submit if last question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        // Reset validation for the next question
        form.resetFields();
      } else {
        handleSubmitSurvey();
      }
    });
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);

      // Pre-fill with previous answer if exists
      const questionId = questions[currentQuestion - 1].questionId;
      const previousResponse = responses.find(
        (r) => r.questionId === questionId
      );

      if (previousResponse) {
        form.setFieldsValue({
          [`question_${questionId}`]: previousResponse.answer,
        });
      }
    }
  };

  const handleSubmitSurvey = async () => {
    try {
      setSubmitting(true);

      // Format the data according to the API requirements
      const formattedResponses = responses.map((response) => {
        // For CHOOSE_OPTION questions, we need to put the option ID in listOptionId array
        const question = questions.find(
          (q) => q.questionId === response.questionId
        );

        if (question?.typeQuestion === "CHOOSE_OPTION") {
          return {
            answerText: "", // Empty string for option-based questions
            listOptionId: [response.answer], // Put the option ID in an array
            questionId: response.questionId,
          };
        } else {
          // For other question types like FREE_TEXT
          return {
            answerText: String(response.answer), // Convert to string
            listOptionId: [], // Empty array for text-based questions
            questionId: response.questionId,
          };
        }
      });

      // Make the POST request with surveyId as a query parameter
      await axios.post(
        `http://14.225.207.207:8080/api/survey/save-data-answer?surveyId=${surveyId}`,
        formattedResponses
      );

      console.log("Submitting responses:", formattedResponses);

      message.success("Cảm ơn bạn đã hoàn thành khảo sát!");
      navigate("/surveys"); // Navigate back to surveys list
    } catch (error) {
      console.error("Failed to submit survey:", error);
      message.error("Không thể gửi khảo sát. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOptionChange = (questionId: number, value: string | number) => {
    // Update responses immediately when an option is selected
    setResponses((prev) => {
      const existingResponseIndex = prev.findIndex(
        (r) => r.questionId === questionId
      );
      if (existingResponseIndex >= 0) {
        const newResponses = [...prev];
        newResponses[existingResponseIndex] = { questionId, answer: value };
        return newResponses;
      }
      return [...prev, { questionId, answer: value }];
    });

    // Also update the form value to keep form state in sync
    form.setFieldsValue({
      [`question_${questionId}`]: value,
    });
  };
  const renderQuestion = (question: Question) => {
    switch (question.typeQuestion) {
      case "CHOOSE_OPTION":
        return (
          <Form.Item
            name={`question_${question.questionId}`}
            label={question.questionText}
            rules={[
              { required: true, message: "Vui lòng chọn một câu trả lời" },
            ]}
            className="mb-8"
          >
            <Radio.Group
              className="flex flex-col space-y-3"
              onChange={(e) =>
                handleOptionChange(question.questionId, e.target.value)
              }
            >
              {question.listOption.map((option) => (
                <Radio
                  key={option.id}
                  value={option.id}
                  className="p-3 border border-gray-200 rounded-md hover:border-blue-400"
                >
                  {option.optionText}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        );
      // Add more question types as needed
      default:
        return (
          <div className="text-red-500">
            Unsupported question type: {question.typeQuestion}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải khảo sát..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-50 p-6 border-b border-blue-100">
          <Title level={2} className="text-primary text-center">
            {surveyTitle}
          </Title>
          <Paragraph className="text-center text-gray-600">
            Hãy trả lời các câu hỏi bên dưới để hoàn thành khảo sát sức khỏe
            tinh thần
          </Paragraph>

          <div className="mt-4">
            <Progress
              percent={Math.round(
                ((currentQuestion +
                  (responses.find(
                    (r) =>
                      r.questionId === questions[currentQuestion]?.questionId
                  )
                    ? 1
                    : 0)) /
                  questions.length) *
                  100
              )}
              status="active"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
            <div className="text-gray-500 text-sm text-center mt-2">
              Câu hỏi {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </div>

        <div className="p-6">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            className="survey-form"
          >
            {questions.length > 0 && renderQuestion(questions[currentQuestion])}

            <Divider />

            <div className="flex justify-between mt-6">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="px-6"
              >
                Quay lại
              </Button>

              <Button
                type="primary"
                onClick={handleNextQuestion}
                loading={submitting}
                className="px-6"
              >
                {currentQuestion < questions.length - 1
                  ? "Tiếp theo"
                  : "Hoàn thành"}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default SurveyDetailScreen;
