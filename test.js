const i18nOf = (translates, locale = "en", defaultLocale = "kr", defaultText = undefined) => {
    const joinWithValues = (a, keys) => a.reduce((a, b, i) => a + keys[i - 1] + b);
    return ((strings, ...keys) => {
        const key = strings.raw.join('');
        const t = translates[key] ? translates[key][locale] ? translates[key][locale] : translates[key][defaultLocale] : undefined;
        return t ? joinWithValues(t, keys) : defaultText ? defaultText : joinWithValues(strings.raw, keys);
    });
};

const i18n = i18nOf(require('./translations.json'), "en");

it('i18n', () => {
    expect(i18n`오류가 발생했습니다. 잠시후 다시 시도해주세요.`)
        .toBe("An error occurred. Please try again in a moment.");
    expect(i18n`${123}점 >`)
        .toBe("123 >");
    expect(i18n`${123}점수다 이말이야 >`)
        .toBe("123점수다 이말이야 >");
});
