module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [], // Si tu utilises Tailwind, sinon retire cette ligne
    };
};
