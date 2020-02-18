import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/container';
import { Loading, Owner, IssueList, FilterButton } from './styles';

export default class Repository extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired,
    };

    state = {
        repository: {},
        issues: [],
        loading: true,
    };

    async componentDidMount() {
        const { match } = this.props;

        const repoName = decodeURIComponent(match.params.repository);

        // desta forma a issues iria esperar a de cima concluir, como nao precisamos esperar, usaremos a promisse
        // const response = await api.get(`/repos/${repoName}`);
        // const issues = await api.get(`/repos/${repoName}/issues`);

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                },
            }),
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false,
        });

        console.log('componentDidMount');
    }

    handleState = async e => {
        const { match } = this.props;
        const repoName = decodeURIComponent(match.params.repository);
        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: e.target.value,
                    per_page: 5,
                },
            }),
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false,
        });
        console.log('handleState');
    };

    render() {
        const { repository, issues, loading } = this.state;

        if (loading) {
            return <Loading>Carregando</Loading>;
        }

        return (
            <Container>
                <Owner>
                    <Link to="/"> Voltar aos repositorios </Link>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>
                <FilterButton
                    onClick={this.handleState}
                    type="button"
                    value="all"
                >
                    all
                </FilterButton>
                <FilterButton
                    onClick={this.handleState}
                    type="button"
                    value="open"
                >
                    open
                </FilterButton>
                <FilterButton
                    onClick={this.handleState}
                    type="button"
                    value="closed"
                >
                    closed
                </FilterButton>
                <IssueList>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img
                                src={issue.user.avatar_url}
                                alt={issue.user.login}
                            />
                            <div>
                                <strong>
                                    <a href={issue.html_url}> {issue.title}</a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>
                                            {label.name}
                                        </span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssueList>
            </Container>
        );
    }
}
