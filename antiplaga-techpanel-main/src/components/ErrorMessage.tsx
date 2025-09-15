import React from "react";
import styled from "styled-components";

const ErrorMessageStyled = styled.div`
    color: red;
    font-size: 0.8em;
    padding: 4px 12px;
`

export const ErrorMessage: React.FC = (props) => {
    return (
        <ErrorMessageStyled>{props.children}</ErrorMessageStyled>
    )
}

export default ErrorMessage