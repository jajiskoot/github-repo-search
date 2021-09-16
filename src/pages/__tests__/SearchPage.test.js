import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';

import * as AppConstants from '../../AppConstants';
import SearchPage from '../SearchPage';

jest.mock('@material-ui/core/useMediaQuery', () => jest.fn().mockImplementation((string) => !!string));

const setSearchResults = jest.fn();
const setSearchResult = jest.fn();

// Typically I would use as many constants as possible instead of trying to matchup strings like 'Search' or 'Best Match'
describe('Search Page Tests', () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve({})
            })
        );
    });

    test('Unable to Search without Search text input', () => {
        const { queryByText } = render(
            <SearchPage results={{}} setResults={setSearchResults} setResult={setSearchResult} />
        );

        const searchButton = queryByText(AppConstants.SearchButtonText);
        fireEvent.click(searchButton);

        expect(global.fetch).not.toHaveBeenCalled();
    });

    test('Makes fetch api call with Search Text input', async () => {
        const { getByLabelText, getByText, getByTestId } = render(
            <SearchPage results={{}} setResults={setSearchResults} setResult={setSearchResult} />
        );
        const inputText = 'some text';

        const searchInput = getByLabelText(new RegExp(AppConstants.SearchInputLabel));
        fireEvent.change(searchInput, { target: { value: inputText } });

        const searchButton = getByText(AppConstants.SearchButtonText);
        fireEvent.click(searchButton);

        await waitForElementToBeRemoved(getByTestId(AppConstants.LoadingTestId));

        const queryString = encodeURIComponent(`${inputText}`);

        expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/search/repositories?q=${queryString}`);
    });

    test('Adds just language to api query', async () => {
        const { getByLabelText, getByText, getByTestId } = render(
            <SearchPage results={{}} setResults={setSearchResults} setResult={setSearchResult} />
        );
        const inputText = 'some text';
        const languageText = 'PHP';

        const searchInput = getByLabelText(new RegExp(AppConstants.SearchInputLabel));
        fireEvent.change(searchInput, { target: { value: inputText } });

        const languageInput = getByLabelText(new RegExp(AppConstants.LanguageInputLabel));
        fireEvent.change(languageInput, { target: { value: languageText } });

        const searchButton = getByText(AppConstants.SearchButtonText);
        fireEvent.click(searchButton);

        await waitForElementToBeRemoved(getByTestId(AppConstants.LoadingTestId));

        const queryString = encodeURIComponent(`${inputText} language:${languageText}`);

        expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/search/repositories?q=${queryString}`);
    });

    test('Adds just sort to api query', async () => {
        const { getByLabelText, getByText, getByTestId } = render(
            <SearchPage results={{}} setResults={setSearchResults} setResult={setSearchResult} />
        );
        const inputText = 'some text';

        const searchInput = getByLabelText(new RegExp(AppConstants.SearchInputLabel));
        fireEvent.change(searchInput, { target: { value: inputText } });

        const sortButton = getByText(AppConstants.SortButtonDefaultText);
        fireEvent.click(sortButton);

        const searchButton = getByText(AppConstants.SearchButtonText);
        fireEvent.click(searchButton);

        await waitForElementToBeRemoved(getByTestId(AppConstants.LoadingTestId));

        const queryString = encodeURIComponent(`${inputText} sort:stars`);

        expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/search/repositories?q=${queryString}`);
    });

    test('Adds both language and sort to api query', async () => {
        const { getByLabelText, getByText, getByTestId } = render(
            <SearchPage results={{}} setResults={setSearchResults} setResult={setSearchResult} />
        );
        const inputText = 'some text';
        const languageText = 'PHP';

        const searchInput = getByLabelText(new RegExp(AppConstants.SearchInputLabel));
        fireEvent.change(searchInput, { target: { value: inputText } });

        const languageInput = getByLabelText(new RegExp(AppConstants.LanguageInputLabel));
        fireEvent.change(languageInput, { target: { value: languageText } });

        const sortButton = getByText(AppConstants.SortButtonDefaultText);
        fireEvent.click(sortButton);

        const searchButton = getByText(AppConstants.SearchButtonText);
        fireEvent.click(searchButton);

        await waitForElementToBeRemoved(getByTestId(AppConstants.LoadingTestId));

        const queryString = encodeURIComponent(`${inputText} language:${languageText} sort:stars`);

        expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/search/repositories?q=${queryString}`);
    });

    // TODO: Write another test that verifies proper error handling with the fetch has an error
});
