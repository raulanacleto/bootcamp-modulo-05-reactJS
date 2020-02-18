import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/container';

import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newRepo: '',
            repositories: [],
            loading: false,
            deuErro: false,
        };
    }

    // carregar os dados do localstorage
    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            // seta no state os dados salvos no localstorage
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    // salvar os dados do localstorage
    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    };

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ loading: true });

        const { newRepo, repositories } = this.state;

        try {
            const response = await api.get(`repos/${newRepo}`);
            const data = {
                name: response.data.full_name,
            };

            const jaExisteRepositorio = repositories.find(
                res => res.name === data.name
            );

            if (jaExisteRepositorio) {
                throw new Error('Repositório duplicado');
            }

            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
                loading: false,
                deuErro: false,
            });
        } catch (error) {
            this.setState({
                loading: false,
                deuErro: true,
            });
        }
    };

    render() {
        const { newRepo, repositories, loading, deuErro } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>
                <Form deuErro={deuErro} onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar Repositorio"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading}>
                        {/* condicao de renderizacao - mostrar botao de '+' somente quando ja terminou requisicao */}
                        {loading ? (
                            <FaSpinner color="FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )}
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span> {repository.name} </span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repository.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
