
import { OutputFormat, createOutput } from '../output/output.ts'
import { hasCode, ErrorCodes } from './errorCodes.ts'

import { Timeout, TimeoutError } from 'https://deno.land/x/timeout/mod.ts'

export const checkSMTP = (sender: string, recipient: string, domain: string): Promise<OutputFormat> => {
  const timeout = 10 * 1000 // 10 seconds

  console.log('hello from checkSMTP')
  console.log(domain)

  return new Promise(async r => {
    let receivedData = false
  
    try {
      const mxRecords = await Deno
        .resolveDns(domain, 'MX')
        .catch(() => {
          createOutput('smtp', 'MX record not found')
        })

      if(mxRecords?.length) {
        const sortedMxRecords = mxRecords.sort((a, b) => a.preference - b.preference)
        const priorityMxRecord = sortedMxRecords[0].exchange.replace(/\.+$/, '')

        const connection = await Timeout.race([
            Deno.connect({
              hostname: priorityMxRecord,
              port: 25,
            })
          ],
          timeout
        )
        .catch(() => {})

        const request = new TextEncoder().encode(`
          HELLO ${priorityMxRecord}\r
          MAIL FROM: <${sender}>\r
          RCPT TO: <${recipient}>\r
        `)

        const _bytesWritten = await connection?.write(request);

        // Read 15 bytes from the connection.
        const buffer = new Uint8Array(15);
        await connection?.read(buffer);
        connection?.close();

        const res = new Response(buffer)
        const text = await res.text()
        
        if(hasCode(text, 220) || hasCode(text, 250)) {
          console.log('SMTP OK')
          createOutput()
        } else if (hasCode(text, 550)) {
          console.log('SMTP NOK')
          createOutput('smtp', text)
        } else {
          console.log(text)
          console.log('unknown SMTP response')
          createOutput('smtp', text)
        }

        r(createOutput())
  
      } else {
        r(createOutput('smtp', 'MX record not found'))
      }
    } catch(err) {
      console.log('err', err)
    }

  })
}

