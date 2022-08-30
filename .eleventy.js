const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const { default: getShareImage } = require('@jlengstorf/get-share-image');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('_redirects');

  eleventyConfig.addPassthroughCopy({
    'node_modules/instant.page/instantpage.js': 'assets/instantpage.js'
  });
  eleventyConfig.addPassthroughCopy('blog/**/*.jpg');
  eleventyConfig.addPassthroughCopy('blog/**/*.png');

  eleventyConfig.setTemplateFormats(['md', 'njk']);
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
