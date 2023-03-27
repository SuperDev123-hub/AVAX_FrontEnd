import React from 'react';
import styled from "styled-components";
import { CircularProgress } from '@mui/material';

function Loading() {
    return (
        <>
         <Container>
              <div className="circular_icon">
              <CircularProgress/>
              </div>
         </Container>
        </>
    )
};

const Container  = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  width : 100vw;
  height : 100vh;
  align-items: center;

  .circular_icon{
      margin: auto;
  }
`;


export default Loading
