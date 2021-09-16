import { render } from '@testing-library/react';
import DetailsPage from '../DetailsPage';

const searchResult = {
    description: 'Some Descrip',
    full_name: 'hazah/project',
    language: 'javascript',
    owner: {
        html_url: 'https://someurl.com',
        login: 'john_stewart'
    },
    stargazers_count: 364,
    svn_url: 'https://diffurl.org'
};

// Typically I would use as many constants as possible instead of trying to matchup strings like 'Description: ' or 'Stars: '
describe('Test Details Page', () => {
    test('Display passed in values', () => {
        const { queryByText } = render(<DetailsPage result={searchResult} />);

        expect(queryByText(`${searchResult.full_name}`)).toBeInTheDocument();
        expect(queryByText(`Description: ${searchResult.description}`)).toBeInTheDocument();
        expect(queryByText(`Stars: ${searchResult.stargazers_count}`)).toBeInTheDocument();
        expect(queryByText(`Language: ${searchResult.language}`)).toBeInTheDocument();
        expect(queryByText(`${searchResult.owner.login}`)).toBeInTheDocument();
    });

    test('Provide links for repository and owner', () => {
        const { queryByText } = render(<DetailsPage result={searchResult} />);

        expect(queryByText(`${searchResult.full_name}`).closest('a')).toHaveAttribute('href', searchResult.svn_url);
        expect(queryByText(`${searchResult.owner.login}`).closest('a')).toHaveAttribute(
            'href',
            searchResult.owner.html_url
        );
    });

    test('Display N/A for fields that are not always populated', () => {
        const missingValues = { ...searchResult, language: null, description: '' };
        const { queryByText } = render(<DetailsPage result={missingValues} />);

        expect(queryByText(`Description: N/A`)).toBeInTheDocument();
        expect(queryByText(`Language: N/A`)).toBeInTheDocument();
    });
});
