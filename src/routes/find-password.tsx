import { useState } from "react";
import { Form, Input, Wrapper } from "../components/auth-components";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function FindPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email === "") return;
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (e) {
            console.log(e);
        }
        navigate("/login");
    };

    return (
        <Wrapper>
            Send a Password reset link to your email
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    value={email}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input type="submit" value="Send Email" />
            </Form>
        </Wrapper>
    );
}
