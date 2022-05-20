import urls from 'rehype-urls';

function processUrl(url, node) {
  if (node.tagName === 'a') {
    if (!url.href.startsWith('/')) {
      node.properties.target = '_blank';
      node.properties.rel = 'noopener';
    }
  }
}

const config = {
  extensions: ['.svelte.md', '.md', '.svx'],

  smartypants: {
    quotes: true,
    ellipses: true,
  },

  remarkPlugins: [],
  rehypePlugins: [[urls, processUrl]],
};

export default config;
