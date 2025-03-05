import { Helmet } from 'react-helmet';

type SEOProps = {
  title?: string;
  image?: string;
  author?: string;
  keywords?: string;
  description?: string;
};

const SEO: React.FC<SEOProps> = ({
  author = 'Shardendu Mishra',
  image = '/Logo/SVG/main-logo-transparent.svg',
  title = 'Neuro-Assistant | Shardendu Mishra',
  description = 'Neuro-Assistant is an AI-driven application designed for physicians to streamline stroke assessment with guided data entry, image uploads, and protocol-based analysis.',
  keywords = 'neuro-assistant, stroke detection, AI in healthcare, medical imaging, emergency response, stroke management, medical AI, healthcare automation',
}) => (
  <Helmet>
    <html lang="en" />
    <title>{title}</title>
    <meta charSet="utf-8" />
    <meta name="author" content={author} />
    <meta name="keywords" content={keywords} />
    <meta property="og:title" content={title} />
    <meta property="og:image" content={image} />
    <meta property="og:type" content="website" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:image" content={image} />
    <meta name="robots" content="index, follow" />
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </Helmet>
);

export default SEO;
