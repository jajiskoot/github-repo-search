import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, CircularProgress, Divider, TextField } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import * as AppConstants from '../AppConstants';

// To show a more used alternative to inline styles
const useStyles = makeStyles({
    form: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: '1%',
        fontSize: '20px',
        fontWeight: 'bold',
        alignItems: 'center',
        paddingTop: '10px'
    },
    input: (flexWrapped) => ({
        marginBottom: `${flexWrapped ? '10px' : '0'}`
    })
});

export default function SearchPage({ results, setResults, setResult }) {
    // TODO: make value based off dynamic value of element width before flew wrap starts
    const flexWrapped = useMediaQuery(`(max-width: 700px)`);
    const classes = useStyles(flexWrapped);
    const history = useHistory();
    const [searchInput, setSearchInput] = useState('');
    const [searchInputError, setSearchInputError] = useState(false);
    const [language, setLanguage] = useState('');
    const [sortText, setSortText] = useState(AppConstants.SortButtonDefaultText);
    const [loading, setLoading] = useState(false);

    const handleSortChange = useCallback(() => {
        setSortText((prevText) =>
            prevText === AppConstants.SortButtonDefaultText ? 'Stars' : AppConstants.SortButtonDefaultText
        );
    }, []);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            // API doesn't allow searching without a base query string
            if (searchInput) {
                setLoading(true);

                // Build the query; only add sort and language filter if they differ from the default
                const queryString = `?q=${encodeURIComponent(
                    `${searchInput}${language ? ` language:${language}` : ''}${
                        sortText !== AppConstants.SortButtonDefaultText ? ` sort:${sortText.toLowerCase()}` : ''
                    }`
                )}`;

                fetch(`https://api.github.com/search/repositories${queryString}`)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        setResults(data);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error(`An error occurred trying to query GitHub:${err.message}`);
                    });
            } else {
                setSearchInputError(true);
            }
        },
        [searchInput, language, sortText, setResults]
    );

    function handleResultSelected(result) {
        setResult(result);
        history.push('details');
    }

    const ResultButton = withStyles({
        label: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
        }
    })(Button);

    return (
        <div style={{ margin: '10px' }}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    id="search-input"
                    label={AppConstants.SearchInputLabel}
                    className={classes.input}
                    variant="outlined"
                    error={searchInputError}
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        setSearchInputError(false);
                    }}
                    required
                />
                <TextField
                    id="language-input"
                    label={AppConstants.LanguageInputLabel}
                    className={classes.input}
                    variant="outlined"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                />
                <div style={{ minWidth: '180px' }}>
                    Sort:
                    <Button style={{ background: 'lightgray' }} onClick={handleSortChange}>
                        {sortText}
                    </Button>
                </div>
                <Button style={{ background: 'gray', maxHeight: '56px' }} type="submit">
                    {AppConstants.SearchButtonText}
                </Button>
            </form>
            <br />
            <Divider />
            <br />
            {results.items?.length > 0 ? (
                <>
                    <div data-testid={AppConstants.TotalResultsTestId}>
                        Total Results: {results.total_count}
                        <br />
                        {results.total_count > 30 ? 'Showing Top 30' : ''}
                    </div>
                    <br />
                    {results.items.map((result) => (
                        <div key={result.full_name}>
                            <ResultButton onClick={() => handleResultSelected(result)}>
                                <div>Repo Name: {result.full_name}</div>
                                <div>Language: {result.language ? result.language : 'N/A'}</div>
                                <div>Stars: {result.stargazers_count}</div>
                            </ResultButton>
                        </div>
                    ))}
                </>
            ) : (
                <>{loading ? <CircularProgress data-testid={AppConstants.LoadingTestId} /> : <div>No Results</div>}</>
            )}
        </div>
    );
}

SearchPage.propTypes = {
    results: PropTypes.shape({
        incomplete_results: PropTypes.bool,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                full_name: PropTypes.string,
                language: PropTypes.string,
                stargazers_count: PropTypes.number
            })
        ),
        total_count: PropTypes.number
    }).isRequired,
    setResult: PropTypes.func.isRequired,
    setResults: PropTypes.func.isRequired
};
