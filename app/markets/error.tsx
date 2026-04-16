'use client';

import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  max-height: 100vh;
  background-color: var(--white);
`;

const Content = styled.div`
  display: flex;
  width: auto;
  max-width: 298px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
`;

const ErrorTextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  margin-top: 24px;
`;

const ErrorHead = styled.p`
  font-size: 24px;
  font-weight: 600;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  line-height: auto;
  word-break: break-word;
  text-align: left;
  margin-bottom: 8px;
`;

const ErrorText = styled.p`
  text-align: left;
  font-size: 17px;
  font-weight: 500;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.text};
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 286px;
  height: 44px;
  padding: 0px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.colors.text};
  color: #000;
  max-width: 298px;
  outline: none;
  text-align: center;
  user-select: none;
`;

const ButtonText = styled.p`
  text-align: center;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500;
  margin-top: 4px;
  color: var(--white);
`;

const Logo = styled(Image)`
  object-fit: cover;
  width: 252px;
  height: 93px;

  @media only screen and (max-width: 576px) { 
    width: 228px;
    height: 80px;
  }
`;

export default function ErrorComponent() {
  return (
    <Wrapper>
        <Content>
          <ErrorTextContent>
            <ErrorHead>
                Ooops! – Something went wrong.
            </ErrorHead>
            <ErrorText>
              Please reload the page or tap the button to go to homepage.
            </ErrorText>
          </ErrorTextContent>
          <Button href="/homepage">
            <ButtonText>The Ghanaian Web Homepage</ButtonText>
            <Image 
              src='/arrow-white.svg' 
              alt='error' 
              height={30} 
              width={30} 
            />
          </Button>
        </Content>
    </Wrapper>
  );
}