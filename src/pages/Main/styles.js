import styled, { css, keyframes } from 'styled-components';

export const Form = styled.form`
    margin-top: 30px;
    display: flex;
    flex-direction: row;

    input {
        flex: 1;
        border: 1px solid ${props => (props.deuErro ? '#ff0000' : '#eee')};
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 16px;
    }
`;

//  keyframes serve para criar animacoes - neste caso usaremos para animar o 'loading'
const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`;

// attrs serve pra passar propriedades aqui para a estilizacao
export const SubmitButton = styled.button.attrs(props => ({
    type: 'submit',
    disabled: props.loading,
}))`
    background: #7159c1;
    border: 0;
    padding: 0 15px;
    margin-left: 10px;
    border-radius: 4px;

    display: flex;
    justify-content: center;
    align-items: center;

    /* quando estiver desabilitado o botao, nao permitir clicar. */
    &[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
    }

    /* serve pra girar o 'loading' quando ele estiver true */
    ${props =>
        props.loading &&
        css`
            svg {
                animation: ${rotate} 2s linear infinite;
            }
        `}
`;

export const List = styled.ul`
    list-style: none;
    margin-top: 30px;

    li {
        padding: 15px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        /* cria uma linha horizontal em todos os itens adicionados, menos no primeiro item. */
        & + li {
            border-top: 1px solid #eee;
        }

        /* aplica cor no link 'detalhes' */
        a {
            color: #7159c1;
            text-decoration: none;
        }
    }
`;
