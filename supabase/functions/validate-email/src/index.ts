import { isEmail } from './regex/regex.ts'
import { checkTypo } from './typo/typo.ts'
import { checkSMTP } from './smtp/smtp.ts'
import { checkDisposable } from './disposable/disposable.ts'
import { getOptions, ValidatorOptions } from './options/options.ts'
import { OutputFormat, createOutput } from './output/output.ts'
import './types.ts'

export async function validate(emailOrOptions: string | ValidatorOptions): Promise<OutputFormat> {
  const options = getOptions(emailOrOptions)
  const email = options.email

  if (options.validateRegex) {
    const regexResponse = isEmail(email)
    if (regexResponse) return createOutput('regex', regexResponse)
  }

  if (options.validateTypo) {
    const typoResponse = await checkTypo(email, options.additionalTopLevelDomains)
    if (typoResponse) return createOutput('typo', typoResponse)
  }

  const domain = email.split('@')[1]

  if (options.validateDisposable) {
    const disposableResponse = await checkDisposable(domain)
    if (disposableResponse) return createOutput('disposable', disposableResponse)
  }

  if (options.validateMx) {
    if (options.validateSMTP) {
      return checkSMTP(options.sender, email, domain)
    }
  }

  return createOutput()
}

export default validate
