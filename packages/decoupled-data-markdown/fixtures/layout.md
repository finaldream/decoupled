---
title: Layout Test
date: 2019-08-07T18:30:00.000Z
layout: 
  # Markdown text for Intro. Because YAML treats "#" always as comments, use "===" for headings wrap whole
  # text into single quotes ''. See https://yaml-multiline.info/ and 
  # https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax#headings
  # `type: markdown` will be parsed automatically as HTML!
  - type: text
    value: !!md '## Hello World!

orem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ex odio, elementum non luctus eget, mollis vitae orci. Quisque dapibus purus eget turpis accumsan congue. Quisque blandit dui non purus hendrerit, vel ornare eros dignissim. Integer malesuada velit consequat dolor vulputate, eu bibendum lectus suscipit. Vivamus dapibus, ipsum et lobortis lacinia, ex elit tristique ex, quis placerat lorem arcu quis ligula. Aliquam orci tellus, placerat eget velit at, egestas lobortis eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer ut odio iaculis, vestibulum elit vel, sagittis nisl. Nam convallis quam id massa convallis mollis. Phasellus ut nunc ullamcorper, placerat lacus non, viverra libero. Curabitur semper urna tortor. Phasellus varius aliquam odio eu malesuada. Nunc tempus egestas ante, non mollis purus blandit a. Etiam ac vulputate elit.

Curabitur et lectus dapibus urna pretium mattis et non leo. Vestibulum a dui in ligula suscipit auctor sed id sapien. Cras diam felis, tristique dictum diam nec, dignissim congue quam. Curabitur nisi nulla, lobortis eget lacus et, molestie accumsan ex. Vestibulum varius et orci nec congue. Sed interdum ex erat. Ut bibendum egestas fermentum. Duis a viverra est. Pellentesque dictum purus neque, nec efficitur lectus malesuada nec. In sem sapien, venenatis nec erat eu, blandit scelerisque magna. In vitae mi nulla. Pellentesque malesuada, ante sit amet sodales egestas, justo lorem dictum urna, id bibendum est dolor id leo. Etiam vestibulum lorem in dolor molestie sodales. Donec sed consectetur dolor. Vivamus a dictum est. Etiam aliquet malesuada commodo.
'
    
  - type: services
    title: Services
    description: !!md Duis a viverra est. **Pellentesque dictum purus neque**, nec efficitur lectus malesuada nec. In sem sapien, venenatis nec erat eu, blandit scelerisque magna.
    value:
    UI/UX: /ui-ux
    Single Page Applications: /single-page-applications
    Static Site Generators: /static-site-generator
    Microservices: /microservices
    Full-Stack Development: /full-stack-development
    Mobile Development: /mobile-development 
    CI / CD: /ci-cd
  
  - type: workflow
    title: Workflow
    value:
      - Analyse & Planning
      - Development
      - Maintenance
  
  - type: tech
    title: Technologies
    value:
      - Node.js
      - Typescript
      - React.js
      - React Native
      - Javascript
      - Redux
      - Jest
      - GraphQL

  - type: contact
    title: Contact
    description: !!md Duis a viverra est. **Pellentesque dictum purus neque**, nec efficitur lectus malesuada nec. In sem sapien, venenatis nec erat eu, blandit scelerisque magna.
---
