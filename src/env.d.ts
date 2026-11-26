interface ImportMetaEnv {
  readonly PUBLIC_REPO_URL?: string;
  /** Content of the google-site-verification meta tag (Search Console, URL-prefix property). */
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  /** Content of the msvalidate.01 meta tag (Bing Webmaster Tools). */
  readonly PUBLIC_BING_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
