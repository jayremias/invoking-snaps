import { useContext } from 'react';
import styled from 'styled-components';
import {
  Card,
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
} from '../components';
import {
  defaultEncryptSnapOrigin,
  defaultStateSnapOrigin,
} from '../config/snap';
import { MetaMaskContext, MetamaskActions } from '../hooks';
import {
  connectSnap,
  generateState,
  getSnap,
  getState,
  shouldDisplayReconnectButton,
} from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleConnectEncryptClick = async () => {
    try {
      await connectSnap(defaultEncryptSnapOrigin);
      const installedSnap = await getSnap(defaultEncryptSnapOrigin);

      dispatch({
        type: MetamaskActions.SetInstalledEncrypt,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleConnectStateClick = async () => {
    try {
      await connectSnap(defaultStateSnapOrigin);
      const installedSnap = await getSnap(defaultStateSnapOrigin);

      dispatch({
        type: MetamaskActions.SetInstalledState,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await generateState(['item-1', 'item-2', 'item-3']);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleInvokeStateSnapClick = async () => {
    try {
      await getState();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>template-snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedStateSnap && (
          <Card
            content={{
              title: 'Connect State Snap',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectStateClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedStateSnap) && (
          <Card
            content={{
              title: 'Reconnect State Snap',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectStateClick}
                  disabled={!state.installedStateSnap}
                />
              ),
            }}
            disabled={!state.installedStateSnap}
          />
        )}
        <Card
          content={{
            title: 'Generate Some State',
            description: '',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={!state.installedStateSnap}
              />
            ),
          }}
          disabled={!state.installedStateSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedStateSnap) &&
            !shouldDisplayReconnectButton(state.installedStateSnap)
          }
        />

        {!state.installedEncryptSnap && (
          <Card
            content={{
              title: 'Connect Encrypt Snap',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectEncryptClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedEncryptSnap) && (
          <Card
            content={{
              title: 'Reconnect Encrypt Snap',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectEncryptClick}
                  disabled={!state.installedEncryptSnap}
                />
              ),
            }}
            disabled={!state.installedEncryptSnap}
          />
        )}
        <Card
          content={{
            title: 'Invoke State Snap',
            description: '',
            button: (
              <SendHelloButton
                onClick={handleInvokeStateSnapClick}
                disabled={!state.installedEncryptSnap}
              />
            ),
          }}
          disabled={!state.installedEncryptSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedEncryptSnap) &&
            !shouldDisplayReconnectButton(state.installedEncryptSnap)
          }
        />
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
