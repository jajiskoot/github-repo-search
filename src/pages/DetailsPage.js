import PropTypes from 'prop-types';

export default function DetailsPage({ result }) {
    // name, description, stars, language, owner's name
    return (
        <div>
            <div>
                Repo Name: <a href={result.svn_url}>{result.full_name}</a>
            </div>
            <div>Description: {result.description ? result.description : 'N/A'}</div>
            <div>Stars: {result.stargazers_count}</div>
            <div>Language: {result.language ? result.language : 'N/A'}</div>
            <div>
                Owner: <a href={result.owner.html_url}>{result.owner.login}</a>
            </div>
        </div>
    );
}

DetailsPage.propTypes = {
    result: PropTypes.shape({
        description: PropTypes.string,
        full_name: PropTypes.string,
        language: PropTypes.string,
        owner: PropTypes.shape({
            html_url: PropTypes.string,
            login: PropTypes.string
        }),
        stargazers_count: PropTypes.number,
        svn_url: PropTypes.string
    }).isRequired
};
