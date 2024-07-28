import styled from 'styled-components/native';
import { theme } from '../styles/theme';

const GlobalContainer = styled.View`
    flex: 1;
    backgroundColor: ${theme.colors['apex-blue']};
    height: 100%;
    padding: 10px;
    color: ${theme.colors['white']};
`;

export default GlobalContainer;
