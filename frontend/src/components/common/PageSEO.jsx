import { Helmet } from 'react-helmet-async';

const BASE_TITLE = 'SplitSmart Pro';
const BASE_DESC  = 'Smart expense tracking made simple. Split bills, track balances, and settle up effortlessly with SplitSmart Pro.';
const BASE_URL   = 'https://splitsmart.pro'; // update when live

/**
 * PageSEO – Drop this component at the top of any page to set
 * the document title, meta description, and Open Graph tags.
 *
 * @param {string} title        - Page-specific title (appended to brand)
 * @param {string} description  - Page-specific meta description
 * @param {string} path         - URL path for canonical / OG URL
 * @param {string} image        - OG image URL (optional)
 */
export default function PageSEO({
  title,
  description = BASE_DESC,
  path = '',
  image = `${BASE_URL}/og-image.png`,
}) {
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  const canonical = `${BASE_URL}${path}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={canonical} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />
    </Helmet>
  );
}
