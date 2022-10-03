import disposableEmailDomains from 'https://esm.sh/disposable-email-domains@1.0.59'
const disposableDomains: Set<string> = new Set(disposableEmailDomains)

export const checkDisposable = async (domain: string): Promise<string | undefined> => {
  if (disposableDomains.has(domain)) return 'Email was created using a disposable email service'
}