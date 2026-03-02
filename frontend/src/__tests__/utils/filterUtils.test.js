/**
 * filterUtils — unit tests for the filter-stripping logic used in ProductsPage
 */

/**
 * Mirrors the exact logic in ProductsPage.jsx:
 *   Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v != null))
 */
function cleanFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v != null)
    );
}

describe('cleanFilters', () => {
    it('strips empty string values', () => {
        const result = cleanFilters({ search: '', category: 'electronics', minPrice: '' });
        expect(result).toEqual({ category: 'electronics' });
    });

    it('strips null values', () => {
        const result = cleanFilters({ search: null, category: 'books' });
        expect(result).toEqual({ category: 'books' });
    });

    it('strips undefined values', () => {
        const result = cleanFilters({ search: undefined, minPrice: '10' });
        expect(result).toEqual({ minPrice: '10' });
    });

    it('keeps valid string values', () => {
        const result = cleanFilters({ search: 'watch', minPrice: '100', maxPrice: '500' });
        expect(result).toEqual({ search: 'watch', minPrice: '100', maxPrice: '500' });
    });

    it('keeps numeric zero values', () => {
        const result = cleanFilters({ minPrice: 0, maxPrice: 500 });
        // 0 is falsy but not '' or null — should be kept
        expect(result).toEqual({ minPrice: 0, maxPrice: 500 });
    });

    it('returns empty object when all values are empty', () => {
        const result = cleanFilters({ search: '', category: '', minPrice: null });
        expect(result).toEqual({});
    });

    it('returns empty object for empty input', () => {
        const result = cleanFilters({});
        expect(result).toEqual({});
    });
});
