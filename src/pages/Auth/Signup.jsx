import React, { useState } from "react";
import { Form, Input, Checkbox, Button, Row, Col, Space, message } from "antd";
import { UserAddOutlined, LockOutlined } from "@ant-design/icons";
import { Divider, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const passwordValidation = (_, value) => {
        if (!value) {
            return Promise.reject(new Error("Password is required"));
        }

        const minLength = 8; // Minimum length requirement
        const hasUpperCase = /[A-Z]/.test(value); // At least one uppercase letter
        const hasLowerCase = /[a-z]/.test(value); // At least one lowercase letter
        const hasDigit = /\d/.test(value); // At least one digit
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value); // At least one special character

        if (
            value.length < minLength ||
            !hasUpperCase ||
            !hasLowerCase ||
            !hasDigit ||
            !hasSpecialChar
        ) {
            return Promise.reject(
                new Error(
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
                )
            );
        }

        return Promise.resolve();
    };

    const termsValidation = (_, value) => {
        if (value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("You must agree to the terms"));
    };

    async function register() {
        setIsLoading(true);
        console.log("Register function called");
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            username: username,
        };

        try {
            // Check if the user with the provided email already exists
            const checkExistingUserResponse = await axios.post(
                "/api/users/check-existing",
                { email }
            );

            if (checkExistingUserResponse.data.exists) {
                // User with this email already exists, show error message
                message.error(
                    "User with this email already exists. Please use a different email."
                );
            } else {
                // Proceed with user registration
                const registrationResponse = await axios.post(
                    "/api/users/register",
                    user
                );
                message.success("Registration Successful");
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Error during registration:", error);
            message.error("Registration Failed");
        } finally {
            setIsLoading(false);
        }
    }

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Received values of form: ", values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const onCheckboxChange = (e) => {
        console.log("Checkbox checked:", e.target.checked);
    };

    return (
        <div className="max-w-lg h-[700px] mx-auto my-24 p-6 border border-gray-300 rounded-lg bg-white shadow-md">
            <h4 className="font-bold text-2xl mb-2">Sign up!</h4>
            <p className="mb-4">Enter your credentials to continue</p>

            <Form
                name="signup"
                initialValues={{}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            hasFeedback
                            name="firstName"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your first name.",
                                },
                                {
                                    min: 2,
                                    message: "Your first name must be at least 2 characters.",
                                },
                                {
                                    pattern: /^[A-Za-z]+$/,
                                    message: "Your first name can only contain letters.",
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserAddOutlined className="text-gray-500" />}
                                placeholder="First Name"
                                className="rounded-md"
                                size="large"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            hasFeedback
                            name="lastName"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your last name.",
                                },
                                {
                                    min: 2,
                                    message: "Your last name must be at least 2 characters.",
                                },
                                {
                                    pattern: /^[A-Za-z]+$/,
                                    message: "Your last name can only contain letters.",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Last Name"
                                size="large"
                                className="rounded-md"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="username"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Please input your username.",
                        },
                        {
                            min: 4,
                            message: "Your username must be at least 4 characters.",
                        },
                        {
                            pattern: /^[A-Za-z0-9]+$/,
                            message: "Your username can only contain letters and numbers.",
                        },
                    ]}
                >
                    <Input
                        placeholder="Username"
                        size="large"
                        className="rounded-md"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Please input your email.",
                        },
                        {
                            type: "email",
                            message: "Your email is invalid.",
                        },
                    ]}
                >
                    <Input
                        placeholder="Email"
                        size="large"
                        className="rounded-md"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    rules={[
                        {
                            required: true,
                            message: "Please input your phone number.",
                        },
                        {
                            pattern: /^[0-9+-]+$/,
                            message: "Please input a valid phone number.",
                        },
                        {
                            min: 9,
                            message: "Your phone number is too short.",
                        },
                        {
                            max: 10,
                            message: "Your phone number is too long.",
                        },
                    ]}
                >
                    <Space direction="vertical" size="large">
                        <Space.Compact>
                            <Input
                                className="w-1/5 rounded-md"
                                defaultValue="+94"
                                size="large"
                            />
                            <Input
                                className="w-full rounded-md"
                                placeholder="7xxxxxxx"
                                size="large"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </Space.Compact>
                    </Space>
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="password"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password.",
                                },
                                {
                                    validator: passwordValidation,
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-500" />}
                                placeholder="Password"
                                size="large"
                                className="rounded-md"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="confirm"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Confirm your password.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("The two passwords that you entered do not match!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-500" />}
                                placeholder="Confirm Password"
                                size="large"
                                className="rounded-md"
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Form.Item
                        name="agree"
                        valuePropName="checked"
                        noStyle
                        rules={[{ validator: termsValidation }]}
                    >
                        <Checkbox onChange={onCheckboxChange}>
                            I agree to <a href="#">Terms of Use & Privacy policy</a>.
                        </Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-[#533c56] text-white hover:bg-[#99707E]"
                        size="middle"
                        onClick={register}
                        loading={isLoading}
                    >
                        Sign Up
                    </Button>
                    <div className="mt-3 text-center">
                        Already have an Account <a href="/login">Log in!</a>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Signup;
