import { useRouter } from 'next/router';

export default {
  logo: <strong>Significa foundations</strong>,
  project: {
    link: 'https://github.com/significa/foundations'
  },
  docsRepositoryBase: 'https://github.com/significa/foundations/tree/main',
  feedback: {
    content: null
  },
  footer: { component: null },
  darkMode: false,
  nextThemes: {
    forcedTheme: 'light'
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Foundations'
      };
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Significa Foundations" />
      <meta property="og:description" content="Significa Foundations" />
    </>
  )
};
