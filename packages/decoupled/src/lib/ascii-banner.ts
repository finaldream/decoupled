import packageJson from '../../package.json'

export const asciiBanner = (env: string) => `
                                                          ─ ─────────
                                           ─ ─ ─────────────────────
                               ─ ─ ─ ──────────────────────────────
  _ _ ________                            _ _ ______  _ __________
    _ ___  __ \\____________________  ____________  /__________  /
      __  / / /  _ \\  ___/  __ \\  / / /__  __ \\_  /_  _ \\  __  /
      _  /_/ //  __/ /__ / /_/ / /_/ /__  /_/ /  / /  __/ /_/ /
      /_____/ \\___/\\___/ \\____/\\__,_/ _  .___//_/  \\___/\\__,_/
                                      /_/
                        _ _ ________________
                          _ ______  /_  ___/
                            ___ _  /_____ \\
                            / /_/ / ____/ /     
                            \\____/  /____/      
DecoupledJS ${packageJson.version}
Environment: ${env}
`