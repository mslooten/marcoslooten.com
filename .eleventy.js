const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy({
    assets: 'assets',
    _redirects: '_redirects',
    'node_modules/instant.page/instantpage.js': 'assets/instantpage.js'
  });
  eleventyConfig.setTemplateFormats(['md', 'jpg', 'png', 'njk']);
};
