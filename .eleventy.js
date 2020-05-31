const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy({
    assets: 'assets',
    'node_modules/instant.page/instantpage.js': 'assets/instantpage.js'
  });
};
