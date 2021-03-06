const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const { default: getShareImage } = require('@jlengstorf/get-share-image');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy({
    assets: 'assets',
    _redirects: '_redirects',
    'node_modules/instant.page/instantpage.js': 'assets/instantpage.js'
  });
  eleventyConfig.setTemplateFormats(['md', 'jpg', 'png', 'njk']);
  eleventyConfig.addNunjucksFilter('social', (title, desc) => {
    return getShareImage({
      title: title,
      tagline: desc,
      cloudName: 'mslooten',
      imagePublicID: 'social-share-card',
      titleFont: 'Open Sans',
      taglineFont: 'Open Sans',
      titleExtraConfig: '_bold',
      taglineFontSize: 32,
      textColor: '4a5568'
    });
  });
};
