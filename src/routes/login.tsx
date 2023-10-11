import React, { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
    Error,
    Form,
    Input,
    Switcher,
    Title,
    Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";
// import ResetPasswordButton from "../components/reset-password-btn";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    // input에 name을 넣어 어떤 input이 변경되엇는지 찾을 수 있음
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "" || password === "") return;
        try {
            setIsLoading(true);
            // login
            await signInWithEmailAndPassword(auth, email, password);
            // redirect to the home page
            navigate("/");
        } catch (e) {
            //setError
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Wrapper>
            <Title>Log into 𝕏witter</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    name="email"
                    value={email}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    onChange={onChange}
                    name="password"
                    value={password}
                    placeholder="Password"
                    type="password"
                    required
                />
                <Input
                    type="submit"
                    value={isLoading ? "Loading..." : "Log in"}
                />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Don't have an account?
                <Link to="/create-account">Create one &rarr;</Link>
            </Switcher>
            <Switcher>
                Did you forget your password?
                <Link to="/find-password">find &rarr;</Link>
            </Switcher>
            <GithubButton />
        </Wrapper>
    );
}
