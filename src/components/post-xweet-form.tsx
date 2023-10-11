import styled from "styled-components";
import "../variables.css";
import React, { useState } from "react";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: var(--main-fontColor);
    background-color: var(--main-bgColor);
    width: 100%;
    resize: none;
    &::placeholder {
        font-size: 16px;
        font-family: inherit;
    }
    &:focus {
        outline: none;
        border-color: var(--main-blue);
    }
`;

const AttachFileButton = styled.label`
    padding: 10px 0;
    color: var(--main-blue);
    text-align: center;
    border-radius: 20px;
    border: 1px solid var(--main-blue);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;

const AttachFileInput = styled.input`
    display: none;
`;

const SubmitBtn = styled.input`
    background-color: var(--main-blue);
    color: var(--main-fontColor);
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`;

export default function PostXweetForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [xweet, setXweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setXweet(e.target.value);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            setFile(files[0]);
            console.log(files[0].name);
        }
    };
    return (
        <Form>
            <TextArea
                onChange={onChange}
                rows={5}
                maxLength={180}
                placeholder="What is happening?!"
                value={xweet}
            />
            <AttachFileButton htmlFor="file">
                {file ? "Photo added ✅" : "Add photo"}
            </AttachFileButton>
            <AttachFileInput
                onChange={onFileChange}
                type="file"
                id="file"
                accept="image/*"
            />
            <SubmitBtn
                type="submit"
                value={isLoading ? "Posting..." : "Post Xweet"}
            />
        </Form>
    );
}
