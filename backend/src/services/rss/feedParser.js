import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'NewsMind-AI/1.0' },
  customFields: {
    item: ['media:content', 'content:encoded'],
  },
});

export const parseFeed = async (url) => {
  const feed = await parser.parseURL(url);
  return {
    title: feed.title || 'Untitled Feed',
    description: feed.description || '',
    siteUrl: feed.link || url,
    imageUrl: feed.image?.url || feed.itunes?.image,
    items: (feed.items || []).map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || item.guid,
      content: item['content:encoded'] || item.content || item.contentSnippet || '',
      excerpt: item.contentSnippet || item.summary || '',
      author: item.creator || item.author || '',
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      imageUrl: item.enclosure?.url || item['media:content']?.$?.url,
    })),
  };
};

export const DEFAULT_FEEDS = [
  { title: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'technology' },
  { title: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', category: 'world' },
  { title: 'Reuters Top News', url: 'https://www.reutersagency.com/feed/', category: 'world' },
  { title: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'technology' },
  { title: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'technology' },
  { title: 'Hacker News', url: 'https://hnrss.org/frontpage', category: 'technology' },
  { title: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'science' },
  { title: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'technology' },
  {
    title: 'Times of India - India',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
    
  },
  {
    title: 'PRLOG',
    url: 'https://www.prlog.org/news/ind/business/rss.xml',
    category: 'business'

  }
];
