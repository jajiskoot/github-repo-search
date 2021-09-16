import { fireEvent, render } from '@testing-library/react';

import * as AppConstants from './AppConstants';
import App from './App';

const searchResults = { total_count: 56, items: [{ full_name: 'repo/proj', language: 'PHP', stargazers_count: 12 }] };

describe('Test App as a whole, including integration tests', () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(searchResults)
            })
        );
    });

    test('Results render after loading', async () => {
        const { getByLabelText, getByText, findByTestId } = render(<App />);
        const inputText = 'some text';

        const searchInput = getByLabelText(new RegExp(AppConstants.SearchInputLabel));
        fireEvent.change(searchInput, { target: { value: inputText } });

        const searchButton = getByText(AppConstants.SearchButtonText);
        fireEvent.click(searchButton);

        await findByTestId(new RegExp(AppConstants.TotalResultsTestId));

        const queryString = encodeURIComponent(`${inputText}`);

        expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/search/repositories?q=${queryString}`);
        expect(getByText(`Repo Name: ${searchResults.items[0].full_name}`)).toBeInTheDocument();
    });
});
