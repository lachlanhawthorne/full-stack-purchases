import { createMachine, send, assign } from "xstate"

type InputValidatorContext = {
  initialValue: string,
  textValue: string,
  edited: boolean,
  valid: boolean,
  validator: any,
  errorText: string,
}

type InputValidatorEvents = {
  type: 'EDITED',
  value: string,
  validator?: any
} | {
  type: 'RESET'
} | {
  type: 'VALIDATE'
} | {
  type: 'VALID'
} | {
  type: 'INVALID'
}

export const inputValidatorMachine = props =>
/** @xstate-layout N4IgpgJg5mDOIC5QEsB2AHArgFwGoEMAbZCfbAewCcA6EwsAYgFEARASQBVXFR1zZk2ZOVQ8QAD0QBGAEwBWanIAMKqUoDMANgAcATiU7NAGhABPaQHZ11Tbc1ype7dpm7N6gL4eTaLHiIkZFTUkIKQzOxcLGJ8AkIiYpIIMpq61FoWMkqZug7actom5gh61LrlbhYALBa66uoWml7eIKjkEHBivjgExKQUNHRgMfyCwqJIEohVMkWIWTLUUnYWFlJSVbIFTS3d-n1BNKHYkCNx44nzulI2cjINm1W61W5zyWplFfnqeimNVV4fBgegF+lQzmMEpMko43o5mh4gA */
createMachine<
  InputValidatorContext,
  InputValidatorEvents
>({
  predictableActionArguments: true,
  context: {
    initialValue: '' as string,
    textValue: '' as string,
    edited: false as boolean,
    valid: false as boolean,
    validator: props.validator as any,
    errorText: '' as string
  },
  id: 'inputValidator',
  initial: 'idle',
  on: {
    EDITED: {
      target: 'edited',
      actions: [
        assign((ctx, event) => ({ textValue: event.value })),
        assign((ctx, event) => ({ validator: event.validator || ctx.validator })),

        send((ctx, e) => {
          if(ctx.initialValue === e.value) 
            return { type: 'RESET' }

          return { type: 'VALIDATE', value: e.value }
        })
      ]
    }
  },
  states: {
    idle: {},
    edited: {
      on: {
        RESET: {
          target: 'idle'
        },
        VALIDATE: {
          target: 'deboucing',
        }
      }
    },
    deboucing: {
      after: {
        1000: {
          target: 'validating',
        }
      }
    },
    validating: {
      invoke: {
        src: (ctx, e) => ctx.validator(ctx.textValue),
        onDone: {
          actions: [
            send((ctx, e) => ({ type: e.data?.valid ? 'VALID' : 'INVALID' })),
            assign((ctx, e) => {
              if(!e.data?.valid)
                console.log(e.data?.validators)

              return {}
            })
          ]
        },
        onError: {
          target: 'invalid'
        }
      },

      on: {
        VALID: {
          target: 'valid',
        },
        INVALID: {
          target: 'invalid'
        }
      }
    },
    valid: {},
    invalid: {}
  }
}, {
  actions: {
    updateValue: (context, event: any) => {
      context.textValue = event.text
    },

    validate: (context, event) => (sendBack) => {
      const isInitialValue = context.initialValue === context.textValue
      console.log('isInitialValue', isInitialValue)
      if(isInitialValue) sendBack({ type: 'RESET' })
      if(event.type === 'EDITED') {
        if(event.validator) {
          const isValid = event.validator(context.textValue)
          console.log('isValid', isValid)
          if(isValid) sendBack({ type: 'VALID' })
          if(!isValid) sendBack({ type: 'INVALID' })
        }
      }
    }
  }
})
